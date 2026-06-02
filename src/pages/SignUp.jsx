import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, clearError } from '../store/authSlice';
import { UserPlus } from 'lucide-react';
import './Auth.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: serverError } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    dispatch(clearError());

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (name && email && password) {
      const result = await dispatch(signupUser({ name, email, password }));
      if (signupUser.fulfilled.match(result)) {
        navigate('/');
      }
    }
  };

  const displayError = localError || serverError;

  return (
    <div className="auth-page">
      <div className="auth-card glass">
        <div className="auth-header">
          <div className="auth-icon-wrap gradient-bg">
            <UserPlus size={28} color="white" />
          </div>
          <h1>Create Account</h1>
          <p>Join Galaxy Restaurant today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="signup-name">Full Name</label>
            <input
              type="text"
              id="signup-name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="signup-email">Email Address</label>
            <input
              type="email"
              id="signup-email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <input
                type="password"
                id="signup-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <input
                type="password"
                id="signup-confirm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {displayError && <p className="auth-error">{displayError}</p>}

          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/signin" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
