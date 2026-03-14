from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from models import Restaurant, Favorite
from schemas import RestaurantCreate, RestaurantUpdate, RestaurantResponse
from database import get_db
import json

router = APIRouter(prefix="/api/restaurants", tags=["restaurants"])


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
    """Search restaurants with filters."""
    query = db.query(Restaurant)
    
    if name:
        query = query.filter(Restaurant.name.ilike(f"%{name}%"))
    
    if cuisine:
        query = query.filter(Restaurant.cuisine_type.ilike(f"%{cuisine}%"))
    
    if city:
        query = query.filter(Restaurant.city.ilike(f"%{city}%"))
    
    if keywords:
        # Search in description and amenities
        query = query.filter(
            or_(
                Restaurant.description.ilike(f"%{keywords}%"),
                Restaurant.amenities.ilike(f"%{keywords}%")
            )
        )
    
    restaurants = query.offset(skip).limit(limit).all()
    return restaurants


@router.get("/{restaurant_id}", response_model=RestaurantResponse)
def get_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    """Get restaurant details."""
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    return restaurant


@router.post("/", response_model=RestaurantResponse)
def create_restaurant(
    restaurant_data: RestaurantCreate,
    db: Session = Depends(get_db)
):
    """Create a new restaurant."""
    new_restaurant = Restaurant(
        name=restaurant_data.name,
        cuisine_type=restaurant_data.cuisine_type,
        description=restaurant_data.description,
        address=restaurant_data.address,
        city=restaurant_data.city,
        zip_code=restaurant_data.zip_code,
        phone=restaurant_data.phone,
        email=restaurant_data.email,
        hours_of_operation=json.dumps(restaurant_data.hours_of_operation) if restaurant_data.hours_of_operation else None,
        amenities=json.dumps(restaurant_data.amenities) if restaurant_data.amenities else None,
        pricing_tier=restaurant_data.pricing_tier
    )
    
    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)
    
    return new_restaurant


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: int,
    restaurant_data: RestaurantUpdate,
    db: Session = Depends(get_db)
):
    """Update restaurant."""
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    update_data = restaurant_data.dict(exclude_unset=True)
    
    # Handle JSON fields
    if "hours_of_operation" in update_data and update_data["hours_of_operation"]:
        update_data["hours_of_operation"] = json.dumps(update_data["hours_of_operation"])
    
    if "amenities" in update_data and update_data["amenities"]:
        update_data["amenities"] = json.dumps(update_data["amenities"])
    
    for field, value in update_data.items():
        if value is not None:
            setattr(restaurant, field, value)
    
    db.commit()
    db.refresh(restaurant)
    
    return restaurant


@router.delete("/{restaurant_id}")
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    """Delete restaurant."""
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    db.delete(restaurant)
    db.commit()
    
    return {"message": "Restaurant deleted successfully"}


@router.get("/{restaurant_id}/favorites")
def get_restaurant_favorites_count(restaurant_id: int, db: Session = Depends(get_db)):
    """Get favorite count for restaurant."""
    count = db.query(Favorite).filter(
        Favorite.restaurant_id == restaurant_id
    ).count()
    
    return {"restaurant_id": restaurant_id, "favorite_count": count}
