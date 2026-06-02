import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchMyOrders } from '../store/authSlice';
import { ClipboardList, Package, Clock, ChevronRight } from 'lucide-react';
import './MyOrders.css';

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, myOrders, ordersLoading, ordersError } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    dispatch(fetchMyOrders());
  }, [isAuthenticated, dispatch, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'preparing': return '#8B5CF6';
      case 'ready': return '#10B981';
      case 'delivered': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#94A3B8';
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mt-4 mb-4">
      <div className="text-center mb-4">
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>My Orders</h1>
        <p style={{ color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
          Track your order history and current orders.
        </p>
      </div>

      {ordersLoading && (
        <div className="text-center" style={{ padding: '3rem', color: '#94A3B8' }}>
          <p>Loading your orders...</p>
        </div>
      )}

      {ordersError && (
        <div className="text-center" style={{ padding: '3rem', color: '#EF4444' }}>
          <p>Failed to load orders. Please try again.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => dispatch(fetchMyOrders())}>
            Retry
          </button>
        </div>
      )}

      {!ordersLoading && !ordersError && myOrders.length === 0 && (
        <div className="glass empty-orders">
          <ClipboardList size={64} style={{ color: '#64748B', marginBottom: '1rem' }} />
          <h2 style={{ marginBottom: '0.5rem' }}>No Orders Yet</h2>
          <p style={{ color: '#94A3B8', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet. Head to the menu to discover our delicious dishes!
          </p>
          <Link to="/menu" className="btn btn-primary">
            Explore Menu <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {!ordersLoading && !ordersError && myOrders.length > 0 && (
        <div className="orders-list">
          {myOrders.map((order) => (
            <div key={order.id} className="glass order-card">
              <div className="order-card-header">
                <div className="order-id-wrap">
                  <Package size={20} style={{ color: 'var(--color-accent)' }} />
                  <span className="order-id">Order #{order.id}</span>
                </div>
                <span className="order-status" style={{ color: getStatusColor(order.status), borderColor: getStatusColor(order.status) }}>
                  {order.status}
                </span>
              </div>

              <div className="order-card-meta">
                <span className="order-date">
                  <Clock size={14} /> {formatDate(order.created_at)}
                </span>
                <span className="order-delivery-type">{order.delivery_type}</span>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="order-items-preview">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <span>{item.title} × {item.quantity}</span>
                      <span className="order-item-price">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="order-card-footer">
                <span className="order-total-label">Total</span>
                <span className="gradient-text order-total-amount">₦{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
