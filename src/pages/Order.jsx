import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, setCustomerInfo, setDeliveryType, clearCart } from '../store/orderSlice';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import './Forms.css';
import './Order.css';

const Order = () => {
  const dispatch = useDispatch();
  const { cart, customerInfo, deliveryType } = useSelector((state) => state.order);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    alert(`Order submitted! Total: ₦${total.toLocaleString()}. We will contact you shortly.`);
    dispatch(clearCart());
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="text-center mb-4">
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Order Online</h1>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
          Review your selected dishes, adjust quantities, and submit your order.
        </p>
      </div>

      <div className="order-layout">
        {/* Cart Section */}
        <div className="order-cart glass">
          <h2 className="mb-3"><ShoppingBag size={22} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />Your Cart</h2>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <p>Your cart is empty.</p>
              <p style={{ color: '#64748B', fontSize: '0.9rem' }}>Head to the <a href="/menu" style={{ color: 'var(--color-accent)' }}>Menu</a> to add items.</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <span className="cart-item-price">₦{item.price.toLocaleString()}</span>
                    </div>
                    <div className="cart-item-actions">
                      <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                        <Plus size={14} />
                      </button>
                      <button className="qty-btn remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Total</span>
                <span className="gradient-text" style={{ fontSize: '1.3rem', fontWeight: 700 }}>₦{total.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        {/* Order Form */}
        <div className="form-wrapper glass">
          <h2 className="mb-3 text-center">Delivery Details</h2>
          <form className="custom-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" placeholder="John Doe" value={customerInfo.name}
                  onChange={(e) => dispatch(setCustomerInfo({ name: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" placeholder="+234 800 000 0000" value={customerInfo.phone}
                  onChange={(e) => dispatch(setCustomerInfo({ phone: e.target.value }))} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="delivery-type">Delivery Type</label>
              <select id="delivery-type" value={deliveryType}
                onChange={(e) => dispatch(setDeliveryType(e.target.value))}>
                <option value="pickup">Pick up</option>
                <option value="home-delivery">Home Delivery (Lagos)</option>
                <option value="waybill">Interstate Waybill</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery / Waybill Address</label>
              <textarea id="address" rows="3" placeholder="Enter your full address or terminal destination"
                value={customerInfo.address}
                onChange={(e) => dispatch(setCustomerInfo({ address: e.target.value }))} required></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={cart.length === 0}>
              {cart.length === 0 ? 'Add Items to Order' : `Submit Order — ₦${total.toLocaleString()}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Order;
