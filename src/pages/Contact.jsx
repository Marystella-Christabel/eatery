import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import api from '../api/client';
import './Forms.css';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await api.sendMessage(formData);
      setSuccess(data.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="text-center mb-4">
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Contact Us</h1>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
          We'd love to hear from you. Whether it's a reservation, an event inquiry, or feedback on an order.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-info-panel glass">
          <h2 className="mb-3">Get in Touch</h2>
          
          <div className="info-item">
            <MapPin className="info-icon" />
            <div>
              <h3>Our Address</h3>
              <p>123 Galaxy Avenue<br/>Lekki Phase 1, Lagos, Nigeria</p>
            </div>
          </div>

          <div className="info-item">
            <Phone className="info-icon" />
            <div>
              <h3>Phone</h3>
              <p>+234 800 123 4567<br/>+234 811 987 6543</p>
            </div>
          </div>

          <div className="info-item">
            <Mail className="info-icon" />
            <div>
              <h3>Email</h3>
              <p>info@galaxyrestaurant.com<br/>orders@galaxyrestaurant.com</p>
            </div>
          </div>

          <div className="info-item">
            <Clock className="info-icon" />
            <div>
              <h3>Opening Hours</h3>
              <p>Mon - Sun: 8:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        <div className="form-wrapper glass">
          <h2 className="mb-3 text-center">Send a Message</h2>

          {success && (
            <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10B981', textAlign: 'center' }}>
              {success}
            </div>
          )}

          <form className="custom-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">Your Name</label>
              <input type="text" id="contact-name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required disabled={loading} />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input type="email" id="contact-email" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input type="text" id="contact-subject" name="subject" placeholder="Reservation, Feedback, etc." value={formData.subject} onChange={handleChange} required disabled={loading} />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="5" placeholder="How can we help you?" value={formData.message} onChange={handleChange} required disabled={loading}></textarea>
            </div>

            {error && <p className="auth-error" style={{ marginBottom: '1rem' }}>{error}</p>}

            <button type="submit" className="btn btn-primary w-100" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
