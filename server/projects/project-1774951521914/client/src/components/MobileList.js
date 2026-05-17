import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MobileList = () => {
  const [mobiles, setMobiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/mobiles');
        setMobiles(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch mobiles. Is the backend running on port 5000?');
        setLoading(false);
        console.error(err);
      }
    };
    fetchMobiles();
  }, []);

  if (loading) return <div className="loading">Loading mobiles...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="mobile-list-container">
      <h2>Our Mobile Collection</h2>
      <div className="mobile-grid">
        {mobiles.length === 0 ? (
          <p>No mobiles found.</p>
        ) : (
          mobiles.map((mobile) => (
            <div key={mobile._id} className="mobile-card">
              <img src={mobile.imageUrl || "https://picsum.photos/300/200?random=" + mobile._id} alt={mobile.name} />
              <h3>{mobile.name}</h3>
              <p>{mobile.brand}</p>
              <p>${mobile.price.toFixed(2)}</p>
              <button className="btn-details">View Details</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileList;