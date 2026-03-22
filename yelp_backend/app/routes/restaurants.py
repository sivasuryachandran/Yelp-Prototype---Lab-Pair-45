from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from models import Restaurant, Favorite
from schemas import RestaurantCreate, RestaurantUpdate, RestaurantResponse
from database import get_db
import json

router = APIRouter(prefix="/api/restaurants", tags=["restaurants"])


def serialize_restaurant(restaurant: Restaurant):
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
    db: Session = Depends(get_db)
):
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
        pricing_tier=restaurant_data.pricing_tier
    )

    db.add(new_restaurant)
    db.commit()
    db.refresh(new_restaurant)

    return serialize_restaurant(new_restaurant)


@router.put("/{restaurant_id}", response_model=RestaurantResponse)
def update_restaurant(
    restaurant_id: int,
    restaurant_data: RestaurantUpdate,
    db: Session = Depends(get_db)
):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
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

    for field, value in update_data.items():
        setattr(restaurant, field, value)

    db.commit()
    db.refresh(restaurant)

    return serialize_restaurant(restaurant)


@router.delete("/{restaurant_id}")
def delete_restaurant(restaurant_id: int, db: Session = Depends(get_db)):
    restaurant = db.query(Restaurant).filter(Restaurant.id == restaurant_id).first()

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
    count = db.query(Favorite).filter(
        Favorite.restaurant_id == restaurant_id
    ).count()

    return {"restaurant_id": restaurant_id, "favorite_count": count}