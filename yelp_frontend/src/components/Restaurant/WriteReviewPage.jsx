import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Badge } from "react-bootstrap";
import { useNavigate, useParams, Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { restaurantsAPI, reviewsAPI } from "../../services/api";
import authService from "../../services/auth";
import "./RestaurantForms.css";

function WriteReviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = authService.getUserId();

  const [restaurant, setRestaurant] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });
  const [loadingRestaurant, setLoadingRestaurant] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    setLoadingRestaurant(true);
    setError("");

    try {
      const response = await restaurantsAPI.getDetails(id);
      setRestaurant(response.data);
    } catch (err) {
      setError("Failed to load restaurant.");
    } finally {
      setLoadingRestaurant(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!reviewData.comment.trim()) {
      setError("Please enter a review comment.");
      return;
    }

    setSubmitting(true);

    try {
      await reviewsAPI.create(id, userId, {
        rating: reviewData.rating,
        comment: reviewData.comment.trim(),
      });

      setSuccess("Review submitted successfully.");
      navigate(`/restaurants/${id}`);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingRestaurant) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  if (!restaurant) {
    return (
      <Container className="py-5">
        <Alert variant="danger">Restaurant not found.</Alert>
        <Link to="/" className="btn btn-outline-danger">
          Back to Restaurants
        </Link>
      </Container>
    );
  }

  const safeAverageRating = Number(restaurant?.average_rating) || 0;
  const safeReviewCount = Number(restaurant?.review_count) || 0;

  return (
    <div className="restaurant-form-page">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={9} xl={8}>
            <Card className="restaurant-form-card">
              <Card.Body>
                <div className="form-page-header">
                  <h1>Write a Review</h1>
                  <p className="text-muted">
                    Share your experience and help others discover great restaurants.
                  </p>
                </div>

                <Card className="review-restaurant-summary mb-4">
                  <Card.Body>
                    <div className="summary-header">
                      <div>
                        <h4>{restaurant.name}</h4>
                        <p className="text-muted mb-2">
                          {restaurant.cuisine_type || restaurant.cuisine || "Restaurant"}
                        </p>
                      </div>

                      <Badge bg="danger" className="summary-rating-badge">
                        {safeAverageRating.toFixed(1)}
                      </Badge>
                    </div>

                    <div className="summary-stars">
                      <StarRatings
                        rating={safeAverageRating}
                        starDimension="18px"
                        starSpacing="2px"
                        starEmptyColor="#ddd"
                        starRatedColor="#d32323"
                        isSelectable={false}
                      />
                      <span>{safeReviewCount} review{safeReviewCount !== 1 ? "s" : ""}</span>
                    </div>
                  </Card.Body>
                </Card>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label>Your Rating</Form.Label>
                    <div className="review-rating-input">
                      <StarRatings
                        rating={reviewData.rating}
                        starDimension="34px"
                        starSpacing="4px"
                        starEmptyColor="#ddd"
                        starRatedColor="#d32323"
                        changeRating={(value) =>
                          setReviewData((prev) => ({
                            ...prev,
                            rating: value,
                          }))
                        }
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Your Review</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="Describe your experience..."
                      value={reviewData.comment}
                      onChange={(e) =>
                        setReviewData((prev) => ({
                          ...prev,
                          comment: e.target.value,
                        }))
                      }
                    />
                  </Form.Group>

                  <div className="form-actions">
                    <Link to={`/restaurants/${id}`} className="btn btn-outline-secondary">
                      Cancel
                    </Link>

                    <Button type="submit" variant="danger" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Review"
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default WriteReviewPage;