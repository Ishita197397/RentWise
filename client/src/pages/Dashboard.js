import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { calculateCompatibility } from '../utils/compatibilityScore';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState({ sent: [], received: [] });
  const [topMatches, setTopMatches] = useState([]);

  const fetchAllProfiles = useCallback((myProfile) => {
    const headers = { Authorization: `Bearer ${token()}` };
    axios.get(`${API}/profile/all`, { headers }).then((res) => {
      const scored = res.data
        .map((p) => ({ ...p, compatibility: calculateCompatibility(myProfile, p) }))
        .sort((a, b) => b.compatibility - a.compatibility)
        .slice(0, 5);
      setTopMatches(scored);
    }).catch(() => {});
  }, [token]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token()}` };
    axios.get(`${API}/profile`, { headers })
      .then((res) => {
        setProfile(res.data);
        fetchAllProfiles(res.data);
      })
      .catch(() => {});
    axios.get(`${API}/requests`, { headers }).then((res) => setRequests(res.data)).catch(() => {});
  }, [user, fetchAllProfiles, token]);

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.name}!</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3><i className="fas fa-user-circle"></i> Your Profile</h3>
          {profile ? (
            <div className="profile-summary">
              <p><strong>Budget:</strong> ${profile.budget}/mo</p>
              <p><strong>Sleep:</strong> {profile.sleepSchedule}</p>
              <p><strong>Cleanliness:</strong> {'★'.repeat(profile.cleanliness)}</p>
              <Link to="/create-profile" className="btn-small">Edit Profile</Link>
            </div>
          ) : (
            <div>
              <p>You haven't created a profile yet.</p>
              <Link to="/create-profile" className="btn-primary">Create Profile</Link>
            </div>
          )}
        </div>
        <div className="card">
          <h3><i className="fas fa-handshake"></i> Roommate Requests</h3>
          <p>Received: <strong>{requests.received.length}</strong></p>
          <p>Sent: <strong>{requests.sent.length}</strong></p>
          <Link to="/requests" className="btn-small">View Requests</Link>
        </div>
        <div className="card full-width">
          <h3><i className="fas fa-trophy"></i> Top Matches</h3>
          {!profile ? (
            <p>Complete your profile to see matches!</p>
          ) : topMatches.length === 0 ? (
            <p>No other profiles found yet. Check back later!</p>
          ) : (
            <div className="matches-list">
              {topMatches.map((m) => (
                <div key={m._id} className="match-item">
                  <div className="match-score">{m.compatibility}%</div>
                  <div>
                    <strong>{m.user?.name}</strong>
                    <p>${m.budget}/mo &middot; {m.sleepSchedule}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
