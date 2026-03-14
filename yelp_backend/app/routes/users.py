from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import User, UserPreference
from schemas import UserUpdate, UserResponse, UserPreferenceUpdate
from database import get_db
from utils.security import decode_token
import json

router = APIRouter(prefix="/api/users", tags=["users"])


def get_current_user(token: str, db: Session = Depends(get_db)):
    """Extract and validate user from token."""
    if not token.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format"
        )
    
    token = token.split(" ")[1]
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


@router.get("/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    """Get user profile by ID."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user_profile(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    """Update user profile."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = user_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    
    return user


@router.get("/{user_id}/preferences")
def get_user_preferences(user_id: int, db: Session = Depends(get_db)):
    """Get user preferences."""
    preferences = db.query(UserPreference).filter(
        UserPreference.user_id == user_id
    ).first()
    
    if not preferences:
        return {
            "cuisines": [],
            "price_range": None,
            "preferred_location": None,
            "dietary_restrictions": [],
            "ambiance": [],
            "sort_preference": None,
            "search_radius": 5
        }
    
    return {
        "id": preferences.id,
        "user_id": preferences.user_id,
        "cuisines": json.loads(preferences.cuisines) if preferences.cuisines else [],
        "price_range": preferences.price_range,
        "preferred_location": preferences.preferred_location,
        "dietary_restrictions": json.loads(preferences.dietary_restrictions) if preferences.dietary_restrictions else [],
        "ambiance": json.loads(preferences.ambiance) if preferences.ambiance else [],
        "sort_preference": preferences.sort_preference,
        "search_radius": preferences.search_radius
    }


@router.post("/{user_id}/preferences")
def set_user_preferences(
    user_id: int,
    prefs: UserPreferenceUpdate,
    db: Session = Depends(get_db)
):
    """Set user preferences."""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    preferences = db.query(UserPreference).filter(
        UserPreference.user_id == user_id
    ).first()
    
    if not preferences:
        preferences = UserPreference(user_id=user_id)
        db.add(preferences)
    
    if prefs.cuisines:
        preferences.cuisines = json.dumps(prefs.cuisines)
    if prefs.price_range:
        preferences.price_range = prefs.price_range
    if prefs.preferred_location:
        preferences.preferred_location = prefs.preferred_location
    if prefs.dietary_restrictions:
        preferences.dietary_restrictions = json.dumps(prefs.dietary_restrictions)
    if prefs.ambiance:
        preferences.ambiance = json.dumps(prefs.ambiance)
    if prefs.sort_preference:
        preferences.sort_preference = prefs.sort_preference
    if prefs.search_radius:
        preferences.search_radius = prefs.search_radius
    
    db.commit()
    db.refresh(preferences)
    
    return {
        "message": "Preferences updated successfully",
        "preferences": {
            "cuisines": json.loads(preferences.cuisines) if preferences.cuisines else [],
            "price_range": preferences.price_range,
            "preferred_location": preferences.preferred_location,
            "dietary_restrictions": json.loads(preferences.dietary_restrictions) if preferences.dietary_restrictions else [],
            "ambiance": json.loads(preferences.ambiance) if preferences.ambiance else [],
            "sort_preference": preferences.sort_preference,
            "search_radius": preferences.search_radius
        }
    }
