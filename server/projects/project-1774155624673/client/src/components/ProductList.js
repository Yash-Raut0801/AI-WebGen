import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import api from '../api';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="container" style={{textAlign: 'center', padding: '3rem'}}>Loading products...</div>;
  if (error) return <div className="container"><div className="alert alert-danger">{error}</div></div>;

  return (
    <section className="container" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
      <h2 className="section-title">Our Collection</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductList;