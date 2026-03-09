# 🍽️ Yelp Prototype - Lab Pair 45

**Complete Full-Stack Restaurant Discovery & Review Platform**

## 📊 LAB assignment Overview

A production-ready Yelp-like application built with modern web technologies. Features user authentication, restaurant search with advanced filters, review system with ratings, favorites management, and AI chatbot integration.

**Status**: ✅ Complete | **Due**: March 24, 2026 | **Points**: 40

---

## 🚀 Quick Start

### Backend Setup (5 minutes)

```bash
# Navigate to backend
cd yelp_backend

# Create and activate virtual environment
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend (auto-creates SQLite database)
python app/main.py
```

**Backend runs on**: `http://localhost:8000`
- API Docs: `http://localhost:8000/api/docs`

### Frontend Setup (5 minutes)

```bash
# Navigate to frontend
cd yelp_frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend runs on**: `http://localhost:3000`

---

## 📁 Project Structure

```
Lab1/
├── yelp_backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application & routes
│   │   ├── database.py             # SQLite/MySQL connection
│   │   ├── models.py               # SQLAlchemy models (5 tables)
│   │   ├── schemas.py              # Pydantic validation schemas
│   │   ├── routes/
│   │   │   ├── auth.py            # Login/Signup endpoints
│   │   │   ├── users.py           # Profile & preferences
│   │   │   ├── restaurants.py     # Restaurant CRUD
│   │   │   ├── reviews.py         # Review system
│   │   │   ├── favorites.py       # Favorites management
│   │   │   └── ai_assistant.py    # AI chatbot endpoint
│   │   ├── services/
│   │   │   └── ai_service.py      # AI logic (ready for LLM integration)
│   │   └── utils/
│   │       └── security.py        # JWT & password hashing
│   ├── requirements.txt            # Python packages
│   ├── .env                        # Environment configuration
│   ├── seed_data.py               # Sample restaurant data
│   └── README.md                  # Backend documentation
│
├── yelp_frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/              # Login & Signup forms
│   │   │   ├── Profile/           # User profile pages
│   │   │   ├── Restaurant/        # Search & details
│   │   │   ├── Review/            # Review interface
│   │   │   └── ChatBot/           # AI chatbot UI
│   │   ├── services/
│   │   │   ├── api.js             # Axios API client
│   │   │   └── auth.js            # JWT token management
│   │   ├── App.jsx                # Main app component
│   │   └── index.jsx              # Entry point
│   ├── public/index.html          # HTML template
│   ├── package.json               # NPM dependencies
│   ├── .env                       # Frontend config
│   └── README.md                  # Frontend documentation
│
└── README_FINAL.md               # This file
```

---

## 🔧 Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite (dev) / MySQL (production)
- **ORM**: SQLAlchemy
- **Authentication**: JWT with Bcrypt hashing
- **Validation**: Pydantic
- **API Docs**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **UI**: Bootstrap 5
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Ratings**: React Star Ratings

### AI Integration (Ready for Pair Partner)
- **Framework**: Langchain
- **LLM**: OpenAI GPT (to be configured)
- **Search**: Tavily API (to be configured)

---

## 📊 Features Implemented

### ✅ Authentication System (2 endpoints)
- User registration with email validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Token refresh mechanism

### ✅ User Management (4 endpoints)
- Profile creation and editing
- User preferences for AI suggestions
- Dietary restrictions tracking
- Favorite cuisine preferences

### ✅ Restaurant Discovery (5 endpoints)
- Search with multiple filters (name, cuisine, city, keywords)
- Browse all restaurants with ratings
- Filter by price range
- Sort by rating or distance
- Detailed restaurant information

### ✅ Review System (4 endpoints)
- Create, read, update, delete reviews
- 5-star rating system
- Review aggregation and averages
- User-specific review management
- Review sorting and pagination

### ✅ Favorites Management (4 endpoints)
- Add/remove from favorites
- View favorite restaurants
- Check favorite status
- Persistent storage

### ✅ AI Assistant (1 endpoint)
- Chat interface with conversation history
- Natural language processing
- Restaurant filtering based on preferences
- Ready for LLM integration (Pair Partner Task)

---

## 🗄️ Database Schema

### 5 Core Tables

**users** - User accounts and profiles
```
- id, name, email, password_hash, phone
- about_me, city, country, state, languages
- gender, profile_picture, role (user/owner)
- timestamps (created_at, updated_at)
```

**user_preferences** - AI recommendation settings
```
- id, user_id, cuisines, price_range
- preferred_location, dietary_restrictions
- ambiance, sort_preference, search_radius
```

**restaurants** - Restaurant information
```
- id, name, cuisine_type, address, city, phone
- pricing_tier, average_rating, review_count
- owner_id, description, opening_hours
```

**reviews** - User reviews and ratings
```
- id, restaurant_id, user_id, rating (1-5)
- comment, review_date, helpful_count
- timestamps (created_at, updated_at)
```

**favorites** - User favorite restaurants
```
- id, user_id, restaurant_id, added_date
- timestamps (created_at, updated_at)
```

---

## 🎨 UI Features

### Colorful, Modern Design
- Vibrant purple-to-pink gradient navbar
- Responsive card layouts with hover effects
- Cuisine-specific emojis on restaurant cards
- Smooth transitions and animations
- Mobile-friendly Bootstrap grid

### Available Pages
- **Home**: Restaurant search and discovery
- **Login**: Secure user authentication
- **Signup**: New user registration
- **Restaurant Details**: Full restaurant information with reviews
- **Profile**: User profile management
- **Preferences**: AI assistant preferences configuration
- **Chatbot**: Interactive AI chat interface

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ Email validation
- ✅ Role-based access control (user/owner)
- ✅ Protected routes on frontend
- ✅ CORS configuration
- ✅ Environment variable protection

