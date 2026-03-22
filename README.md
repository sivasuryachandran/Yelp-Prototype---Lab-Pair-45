# Yelp Prototype - Lab Pair 45

Full-Stack Restaurant Discovery and Review Platform with AI-Powered Recommendations

## Assignment Information

- Course: AB 1 Assignment
- Title: Yelp Prototype - Using FastAPI and ReactJS + Agentic AI
- Due Date: March 24, 2026, 11:59 PM
- Total Points: 40

---

## Project Overview

A comprehensive Yelp-style restaurant discovery and review platform built with React for the frontend and Python FastAPI for the backend. The application supports two main user personas: Users (Reviewers) and Restaurant Owners. Key features include user authentication with secure password hashing, restaurant search with advanced filtering capabilities, a comprehensive review system, user preferences management, and an AI-powered chatbot that provides personalized restaurant recommendations using natural language processing.

The platform is designed to be responsive across mobile, tablet, and desktop devices, with proper error handling, security measures, and scalable architecture suitable for production deployment.

## Core Requirements

The application implements the following key features:

- User authentication with JWT-based session management and bcrypt password hashing
- User profile management with customizable personal information and preferences
- Advanced restaurant search and filtering by cuisine type, price range, location, and keywords
- Complete review system allowing users to create, edit, and delete their own reviews with ratings
- Favorites management and user activity history tracking
- AI Assistant chatbot with natural language understanding for personalized recommendations
- Restaurant owner features including profile management, posting, and analytics
- RESTful API architecture with comprehensive API documentation via Swagger
- Fully responsive user interface optimized for all device sizes

## Technology Stack

**Backend Infrastructure**
- Framework: Python FastAPI
- Database: MySQL 5.7 or higher
- ORM: SQLAlchemy
- Authentication: JWT (python-jose)
- Password Security: bcrypt
- AI and NLP: Langchain with LLM integration
- Optional Web Search: Tavily API for real-time restaurant information
- API Documentation: Swagger/OpenAPI

**Frontend Infrastructure**
- Framework: React 18
- Routing: React Router v6
- HTTP Client: Axios
- UI Framework: Bootstrap 5 or TailwindCSS
- Additional Libraries: React Icons
- Styling: CSS3 with responsive design patterns

**Development and Deployment**
- Version Control: Git
- API Testing: Swagger or Postman
- Build Tool: Create React App (frontend), Uvicorn (backend)

## Getting Started

This section provides instructions for setting up and running both the backend and frontend components of the application. Ensure you have the necessary prerequisites installed before proceeding.

### Backend Setup

Navigate to the backend directory and follow these steps:

```bash
cd yelp_backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate

# Install all required Python packages
pip install -r requirements.txt

# Start the FastAPI server
python app/main.py
```

The backend server will be accessible at `http://localhost:8000`. The interactive API documentation is available at `http://localhost:8000/docs` (Swagger UI) and `http://localhost:8000/redoc` (ReDoc alternative).

### Frontend Setup

Navigate to the frontend directory and follow these steps:

```bash
cd yelp_frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start
```

The frontend application will be accessible at `http://localhost:3000`. The development server includes hot-reload functionality for faster development iteration.

## Feature Requirements

### User (Reviewer) Features

The application must provide the following features for regular users:

1. Account Management
   - User registration with name, email, and password
   - Secure password storage using bcrypt hashing algorithm
   - Login functionality with JWT or session-based authentication
   - Logout capability with proper session management

2. User Profile
   - Display of user account information and profile picture
   - Ability to update profile details including name, email, phone number, bio, city, country, spoken languages, and gender
   - Country field implemented as a dropdown selection
   - State/province field with proper abbreviations

3. User Preferences
   Users can configure preferences for the AI assistant feature:
   - Cuisine type preferences (Italian, Chinese, Mexican, Indian, Japanese, American, etc.)
   - Price range selection on a four-tier scale ($, $$, $$$, $$$$)
   - Preferred search location and search radius
   - Dietary restrictions including vegetarian, vegan, halal, gluten-free, kosher, and custom options
   - Ambiance preferences (casual, fine dining, family-friendly, romantic, etc.)
   - Preferred sorting method for results (by rating, distance, popularity, price)

4. Restaurant Discovery
   - Search functionality supporting multiple search criteria
   - Filter options including restaurant name, cuisine type, location, and keywords
   - Keyword search capability (e.g., 'quiet', 'family-friendly', 'outdoor seating', 'wifi')
   - Location-based search by city or zip code
   - Display of search results with restaurant cards showing key information

