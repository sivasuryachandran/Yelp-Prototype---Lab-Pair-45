from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from models import Favorite, Restaurant
from schemas import FavoriteCreate, FavoriteResponse
from database import get_db

router = APIRouter(prefix="/api/favorites", tags=["favorites"])


@router.get("/user/{user_id}", response_model=list[FavoriteResponse])
def get_user_favorites(
    user_id: int,
    skip: int = Query(0),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    """Get all favorites for a user."""
    favorites = db.query(Favorite).filter(
        Favorite.user_id == user_id
    ).offset(skip).limit(limit).all()
    
    return favorites


@router.post("/", response_model=FavoriteResponse)
def add_favorite(
    favorite_data: FavoriteCreate,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Add a restaurant to favorites."""
    # Check if restaurant exists
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == favorite_data.restaurant_id
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    # Check if already favorited
    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.restaurant_id == favorite_data.restaurant_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Restaurant already in favorites"
        )
    
    new_favorite = Favorite(
        user_id=user_id,
        restaurant_id=favorite_data.restaurant_id
    )
    
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    
    return new_favorite


@router.delete("/{favorite_id}")
def remove_favorite(favorite_id: int, db: Session = Depends(get_db)):
    """Remove a restaurant from favorites."""
    favorite = db.query(Favorite).filter(Favorite.id == favorite_id).first()
    
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Favorite not found"
        )
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Removed from favorites"}


@router.get("/check/{user_id}/{restaurant_id}")
def check_favorite(user_id: int, restaurant_id: int, db: Session = Depends(get_db)):
    """Check if a restaurant is in user's favorites."""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.restaurant_id == restaurant_id
    ).first()
    
    return {"is_favorite": favorite is not None}