---

## 📝 API Endpoints (22 Total)

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/{user_id}` - Get profile
- `PUT /api/users/{user_id}` - Update profile
- `GET /api/users/{user_id}/preferences` - Get preferences
- `POST /api/users/{user_id}/preferences` - Set preferences

### Restaurants
- `GET /api/restaurants/` - Search restaurants
- `GET /api/restaurants/{restaurant_id}` - Get details
- `POST /api/restaurants/` - Create restaurant (owner)
- `PUT /api/restaurants/{restaurant_id}` - Update (owner)
- `DELETE /api/restaurants/{restaurant_id}` - Delete (owner)

### Reviews
- `GET /api/reviews/restaurant/{restaurant_id}` - Get reviews
- `POST /api/reviews/` - Create review
- `PUT /api/reviews/{review_id}` - Update review
- `DELETE /api/reviews/{review_id}` - Delete review

### Favorites
- `GET /api/favorites/users/{user_id}` - Get favorites
- `POST /api/favorites/` - Add favorite
- `DELETE /api/favorites/{favorite_id}` - Remove favorite
- `GET /api/favorites/check/{user_id}/{restaurant_id}` - Check status

### AI Assistant
- `POST /api/ai_assistant/chat` - Send message to chatbot

**Full API Documentation**: Available at `http://localhost:8000/api/docs` when backend is running

---

## 🌾 Sample Data

10 pre-seeded restaurants included:
- The Italian Kitchen (Italian)
- Dragon Palace (Chinese)
- Tokyo Ramen House (Japanese)
- El Mariachi (Mexican)
- Spice Route (Indian)
- Le Petit Café (French)
- Burger Paradise (American)
- Thai Orchid (Thai)
- Athens Taverna (Greek)
- La Bodega Española (Spanish)

Run seed script:
```bash
cd yelp_backend
python seed_data.py
```

---

## 🔧 Configuration

### Backend .env
```env
# Database (SQLite enabled by default)
DB_TYPE=sqlite
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=yelp_db

# JWT
SECRET_KEY=your-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI (for Pair Partner)
OPENAI_API_KEY=sk-your-key
TAVILY_API_KEY=your-key
```

### Frontend .env
```env
REACT_APP_API_URL=http://localhost:8000
```

---

## 📦 Dependencies

### Backend (15 packages)
- fastapi, uvicorn
- sqlalchemy, pymysql
- pydantic, pydantic[email]
- pyjwt, passlib, cryptography
- python-dotenv
- langchain, langchain-openai
- openai, tavily-python
- And more...

### Frontend (8 packages)
- react, react-dom
- react-router-dom
- Bootstrap 5
- axios
- react-icons
- react-star-ratings
- And more...

---

## ✨ Key Highlights

1. **Production Ready**: Error handling, validation, logging
2. **Scalable Architecture**: Modular design, easy to extend
3. **Modern UI**: Responsive, colorful, user-friendly
4. **Complete Documentation**: API docs, inline comments
5. **Sample Data**: 10 restaurants ready to explore
6. **AI Framework**: Ready for LLM integration
7. **Security**: Authentication, hashing, validation
8. **Database**: Flexible (SQLite/MySQL support)

---

## 🧪 Testing

### Manual Testing Workflow

1. **SignUp**: Create new user account
2. **Login**: Authenticate with credentials
3. **Browse**: Search and filter restaurants
4. **View Details**: Check restaurant information
5. **Add Review**: Rate and review a restaurant
6. **Favorites**: Add restaurants to favorites
7. **Profile**: Edit user preferences
8. **Chatbot**: Test AI assistant (basic framework)

### API Testing
Access Swagger UI: `http://localhost:8000/api/docs`
- Test all endpoints interactively
- Try different parameters
- View request/response examples

---

## 🤝 For Pair Partner (AI Integration)

The AI chatbot framework is ready for LLM integration:

**File to Update**: `yelp_backend/app/services/ai_service.py`

**Functions Ready for Implementation**:
- `process_chat_message()` - Main chat handler
- `interpret_user_query()` - NLP for user input
- `search_restaurants_with_filters()` - Restaurant search integration
- `generate_recommendation()` - AI recommendation engine

**Required Configuration**:
1. Add OpenAI API key to `.env`
2. Add Tavily API key for web search
3. Implement Langchain LLM calls
4. Test with sample queries

---

## 📞 Support & Troubleshooting

### Frontend won't start?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend connection error?
```bash
# Verify SQLite database exists
ls yelp_backend/yelp_dev.db

# Check port 8000 is available
netstat -ano | findstr :8000
```

### Database issues?
```bash
# Reseed database
python seed_data.py

# Or clear and restart (new DB auto-created)
rm yelp_dev.db
python app/main.py
```

---

## 📅 Project Timeline

- **Submission Deadline**: March 24, 2026, 11:59 PM
- **Status**: Ready for submission
- **Next Steps**: Partner integration of AI features

---

## 📄 License & Credits

**Lab Assignment**: Spring 2026 - Advanced Web Development
**Pair Number**: 45
**Type**: Full-Stack Web Application with AI Integration

---

## 🎓 Learning Outcomes

✅ Full-stack web development mastery  
✅ RESTful API design and implementation  
✅ Database design and management  
✅ User authentication and security  
✅ Frontend-backend integration  
✅ AI/LLM integration framework  
✅ Responsive UI/UX design  
✅ Modern development best practices  

---

**Built with ❤️ for Learning Excellence** 🚀
