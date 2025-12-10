import { useState, useEffect } from 'react';
import { cakesAPI, categoriesAPI, ordersAPI } from '../services/api';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('cakes');
  const [cakes, setCakes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCake, setNewCake] = useState({
    name: '',
    categoryId: '',
    description: '',
    price: '',
    imageUrl: '',
    isAvailable: true
  });
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    description: ''
  });
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [cakesRes, categoriesRes, ordersRes] = await Promise.all([
        cakesAPI.getAll(),
        categoriesAPI.getAll(),
        ordersAPI.getAll()
      ]);
      setCakes(cakesRes.data);
      setCategories(categoriesRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAddCake = async (e) => {
    e.preventDefault();
    try {
      await cakesAPI.create({
        ...newCake,
        categoryId: parseInt(newCake.categoryId),
        price: parseFloat(newCake.price)
      });
      setNewCake({
        name: '',
        categoryId: '',
        description: '',
        price: '',
        imageUrl: '',
        isAvailable: true
      });
      fetchData();
    } catch (error) {
      console.error('Error adding cake:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await categoriesAPI.create(newCategory);
      setNewCategory({ categoryName: '', description: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoriesAPI.update(editingCategory.categoryId, newCategory);
      setNewCategory({ categoryName: '', description: '' });
      setEditingCategory(null);
      fetchData();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const editCategory = (category) => {
    setNewCategory({
      categoryName: category.categoryName,
      description: category.description
    });
    setEditingCategory(category);
  };

  const cancelEdit = () => {
    setNewCategory({ categoryName: '', description: '' });
    setEditingCategory(null);
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const deleteCake = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await cakesAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting cake:', error);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Dashboard</h2>
      
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'cakes' ? 'active' : ''}`}
            onClick={() => setActiveTab('cakes')}
          >
            Cakes
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </li>
      </ul>

      <div className="tab-content mt-4">
        {activeTab === 'categories' && (
          <div>
            <div className="row">
              <div className="col-md-4">
                <h4>{editingCategory ? 'Edit Category' : 'Add New Category'}</h4>
                <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Category Name"
                      value={newCategory.categoryName}
                      onChange={(e) => setNewCategory({...newCategory, categoryName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary me-2">
                    {editingCategory ? 'Update' : 'Add'} Category
                  </button>
                  {editingCategory && (
                    <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                      Cancel
                    </button>
                  )}
                </form>
              </div>
              <div className="col-md-8">
                <h4>Existing Categories</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category.categoryId}>
                          <td>{category.categoryName}</td>
                          <td>{category.description}</td>
                          <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => editCategory(category)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteCategory(category.categoryId)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cakes' && (
          <div>
            <div className="row">
              <div className="col-md-4">
                <h4>Add New Cake</h4>
                <form onSubmit={handleAddCake}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Cake Name"
                      value={newCake.name}
                      onChange={(e) => setNewCake({...newCake, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-control"
                      value={newCake.categoryId}
                      onChange={(e) => setNewCake({...newCake, categoryId: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.categoryId} value={cat.categoryId}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      placeholder="Description"
                      value={newCake.description}
                      onChange={(e) => setNewCake({...newCake, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="Price"
                      value={newCake.price}
                      onChange={(e) => setNewCake({...newCake, price: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="url"
                      className="form-control"
                      placeholder="Image URL"
                      value={newCake.imageUrl}
                      onChange={(e) => setNewCake({...newCake, imageUrl: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Cake</button>
                </form>
              </div>
              <div className="col-md-8">
                <h4>Existing Cakes</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Available</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cakes.map(cake => (
                        <tr key={cake.cakeId}>
                          <td>{cake.name}</td>
                          <td>${cake.price}</td>
                          <td>{cake.isAvailable ? 'Yes' : 'No'}</td>
                          <td>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteCake(cake.cakeId)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h4>All Orders</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.orderId}>
                      <td>#{order.orderId}</td>
                      <td>{order.user?.fullName}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>${order.totalAmount}</td>
                      <td>{order.status}</td>
                      <td>{order.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;