5. Restaurant Details
   - Comprehensive restaurant information display
   - Restaurant name, cuisine type, address, and description
   - Operating hours and contact information
   - Average rating calculation and total review count
   - Photo gallery for restaurant images
   - Complete list of user reviews with ratings, comments, and dates
   - Photo viewing capability for reviews

6. Restaurant Submission
   - Ability for users to add new restaurant listings to the platform
   - Required information: restaurant name, cuisine type, address
   - Optional information: contact details, description, hours of operation, photos

7. Review Management
   - Create new reviews for restaurants with 1 to 5 star ratings
   - Edit and delete reviews for restaurants created by the user
   - Comment text entry for detailed feedback
   - Server-generated timestamps for review creation and modification
   - Optional photo attachment capability with reviews

8. Favorites System
   - Ability to mark restaurants as favorite
   - Dedicated favorites section displaying saved restaurants
   - Remove restaurants from favorites list

9. Activity History
   - Display of user's previous review contributions
   - Display of restaurants added by the user
   - Historical tracking of user activities on the platform

10. AI Assistant Access
    - Prominent placement of AI chatbot on the home screen or dashboard
    - Ability to interact with chatbot for restaurant recommendations
    - Natural language query processing for diverse user requests

### Restaurant Owner Features

The application must support the following features for restaurant owners:

1. Owner Account Management
   - Account registration with name, email, password, and restaurant location
   - Login functionality with session-based or JWT authentication
   - Logout capability

2. Restaurant Profile Management
   - View and edit restaurant profile information
   - Update restaurant name, cuisine type, and description
   - Manage restaurant location and contact information
   - Upload and manage restaurant photographs
   - Edit hours of operation

3. Restaurant Posting
   - Create restaurant listings with comprehensive details
   - Specify location, detailed description, and photos
   - Set pricing tier (from $ to $$$$)
   - Define amenities available at the restaurant
   - Designate cuisine types served
   - Provide contact information and operating hours

4. Restaurant Claim and Management
   - Claim existing restaurant listings in the system
   - Take ownership of restaurant profiles
   - Update claimed restaurant information

5. Review Monitoring
   - View all reviews submitted for owned restaurants
   - Read-only access to customer reviews for moderation purposes
   - Cannot delete customer reviews from the system

6. Owner Dashboard
   - View restaurant analytics and performance metrics
   - Display recent reviews submitted by customers
   - Track restaurant visibility and engagement metrics
   - Performance metrics

## AI Assistant Chatbot Implementation

The AI-powered chatbot serves as a core feature of the platform, providing users with intelligent, personalized restaurant recommendations through natural language conversation.

### Functionality

The chatbot operates as follows:

1. The system loads the user's saved preferences from the database on the initial query
2. User messages are processed using Langchain for natural language understanding
3. The chatbot extracts key information from user queries including cuisine type, price range, dietary restrictions, occasion, and ambiance preferences
4. Restaurant database queries are executed with intelligent filtering based on extracted parameters
5. Results are ranked according to relevance to the specific query combined with the user's saved preferences
6. Conversational, context-aware responses are generated with reasoning for recommendations
7. The system supports multi-turn conversations allowing users to refine and adjust recommendations
8. Optional integration with Tavily web search for accessing current restaurant hours, special events, and trending establishments

### Example Interactions

Example 1: Basic Preference-Based Query
- User: "I'm looking for a place for dinner tonight"
- Response: System identifies user's Italian cuisine preference and mid-range budget, recommending Pasta Paradise (4.5 stars, $$) with note "Matches your Italian preference and budget" and Trattoria Roma (4.7 stars, $$) with note "Highly rated, Italian, within your price range"

Example 2: Special Occasion Query
- User: "Something romantic for an anniversary"
- Response: System considers romantic ambiance preference and provides Candlelight Bistro (4.8 stars, $$$) noted as "Romantic ambiance, French cuisine, highly rated" and Sunset Terrace (4.6 stars, $$$) noted as "Outdoor seating with views, perfect for special occasions"

Example 3: Dietary Restriction Query
- User: "I'm vegan and want something casual"
- Response: System recommends Green Leaf Cafe (4.4 stars, $) noted as "100% vegan menu, casual atmosphere" and Veggie Delight (4.5 stars, $$) noted as "Extensive vegan options, relaxed setting"

### API Endpoint

POST /api/ai-assistant/chat
- Input parameters: message (user query string), conversation_history (array of previous messages)
- Output: Structured JSON response containing restaurant recommendations with details

### User Interface

