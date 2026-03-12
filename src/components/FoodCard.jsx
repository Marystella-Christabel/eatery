import React from 'react';
import './FoodCard.css';

const FoodCard = ({ title, description, price, imageUrl, onAddToCart }) => {
  return (
    <div className="food-card glass">
      <div className="food-card-img" style={{ backgroundImage: `url(${imageUrl || ''})` }}>
        {!imageUrl && <div className="placeholder-pattern"></div>}
      </div>
      <div className="food-card-content">
        <h3 className="food-title gradient-text">{title}</h3>
        <p className="food-desc">{description}</p>
        <div className="food-footer">
          <span className="food-price">₦{typeof price === 'number' ? price.toLocaleString() : price}</span>
          <button className="btn btn-primary btn-sm" onClick={onAddToCart}>Add to Order</button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
