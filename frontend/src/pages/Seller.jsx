import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import styles from './Seller.module.css';
import toast from 'react-hot-toast';
import { CATEGORIES } from '../constants/categories';

export default function Seller() {
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: '',
    imageFiles: [],
    inventory: '',
    tags: '',
  });

  useEffect(() => {
    if (token && user?.isSeller) {
      fetchData();
    }
  }, [token, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        API.get('/products/seller/my-products'),
        API.get('/orders/seller/my-orders'),
      ]);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageFiles: Array.from(e.target.files) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('price', parseFloat(formData.price));
      form.append('category', formData.category);
      form.append('inventory', parseInt(formData.inventory));
      form.append('tags', formData.tags);

      const urlImages = formData.images
        ? formData.images.split(',').map((img) => img.trim()).filter(Boolean)
        : [];
      form.append('images', JSON.stringify(urlImages));

      formData.imageFiles.forEach((file) => form.append('images', file));

      const response = await API.post('/products', form);
      setProducts([...products, response.data]);
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        images: '',
        imageFiles: [],
        inventory: '',
        tags: '',
      });
      toast.success('Product created successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    }
  };

  const deleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await API.delete(`/products/${productId}`);
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Product deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (!token || !user?.isSeller) {
    return (
      <div className={styles.container}>
        <p>You need to be a seller to access this page.</p>
        <Link to="/seller-signup">Become a Seller</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Seller Dashboard</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`}
          onClick={() => setActiveTab('products')}
        >
          My Products
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'create' ? styles.active : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Product
        </button>
      </div>

      {activeTab === 'products' && (
        <div className={styles.section}>
          <h2>My Products</h2>
          {loading ? (
            <p>Loading...</p>
          ) : products.length === 0 ? (
            <p>No products yet. <Link to="#" onClick={() => setActiveTab('create')}>Create one</Link></p>
          ) : (
            <div className={styles.productsList}>
              {products.map((product) => (
                <div key={product._id} className={styles.productItem}>
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/150'}
                    alt={product.title}
                  />
                  <div className={styles.productInfo}>
                    <h3>{product.title}</h3>
                    <p>${product.price.toFixed(2)}</p>
                    <p className={styles.inventory}>Stock: {product.inventory}</p>
                  </div>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    className={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'orders' && (
        <div className={styles.section}>
          <h2>Orders</h2>
          {loading ? (
            <p>Loading...</p>
          ) : orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order._id} className={styles.orderItem}>
                  <div>
                    <h3>Order #{order._id.slice(-6)}</h3>
                    <span className={styles.status}>{order.status}</span>
                  </div>
                  <span className={styles.total}>${order.totalPrice?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className={styles.section}>
          <h2>Create New Product</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="title">Product Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORIES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="inventory">Inventory *</label>
                <input
                  type="number"
                  id="inventory"
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g., handmade, vintage, unique"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="images">Image URLs (comma separated)</label>
              <input
                type="text"
                id="images"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="imageFiles">Upload Images</label>
              <input
                type="file"
                id="imageFiles"
                name="imageFiles"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Create Product
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
