from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import User
from schemas import ChatRequest, ChatResponse
from database import get_db
from services.ai_service import process_chat_message

router = APIRouter(prefix="/api/ai-assistant", tags=["ai-assistant"])


@router.post("/chat", response_model=ChatResponse)
def chat_with_assistant(
    chat_request: ChatRequest,
    user_id: int,
    db: Session = Depends(get_db)
):
    """Chat with AI assistant for restaurant recommendations."""
    # Validate user exists
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Process the chat message
    result = process_chat_message(chat_request.message, db, user_id)
    
    return ChatResponse(
        response=result["response"],
        recommendations=result.get("recommendations")
    )
