import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer glass">
      <div className="container footer-container">
        <div className="footer-section">
          <h3 className="footer-title gradient-text">Galaxy Restaurant</h3>
          <p className="footer-desc">
            Experience the vibrant and authentic flavors of Africa. We bring the best of continental dishes right to your table or doorstep.
          </p>
          <div className="social-links">
            <a href="#" className="social-link"><Facebook size={20} /></a>
            <a href="#" className="social-link"><Twitter size={20} /></a>
            <a href="#" className="social-link"><Instagram size={20} /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Our Menu</Link></li>
            <li><Link to="/services">Services & Waybill</Link></li>
            <li><Link to="/order">Order Online</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Information</h3>
          <div className="contact-info">
            <p><MapPin size={18} /> 123 Galaxy Avenue, Lekki Phase 1, Lagos, Nigeria</p>
            <p><Phone size={18} /> +234 800 123 4567</p>
            <p><Mail size={18} /> info@galaxyrestaurant.com</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Galaxy Restaurant. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
