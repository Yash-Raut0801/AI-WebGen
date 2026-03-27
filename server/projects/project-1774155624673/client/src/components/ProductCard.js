import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <div className="product-card-image">
          <img src={product.image} alt={product.name} />
        </div>
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>${product.price.toFixed(2)}</p>
        <Link to={`/product/${product._id}`} className="btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;