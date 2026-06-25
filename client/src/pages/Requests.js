import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const Requests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState({ sent: [], received: [] });

  const fetchRequests = () => {
    axios
      .get(`${API}/requests`, { headers: { Authorization: `Bearer ${token()}` } })
      .then((res) => setRequests(res.data))
      .catch(() => {});
  };

  useEffect(() => { fetchRequests(); }, []);

  const respond = async (id, status) => {
    try {
      await axios.put(
        `${API}/requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      fetchRequests();
    } catch (err) {
      alert('Failed to update request');
    }
  };

  return (
    <div className="requests">
      <h2>Roommate Requests</h2>
      <div className="requests-grid">
        <div className="card">
          <h3><i className="fas fa-inbox"></i> Received ({requests.received.length})</h3>
          {requests.received.length === 0 ? (
            <p className="empty">No requests received yet.</p>
          ) : (
            requests.received.map((req) => (
              <div key={req._id} className="request-item">
                <div className="request-info">
                  <strong>{req.from?.name}</strong>
                  {req.message && <p>{req.message}</p>}
                  <span className={`status ${req.status}`}>{req.status}</span>
                </div>
                {req.status === 'pending' && (
                  <div className="request-actions">
                    <button className="btn-accept" onClick={() => respond(req._id, 'accepted')}>
                      <i className="fas fa-check"></i> Accept
                    </button>
                    <button className="btn-reject" onClick={() => respond(req._id, 'rejected')}>
                      <i className="fas fa-times"></i> Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        <div className="card">
          <h3><i className="fas fa-paper-plane"></i> Sent ({requests.sent.length})</h3>
          {requests.sent.length === 0 ? (
            <p className="empty">No requests sent yet. Browse roommates to find matches!</p>
          ) : (
            requests.sent.map((req) => (
              <div key={req._id} className="request-item">
                <div className="request-info">
                  <strong>{req.to?.name}</strong>
                  {req.message && <p>{req.message}</p>}
                  <span className={`status ${req.status}`}>{req.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Requests;
