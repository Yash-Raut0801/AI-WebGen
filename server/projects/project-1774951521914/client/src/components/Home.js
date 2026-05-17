import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to MobileStore!</h1>
      <p>Discover the latest mobile phones at unbeatable prices.</p>
      <img src="https://picsum.photos/1200/500?random=1" alt="Mobile Banner" className="home-banner" />
      <Link to="/mobiles" className="btn-shop">Shop Now</Link>
    </div>
  );
};

export default Home;