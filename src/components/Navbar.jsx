import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, UtensilsCrossed, ShoppingCart, User, LogOut, ClipboardList, Shield } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.order.cart.reduce((sum, item) => sum + item.quantity, 0));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    dispatch(logout());
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <UtensilsCrossed className="logo-icon" size={28} />
          <span className="gradient-text">Galaxy</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/services" className="nav-link">Services</Link>
          <Link to="/order" className="nav-link nav-cart-link">
            Order
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {isAuthenticated && (
            <Link to="/my-orders" className="nav-link">My Orders</Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="nav-link nav-admin-link">
              <Shield size={15} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
              Admin
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="auth-user-area">
              <span className="user-greeting">Hi, {user?.name}</span>
              <button className="nav-auth-btn" onClick={handleLogout} title="Sign Out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/signin" className="btn btn-primary btn-sm nav-signin-btn">Sign In</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="mobile-menu-btn" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="mobile-menu glass">
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/menu" className="nav-link" onClick={closeMenu}>Menu</Link>
          <Link to="/services" className="nav-link" onClick={closeMenu}>Services</Link>
          <Link to="/order" className="nav-link" onClick={closeMenu}>
            Order {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          <Link to="/contact" className="nav-link" onClick={closeMenu}>Contact</Link>
          {isAuthenticated ? (
            <>
              <Link to="/my-orders" className="nav-link" onClick={closeMenu}>My Orders</Link>
              {user?.role === 'admin' && (
                <Link to="/admin" className="nav-link" onClick={closeMenu}>
                  <Shield size={15} style={{ marginRight: '4px', verticalAlign: 'text-bottom' }} />
                  Admin
                </Link>
              )}
              <button className="nav-link mobile-logout" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/signin" className="nav-link" onClick={closeMenu}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
