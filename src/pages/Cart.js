import { useState, useEffect } from 'react';
import { cartItemsAPI, ordersAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
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
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await cartItemsAPI.getAll();
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await cartItemsAPI.delete(itemId);
      fetchCartItems();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const item = cartItems.find(item => item.cartItemId === itemId);
      await cartItemsAPI.update(itemId, { ...item, quantity: newQuantity });
      fetchCartItems();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const checkout = async () => {
    if (!userId || cartItems.length === 0) return;

    const total = cartItems.reduce((sum, item) => sum + (item.cake?.price || 0) * item.quantity, 0);

    try {
      await ordersAPI.create({
        userId: parseInt(userId),
        totalAmount: total,
        shippingAddress: 'Default Address',
        status: 'Pending',
        paymentStatus: 'Pending'
      });
      
      // Clear cart items
      for (const item of cartItems) {
        await cartItemsAPI.delete(item.cartItemId);
      }
      
      alert('Order placed successfully!');
      fetchCartItems();
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.cake?.price || 0) * item.quantity, 0);

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container mt-5">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="row">
            {cartItems.map(item => (
              <div key={item.cartItemId} className="col-12 mb-3">
                <div className="card">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{item.cake?.name}</h5>
                      <p>${item.cake?.price} each</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button 
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button 
                        className="btn btn-sm btn-danger ms-3"
                        onClick={() => removeFromCart(item.cartItemId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <h4>Total: ${total.toFixed(2)}</h4>
            <button className="btn btn-success" onClick={checkout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;