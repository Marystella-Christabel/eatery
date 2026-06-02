import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCategory, fetchMenu } from '../store/menuSlice';
import { addToCart } from '../store/orderSlice';
import FoodCard from '../components/FoodCard';
import './Menu.css';

const Menu = () => {
  const dispatch = useDispatch();
  const { items, categories, activeCategory, loading, error } = useSelector((state) => state.menu);

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const filtered = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <div className="container mt-4 mb-4">
      <div className="text-center mb-4">
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Menu</h1>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
          Discover the profound richness of African cuisine. Every dish is a story woven with authentic spices and fresh ingredients.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="menu-categories mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => dispatch(setActiveCategory(cat))}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center" style={{ padding: '3rem', color: '#94A3B8' }}>
          <p>Loading menu...</p>
        </div>
      )}

      {error && (
        <div className="text-center" style={{ padding: '3rem', color: '#EF4444' }}>
          <p>Failed to load menu. Please try again later.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="menu-grid">
          {filtered.map((item) => (
            <FoodCard
              key={item.id}
              title={item.title}
              description={item.description}
              price={item.price}
              imageUrl={item.image_url || item.imageUrl}
              onAddToCart={() => dispatch(addToCart(item))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
