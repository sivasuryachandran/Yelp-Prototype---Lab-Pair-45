import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Button, Alert, Badge } from "react-bootstrap";
import { useParams, Link, useLocation } from "react-router-dom";
import { restaurantsAPI, reviewsAPI, favoritesAPI } from "../../services/api";
import authService from "../../services/auth";
import StarRatings from "react-star-ratings";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaPhone,
  FaClock,
  FaUtensils,
  FaArrowLeft,
} from "react-icons/fa";
import "./Restaurant.css";

const fallbackRestaurantImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
];

function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return fallback;
}

function formatHours(hours) {
  if (!hours) return "";
  if (typeof hours === "string") return hours;
  if (Array.isArray(hours)) return hours.join(", ");
  if (typeof hours === "object") {
    const entries = Object.entries(hours);
    if (entries.length === 0) return "";
    return entries
      .map(([day, value]) => `${day}: ${typeof value === "string" ? value : JSON.stringify(value)}`)
      .join(" | ");
  }
  return "";
}

function getAmenitiesList(amenities) {
  if (!amenities) return [];
  if (Array.isArray(amenities)) {
    return amenities.map((item) => String(item).trim()).filter(Boolean);
  }
  return String(amenities)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function RestaurantDetails() {
  const { id } = useParams();
  const location = useLocation();
  const userId = authService.getUserId();

  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    loadPageData();
  }, [id]);

  const loadPageData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchRestaurantDetails(), fetchReviews()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantDetails = async () => {
    try {
      const response = await restaurantsAPI.getDetails(id);
      const data = response.data;

      const storedImage = sessionStorage.getItem(`restaurant_image_${id}`);
      const createdImageFromState = location.state?.createdImageUrl || "";

      const safeRestaurant = {
        ...data,
        average_rating:
          data?.average_rating !== null && data?.average_rating !== undefined
            ? Number(data.average_rating)
            : 0,
        review_count:
          data?.review_count !== null && data?.review_count !== undefined
            ? Number(data.review_count)
            : 0,
        image_url:
          data?.photo_data ||
          data?.image_url ||
          createdImageFromState ||
          storedImage ||
          fallbackRestaurantImages[Number(id) % fallbackRestaurantImages.length],
      };

      setRestaurant(safeRestaurant);

      if (userId) {
        try {
          const favResponse = await favoritesAPI.check(userId, id);
          setIsFavorite(!!favResponse?.data?.is_favorite);
          setFavoriteId(favResponse?.data?.favorite_id || null);
        } catch (favErr) {
          console.error("Favorite check failed:", favErr);
        }
      }
    } catch (err) {
      console.error("Failed to load restaurant details:", err);
      setError("Failed to load restaurant details");
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByRestaurant(id);
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setError("Failed to load reviews");
      setReviews([]);
    }
  };

  const toggleFavorite = async () => {
    if (!userId) {
      alert("Please log in to add favorites");
      return;
    }

    try {
      if (isFavorite) {
        if (favoriteId) {
          await favoritesAPI.remove(favoriteId);
        }
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await favoritesAPI.add(id, userId);
        setIsFavorite(true);
        setFavoriteId(response?.data?.id || null);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to update favorite");
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

  const safeAverageRating = Number(restaurant?.average_rating) || 0;
  const safeReviewCount = Number(restaurant?.review_count) || 0;
  const amenitiesList = getAmenitiesList(restaurant?.amenities);

  return (
    <div className="restaurant-details-page">
      <section className="detail-hero">
        <img
          src={restaurant.image_url}
          alt={safeText(restaurant.name, "Restaurant")}
          className="detail-hero-image"
          onError={(e) => {
            e.currentTarget.src = fallbackRestaurantImages[0];
          }}
        />
        <div className="detail-hero-overlay" />
        <Container className="detail-hero-content">
          <Link to="/" className="back-link">
            <FaArrowLeft /> Back to Search
          </Link>

          <div className="detail-title-block">
            <h1>{safeText(restaurant.name, "Restaurant")}</h1>

            <div className="detail-subtitle">
              <span className="detail-cuisine">
                <FaUtensils /> {safeText(restaurant.cuisine_type || restaurant.cuisine, "Restaurant")}
              </span>
            </div>

            <div className="detail-rating-row">
              <StarRatings
                rating={safeAverageRating}
                starDimension="22px"
                starSpacing="2px"
                starEmptyColor="#ddd"
                starRatedColor="#d32323"
                isSelectable={false}
              />
              <Badge bg="danger" className="detail-rating-badge">
                {safeAverageRating.toFixed(1)}
              </Badge>
              <span className="detail-review-count">
                {safeReviewCount} review{safeReviewCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-4">
        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="g-4">
          <Col lg={8}>
            <Card className="detail-main-card mb-4">
              <Card.Body>
                <h4 className="section-title">About</h4>

                <div className="restaurant-info-detail">
                  <p>
                    <FaMapMarkerAlt />
                    <span>
                      {[
                        safeText(restaurant.address),
                        safeText(restaurant.city),
                        safeText(restaurant.zip_code),
                      ]
                        .filter(Boolean)
                        .join(", ") || "Address unavailable"}
                    </span>
                  </p>

                  {restaurant.phone && (
                    <p>
                      <FaPhone />
                      <span>{safeText(restaurant.phone)}</span>
                    </p>
                  )}

                  {restaurant.hours_of_operation && (
                    <p>
                      <FaClock />
                      <span>{formatHours(restaurant.hours_of_operation)}</span>
                    </p>
                  )}

                  {restaurant.pricing_tier && (
                    <p>
                      <strong>Price Range:</strong>
                      <span className="ms-1">{safeText(restaurant.pricing_tier)}</span>
                    </p>
                  )}
                </div>

                {restaurant.description && (
                  <div className="description-box">
                    <p>{safeText(restaurant.description)}</p>
                  </div>
                )}

                {amenitiesList.length > 0 && (
                  <div className="amenities-box">
                    <h5 className="amenities-title">Amenities</h5>
                    <div className="amenities-list">
                      {amenitiesList.map((amenity, idx) => (
                        <span key={idx} className="amenity-chip">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="detail-main-card">
              <Card.Body>
                <div className="reviews-header">
                  <h4 className="section-title mb-0">Customer Reviews</h4>
                  <span className="reviews-header-count">
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {reviews.length === 0 ? (
                  <div className="empty-review-state">
                    <p>No reviews yet. Be the first to review this restaurant.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id} className="review-card mb-3">
                      <Card.Body>
                        <div className="review-header">
                          <div>
                            <strong>{safeText(review.author?.name, "Anonymous")}</strong>
                            <div className="review-rating">
                              <StarRatings
                                rating={Number(review.rating) || 0}
                                starDimension="16px"
                                starSpacing="1px"
                                starEmptyColor="#ddd"
                                starRatedColor="#d32323"
                                isSelectable={false}
                              />
                            </div>
                          </div>

                          <small className="text-muted">
                            {review.created_at
                              ? new Date(review.created_at).toLocaleDateString()
                              : ""}
                          </small>
                        </div>

                        {review.comment && (
                          <p className="review-comment">{safeText(review.comment)}</p>
                        )}
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="action-card mb-3">
              <Card.Body>
                <Button
                  variant={isFavorite ? "danger" : "outline-danger"}
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
                  as={Link}
                  to={`/restaurants/${id}/review`}
                  variant="danger"
                  className="w-100"
                >
                  Write a Review
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default RestaurantDetails;