The chatbot interface includes:
- Chat window displaying conversation history
- Input field for user message entry
- Display of recommended restaurants with name, rating, price tier, and cuisine type
- Clickable restaurant cards with navigation to full details page
- Processing indicator during AI response generation
- Ability to clear chat history and start new conversations
- Optional quick action buttons such as "Find dinner tonight", "Best rated near me", "Vegan options"

## API Documentation and Testing

The backend API must be fully documented and testable. Developers must choose one of the following documentation approaches for API specification:

### Option 1: Swagger/OpenAPI (Recommended)

Implement Swagger UI for interactive API documentation:
- Swagger UI accessible at /docs endpoint
- Automatic generation from FastAPI code using OpenAPI specification
- Interactive testing capabilities directly within documentation interface
- Clear endpoint descriptions and parameter specifications
- Request and response schema documentation

### Option 2: Postman Collection

Create a comprehensive Postman collection:
- Detailed descriptions for each API endpoint
- Request parameters with type specifications
- HTTP headers documentation
- Sample request and response bodies
- Export collection for version control and team sharing

### Core API Endpoints

Authentication Endpoints:
- POST /api/auth/signup - User and owner account creation
- POST /api/auth/login - Account authentication with token generation
- POST /api/auth/logout - Session termination

User Management Endpoints:
- GET /api/users/{user_id} - Retrieve user profile information
- PUT /api/users/{user_id} - Update user profile details
- GET /api/users/{user_id}/preferences - Retrieve user dining preferences
- PUT /api/users/{user_id}/preferences - Update user preferences

Restaurant Endpoints:
- GET /api/restaurants - List and search restaurants with filters
- POST /api/restaurants - Create new restaurant listing
- GET /api/restaurants/{restaurant_id} - Retrieve specific restaurant details
- PUT /api/restaurants/{restaurant_id} - Update restaurant information
- GET /api/restaurants/{restaurant_id}/reviews - Retrieve restaurant reviews

Review Endpoints:
- POST /api/reviews - Create new review for restaurant
- GET /api/reviews/{review_id} - Retrieve specific review
- PUT /api/reviews/{review_id} - Update existing review
- DELETE /api/reviews/{review_id} - Delete user's own review

Favorites Endpoints:
- GET /api/favorites - Retrieve user's favorite restaurants
- POST /api/favorites - Add restaurant to favorites
- DELETE /api/favorites/{restaurant_id} - Remove restaurant from favorites

AI Assistant Endpoint:
- POST /api/ai-assistant/chat - Send message to AI chatbot for recommendations

## Frontend Application Architecture

The frontend application is organized into logical pages and views that work together to provide a cohesive user experience.

### Public Pages (Accessible Without Authentication)

1. Restaurant Exploration/Search Page
   - Main landing page for restaurant discovery
   - Search functionality with multiple filter options
   - Display restaurant results as interactive cards
   - Show key restaurant information including name, rating, and cuisine type
   - Pagination or infinite scroll for result navigation

2. Restaurant Details Page
   - Comprehensive view of individual restaurant
   - Display complete restaurant information
   - Show photo gallery for restaurant images
   - Display average rating and total review count
   - Show all user-submitted reviews with ratings and comments
   - Display restaurant contact information and hours

### Authenticated User Pages

1. Authentication Pages
   - User signup page with form validation
   - Login page with error handling
   - Password field masking for security
   - Validation feedback for required fields

2. User Profile and Preferences
   - Profile page displaying user account information
   - Editable fields for personal information
   - Profile picture upload capability
   - Preferences editor for AI chatbot configuration
   - Storage and retrieval of user preferences

3. Restaurant Search and Management
   - Advanced search page with multiple filter options
   - Create new restaurant listing form with required fields
   - Form validation for all inputs
   - Photo upload capability for restaurants

4. Review Management
   - Write review form with rating system
   - Comment text area for detailed feedback
   - Star rating selection interface
   - Optional photo attachment capability
   - Review submission and confirmation

5. User Dashboard
   - Favorites tab showing saved restaurants
   - History tab showing user's previous activities
   - AI Assistant chatbot interface displayed prominently
   - Quick access to common features

6. AI Assistant Chatbot
   - Chat-like conversational interface
   - Display of conversation history
   - Input field for user queries
   - Real-time response display with restaurant recommendations
   - Clickable restaurant cards linking to details page
   - Ability to start new conversation

### Restaurant Owner Pages (Optional Implementation)

1. Owner Authentication
   - Owner signup page with business information
   - Owner login page

2. Restaurant Management
   - Profile management page for owned restaurant
   - Edit restaurant details interface
   - Add new restaurant listing form
   - Photo management interface
   - Hours and amenities configuration

