import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4">Welcome to Cake Shop</h1>
              <p className="lead">Delicious cakes made with love for every occasion</p>
              <Link to="/products" className="btn btn-light btn-lg">
                Shop Now
              </Link>
            </div>
            <div className="col-md-6">
              <img 
                src="/hero-cake.jpg" 
                alt="Delicious Cake" 
                className="img-fluid rounded"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x300/007bff/ffffff?text=Delicious+Cakes';
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="row text-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3>🍰</h3>
                <h5>Fresh Daily</h5>
                <p>All our cakes are baked fresh daily with the finest ingredients</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3>🚚</h3>
                <h5>Fast Delivery</h5>
                <p>Quick and reliable delivery to your doorstep</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3>🎂</h3>
                <h5>Custom Orders</h5>
                <p>Special occasion? We create custom cakes for your celebrations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h2>Ready to Order?</h2>
          <p className="lead">Browse our delicious collection of cakes</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;