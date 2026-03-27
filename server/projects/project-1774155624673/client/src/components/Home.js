import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import api from '../api';

function Home() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        // Get 6 random products for "Featured Products"
        const featured = data.sort(() => 0.5 - Math.random()).slice(0, 6);
        setProducts(featured);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <h1>Elegance Redefined. Style Unveiled.</h1>
          <p>Discover our exclusive collection of formal and party wear, crafted for the modern individual.</p>
          <Link to="/products" className="btn">
            Shop The Collection
          </Link>
        </div>
      </section>

      <section className="container" style={{ marginBottom: '3rem' }}>
        <h2 className="section-title">Featured Products</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/products" className="btn btn-light">
            View All Products
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;