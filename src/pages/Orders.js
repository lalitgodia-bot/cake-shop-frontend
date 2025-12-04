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

   
 

  

  return (
     ""
  );
};

export default Orders;