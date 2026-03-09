# Yelp Prototype - Backend API

FastAPI-based REST API for the Yelp Prototype application with JWT authentication, restaurant management, reviews, and AI-powered recommendations.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- MySQL 5.7+ or MariaDB
- pip (Python package manager)

### Installation

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment variables:**

Create a `.env` file in the root directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=yelp_db
DB_PORT=3306
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
```

4. **Create MySQL database:**
```bash
mysql -u root -p
mysql> CREATE DATABASE yelp_db;
```

5. **Run the server:**
```bash
cd app
python main.py
```

Server will start at: `http://localhost:8000`

## 📚 API Documentation

### Swagger UI
Visit `http://localhost:8000/api/docs` for interactive API documentation

### Alternative: ReDoc
Visit `http://localhost:8000/api/redoc` for ReadOnly documentation

## 🔑 Authentication

All endpoints (except `/auth/signup` and `/auth/login`) require JWT authentication.

**Get Access Token:**
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"user@example.com\",
    \"password\": \"password123\"
  }"
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiL...",
  "token_type": "bearer",
  "user_id": 1,
  "role": "user"
}
```

**Use Token in Requests:**
```bash
curl -X GET "http://localhost:8000/api/users/1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📋 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login

### Users (`/api/users`)
- `GET /api/users/{user_id}` - Get user profile
- `PUT /api/users/{user_id}` - Update user profile
- `GET /api/users/{user_id}/preferences` - Get user preferences
- `POST /api/users/{user_id}/preferences` - Set user preferences

### Restaurants (`/api/restaurants`)
- `GET /api/restaurants/` - Search restaurants
- `GET /api/restaurants/{restaurant_id}` - Get restaurant details
- `POST /api/restaurants/` - Create restaurant
- `PUT /api/restaurants/{restaurant_id}` - Update restaurant
- `DELETE /api/restaurants/{restaurant_id}` - Delete restaurant

### Reviews (`/api/reviews`)
- `GET /api/reviews/restaurant/{restaurant_id}` - Get restaurant reviews
- `POST /api/reviews/restaurant/{restaurant_id}` - Create review
- `PUT /api/reviews/{review_id}` - Update review
- `DELETE /api/reviews/{review_id}` - Delete review

### Favorites (`/api/favorites`)
- `GET /api/favorites/user/{user_id}` - Get user favorites
- `POST /api/favorites/` - Add favorite
- `DELETE /api/favorites/{favorite_id}` - Remove favorite
- `GET /api/favorites/check/{user_id}/{restaurant_id}` - Check if favorited

### AI Assistant (`/api/ai-assistant`)
- `POST /api/ai-assistant/chat` - Chat with AI assistant

## 📁 Project Structure

```
yelp_backend/
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI app
│   ├── database.py                   # DB connection
│   ├── models.py                     # SQLAlchemy models
│   ├── schemas.py                    # Pydantic schemas
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py                   # Authentication
│   │   ├── users.py                  # User management
│   │   ├── restaurants.py            # Restaurant CRUD
│   │   ├── reviews.py                # Review system
│   │   ├── favorites.py              # Favorites
│   │   └── ai_assistant.py           # AI chatbot
│   ├── services/
│   │   ├── __init__.py
│   │   └── ai_service.py             # AI logic
│   └── utils/
│       ├── __init__.py
│       └── security.py               # Security utils
├── requirements.txt
├── .env                              # Environment config
├── .gitignore
└── README.md                         # This file
```

## 🗄️ Database Schema

### Users Table
```sql
id, name, email, password_hash, phone, about_me, city, country, 
state, languages, gender, role, created_at, updated_at
```

### User Preferences Table
```sql
id, user_id, cuisines, price_range, preferred_location, 
dietary_restrictions, ambiance, sort_preference, search_radius
```

### Restaurants Table
```sql
id, name, cuisine_type, description, address, city, zip_code,
latitude, longitude, phone, email, hours_of_operation, amenities,
pricing_tier, owner_id, average_rating, review_count
```

### Reviews Table
```sql
id, user_id, restaurant_id, rating, comment, photos, created_at, updated_at
```

### Favorites Table
```sql
id, user_id, restaurant_id, created_at
```

See `DATABASE_SCHEMA.md` for complete schema details.

## 🔒 Security Features

- **Password Hashing**: Bcrypt hashing with salt
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for React frontend
- **Input Validation**: Pydantic schemas validate all inputs
- **SQL Injection Prevention**: SQLAlchemy ORM protection
- **Token Expiration**: 30-minute default expiry

## 🧠 AI Assistant

The AI service processes user queries to recommend restaurants based on:
1. User's saved preferences (cuisines, price range, dietary restrictions, etc.)
2. Natural language interpretation of the query
3. Current restaurant inventory in the database
4. Personalized rankings

### Features
- Multi-turn conversation support
- Natural language query interpretation
- Preference-based filtering
- Ranking and recommendations with reasoning

## 📦 Dependencies

Key packages in `requirements.txt`:
- `fastapi` - Web framework
- `sqlalchemy` - ORM
- `pymysql` - MySQL driver
- `pydantic` - Data validation
- `PyJWT` - JWT tokens
- `python-dotenv` - Environment variables
- `passlib[bcrypt]` - Password hashing
- `langchain` - AI framework
- `openai` - LLM integration

## 🧪 Testing with Swagger

1. Navigate to `http://localhost:8000/api/docs`
2. Click "Authorize" and enter a JWT token
3. Try all endpoints with interactive forms
4. View request/response examples

## 📝 Environment Variables

```env
# Database
DB_HOST=localhost                    # MySQL host
DB_USER=root                         # MySQL user
DB_PASSWORD=password                 # MySQL password
DB_NAME=yelp_db                      # Database name
DB_PORT=3306                         # MySQL port

# JWT
SECRET_KEY=your-secret-key           # Should be changed in production
ALGORITHM=HS256                      # JWT algorithm
ACCESS_TOKEN_EXPIRE_MINUTES=30       # Token expiry

# AI Services
OPENAI_API_KEY=sk-...                # OpenAI API key
TAVILY_API_KEY=tvly-...              # Tavily API key

# CORS
CORS_ORIGINS=["http://localhost:3000"]  # Frontend URL
```

## 🚀 Running the Server

**Development:**
```bash
cd app
python main.py
```

**With auto-reload:**
```bash
cd app
uvicorn main:app --reload
```

**Specify host and port:**
```bash
cd app
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🐛 Common Issues

### Database Connection Error
```
sqlalchemy.exc.OperationalError: (pymysql.err.OperationalError)
```
**Solution**: 
- Ensure MySQL is running
- Check DB credentials in `.env`
- Verify database exists

### Token Expired
```
HTTPException: Invalid token
```
**Solution**: 
- Get a new token by logging in again
- Increase `ACCESS_TOKEN_EXPIRE_MINUTES` in `.env`

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
- Add frontend URL to `cors_origins` in `main.py`
- Or update CORS_ORIGINS in `.env`

## 📞 Support

For detailed API documentation and testing:
- **Swagger**: `http://localhost:8000/api/docs`
- **ReDoc**: `http://localhost:8000/api/redoc`
- **OpenAPI JSON**: `http://localhost:8000/api/openapi.json`

---

**Backend Version**: 1.0.0  
**Last Updated**: March 2026  
**Python Version**: 3.8+  
**FastAPI Version**: 0.88+
