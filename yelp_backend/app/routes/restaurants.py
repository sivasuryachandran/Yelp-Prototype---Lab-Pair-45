from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from models import Restaurant, Favorite, Review, User
from schemas import RestaurantCreate, RestaurantUpdate, RestaurantResponse
from database import get_db
from utils.security import decode_token
from datetime import datetime
import json

router = APIRouter(prefix="/api/restaurants", tags=["restaurants"])


def get_current_user_from_header(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Extract and validate user from Authorization header."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    token = authorization.split(" ")[1]
    payload = decode_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user_id = int(payload.get("sub"))
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


def serialize_restaurant(restaurant: Restaurant):
    import base64
    
    # Convert binary photo to base64 if it exists
    photo_data = None
    if restaurant.photos:
        try:
            photo_base64 = base64.b64encode(restaurant.photos).decode('utf-8') if restaurant.photos else None
            if photo_base64:
                photo_data = f"data:image/jpeg;base64,{photo_base64}"
        except Exception as e:
            print(f"Error encoding photo: {e}")
            photo_data = None
    
    return {
        "id": restaurant.id,
        "name": restaurant.name,
        "cuisine_type": restaurant.cuisine_type,
        "description": restaurant.description,
        "address": restaurant.address,
        "city": restaurant.city,
        "zip_code": restaurant.zip_code,
        "phone": restaurant.phone,
        "email": restaurant.email,
        "hours_of_operation": json.loads(restaurant.hours_of_operation)
        if restaurant.hours_of_operation else None,
        "amenities": json.loads(restaurant.amenities)
        if restaurant.amenities else None,
        "pricing_tier": restaurant.pricing_tier,
        "average_rating": restaurant.average_rating,
        "review_count": restaurant.review_count,
        "created_at": restaurant.created_at,
        "photo_data": photo_data,
    }


@router.get("/", response_model=list[RestaurantResponse])
def search_restaurants(
    name: str = Query(None),
    cuisine: str = Query(None),
    city: str = Query(None),
    keywords: str = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    query = db.query(Restaurant)

    if name:
        query = query.filter(Restaurant.name.ilike(f"%{name}%"))

    if cuisine:
        query = query.filter(Restaurant.cuisine_type.ilike(f"%{cuisine}%"))

    if city:
        query = query.filter(Restaurant.city.ilike(f"%{city}%"))

    if keywords:
        query = query.filter(
            or_(
                Restaurant.description.ilike(f"%{keywords}%"),
                Restaurant.amenities.ilike(f"%{keywords}%")
            )
        )

    restaurants = query.offset(skip).limit(limit).all()
    return [serialize_restaurant(r) for r in restaurants]


# ========== OWNER-SPECIFIC ENDPOINTS (MUST COME BEFORE /{restaurant_id}) ==========

@router.get("/user/{user_id}", response_model=list[RestaurantResponse])
def get_user_restaurants(
    user_id: int,
    skip: int = Query(0),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    """Get all restaurants created by a specific user."""
    restaurants = db.query(Restaurant).filter(
        Restaurant.owner_id == user_id
    ).offset(skip).limit(limit).all()
    
    return [serialize_restaurant(r) for r in restaurants]


@router.get("/owner/list", response_model=list[RestaurantResponse])
def get_owner_restaurants(
    authorization: str = Header(None),
    skip: int = Query(0),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    """Get all restaurants owned by the current user."""
    current_user = get_current_user_from_header(authorization, db)
    
    restaurants = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return [serialize_restaurant(r) for r in restaurants]


@router.get("/owner/dashboard", response_model=dict)
def get_owner_dashboard(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Get owner dashboard with analytics for their restaurants."""
    current_user = get_current_user_from_header(authorization, db)
    
    # Get all owner's restaurants
    restaurants = db.query(Restaurant).filter(
        Restaurant.owner_id == current_user.id
    ).all()
    
    if not restaurants:
        return {
            "total_restaurants": 0,
            "total_favorites": 0,
            "average_rating": 0,
            "total_reviews": 0,
            "restaurants": []
        }
    
    restaurant_ids = [r.id for r in restaurants]
    
    # Calculate analytics
    total_favorites = db.query(func.count(Favorite.id)).filter(
        Favorite.restaurant_id.in_(restaurant_ids)
    ).scalar() or 0
    
    total_reviews = db.query(func.count(Review.id)).filter(
        Review.restaurant_id.in_(restaurant_ids)
    ).scalar() or 0
    
    avg_rating = db.query(func.avg(Restaurant.average_rating)).filter(
        Restaurant.id.in_(restaurant_ids)
    ).scalar() or 0
    
    # Get recent reviews
    recent_reviews = db.query(Review).filter(
        Review.restaurant_id.in_(restaurant_ids)
    ).order_by(Review.created_at.desc()).limit(5).all()
    
    return {
        "total_restaurants": len(restaurants),
        "total_favorites": total_favorites,
        "average_rating": float(round(avg_rating, 2)),
        "total_reviews": total_reviews,
        "recent_reviews": [
            {
                "id": r.id,
                "restaurant_id": r.restaurant_id,
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at
            }
            for r in recent_reviews
        ],
        "restaurants": [serialize_restaurant(r) for r in restaurants]
    }


# ========== GENERAL RESTAURANT ENDPOINTS ==========

@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )

    return serialize_restaurant(restaurant)


@router.post("/", response_model=RestaurantResponse)
def create_restaurant(
    restaurant_data: RestaurantCreate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Create a new restaurant. Can be called by authenticated users."""
    current_user = get_current_user_from_header(authorization, db)
    
    # Convert base64 photo data to binary if provided
    photo_binary = None
    if restaurant_data.photo_data and restaurant_data.photo_data.startswith("data:image"):
        try:
            # Extract base64 part after the comma
            photo_data_str = restaurant_data.photo_data.split(",", 1)[1]
            import base64
            photo_binary = base64.b64decode(photo_data_str)
        except Exception as e:
            print(f"Error processing photo data: {e}")
            photo_binary = None
    
    new_restaurant = Restaurant(
        name=restaurant_data.name,
        cuisine_type=restaurant_data.cuisine_type,
        description=restaurant_data.description,
        address=restaurant_data.address,
        city=restaurant_data.city,
        zip_code=restaurant_data.zip_code,
        phone=restaurant_data.phone,
        email=restaurant_data.email,
        hours_of_operation=json.dumps(restaurant_data.hours_of_operation)
        if restaurant_data.hours_of_operation is not None else None,
        amenities=json.dumps(restaurant_data.amenities)
        if restaurant_data.amenities is not None else None,
        pricing_tier=restaurant_data.pricing_tier,
        photos=photo_binary,
        owner_id=current_user.id if current_user.role == "owner" else None
    )

    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)

    return serialize_restaurant(new_restaurant)


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: int,
    restaurant_data: RestaurantUpdate,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Update restaurant. Only owner or admin can update."""
    current_user = get_current_user_from_header(authorization, db)
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    # Check ownership
    if restaurant.owner_id and restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to update this restaurant"
        )

    update_data = restaurant_data.model_dump(exclude_unset=True)

    if "hours_of_operation" in update_data:
        update_data["hours_of_operation"] = (
            json.dumps(update_data["hours_of_operation"])
            if update_data["hours_of_operation"] is not None else None
        )

    if "amenities" in update_data:
        update_data["amenities"] = (
            json.dumps(update_data["amenities"])
            if update_data["amenities"] is not None else None
        )
    
    # Handle photo_data if provided
    if "photo_data" in update_data:
        photo_data = update_data.pop("photo_data")
        if photo_data and photo_data.startswith("data:image"):
            try:
                import base64
                photo_data_str = photo_data.split(",", 1)[1]
                photo_binary = base64.b64decode(photo_data_str)
                update_data["photos"] = photo_binary
            except Exception as e:
                print(f"Error processing photo data: {e}")

    for field, value in update_data.items():
        setattr(restaurant, field, value)

    db.commit()
    db.refresh(restaurant)

    return serialize_restaurant(restaurant)


@router.delete("/{restaurant_id}")
def delete_restaurant(
    restaurant_id: int,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Delete restaurant. Only owner can delete."""
    current_user = get_current_user_from_header(authorization, db)
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    # Check ownership
    if restaurant.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this restaurant"
        )

    db.delete(restaurant)
    db.commit()

    return {"message": "Restaurant deleted successfully"}


@router.get("/{restaurant_id}/favorites")
def get_restaurant_favorites_count(restaurant_id: int, db: Session = Depends(get_db)):
    count = db.query(Favorite).filter(
        Favorite.restaurant_id == restaurant_id
    ).count()

    return {"restaurant_id": restaurant_id, "favorite_count": count}


@router.post("/{restaurant_id}/claim")
def claim_restaurant(
    restaurant_id: int,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """Allow restaurant owner to claim an existing restaurant listing."""
    current_user = get_current_user_from_header(authorization, db)
    
    if current_user.role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only restaurant owners can claim restaurants"
        )
    
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    if restaurant.owner_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This restaurant is already claimed by another owner"
        )
    
    restaurant.owner_id = current_user.id
    db.commit()
    db.refresh(restaurant)
    
    return {
        "message": "Restaurant claimed successfully",
        "restaurant": serialize_restaurant(restaurant)
    }