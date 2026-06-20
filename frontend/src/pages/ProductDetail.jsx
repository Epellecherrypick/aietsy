import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import styles from './ProductDetail.module.css';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/products/${id}`);
      setProduct(response.data);
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(id, quantity);
      toast.success('Added to cart!');
      setQuantity(1);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error(error.response?.data?.message || 'Could not add to cart. Please try again.');
      }
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to review');
      return;
    }
    try {
      const response = await API.post(`/products/${id}/review`, newReview);
      setProduct(response.data);
      setReviews(response.data.reviews || []);
      setNewReview({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Could not submit review. Please try again.');
    }
  };

  if (loading) return <div className={styles.loading}>Loading product...</div>;
  if (!product) return <div className={styles.error}>Product not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.productWrapper}>
        {/* Product Images */}
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/500x500'}
              alt={product.title}
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbs}>
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${product.title} ${idx}`} />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={styles.infoSection}>
          <h1>{product.title}</h1>

          <div className={styles.meta}>
            <span className={styles.rating}>⭐ {product.rating || 'New'}</span>
            <span className={styles.reviews}>({reviews.length} reviews)</span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.price}>
            <span className={styles.amount}>${product.price.toFixed(2)}</span>
            {product.inventory === 0 && <span className={styles.outOfStock}>Out of Stock</span>}
            {product.inventory > 0 && (
              <span className={styles.inStock}>In Stock ({product.inventory})</span>
            )}
          </div>

          <div className={styles.seller}>
            <p>
              Sold by <strong>{product.sellerId?.username}</strong>
            </p>
          </div>

          <div className={styles.options}>
            <div className={styles.quantity}>
              <label>Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.inventory}
                value={quantity || ''}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setQuantity(isNaN(val) ? 1 : Math.max(1, val));
                }}
              />
            </div>

            <button
              onClick={handleAddToCart}
              className={styles.addBtn}
              disabled={product.inventory === 0}
            >
              🛒 Add to Cart
            </button>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className={styles.tags}>
              {product.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className={styles.reviewsSection}>
        <h2>Reviews</h2>

        {user && (
          <form onSubmit={handleAddReview} className={styles.reviewForm}>
            <div className={styles.formGroup}>
              <label>Rating:</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {'⭐'.repeat(n)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Comment:</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your thoughts about this product"
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Submit Review
            </button>
          </form>
        )}

        <div className={styles.reviewsList}>
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review, index) => (
              <div key={review._id || index} className={styles.review}>
                <span className={styles.rating}>{'⭐'.repeat(review.rating)}</span>
                <p className={styles.comment}>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
