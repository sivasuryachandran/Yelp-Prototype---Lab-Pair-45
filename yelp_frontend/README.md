# Yelp Prototype - Frontend (React)

A modern React-based frontend for a Yelp-like restaurant discovery platform with AI-powered recommendations.

## Features

- User authentication (signup/login)
- Restaurant search and filtering
- Detailed restaurant views with reviews
- Favorite restaurants management
- AI chatbot for personalized recommendations
- User profile and preferences management
- Responsive design for mobile, tablet, and desktop
- Bootstrap and custom CSS styling

## Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **UI Library**: React Bootstrap
- **Icons**: React Icons
- **Ratings**: React Star Ratings
- **Styling**: Bootstrap 5 + Custom CSS

## Prerequisites

- Node.js 14+ 
- npm or yarn

## Installation

1. **Navigate to Frontend Directory**:
   ```bash
   cd yelp_frontend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure API URL**:
   - Update `.env` file:
     ```
     REACT_APP_API_URL=http://localhost:8000/api
     ```

## Running the Frontend

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Project Structure

```
yelp_frontend/
├── public/
│   └── index.html           # HTML entry point
├── src/
│   ├── components/
│   │   ├── Auth/            # Login, Signup components
│   │   ├── Profile/         # Profile, Preferences components
│   │   ├── Restaurant/      # Search, Details components
│   │   ├── Review/          # Review components
│   │   └── ChatBot/         # AI Chatbot component
│   ├── pages/               # Page components
│   ├── services/
│   │   ├── api.js           # Axios API client
│   │   └── auth.js          # Auth utilities
│   ├── App.jsx              # Main App component
│   ├── App.css              # Global styles
│   ├── index.jsx            # React entry point
│   └── index.css            # Global styles
├── package.json
├── .env
└── .gitignore
```

## Key Pages

### Public Pages
- **Home/Explore** (`/`) - Restaurant search and discovery
- **Restaurant Details** (`/restaurants/:id`) - Individual restaurant view
- **Login** (`/login`) - User authentication
- **Signup** (`/signup`) - User registration

### Protected Pages (Require Login)
- **AI Chatbot** (`/chatbot`) - AI assistant for recommendations
- **Profile** (`/profile`) - User profile management
- **Preferences** (`/preferences`) - AI preferences configuration

## Component Documentation

### Authentication Components
- `Login.jsx` - User login form
- `Signup.jsx` - User registration form

### Profile Components
- `ProfilePage.jsx` - User profile view and edit
- `PreferencesEditor.jsx` - AI preferences configuration

### Restaurant Components
- `RestaurantSearch.jsx` - Search and browse restaurants
- `RestaurantDetails.jsx` - Detailed view with reviews

### Chatbot Component
- `AIChatbot.jsx` - AI assistant interface with recommendations

## Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## API Integration

All API calls go through the `services/api.js` file:

```javascript
import { usersAPI, restaurantsAPI, reviewsAPI, aiAssistantAPI } from './services/api';

// Example usage
const profile = await usersAPI.getProfile(userId);
const restaurants = await restaurantsAPI.search({ name: 'Pizza' });
const chatResponse = await aiAssistantAPI.chat(message, history, userId);
```

## Features Implementation

### Authentication Flow
1. User signs up/logs in
2. JWT token stored in localStorage
3. Token automatically added to API requests
4. Protected routes validate authentication
5. Logout clears token and redirects to login

### Restaurant Search
- Real-time search and filtering
- Multiple filter options
- Responsive restaurant cards
- Quick view and detailed page

### AI Chatbot
- Natural language queries
- Personalized recommendations
- Conversation history
- Real-time responses
- Quick action buttons

### User Preferences
- Cuisine preferences
- Price range selection
- Dietary restrictions
- Ambiance preferences
- Location preferences
- Sort preferences

## Styling

The application uses Bootstrap 5 for components and custom CSS for additional styling:

- Color scheme: Yelp red (#d1345b) as primary color
- Responsive breakpoints: xs, sm, md, lg, xl
- Dark navigation bar
- White cards with shadows
- Hover effects and transitions

## Responsive Design

- **Mobile** (< 576px): Single column layout
- **Tablet** (≥ 576px): Two column layout
- **Desktop** (≥ 992px): Multi-column layout

## Testing

To test the application:

1. **Start Backend Server** (see backend README)
2. **Start Frontend Application**: `npm start`
3. **Test User Flow**:
   - Navigate to `/signup` and create account
   - Search for restaurants
   - Add restaurants to favorites
   - Write reviews
   - Use AI chatbot for recommendations
   - Update profile and preferences

## Common Issues

**API Connection Error**:
- Ensure backend is running on port 8000
- Check `.env` file has correct API URL
- Verify CORS is enabled in backend

**Login Not Working**:
- Check browser console for errors
- Verify backend database has user records
- Check localStorage for token storage

**Chatbot Not Responding**:
- Verify OpenAI API key in backend
- Check backend logs for errors
- Ensure user preferences are set

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- CSS minification
- Lazy loading components
- Debounced search queries

## Accessibility

- Semantic HTML structure
- ARIA labels where appropriate
- Keyboard navigation support
- Alt text for images
- Sufficient color contrast

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Create a branch for your feature
2. Follow React best practices
3. Use functional components with hooks
4. Add PropTypes or TypeScript
5. Write descriptive commit messages

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Check existing issues on GitHub
- Create new issue with detailed description
- Include error messages and steps to reproduce
