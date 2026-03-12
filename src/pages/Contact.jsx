import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import './Forms.css';

const Contact = () => {
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
          <form className="custom-form">
            <div className="form-group">
              <label htmlFor="contact-name">Your Name</label>
              <input type="text" id="contact-name" placeholder="John Doe" required />
            </div>
            
            <div className="form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input type="email" id="contact-email" placeholder="john@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="contact-subject">Subject</label>
              <input type="text" id="contact-subject" placeholder="Reservation, Feedback, etc." required />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" rows="5" placeholder="How can we help you?" required></textarea>
            </div>

            <button type="button" className="btn btn-primary w-100" style={{ width: '100%' }}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
