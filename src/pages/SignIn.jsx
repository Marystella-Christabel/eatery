import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import { LogIn } from 'lucide-react';
import './Auth.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    if (email && password) {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        navigate('/');
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-icon-wrap gradient-bg">
            <LogIn size={28} color="white" />
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to your Galaxy Restaurant account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signin-email">Email Address</label>
            <input
              type="email"
              id="signin-email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="signin-password">Password</label>
            <input
              type="password"
              id="signin-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup" className="auth-link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
