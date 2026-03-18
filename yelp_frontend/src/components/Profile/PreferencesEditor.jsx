import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { usersAPI } from '../../services/api';
import authService from '../../services/auth';
import './Profile.css';

function PreferencesEditor() {
  const userId = authService.getUserId();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preferences, setPreferences] = useState({
    cuisines: [],
    price_range: '',
    preferred_location: '',
    dietary_restrictions: [],
    ambiance: [],
    sort_preference: 'rating',
    search_radius: 5,
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await usersAPI.getPreferences(userId);
      setPreferences(response.data);
    } catch (err) {
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleCuisineChange = (cuisine) => {
    setPreferences((prev) => ({
      ...prev,
      cuisines: prev.cuisines.includes(cuisine)
        ? prev.cuisines.filter((c) => c !== cuisine)
        : [...prev.cuisines, cuisine],
    }));
  };

  const handleDietaryChange = (dietary) => {
    setPreferences((prev) => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.includes(dietary)
        ? prev.dietary_restrictions.filter((d) => d !== dietary)
        : [...prev.dietary_restrictions, dietary],
    }));
  };

  const handleAmbianceChange = (ambiance) => {
    setPreferences((prev) => ({
      ...prev,
      ambiance: prev.ambiance.includes(ambiance)
        ? prev.ambiance.filter((a) => a !== ambiance)
        : [...prev.ambiance, ambiance],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await usersAPI.setPreferences(userId, preferences);
      setSuccess('Preferences saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Save failed');
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  const cuisines = ['Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'American', 'Thai', 'French'];
  const dietary = ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal', 'Kosher'];
  const ambiances = ['Casual', 'Fine Dining', 'Family-friendly', 'Romantic', 'Quiet', 'Lively'];

  return (
    <Container className="preferences-container py-5">
      <Row>
        <Col md={8}>
          <div className="preferences-card">
            <h2>AI Assistant Preferences</h2>
            <p className="text-muted">
              Customize your dining preferences for personalized restaurant recommendations
            </p>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Cuisines */}
              <div className="preferences-section">
                <h5>Cuisine Preferences</h5>
                <div className="checkbox-group">
                  {cuisines.map((cuisine) => (
                    <Form.Check
                      key={cuisine}
                      type="checkbox"
                      id={`cuisine-${cuisine}`}
                      label={cuisine}
                      checked={preferences.cuisines.includes(cuisine)}
                      onChange={() => handleCuisineChange(cuisine)}
                    />
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="preferences-section">
                <h5>Price Range</h5>
                <Form.Group>
                  <div className="radio-group">
                    {['$', '$$', '$$$', '$$$$'].map((price) => (
                      <Form.Check
                        key={price}
                        type="radio"
                        id={`price-${price}`}
                        label={price}
                        name="price_range"
                        value={price}
                        checked={preferences.price_range === price}
                        onChange={(e) =>
                          setPreferences((prev) => ({
                            ...prev,
                            price_range: e.target.value,
                          }))
                        }
                      />
                    ))}
                  </div>
                </Form.Group>
              </div>

              {/* Dietary Restrictions */}
              <div className="preferences-section">
                <h5>Dietary Restrictions</h5>
                <div className="checkbox-group">
                  {dietary.map((diet) => (
                    <Form.Check
                      key={diet}
                      type="checkbox"
                      id={`diet-${diet}`}
                      label={diet}
                      checked={preferences.dietary_restrictions.includes(diet)}
                      onChange={() => handleDietaryChange(diet)}
                    />
                  ))}
                </div>
              </div>

              {/* Ambiance */}
              <div className="preferences-section">
                <h5>Ambiance Preferences</h5>
                <div className="checkbox-group">
                  {ambiances.map((ambiance) => (
                    <Form.Check
                      key={ambiance}
                      type="checkbox"
                      id={`ambiance-${ambiance}`}
                      label={ambiance}
                      checked={preferences.ambiance.includes(ambiance)}
                      onChange={() => handleAmbianceChange(ambiance)}
                    />
                  ))}
                </div>
              </div>

              {/* Preferred Location */}
              <div className="preferences-section">
                <Form.Group className="mb-3">
                  <Form.Label>Preferred Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="e.g., San Francisco, CA"
                    value={preferences.preferred_location}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        preferred_location: e.target.value,
                      }))
                    }
                  />
                </Form.Group>
              </div>

              {/* Search Radius */}
              <div className="preferences-section">
                <Form.Group className="mb-3">
                  <Form.Label>Search Radius (miles)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="50"
                    value={preferences.search_radius}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        search_radius: parseInt(e.target.value),
                      }))
                    }
                  />
                </Form.Group>
              </div>

              {/* Sort Preference */}
              <div className="preferences-section">
                <Form.Group className="mb-3">
                  <Form.Label>Sort By</Form.Label>
                  <Form.Select
                    value={preferences.sort_preference}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        sort_preference: e.target.value,
                      }))
                    }
                  >
                    <option value="rating">Rating</option>
                    <option value="distance">Distance</option>
                    <option value="popularity">Popularity</option>
                    <option value="price">Price</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <Button variant="danger" type="submit" className="mt-3">
                Save Preferences
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default PreferencesEditor;
