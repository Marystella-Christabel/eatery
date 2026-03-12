import React from 'react';
import { Truck, Utensils, GlassWater } from 'lucide-react';
import './Services.css';

const Services = () => {
  return (
    <div className="container mt-4 mb-4">
      <div className="text-center mb-4">
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Services & Waybill</h1>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
          More than just a meal. We offer premium dining experiences, event catering, and nationwide waybill deliveries.
        </p>
      </div>

      <div className="services-grid mb-4">
        <div className="service-card glass">
          <Utensils className="service-icon" size={48} />
          <h3>Dine-In Experience</h3>
          <p>Immerse yourself in our beautifully designed space, enjoy live African music, and experience our hospitality firsthand.</p>
        </div>
        
        <div className="service-card glass">
          <GlassWater className="service-icon" size={48} />
          <h3>Event Catering</h3>
          <p>Give your guests an unforgettable culinary experience with our premium catering for weddings, parties, and corporate events.</p>
        </div>

        <div className="service-card glass">
          <Truck className="service-icon" size={48} />
          <h3>Interstate Waybill</h3>
          <p>Craving our unique dishes from another state? We safely package and waybill our special delicacies across the country via trusted logistics.</p>
        </div>
      </div>

      <div className="waybill-details glass">
        <h2 className="mb-2">How Our Waybill Works</h2>
        <ul className="waybill-steps">
          <li><strong>Step 1:</strong> Place your order online specifying 'Waybill' in delivery instructions.</li>
          <li><strong>Step 2:</strong> Our chefs prepare your food fresh and freeze-pack it using vacuum sealing technology to preserve freshness.</li>
          <li><strong>Step 3:</strong> We dispatch it through our logistics partners (e.g., GIG, GUO) to your state's terminal or direct home delivery if applicable.</li>
          <li><strong>Step 4:</strong> Receive, heat, and enjoy the true taste of Galaxy Restaurant!</li>
        </ul>
      </div>
    </div>
  );
};

export default Services;
