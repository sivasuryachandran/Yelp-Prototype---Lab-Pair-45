import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { restaurantsAPI, favoritesAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import authService from '../../services/auth';
import StarRatings from 'react-star-ratings';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import './Restaurant.css';

function RestaurantSearch() {
  const userId = authService.getUserId();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState({});
  const [filters, setFilters] = useState({
    name: '',
    cuisine: '',
    city: '',
    keywords: '',
  });

  useEffect(() => {
    searchRestaurants();
  }, []);

  const searchRestaurants = async (searchParams = filters) => {
    setLoading(true);
    setError('');
    try {
      const response = await restaurantsAPI.search(searchParams);
      setRestaurants(response.data);

      // Check favorites for each restaurant
      if (userId && response.data.length > 0) {
        const favData = {};
        for (const restaurant of response.data) {
          try {
            const favResponse = await favoritesAPI.check(userId, restaurant.id);
            favData[restaurant.id] = favResponse.data.is_favorite;
          } catch {}
        }
        setFavorites(favData);
      }
    } catch (err) {
      setError('Failed to search restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    searchRestaurants(filters);
  };

  const toggleFavorite = async (restaurantId) => {
    if (!userId) {
      alert('Please log in to add favorites');
      return;
    }

    try {
      if (favorites[restaurantId]) {
        // Find the favorite and remove it
        // In a real app, you'd need to store the favorite ID
        setFavorites((prev) => ({ ...prev, [restaurantId]: false }));
      } else {
        await favoritesAPI.add(restaurantId, userId);
        setFavorites((prev) => ({ ...prev, [restaurantId]: true }));
      }
    } catch (err) {
      alert('Failed to update favorite');
    }
  };

  return (
    <Container fluid className="restaurant-search py-5">
      <div className="search-header">
        <h1>Find Your Next Favorite Restaurant</h1>
        <p>Discover amazing restaurants in your area</p>
      </div>

      {/* Search Filters */}
      <Row className="search-filters mb-4">
        <Col md={12}>
          <Card className="filter-card">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Restaurant Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Search by name..."
                      name="name"
                      value={filters.name}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Cuisine</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., Italian..."
                      name="cuisine"
                      value={filters.cuisine}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., New York..."
                      name="city"
                      value={filters.city}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Keywords</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="e.g., outdoor seating..."
                      name="keywords"
                      value={filters.keywords}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="danger"
                onClick={handleSearch}
                className="mt-3"
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Results */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" variant="danger" />
        </div>
      )}

      <Row className="restaurant-results">
        {restaurants.map((restaurant) => (
          <Col md={6} lg={4} key={restaurant.id} className="mb-4">
            <Card className="restaurant-card h-100">
              <div className="restaurant-image">
                {/* Colorful placeholder with emoji based on cuisine */}
                {restaurant.cuisine_type === 'Italian' || restaurant.cuisine_type === 'italian' ? '🍝' :
                 restaurant.cuisine_type === 'Japanese' || restaurant.cuisine_type === 'japanese' ? '🍣' :
                 restaurant.cuisine_type === 'Mexican' || restaurant.cuisine_type === 'mexican' ? '🌮' :
                 restaurant.cuisine_type === 'Chinese' || restaurant.cuisine_type === 'chinese' ? '🥢' :
                 restaurant.cuisine_type === 'Indian' || restaurant.cuisine_type === 'indian' ? '🍛' :
                 restaurant.cuisine_type === 'American' || restaurant.cuisine_type === 'american' ? '🍔' :
                 restaurant.cuisine_type === 'Thai' || restaurant.cuisine_type === 'thai' ? '🍜' :
                 restaurant.cuisine_type === 'French' || restaurant.cuisine_type === 'french' ? '🥐' :
                 restaurant.cuisine_type === 'Greek' || restaurant.cuisine_type === 'greek' ? '🌯' :
                 restaurant.cuisine_type === 'Spanish' || restaurant.cuisine_type === 'spanish' ? '🥘' :
                 '🍽️'}
              </div>
              <Card.Body>
                <div className="restaurant-header">
                  <div>
                    <h5>{restaurant.name || 'Restaurant'}</h5>
                    <p className="cuisine-type">{restaurant.cuisine_type || 'Cuisine'}</p>
                  </div>
                  <button
                    className="favorite-btn"
                    onClick={() => toggleFavorite(restaurant.id)}
                  >
                    {favorites[restaurant.id] ? (
                      <FaHeart className="active" />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>

                <div className="rating-section mb-2">
                  <StarRatings
                    rating={restaurant.average_rating || 0}
                    starDimension="20px"
                    starSpacing="2px"
                    starEmptyColor="#ddd"
                    starRatedColor="#ffc107"
                    isSelectable={false}
                  />
                  <span className="review-count">
                    ({restaurant.review_count || 0} reviews)
                  </span>
                </div>

                <div className="restaurant-info mb-3">
                  {restaurant.pricing_tier && (
                    <p>
                      <strong>Price:</strong> {restaurant.pricing_tier}
                    </p>
                  )}
                  <p>
                    <FaMapMarkerAlt /> {restaurant.address}, {restaurant.city}
                  </p>
                  {restaurant.phone && (
                    <p>
                      <FaPhone /> {restaurant.phone}
                    </p>
                  )}
                </div>

                <Link
                  to={`/restaurants/${restaurant.id}`}
                  className="btn btn-danger btn-sm w-100"
                >
                  View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {!loading && restaurants.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No restaurants found. Try adjusting your search criteria.</p>
        </div>
      )}
    </Container>
  );
}

export default RestaurantSearch;
