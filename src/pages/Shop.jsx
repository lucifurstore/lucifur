import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import styles from './Shop.module.css';
import { SlidersHorizontal } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['ALL', 'HOODIES', 'TSHIRT', 'PANTS', 'OUTERWEAR', 'SHOES', 'JEANS', 'ACCESSORIES'];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [sort, setSort] = useState('');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filter !== 'ALL') params.append('category', filter);
    if (sort) params.append('sort', sort);
    params.append('limit', '50');

    fetch(`${API_URL}/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter, sort]);

  const sortLabels = {
    '': 'DEFAULT',
    'price_asc': 'PRICE: LOW → HIGH',
    'price_desc': 'PRICE: HIGH → LOW',
    'name_asc': 'NAME: A → Z',
  };

  return (
    <div className={styles.shopPage}>
      <header className={styles.shopHeader}>
        <div className="container-fluid">
          <h1>COLLECTIONS</h1>
          <p>EXPLORE OUR CURATED STREETWEAR PIECES</p>
        </div>
      </header>

      <div className="container-fluid pb-5">
        <div className={styles.shopControls}>
          {/* Category Filters */}
          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }}>
            <button className={styles.sortBtn} onClick={() => setShowSort((p) => !p)}>
              <SlidersHorizontal size={16} />
              <span>{sortLabels[sort] || 'FILTER & SORT'}</span>
            </button>
            {showSort && (
              <div className={styles.sortDropdown}>
                {Object.entries(sortLabels).map(([val, label]) => (
                  <button
                    key={val}
                    className={`${styles.sortOption} ${sort === val ? styles.activeSortOption : ''}`}
                    onClick={() => { setSort(val); setShowSort(false); }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className={styles.skeletonGrid}>
            {[...Array(8)].map((_, i) => <div key={i} className={styles.skeletonCard} />)}
          </div>
        ) : products.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No products found in this category.</p>
          </div>
        ) : (
          <>
            <p className={styles.resultCount}>{products.length} PRODUCTS</p>
            <div className="row g-4">
              {products.map((product) => (
                <div key={product._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
