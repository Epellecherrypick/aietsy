import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import styles from './Products.module.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [searchParams] = useSearchParams();
  
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    fetchProducts();
  }, [search, category, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: 12,
        ...(search && { search }),
        ...(category && { category }),
      });
      
      const response = await API.get(`/products?${params}`);
      setProducts(response.data.products);
      setTotal(response.data.total);
      setPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>
        {search ? `Search Results: "${search}"` : category ? `Category: ${category}` : 'All Products'}
      </h1>

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>No products found</div>
      ) : (
        <>
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {pages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={styles.pageBtn}
              >
                ← Previous
              </button>
              
              <span className={styles.pageInfo}>
                Page {page} of {pages}
              </span>
              
              <button
                onClick={() => setPage(Math.min(pages, page + 1))}
                disabled={page === pages}
                className={styles.pageBtn}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
