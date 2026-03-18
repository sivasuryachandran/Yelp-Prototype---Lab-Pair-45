import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Alert, Form } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { restaurantsAPI, reviewsAPI, favoritesAPI } from '../../services/api';
import authService from '../../services/auth';
import StarRatings from 'react-star-ratings';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import './Restaurant.css';

function RestaurantDetails() {
  const { id } = useParams();
  const userId = authService.getUserId();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchRestaurantDetails();
    fetchReviews();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const response = await restaurantsAPI.getDetails(id);
      setRestaurant(response.data);

      if (userId) {
        const favResponse = await favoritesAPI.check(userId, id);
        setIsFavorite(favResponse.data.is_favorite);
      }
    } catch (err) {
      setError('Failed to load restaurant details');
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByRestaurant(id);
      setReviews(response.data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async () => {
    if (!userId) {
      alert('Please log in to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        setIsFavorite(false);
      } else {
        await favoritesAPI.add(id, userId);
        setIsFavorite(true);
      }
    } catch (err) {
      alert('Failed to update favorite');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('Please log in to submit a review');
      return;
    }

    try {
      await reviewsAPI.create(id, userId, reviewData);
      setReviewData({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchReviews();
      fetchRestaurantDetails();
    } catch (err) {
      alert('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Restaurant not found</Alert>
        <Link to="/" className="btn btn-danger">
          Back to Search
        </Link>
      </Container>
    );
  }

  return (
    <Container className="restaurant-details py-5">
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Restaurant Header */}
      <Row className="mb-4">
        <Col md={8}>
          <div className="restaurant-header-detail">
            <h1>{restaurant.name}</h1>
            <p className="cuisine-type mb-2">{restaurant.cuisine_type}</p>

            <div className="rating-section mb-3">
              <StarRatings
                rating={restaurant.average_rating}
                starDimension="24px"
                starSpacing="2px"
                starEmptyColor="#ddd"
                starRatedColor="#ffc107"
                isSelectable={false}
              />
              <span className="review-count">
                {restaurant.average_rating.toFixed(1)} ({restaurant.review_count} reviews)
              </span>
            </div>

            <div className="restaurant-info-detail mb-4">
              <p>
                <FaMapMarkerAlt /> {restaurant.address}, {restaurant.city}{' '}
                {restaurant.zip_code && `, ${restaurant.zip_code}`}
              </p>
              {restaurant.phone && (
                <p>
                  <FaPhone /> {restaurant.phone}
                </p>
              )}
              {restaurant.hours_of_operation && (
                <p>
                  <FaClock /> Hours vary
                </p>
              )}
              {restaurant.pricing_tier && (
                <p>
                  <strong>Price Range:</strong> {restaurant.pricing_tier}
                </p>
              )}
            </div>

            {restaurant.description && (
              <div className="description mb-4">
                <p>{restaurant.description}</p>
              </div>
            )}
          </div>
        </Col>

        <Col md={4}>
          <Card className="action-card">
            <Card.Body>
              <Button
                variant={isFavorite ? 'danger' : 'outline-danger'}
                className="w-100 mb-2"
                onClick={toggleFavorite}
              >
                {isFavorite ? (
                  <>
                    <FaHeart /> Remove from Favorites
                  </>
                ) : (
                  <>
                    <FaRegHeart /> Add to Favorites
                  </>
                )}
              </Button>

              <Button
                variant="danger"
                className="w-100"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                Write a Review
              </Button>
            </Card.Body>
          </Card>

          {/* Review Form */}
          {showReviewForm && userId && (
            <Card className="action-card mt-3">
              <Card.Body>
                <h6>Write a Review</h6>
                <Form onSubmit={handleSubmitReview}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rating</Form.Label>
                    <div>
                      <StarRatings
                        rating={reviewData.rating}
                        starDimension="30px"
                        starSpacing="3px"
                        starEmptyColor="#ddd"
                        starRatedColor="#ffc107"
                        changeRating={(value) =>
                          setReviewData((prev) => ({ ...prev, rating: value }))
                        }
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Your Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Share your experience..."
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>

                  <Button variant="danger" type="submit" className="w-100 mb-2">
                    Submit Review
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="w-100"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Reviews Section */}
      <Row>
        <Col md={8}>
          <div className="reviews-section">
            <h3>Customer Reviews</h3>

            {reviews.length === 0 ? (
              <p className="text-muted">No reviews yet. Be the first to review this restaurant!</p>
            ) : (
              reviews.map((review) => (
                <Card key={review.id} className="review-card mb-3">
                  <Card.Body>
                    <div className="review-header mb-2">
                      <div>
                        <strong>{review.author?.name || 'Anonymous'}</strong>
                        <div className="review-rating">
                          <StarRatings
                            rating={review.rating}
                            starDimension="16px"
                            starSpacing="1px"
                            starEmptyColor="#ddd"
                            starRatedColor="#ffc107"
                            isSelectable={false}
                          />
                        </div>
                      </div>
                      <small className="text-muted">
                        {new Date(review.created_at).toLocaleDateString()}
                      </small>
                    </div>
                    {review.comment && <p>{review.comment}</p>}
                  </Card.Body>
                </Card>
              ))
            )}
          </div>
        </Col>
      </Row>

      <div className="mt-4">
        <Link to="/" className="btn btn-outline-danger">
          ← Back to Search
        </Link>
      </div>
    </Container>
  );
}

export default RestaurantDetails;