3. Restaurant Claiming
   - Interface to claim existing restaurant listings
   - Ownership verification process

4. Reviews and Analytics
   - Reviews dashboard showing all submitted reviews
   - Read-only review display
   - Filter and sort options for reviews
   - Analytics dashboard with performance metrics
   - Rating distribution visualization
   - Recent review display

### Frontend Design Standards

The frontend implementation must adhere to the following standards:

Responsive Design:
- Mobile optimization for screens smaller than 576px
- Tablet optimization for screens 576px to 992px
- Desktop optimization for screens larger than 992px
- Flexible layouts that adapt to various screen sizes
- Touch-friendly interface elements for mobile devices

User Interface:
- Clean and modern design aesthetic
- Consistent styling throughout application
- Use of CSS framework such as Bootstrap or TailwindCSS
- Professional color scheme and typography
- Clear visual hierarchy and information organization

API Integration:
- Axios or Fetch API for all backend communications
- Proper error handling with user-friendly messages
- Loading state indicators during API requests
- Timeout handling for slow connections
- Retry logic for failed requests

Code Architecture:
- Component-based structure with reusable components
- Separation of concerns between pages and components
- Service layer for API communication
- Clear folder structure for maintainability
- Proper state management using React hooks

## Security and Non-Functional Requirements

### Security Requirements

Password Security:
- All passwords must be hashed using bcrypt before database storage
- Never store plain text passwords in the database
- Implement proper password validation on user input

Authentication:
- Implement session-based or JWT authentication for user sessions
- Secure token generation and validation
- Token expiration after configurable timeout period
- Proper error handling without exposing sensitive information

API Security:
- Validate all user input to prevent injection attacks
- Implement rate limiting on authentication endpoints
- Use HTTPS in production environments
- Implement CORS headers appropriately
- Secure storage of API keys in environment variables

Data Protection:
- Never display sensitive user information in error messages
- Implement proper access control for user-specific data
- Validate that users can only modify their own data

### Scalability and Performance Requirements

Database Optimization:
- Create appropriate indexes on frequently queried fields
- Optimize database queries to avoid unnecessary data loading
- Implement pagination for large result sets

API Performance:
- Ensure efficient API response times
- Minimize data transfer by returning only required fields
- Implement caching strategies where appropriate
- Monitor and optimize slow queries

Frontend Performance:
- Optimize component rendering to prevent unnecessary re-renders
- Implement lazy loading for images and components
- Minimize bundle size through code splitting
- Use efficient state management

### Accessibility Requirements

HTML Semantics:
- Use proper semantic HTML elements
- Implement heading hierarchy correctly
- Use form labels associated with input fields

Visual Accessibility:
- Provide alternative text for all images
- Ensure sufficient color contrast between text and background
- Do not rely solely on color to convey information

Keyboard Navigation:
- Support keyboard navigation throughout the application
- Implement focus indicators for keyboard users
- Ensure all interactive elements are keyboard accessible

Screen Reader Support:
- Add ARIA labels where appropriate
- Use proper heading and list structures
- Describe images and icons for screen reader users

### Responsive Design Requirements

The application must function properly across all device sizes:
- Mobile devices (less than 576px width)
- Tablets (576px to 992px width)
- Desktop computers (992px and larger)
- Touch and mouse input support
- Images and media scale appropriately

## Project Structure and File Organization

The project is organized with clear separation between frontend and backend components:

