import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { calculateCompatibility } from '../utils/compatibilityScore';

const API = 'https://rentwisee.onrender.com';

const BrowseRoommates = () => {
  const { token } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [filters, setFilters] = useState({
    minBudget: '', maxBudget: '', sleepSchedule: '', gender: '', minScore: 0,
  });
  const [sending, setSending] = useState({});

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token()}` };
    axios.get(`${API}/profile/all`, { headers }).then((res) => setProfiles(res.data)).catch(() => {});
    axios.get(`${API}/profile`, { headers }).then((res) => setMyProfile(res.data)).catch(() => {});
  }, []);

  const scoredProfiles = useMemo(() => {
    return profiles
      .map((p) => ({
        ...p,
        compatibility: myProfile ? calculateCompatibility(myProfile, p) : 50,
      }))
      .filter((p) => {
        if (filters.sleepSchedule && p.sleepSchedule !== filters.sleepSchedule) return false;
        if (filters.gender && p.gender !== filters.gender) return false;
        if (filters.minBudget && p.budget < Number(filters.minBudget)) return false;
        if (filters.maxBudget && p.budget > Number(filters.maxBudget)) return false;
        if (p.compatibility < filters.minScore) return false;
        return true;
      })
      .sort((a, b) => b.compatibility - a.compatibility);
  }, [profiles, myProfile, filters]);

  const sendRequest = async (toId) => {
    setSending((prev) => ({ ...prev, [toId]: true }));
    try {
      await axios.post(
        `${API}/requests`,
        { to: toId, message: 'Would you like to be roommates?' },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      alert('Request sent!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
    setSending((prev) => ({ ...prev, [toId]: false }));
  };

  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div className="browse">
      <h2>Browse Roommates</h2>
      <div className="filters">
        <input type="number" name="minBudget" placeholder="Min Budget" value={filters.minBudget} onChange={handleFilterChange} />
        <input type="number" name="maxBudget" placeholder="Max Budget" value={filters.maxBudget} onChange={handleFilterChange} />
        <select name="sleepSchedule" value={filters.sleepSchedule} onChange={handleFilterChange}>
          <option value="">All Schedules</option>
          <option value="early-bird">Early Bird</option>
          <option value="night-owl">Night Owl</option>
          <option value="flexible">Flexible</option>
        </select>
        <select name="gender" value={filters.gender} onChange={handleFilterChange}>
          <option value="">All Genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <div className="score-filter">
          <label>Min Compatibility: {filters.minScore}%</label>
          <input type="range" name="minScore" min={0} max={100} value={filters.minScore} onChange={handleFilterChange} />
        </div>
      </div>
      <div className="profiles-grid">
        {scoredProfiles.length === 0 ? (
          <p className="no-results">No roommates match your filters.</p>
        ) : (
          scoredProfiles.map((p) => (
            <div key={p._id} className="profile-card">
              <div className="compatibility-badge">{p.compatibility}% Match</div>
              <h3>{p.user?.name}</h3>
              <p><strong>Age:</strong> {p.age} &middot; <strong>Gender:</strong> {p.gender}</p>
              <p><strong>Budget:</strong> ${p.budget}/mo</p>
              <p><strong>Sleep:</strong> {p.sleepSchedule}</p>
              <p><strong>Cleanliness:</strong> {'★'.repeat(p.cleanliness)}{'☆'.repeat(5 - p.cleanliness)}</p>
              <p><strong>Smoking:</strong> {p.smoking} &middot; <strong>Drinking:</strong> {p.drinking}</p>
              {p.bio && <p className="bio">{p.bio}</p>}
              <div className="interests">
                {(p.interests || []).map((i) => (
                  <span key={i} className="interest-tag">{i}</span>
                ))}
              </div>
              <button
                className="btn-primary"
                onClick={() => sendRequest(p.user?._id)}
                disabled={sending[p.user?._id]}
              >
                {sending[p.user?._id] ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseRoommates;
