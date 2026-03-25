from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Review, Restaurant, User
from schemas import ReviewCreate, ReviewUpdate, ReviewResponse
from database import get_db

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.get("/restaurant/{restaurant_id}", response_model=list[ReviewResponse])
def get_restaurant_reviews(
    restaurant_id: int,
    skip: int = Query(0),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    """Get all reviews for a restaurant."""
    reviews = db.query(Review).filter(
        Review.restaurant_id == restaurant_id
    ).offset(skip).limit(limit).all()
    
    return reviews


@router.get("/user/{user_id}", response_model=list[ReviewResponse])
def get_user_reviews(
    user_id: int,
    skip: int = Query(0),
    limit: int = Query(10),
    db: Session = Depends(get_db)
):
    """Get all reviews written by a user."""
    reviews = db.query(Review).filter(
        Review.user_id == user_id
    ).offset(skip).limit(limit).all()
    
    return reviews


@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(review_id: int, db: Session = Depends(get_db)):
    """Get a specific review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    return review


@router.post("/restaurant/{restaurant_id}", response_model=ReviewResponse)
def create_review(
    restaurant_id: int,
    user_id: int,
    review_data: ReviewCreate,
    db: Session = Depends(get_db)
):
    """Create a new review for a restaurant."""
    # Validate restaurant
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()
    
    if not restaurant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restaurant not found"
        )
    
    # Validate rating
    if review_data.rating < 1 or review_data.rating > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rating must be between 1 and 5"
        )
    
    # Create review
    new_review = Review(
        user_id=user_id,
        restaurant_id=restaurant_id,
        rating=review_data.rating,
        comment=review_data.comment
    )
    
    db.add(new_review)
    
    # Update restaurant average rating and review count
    all_reviews = db.query(Review).filter(
        Review.restaurant_id == restaurant_id
    ).all()
    
    total_rating = sum([r.rating for r in all_reviews]) + review_data.rating
    review_count = len(all_reviews) + 1
    
    restaurant.average_rating = total_rating / review_count
    restaurant.review_count = review_count
    
    db.commit()
    db.refresh(new_review)
    
    return new_review


@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    review_data: ReviewUpdate,
    db: Session = Depends(get_db)
):
    """Update a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    update_data = review_data.dict(exclude_unset=True)
    
    for field, value in update_data.items():
        if value is not None:
            setattr(review, field, value)
    
    # Recalculate restaurant average rating
    if review_data.rating:
        restaurant = db.query(Restaurant).filter(
            Restaurant.id == review.restaurant_id
        ).first()
        
        all_reviews = db.query(Review).filter(
            Review.restaurant_id == review.restaurant_id
        ).all()
        
        total_rating = sum([r.rating for r in all_reviews])
        restaurant.average_rating = total_rating / len(all_reviews)
        
        db.commit()
    
    db.commit()
    db.refresh(review)
    
    return review


@router.delete("/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    """Delete a review."""
    review = db.query(Review).filter(Review.id == review_id).first()
    
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )
    
    restaurant_id = review.restaurant_id
    db.delete(review)
    
    # Recalculate restaurant average rating
    restaurant = db.query(Restaurant).filter(
        Restaurant.id == restaurant_id
    ).first()
    
    remaining_reviews = db.query(Review).filter(
        Review.restaurant_id == restaurant_id
    ).all()
    
    if remaining_reviews:
        total_rating = sum([r.rating for r in remaining_reviews])
        restaurant.average_rating = total_rating / len(remaining_reviews)
        restaurant.review_count = len(remaining_reviews)
    else:
        restaurant.average_rating = 0.0
        restaurant.review_count = 0
    
    db.commit()
    
    return {"message": "Review deleted successfully"}