Root Directory Structure:
```
Yelp-Prototype-Lab-Pair-45/
├── README.md                      Main project documentation
├── yelp_backend/                  Backend application directory
│   ├── app/                       Main application package
│   │   ├── __init__.py
│   │   ├── main.py               FastAPI application entry point
│   │   ├── database.py           Database configuration and session management
│   │   ├── models.py             SQLAlchemy database models
│   │   ├── schemas.py            Pydantic request and response schemas
│   │   ├── routes/               API endpoint route definitions
│   │   │   ├── __init__.py
│   │   │   ├── auth.py          Authentication endpoints
│   │   │   ├── users.py         User management endpoints
│   │   │   ├── restaurants.py   Restaurant endpoints
│   │   │   ├── reviews.py       Review endpoints
│   │   │   ├── favorites.py     Favorites endpoints
│   │   │   └── ai_assistant.py  AI chatbot endpoints
│   │   ├── services/             Business logic layer
│   │   │   ├── __init__.py
│   │   │   └── ai_service.py    AI chatbot service implementation
│   │   └── utils/                Utility functions
│   │       ├── __init__.py
│   │       └── security.py      Authentication and security utilities
│   ├── requirements.txt          Python package dependencies
│   ├── seed_data.py             Sample data population script
│   └── README.md                Backend-specific documentation
├── yelp_frontend/                Frontend application directory
│   ├── src/                      Source code directory
│   │   ├── components/           Reusable React components
│   │   │   ├── Auth/            Authentication components
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   ├── ChatBot/         AI chatbot components
│   │   │   │   ├── AIChatbot.jsx
│   │   │   │   └── ChatBot.css
│   │   │   ├── Profile/         User profile components
│   │   │   │   ├── ProfilePage.jsx
│   │   │   │   ├── PreferencesEditor.jsx
│   │   │   │   └── Profile.css
│   │   │   ├── Restaurant/      Restaurant-related components
│   │   │   │   ├── RestaurantSearch.jsx
│   │   │   │   ├── RestaurantDetails.jsx
│   │   │   │   └── Restaurant.css
│   │   │   └── Review/           Review components
│   │   │       ├── ReviewForm.jsx
│   │   │       ├── ReviewCard.jsx
│   │   │       ├── ReviewList.jsx
│   │   │       └── Review.css
│   │   ├── services/             API and authentication services
│   │   │   ├── api.js           Axios API client configuration
│   │   │   └── auth.js          Authentication service functions
│   │   ├── App.jsx              Main application component
│   │   ├── App.css              Application-level styles
│   │   ├── index.js             React entry point
│   │   ├── index.jsx            JSX entry point
│   │   └── index.css            Global application styles
│   ├── public/                   Static files directory
│   │   └── index.html           HTML entry point
│   ├── package.json             Node.js dependencies and scripts
│   ├── .env                     Environment variables (not committed)
│   └── README.md                Frontend-specific documentation
```

## Configuration and Environment Setup

The application requires proper configuration through environment variables before execution. Ensure all necessary values are set correctly to enable full functionality.

### Backend Configuration

Create a .env file in the yelp_backend directory with the following variables:

```
# Database Configuration
DATABASE_URL=mysql://username:password@localhost:3306/yelp_db
SQLALCHEMY_ECHO=False

# JWT Authentication
SECRET_KEY=your_secret_key_here_min_32_chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_TITLE=Yelp Prototype API
API_VERSION=1.0.0

# AI/LLM Configuration
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here (optional)

# Server Configuration
SERVER_HOST=127.0.0.1
SERVER_PORT=8000
```

### Frontend Configuration

Create a .env file in the yelp_frontend directory with the following variables:

```
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_API_BASE_URL=http://localhost:8000

# Optional: Feature flags
REACT_APP_ENABLE_OWNER_FEATURES=true
REACT_APP_DEBUG_MODE=false
```

### Database Setup

Before running the backend, ensure MySQL is installed and running:

1. Create the application database:
   ```bash
   mysql -u username -p
   >> CREATE DATABASE yelp_db;
   >> EXIT;
   ```

2. The application will automatically create required tables on first run if using SQLAlchemy create_all()

3. Optional: Populate sample data using the seed script:
   ```bash
   python seed_data.py
   ````

## Version Control and Git Repository Guidelines

Proper version control practices ensure code quality, traceability, and collaboration.

### Commit Practices

- Write clear, descriptive commit messages that explain changes made
- Use consistent commit message format: [TYPE] Description - Additional details
- Example format: "[FEATURE] Add email verification" or "[FIX] Resolve review deletion bug"
- Commit frequently with logical groupings of changes
- Do not combine unrelated changes in a single commit

### Files and Directories

Files that must NOT be committed:
- Virtual environment directories (venv/, .venv/, conda/)
- Python cache files (__pycache__/)
- Node modules directory (node_modules/)
- Environment variable files (.env, .env.local)
- Operating system files (.DS_Store, Thumbs.db)
- IDE configuration files (.idea/, .vscode/settings.json)
- Build outputs and temporary files

Files that MUST be committed:
- requirements.txt with all Python dependencies
- package.json and package-lock.json
- Clear and comprehensive README.md files
- Source code (.py, .jsx, .js files)
- Configuration templates (.env.example)
- Database migrations if applicable

### Repository Access Control

- Repository visibility: Private
- Add required collaborators (Devdatta1999 and Saurabh2504) with appropriate access levels
- Use branch protection rules if available
- Document any special merge requirements

### Branching Strategy

Optional but recommended:
- Use feature branches for major feature development
- Name branches descriptively (feature/restaurant-search, fix/auth-bug)
- Create pull requests for peer review before merging
- Maintain a clean main branch with working code only
- Delete merged branches to keep repository clean
