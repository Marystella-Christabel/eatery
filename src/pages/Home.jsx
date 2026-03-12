import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <h1 className="hero-title">
            Experience the <span className="gradient-text">Galaxy</span> of African Flavors
          </h1>
          <p className="hero-subtitle">
            Authentic, vibrant, and unforgettable dishes crafted with passion. 
            From spicy Jollof to heartwarming Egusi.
          </p>
          <div className="hero-actions">
            <Link to="/order" className="btn btn-primary">Order Now</Link>
            <Link to="/menu" className="btn btn-outline">Explore Menu</Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured container mb-4 mt-4">
        <div className="section-header text-center mb-4">
          <h2 className="gradient-text">Featured Delicacies</h2>
          <p>Our most loved African dishes</p>
        </div>
        
        <div className="featured-grid">
          {/* We will replace these with real components later, just placeholders for now to have structure */}
          <div className="glass featured-card">
            <div className="card-img" style={{ backgroundImage: "url('/images/jollof_rice.png')", width: '100%', height: '200px', backgroundSize: 'cover' }}></div>
            <div className="card-content">
              <h3>Smoky Party Jollof</h3>
              <p>Served with plantain and grilled chicken</p>
            </div>
          </div>
          <div className="glass featured-card">
            <div className="card-img" style={{ backgroundImage: "url('/images/pounded_yam_egusi.png')", width: '100%', height: '200px', backgroundSize: 'cover' }}></div>
            <div className="card-content">
              <h3>Pounded Yam & Egusi</h3>
              <p>Rich melon soup with assorted meat</p>
            </div>
          </div>
          <div className="glass featured-card">
            <div className="card-img" style={{ backgroundImage: "url('/images/beef_suya.png')", width: '100%', height: '200px', backgroundSize: 'cover' }}></div>
            <div className="card-content">
              <h3>Spicy Suya platter</h3>
              <p>Premium beef skewers with Yaji spice</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <Link to="/menu" className="btn btn-text">View Full Menu <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
