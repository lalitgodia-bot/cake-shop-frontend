import React, { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const Orders = () => {
  const [orders, setOrders] = useState([]);
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
   const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      // Filter orders for current user
      const userOrders = response.data.filter(order => order.userId === parseInt(userId));
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };


    fetchOrders();
  }, []);

 

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="row">
          {orders.map(order => (
            <div key={order.orderId} className="col-12 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5>Order #{order.orderId}</h5>
                      <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p><strong>Payment:</strong> {order.paymentStatus}</p>
                      <p><strong>Address:</strong> {order.shippingAddress}</p>
                    </div>
                    <div className="col-md-4 text-end">
                      <h4>${order.totalAmount}</h4>
                    </div>
                  </div>
                  {order.orderItems && order.orderItems.length > 0 && (
                    <div className="mt-3">
                      <h6>Items:</h6>
                      {order.orderItems.map(item => (
                        <div key={item.orderItemId} className="d-flex justify-content-between">
                          <span>{item.cake?.name} x {item.quantity}</span>
                          <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;