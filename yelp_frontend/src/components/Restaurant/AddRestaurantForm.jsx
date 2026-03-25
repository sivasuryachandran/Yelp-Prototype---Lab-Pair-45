import React, { useMemo, useState } from "react";
import { Container, Card, Form, Button, Alert, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { restaurantsAPI } from "../../services/api";
import "./RestaurantForms.css";

function getErrorMessage(err, fallback = "Failed to create restaurant.") {
  const detail = err?.response?.data?.detail;

  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (item?.msg && Array.isArray(item?.loc)) {
          return `${item.loc.join(" → ")}: ${item.msg}`;
        }
        if (item?.msg) return item.msg;
        return JSON.stringify(item);
      })
      .join(" | ");
  }

  if (detail && typeof detail === "object") {
    return detail.msg || JSON.stringify(detail);
  }

  return err?.response?.data?.message || err?.message || fallback;
}

function AddRestaurantForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    cuisine_type: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    phone: "",
    pricing_tier: "$$",
    description: "",
    image_url: "",
    amenities: "",
    hours_of_operation: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
  });

  const [uploadedImageDataUrl, setUploadedImageDataUrl] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const effectivePreview = useMemo(() => {
    if (uploadedImageDataUrl) return uploadedImageDataUrl;
    if (formData.image_url?.trim()) return formData.image_url.trim();
    return "";
  }, [uploadedImageDataUrl, formData.image_url]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHoursChange = (day, value) => {
    setError("");
    setFormData((prev) => ({
      ...prev,
      hours_of_operation: {
        ...prev.hours_of_operation,
        [day]: value,
      },
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoName(file.name);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setUploadedImageDataUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Restaurant name is required.";
    if (!formData.cuisine_type.trim()) return "Cuisine type is required.";
    if (!formData.address.trim()) return "Address is required.";
    if (!formData.city.trim()) return "City is required.";
    if (!formData.description.trim()) return "Description is required.";
    return "";
  };

  const parseAmenities = (value) => {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const cleanedHours = Object.fromEntries(
        Object.entries(formData.hours_of_operation).map(([day, value]) => [day, value.trim()])
      );

      const payload = {
        ...formData,
        name: formData.name.trim(),
        cuisine_type: formData.cuisine_type.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zip_code: formData.zip_code.trim(),
        phone: formData.phone.trim(),
        pricing_tier: formData.pricing_tier,
        description: formData.description.trim(),
        amenities: parseAmenities(formData.amenities),
        hours_of_operation: cleanedHours,
        image_url: formData.image_url.trim(),
        photo_data: uploadedImageDataUrl,  // Send the base64 photo data
      };

      const response = await restaurantsAPI.create(payload);
      const newRestaurantId = response?.data?.id;

      setSuccess("Restaurant created successfully.");

      if (newRestaurantId) {
        if (effectivePreview) {
          sessionStorage.setItem(`restaurant_image_${newRestaurantId}`, effectivePreview);
        }

        navigate(`/restaurants/${newRestaurantId}`, {
          state: {
            createdImageUrl: effectivePreview,
          },
        });
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Create restaurant error:", err);
      setError(getErrorMessage(err, "Failed to create restaurant."));
    } finally {
      setLoading(false);
    }
  };

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="restaurant-form-page">
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10} xl={9}>
            <Card className="restaurant-form-card">
              <Card.Body>
                <div className="form-page-header">
                  <h1>Add Restaurant</h1>
                  <p className="text-muted">
                    Create a new restaurant listing with details, pricing, photos, and amenities.
                  </p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Restaurant Name</Form.Label>
                        <Form.Control
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g., Bella Pasta"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Cuisine Type</Form.Label>
                        <Form.Control
                          name="cuisine_type"
                          value={formData.cuisine_type}
                          onChange={handleChange}
                          placeholder="e.g., Italian"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={8}>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="Street address"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          placeholder="San Jose"
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>State</Form.Label>
                        <Form.Control
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          placeholder="CA"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>ZIP Code</Form.Label>
                        <Form.Control
                          name="zip_code"
                          value={formData.zip_code}
                          onChange={handleChange}
                          placeholder="95112"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={4}>
                      <Form.Group>
                        <Form.Label>Pricing Tier</Form.Label>
                        <Form.Select
                          name="pricing_tier"
                          value={formData.pricing_tier}
                          onChange={handleChange}
                        >
                          <option value="$">$</option>
                          <option value="$$">$$</option>
                          <option value="$$$">$$$</option>
                          <option value="$$$$">$$$$</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="(408) 555-1234"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <div className="preferences-section">
                        <h5>Hours of Operation</h5>
                        <Row className="g-3">
                          {days.map((day) => (
                            <Col md={6} key={day}>
                              <Form.Group>
                                <Form.Label>
                                  {day.charAt(0).toUpperCase() + day.slice(1)}
                                </Form.Label>
                                <Form.Control
                                  value={formData.hours_of_operation[day]}
                                  onChange={(e) => handleHoursChange(day, e.target.value)}
                                  placeholder="11 AM - 10 PM"
                                />
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Tell people about the restaurant..."
                          required
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Amenities</Form.Label>
                        <Form.Control
                          type="text"
                          name="amenities"
                          value={formData.amenities}
                          onChange={handleChange}
                          placeholder="e.g., Outdoor seating, Wi-Fi, Parking, Pet-friendly"
                        />
                        <Form.Text className="text-muted">
                          Separate amenities with commas.
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Photo Upload</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Photo URL</Form.Label>
                        <Form.Control
                          name="image_url"
                          value={formData.image_url}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12}>
                      <div className="photo-preview-wrap">
                        {effectivePreview ? (
                          <>
                            <div className="photo-preview-card">
                              <img
                                src={effectivePreview}
                                alt="Restaurant preview"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            </div>
                            {photoName && (
                              <p className="preview-caption">Selected file: {photoName}</p>
                            )}
                          </>
                        ) : (
                          <div className="photo-placeholder">
                            No photo selected yet.
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>

                  <div className="form-actions">
                    <Link to="/" className="btn btn-outline-secondary">
                      Cancel
                    </Link>

                    <Button type="submit" variant="danger" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Creating...
                        </>
                      ) : (
                        "Create Restaurant"
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

export default AddRestaurantForm;