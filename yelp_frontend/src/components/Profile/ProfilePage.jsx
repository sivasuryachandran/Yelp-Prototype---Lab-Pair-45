import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { usersAPI } from '../../services/api';
import authService from '../../services/auth';
import './Profile.css';

function ProfilePage() {
  const userId = authService.getUserId();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    about_me: '',
    city: '',
    country: '',
    state: '',
    languages: '',
    gender: '',
  });

  console.log('ProfilePage loaded, userId:', userId);

  useEffect(() => {
    if (!userId) {
      console.error('No userId found in localStorage');
      setError('User not logged in. Please login first.');
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile for userId:', userId);
      const response = await usersAPI.getProfile(userId);
      console.log('Profile response:', response);
      setProfile(response.data);
      setFormData({
        name: response.data.name || '',
        phone: response.data.phone || '',
        about_me: response.data.about_me || '',
        city: response.data.city || '',
        country: response.data.country || '',
        state: response.data.state || '',
        languages: response.data.languages || '',
        gender: response.data.gender || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to load profile';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!userId) {
      setError('User not logged in. Please refresh and login again.');
      return;
    }

    try {
      console.log('Updating profile for user:', userId);
      console.log('Form data:', formData);
      
      await usersAPI.updateProfile(userId, formData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Update failed';
      setError(errorMessage);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="danger" />
      </Container>
    );
  }

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Australia',
    'India',
    'Other',
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  ];

  return (
    <Container className="profile-container py-5">
      <Row>
        <Col md={8}>
          <div className="profile-card">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {!isEditing ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h2>My Profile</h2>
                  <Button variant="outline-danger" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                </div>

                <div className="profile-info">
                  <Row>
                    <Col md={6} className="mb-3">
                      <p><strong>Full Name:</strong></p>
                      <p>{profile?.name || 'Not provided'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p><strong>Email:</strong></p>
                      <p>{profile?.email || 'Not provided'}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <p><strong>Phone:</strong></p>
                      <p>{profile?.phone || 'Not provided'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p><strong>City:</strong></p>
                      <p>{profile?.city || 'Not provided'}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <p><strong>Country:</strong></p>
                      <p>{profile?.country || 'Not provided'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p><strong>State:</strong></p>
                      <p>{profile?.state || 'Not provided'}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6} className="mb-3">
                      <p><strong>Languages:</strong></p>
                      <p>{profile?.languages || 'Not provided'}</p>
                    </Col>
                    <Col md={6} className="mb-3">
                      <p><strong>Gender:</strong></p>
                      <p>{profile?.gender || 'Not provided'}</p>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={12} className="mb-3">
                      <p><strong>About Me:</strong></p>
                      <p>{profile?.about_me || 'Not provided'}</p>
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <>
                <h2>Edit Profile</h2>

                <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>About Me</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="about_me"
                  value={formData.about_me}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                />
              </Form.Group>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Country</Form.Label>
                    <Form.Select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="">Select State</option>
                      {states.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Languages</Form.Label>
                    <Form.Control
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder="e.g., English, Spanish"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="danger" type="submit" className="mt-3 me-2">
                Save Changes
              </Button>
              <Button variant="outline-secondary" className="mt-3" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </Form>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
