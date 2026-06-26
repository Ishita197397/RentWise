import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const INTEREST_OPTIONS = [
  'Music', 'Gaming', 'Reading', 'Fitness', 'Cooking',
  'Movies', 'Travel', 'Photography', 'Sports', 'Art',
  'Technology', 'Yoga', 'Hiking', 'Dancing', 'Volunteering',
];

const CreateProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    age: '', gender: 'male', bio: '', budget: '',
    sleepSchedule: 'flexible', cleanliness: 3,
    smoking: 'no', drinking: 'no', interests: [], lookingFor: 'any',
  });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token()}` };
    axios.get(`${API}/profile`, { headers }).then((res) => {
      setForm({
        age: res.data.age || '',
        gender: res.data.gender || 'male',
        bio: res.data.bio || '',
        budget: res.data.budget || '',
        sleepSchedule: res.data.sleepSchedule || 'flexible',
        cleanliness: res.data.cleanliness || 3,
        smoking: res.data.smoking || 'no',
        drinking: res.data.drinking || 'no',
        interests: res.data.interests || [],
        lookingFor: res.data.lookingFor || 'any',
      });
      setEditing(true);
    }).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleInterest = (interest) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/profile`, form, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save profile');
    }
  };

  return (
    <div className="profile-form">
      <h2>{editing ? 'Edit Your Profile' : 'Create Your Profile'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" value={form.age} onChange={handleChange} min={16} max={99} required />
          </div>
          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange}>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} maxLength={500} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Monthly Budget ($)</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange} min={100} required />
          </div>
          <div className="form-group">
            <label>Looking For</label>
            <select name="lookingFor" value={form.lookingFor} onChange={handleChange}>
              <option value="any">Anyone</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Sleep Schedule</label>
          <select name="sleepSchedule" value={form.sleepSchedule} onChange={handleChange}>
            <option value="early-bird">Early Bird (sleep by 10pm)</option>
            <option value="night-owl">Night Owl (sleep after 2am)</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>
        <div className="form-group">
          <label>Cleanliness Level: {form.cleanliness}</label>
          <input type="range" name="cleanliness" value={form.cleanliness} onChange={handleChange} min={1} max={5} />
          <div className="range-labels">
            <span>Messy</span><span>Neat Freak</span>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Smoking</label>
            <select name="smoking" value={form.smoking} onChange={handleChange}>
              <option value="no">No</option>
              <option value="occasional">Occasional</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div className="form-group">
            <label>Drinking</label>
            <select name="drinking" value={form.drinking} onChange={handleChange}>
              <option value="no">No</option>
              <option value="occasional">Occasional</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Interests (select all that apply)</label>
          <div className="interests-grid">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                type="button"
                key={interest}
                className={`interest-btn ${form.interests.includes(interest) ? 'active' : ''}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="btn-primary">
          {editing ? 'Update Profile' : 'Create Profile'}
        </button>
      </form>
    </div>
  );
};

export default CreateProfile;
