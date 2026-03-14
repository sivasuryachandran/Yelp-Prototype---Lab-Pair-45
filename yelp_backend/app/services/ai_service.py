# Langchain imports - to be implemented by your pair partner
# from langchain_openai import OpenAI
# from langchain.prompts import ChatPromptTemplate
# from langchain.chains import LLMChain

from sqlalchemy.orm import Session
from models import UserPreference, Restaurant
from dotenv import load_dotenv
import os
import json

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")


def get_user_preferences_dict(db: Session, user_id: int):
    """Get user preferences as a dictionary."""
    preferences = db.query(UserPreference).filter(
        UserPreference.user_id == user_id
    ).first()
    
    if not preferences:
        return {
            "cuisines": [],
            "price_range": None,
            "dietary_restrictions": [],
            "ambiance": [],
            "preferred_location": None,
            "search_radius": 5
        }
    
    return {
        "cuisines": json.loads(preferences.cuisines) if preferences.cuisines else [],
        "price_range": preferences.price_range,
        "dietary_restrictions": json.loads(preferences.dietary_restrictions) if preferences.dietary_restrictions else [],
        "ambiance": json.loads(preferences.ambiance) if preferences.ambiance else [],
        "preferred_location": preferences.preferred_location,
        "search_radius": preferences.search_radius
    }


def search_restaurants_with_filters(db: Session, filters: dict, location: str = None):
    """Search restaurants based on filters."""
    query = db.query(Restaurant)
    
    if filters.get("cuisine"):
        query = query.filter(Restaurant.cuisine_type.ilike(f"%{filters['cuisine']}%"))
    
    if filters.get("price_range"):
        query = query.filter(Restaurant.pricing_tier == filters["price_range"])
    
    if location:
        query = query.filter(Restaurant.city.ilike(f"%{location}%"))
    
    if filters.get("dietary"):
        query = query.filter(Restaurant.amenities.ilike(f"%{filters['dietary']}%"))
    
    if filters.get("ambiance"):
        query = query.filter(Restaurant.amenities.ilike(f"%{filters['ambiance']}%"))
    
    restaurants = query.limit(5).all()
    return restaurants


def format_restaurants_for_response(restaurants: list):
    """Format restaurants for AI response."""
    formatted = []
    for r in restaurants:
        formatted.append({
            "id": r.id,
            "name": r.name,
            "rating": r.average_rating,
            "price_tier": r.pricing_tier or "Unknown",
            "cuisine_type": r.cuisine_type,
            "city": r.city
        })
    return formatted


def interpret_user_query(user_message: str, preferences: dict) -> dict:
    """Interpret user query and extract dining preferences."""
    message_lower = user_message.lower()
    filters = {}
    
    # Extract cuisine preferences
    cuisines = ["italian", "chinese", "mexican", "indian", "japanese", "american", "thai", "french", "korean", "vietnamese"]
    for cuisine in cuisines:
        if cuisine in message_lower:
            filters["cuisine"] = cuisine
            break
    
    # Extract price range
    if "$$$" in message_lower or "expensive" in message_lower or "fine dining" in message_lower:
        filters["price_range"] = "$$$$"
    elif "$$" in message_lower or "moderate" in message_lower:
        filters["price_range"] = "$$"
    elif "$" in message_lower or "cheap" in message_lower or "budget" in message_lower:
        filters["price_range"] = "$"
    
    # Extract dietary restrictions
    dietary_keywords = {
        "vegan": "vegan",
        "vegetarian": "vegetarian",
        "gluten": "gluten-free",
        "halal": "halal",
        "kosher": "kosher"
    }
    
    for keyword, dietary in dietary_keywords.items():
        if keyword in message_lower:
            filters["dietary"] = dietary
            break
    
    # Extract ambiance
    ambiance_keywords = ["casual", "romantic", "family-friendly", "quiet", "fine dining", "fast casual"]
    for ambiance in ambiance_keywords:
        if ambiance in message_lower:
            filters["ambiance"] = ambiance
            break
    
    # Extract occasion
    occasion = None
    occasions = {
        "dinner": "dinner",
        "lunch": "lunch",
        "breakfast": "breakfast",
        "romantic": "romantic",
        "anniversary": "romantic",
        "date": "romantic",
        "birthday": "celebration",
        "party": "celebration"
    }
    
    for occ_keyword, occ_type in occasions.items():
        if occ_keyword in message_lower:
            occasion = occ_type
            break
    
    filters["occasion"] = occasion
    
    return filters


def generate_ai_response(restaurants: list, user_message: str, filters: dict) -> str:
    """Generate conversational AI response."""
    if not restaurants:
        return "I couldn't find any restaurants matching your preferences. Try adjusting your criteria or let me know what kind of food you're in the mood for!"
    
    response_parts = []
    
    # Generate contextual greeting
    if filters.get("occasion") == "romantic":
        response_parts.append("For a romantic dinner, here are my top recommendations:")
    elif filters.get("occasion") == "celebration":
        response_parts.append("For a special celebration, here are great options:")
    elif filters.get("dietary"):
        response_parts.append(f"Here are excellent {filters['dietary']} options for you:")
    else:
        response_parts.append("Based on your preferences, here are my recommendations:")
    
    # Add restaurant recommendations
    for i, restaurant in enumerate(restaurants, 1):
        stars = "★" * int(restaurant.average_rating) + "☆" * (5 - int(restaurant.average_rating))
        response_parts.append(
            f"{i}. {restaurant.name} ({restaurant.average_rating}/5 {stars}, {restaurant.pricing_tier or 'Unknown'}) - {restaurant.cuisine_type} cuisine in {restaurant.city}"
        )
    
    response_parts.append("\nWould you like more details about any of these restaurants or different recommendations?")
    
    return "\n".join(response_parts)


def process_chat_message(user_message: str, db: Session, user_id: int) -> dict:
    """Process a chat message from the user."""
    # Get user preferences
    user_preferences = get_user_preferences_dict(db, user_id)
    
    # Interpret user query
    filters = interpret_user_query(user_message, user_preferences)
    
    # Use user's saved cuisine preference if not specified in message
    if not filters.get("cuisine") and user_preferences.get("cuisines"):
        filters["cuisine"] = user_preferences["cuisines"][0]
    
    # Use user's saved price range if not specified
    if not filters.get("price_range") and user_preferences.get("price_range"):
        filters["price_range"] = user_preferences["price_range"]
    
    # Use user's preferred location
    location = filters.get("location") or user_preferences.get("preferred_location")
    
    # Search restaurants
    restaurants = search_restaurants_with_filters(db, filters, location)
    
    # Generate response
    response_text = generate_ai_response(restaurants, user_message, filters)
    
    # Format restaurant data for frontend
    formatted_restaurants = format_restaurants_for_response(restaurants)
    
    return {
        "response": response_text,
        "recommendations": [
            {
                "id": r["id"],
                "name": r["name"],
                "rating": r["rating"],
                "price_tier": r["price_tier"],
                "cuisine_type": r["cuisine_type"],
                "reasoning": "Matches your preferences"
            }
            for r in formatted_restaurants
        ]
    }
