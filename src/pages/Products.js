import React, { useState, useEffect } from 'react';
import { cakesAPI, cartItemsAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const Products = () => {
  const [cakes, setCakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const user = jwtDecode(token);
      userId = user.nameid;
    } catch (error) {
      console.error('Invalid token');
    }
  }

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const response = await cakesAPI.getAll();
      setCakes(response.data);
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (cakeId) => {
    if (!userId) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await cartItemsAPI.create({
        cartId: 1, // Assuming default cart
        cakeId: cakeId,
        quantity: 1
      });
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>Our Cakes</h2>
      <div className="row">
        {cakes.map(cake => (
          <div key={cake.cakeId} className="col-md-4 mb-4">
            <div className="card">
              <img 
                src={ cake.imageUrl || require('../placeholder-cake.jpg')} 
                className="card-img-top" 
                alt={cake.name}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{cake.name}</h5>
                <p className="card-text">{cake.description}</p>
                <p className="card-text">
                  <strong>${cake.price}</strong>
                </p>
                {cake.isAvailable ? (
                  <button 
                    className="btn btn-primary"
                    onClick={() => addToCart(cake.cakeId)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button className="btn btn-secondary" disabled>
                    Out of Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;