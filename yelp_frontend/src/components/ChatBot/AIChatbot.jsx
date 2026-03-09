import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { aiAssistantAPI, restaurantsAPI } from '../../services/api';
import authService from '../../services/auth';
import { FaRobot, FaUser, FaTrash, FaLink } from 'react-icons/fa';
import StarRatings from 'react-star-ratings';
import './ChatBot.css';

function AIChatbot() {
  const userId = authService.getUserId();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content:
        "Hi! 👋 I'm your personal restaurant assistant. I can help you find the perfect restaurant based on your preferences. What are you in the mood for today?",
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      // Call AI assistant API
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await aiAssistantAPI.chat(
        userInput,
        conversationHistory,
        userId
      );

      // Add assistant response
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Store recommendations
      if (response.data.recommendations && response.data.recommendations.length > 0) {
        setRecommendations(response.data.recommendations);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content:
          "Hi! 👋 I'm your personal restaurant assistant. I can help you find the perfect restaurant based on your preferences. What are you in the mood for today?",
      },
    ]);
    setRecommendations([]);
  };

  const quickActions = [
    'Find dinner tonight',
    'Best rated near me',
    'Vegan options',
    'Romantic dinner',
  ];

  return (
    <Container fluid className="chatbot-container py-5">
      <Row className="h-100">
        {/* Chat Window */}
        <Col md={8}>
          <Card className="chatbot-card h-100 d-flex flex-column">
            <Card.Header className="chatbot-header">
              <h5 className="mb-0">
                <FaRobot /> Restaurant Assistant
              </h5>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={clearChat}
                title="Clear chat"
              >
                <FaTrash />
              </Button>
            </Card.Header>

            <Card.Body className="messages-container">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message message-${message.role}`}
                >
                  <div className="message-avatar">
                    {message.role === 'user' ? (
                      <FaUser />
                    ) : (
                      <FaRobot />
                    )}
                  </div>
                  <div className="message-content">
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message message-assistant">
                  <div className="message-avatar">
                    <FaRobot />
                  </div>
                  <div className="message-content">
                    <Spinner
                      animation="grow"
                      size="sm"
                      variant="danger"
                    />
                    <span className="ms-2">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </Card.Body>

            <Card.Footer className="chatbot-footer">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-0">
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="Ask me anything about restaurants..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      disabled={loading}
                    />
                    <Button
                      variant="danger"
                      type="submit"
                      disabled={loading || !userInput.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </Form.Group>
              </Form>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="quick-actions mt-3">
                  <p className="mb-2">Try asking:</p>
                  <div className="action-buttons">
                    {quickActions.map((action, idx) => (
                      <button
                        key={idx}
                        className="quick-action-btn"
                        onClick={() => {
                          setUserInput(action);
                          // Simulate form submission
                          setTimeout(() => {
                            const form = document.querySelector(
                              '.chatbot-footer form'
                            );
                            form?.dispatchEvent(
                              new Event('submit', { bubbles: true })
                            );
                          }, 0);
                        }}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card.Footer>
          </Card>
        </Col>

        {/* Recommendations Sidebar */}
        <Col md={4}>
          <Card className="recommendations-card h-100">
            <Card.Header className="recommendations-header">
              <h5 className="mb-0">Recommendations</h5>
            </Card.Header>

            <Card.Body className="recommendations-body">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <a
                    key={rec.id}
                    href={`/restaurants/${rec.id}`}
                    className="recommendation-item"
                  >
                    <div className="rec-header">
                      <h6>{rec.name}</h6>
                      <span className="price-tier">{rec.price_tier}</span>
                    </div>

                    <div className="rec-rating">
                      <StarRatings
                        rating={rec.rating}
                        starDimension="16px"
                        starSpacing="1px"
                        starEmptyColor="#ddd"
                        starRatedColor="#ffc107"
                        isSelectable={false}
                      />
                      <span>{rec.rating.toFixed(1)}</span>
                    </div>

                    <p className="rec-cuisine">{rec.cuisine_type}</p>
                    <p className="rec-reasoning">{rec.reasoning}</p>

                    <div className="rec-link">
                      <FaLink /> View Details
                    </div>
                  </a>
                ))
              ) : (
                <div className="empty-state">
                  <p className="text-muted text-center">
                    Start chatting to see personalized restaurant recommendations!
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AIChatbot;
