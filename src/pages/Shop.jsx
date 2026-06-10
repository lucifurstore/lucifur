import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useDocumentTitle } from '../utils/useDocumentTitle';
import { products as productsData } from '../data/products';
import styles from './Shop.module.css';
import { SlidersHorizontal, Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['ALL', 'HOODIES', 'TSHIRT', 'PANTS', 'OUTERWEAR', 'SHOES', 'JEANS', 'ACCESSORIES'];

const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const Shop = () => {
  useDocumentTitle('Shop');
  const [searchParams, setSearchParams] = useSearchParams();

  // Pre-seed state from URL query params (e.g. from footer links)
  const urlFilter = searchParams.get('filter') || 'ALL';
  const urlSort = searchParams.get('sort') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(urlFilter);
  const [sort, setSort] = useState(urlSort);
  const [collectionId, setCollectionId] = useState(searchParams.get('collection') || '');
  const [showSort, setShowSort] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const sortRef = useRef(null);

  // Re-sync filter/sort/search/collection whenever the URL query params change
  useEffect(() => {
    const f = searchParams.get('filter') || 'ALL';
    const s = searchParams.get('sort') || '';
    const q = searchParams.get('search') || '';
    const col = searchParams.get('collection') || '';
    setFilter(f);
    setSort(s);
    setSearchInput(q);
    setSearch(q);
    setCollectionId(col);
  }, [searchParams]);

  // Debounce: only update URL search param 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = searchInput.trim();
      if ((searchParams.get('search') || '') !== trimmed) {
        const nextParams = new URLSearchParams(searchParams);
        if (!trimmed) {
          nextParams.delete('search');
        } else {
          nextParams.set('search', trimmed);
        }
        setSearchParams(nextParams);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  const handleFilterChange = (newFilter) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('collection'); // clear collection filter on category filter click
    if (newFilter === 'ALL') {
      nextParams.delete('filter');
    } else {
      nextParams.set('filter', newFilter);
    }
    setSearchParams(nextParams);
  };

  const handleSortChange = (newSort) => {
    const nextParams = new URLSearchParams(searchParams);
    if (!newSort) {
      nextParams.delete('sort');
    } else {
      nextParams.set('sort', newSort);
    }
    setSearchParams(nextParams);
  };

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    // Badge-based filters (SALE, BEST SELLER) are not categories — send as badge param
    const isCategory = CATEGORIES.includes(filter);
    if (filter !== 'ALL') {
      if (isCategory) params.append('category', filter);
      else params.append('badge', filter);
    }
    if (collectionId) {
      params.append('collection', collectionId);
    }
    if (sort) params.append('sort', sort);
    params.append('limit', '100');

    fetch(`${API_URL}/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        } else {
          setProducts(productsData.map(p => ({ ...p, _id: String(p.id) })));
        }
      })
      .catch(() => {
        setProducts(productsData.map(p => ({ ...p, _id: String(p.id) })));
      })
      .finally(() => setLoading(false));
  }, [filter, sort, collectionId]);  // only re-runs on filter or sort change

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSort(false);
      }
    };
    if (showSort) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSort]);

  const sortLabels = {
    '': 'DEFAULT',
    'new': 'NEW ARRIVALS',
    'price_asc': 'PRICE: LOW → HIGH',
    'price_desc': 'PRICE: HIGH → LOW',
    'name_asc': 'NAME: A → Z',
  };

  const normalizedSearch = normalizeString(search);
  const displayProducts = products.filter((product) => {
    if (!normalizedSearch) return true;
    const nameMatch = normalizeString(product.name).includes(normalizedSearch);
    const catMatch = normalizeString(product.category).includes(normalizedSearch);
    const descMatch = normalizeString(product.description).includes(normalizedSearch);
    return nameMatch || catMatch || descMatch;
  });

  const collectionName = (collectionId && products.length > 0) ? products[0]?.collection?.name : '';

  return (
    <div className={styles.shopPage}>
      <header className={styles.shopHeader}>
        <div className="container-fluid">
          <h1>{collectionName ? collectionName.toUpperCase() : 'COLLECTIONS'}</h1>
          <p>{collectionName ? `EXPLORE PIECES FROM OUR ${collectionName.toUpperCase()}` : 'EXPLORE OUR CURATED STREETWEAR PIECES'}</p>
        </div>
      </header>

      <div className="container-fluid pb-5">
        <div className={styles.shopControls}>
          {/* Category Filters */}
          <div className={styles.filters} style={loading ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.active : ''}`}
                onClick={() => handleFilterChange(cat)}
                disabled={loading}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className={styles.searchContainer}>
            <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text-secondary)', pointerEvents: 'none' }} />
            <input
              type="text"
              name="search"
              aria-label="Search products"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="SEARCH BY NAME OR CATEGORY..."
              className={styles.shopSearchInput}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ position: 'relative' }} ref={sortRef}>
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
                    onClick={() => { handleSortChange(val); setShowSort(false); }}
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
        ) : displayProducts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No products found matching your search.</p>
          </div>
        ) : (
          <>
            <p className={styles.resultCount}>{displayProducts.length} PRODUCTS</p>
            <div className="row g-4">
              {displayProducts.map((product) => (
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
