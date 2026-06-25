import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="landing-futuristic">
      <div className="light-streak streak-1"></div>
      <div className="light-streak streak-2"></div>
      <div className="light-streak streak-3"></div>
      <div className="light-streak streak-4"></div>
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <nav className="fut-nav">
        <div className="fut-logo">
          <svg viewBox="0 0 40 40" className="fut-logo-icon">
            <circle cx="16" cy="18" r="12" fill="none" stroke="#4fc3f7" strokeWidth="2.5" opacity="0.8"/>
            <circle cx="24" cy="22" r="12" fill="none" stroke="#4fc3f7" strokeWidth="2.5" opacity="0.8"/>
          </svg>
          <span className="fut-logo-text">RentWise</span>
        </div>
        <div className="fut-nav-right">
          <Link to="/" className="fut-nav-link">Home</Link>
          {user ? (
            <button className="fut-btn-login" onClick={() => navigate('/dashboard')}>Dashboard</button>
          ) : (
            <Link to="/login" className="fut-btn-login">Login</Link>
          )}
        </div>
      </nav>

      <main className="fut-hero">
        <div className="fut-hero-left">
          <h1 className="fut-heading">
            <span className="fut-heading-bold">Perfect</span>{' '}
            <span className="fut-heading-light">Roommates.</span>
            <br />
            <span className="fut-heading-light">Zero</span>{' '}
            <span className="fut-heading-bold">Drama.</span>
          </h1>
          <p className="fut-subtext">
            Skip the awkward housemate interviews. Our AI-driven compatibility engine
            matches you with roommates based on living habits, cleanliness, schedules,
            and personality traits.
          </p>
          <button className="fut-cta" onClick={() => navigate('/register')}>
            Find Your Match <span className="fut-arrow">&rarr;</span>
          </button>
        </div>
        <div className="fut-hero-right">
          <svg viewBox="0 0 200 180" className="fut-house-icon">
            <path d="M20 100 L100 20 L180 100" stroke="#4fc3f7" strokeWidth="3" fill="none" opacity="0.6"/>
            <path d="M100 20 L100 10" stroke="#4fc3f7" strokeWidth="3" fill="none" opacity="0.4"/>
            <rect x="50" y="100" width="100" height="70" rx="4" stroke="#4fc3f7" strokeWidth="2.5" fill="none" opacity="0.5"/>
            <rect x="80" y="120" width="40" height="50" rx="2" stroke="#4fc3f7" strokeWidth="2" fill="none" opacity="0.5"/>
            <rect x="60" y="110" width="18" height="25" rx="2" stroke="#4fc3f7" strokeWidth="1.5" fill="none" opacity="0.35"/>
            <rect x="122" y="110" width="18" height="25" rx="2" stroke="#4fc3f7" strokeWidth="1.5" fill="none" opacity="0.35"/>
            <circle cx="100" cy="85" r="6" fill="#4fc3f7" opacity="0.3"/>
            <circle cx="85" cy="75" r="4" fill="#4fc3f7" opacity="0.2"/>
            <circle cx="112" cy="78" r="5" fill="#4fc3f7" opacity="0.25"/>
          </svg>
        </div>
      </main>
    </div>
  );
};

export default Landing;
