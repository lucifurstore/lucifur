import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import styles from './admin.module.css';

const normalizeString = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  useDocumentTitle('Admin Products');

  const fetchProducts = () => {
    setLoading(true);
    adminApi
      .getProducts(search ? `search=${search}` : '')
      .then((data) => setProducts(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}" from the store?`)) return;
    setDeleting(id);
    try {
      await adminApi.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const normalizedSearch = normalizeString(search);
  const filtered = products.filter((p) => {
    if (!normalizedSearch) return true;
    const nameMatch = normalizeString(p.name).includes(normalizedSearch);
    const catMatch = normalizeString(p.category).includes(normalizedSearch);
    return nameMatch || catMatch;
  });

  return (
    <AdminLayout pageTitle="Products">
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2>All Products ({filtered.length})</h2>
          <div className={styles.headerActions}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%', maxWidth: '180px' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: 10, color: 'var(--text-secondary)' }}
              />
              <input
                className={styles.adminSearchInput}
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/admin/products/add" style={{ width: '100%', maxWidth: '180px' }} className={styles.headerActions ? '' : ''}>
              <button className={`${styles.actionBtn} ${styles.primary}`} style={{ width: '100%' }}>
                <Plus size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Add Product
              </button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading products...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>No products found</div>
        ) : (
          <table className={`${styles.table} ${styles.tableProducts}`}>
            <thead>
              <tr>
                <th className={styles.hideBelow480}>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th className={styles.hideBelow768}>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id} style={deleting === product._id ? { pointerEvents: 'none', opacity: 0.5 } : {}}>
                  <td className={styles.hideBelow480}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className={styles.productThumb}
                      />
                    ) : (
                      <div
                        className={styles.productThumb}
                        style={{ background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Package size={16} color="var(--text-secondary)" />
                      </div>
                    )}
                  </td>
                  <td>
                    <span style={{ fontWeight: 500 }}>{product.name}</span>
                    {product.badge && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: '0.58rem',
                          letterSpacing: '1px',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                          padding: '1px 6px',
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    {product.category}
                  </td>
                  <td>₹{product.price.toFixed(2)}</td>
                  <td>
                    <span
                      style={{
                        color: product.stock < 5 ? '#f87171' : product.stock < 20 ? '#f0c040' : '#4ade80',
                      }}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className={styles.hideBelow768}>
                    {product.isFeatured ? (
                      <span className={`${styles.badge} ${styles.delivered}`}>Yes</span>
                    ) : (
                      <span className={`${styles.badge} ${styles.user}`}>No</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionsGroup}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                      >
                        <Pencil size={12} style={{ marginRight: 4 }} />
                        Edit
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.danger}`}
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deleting === product._id}
                      >
                        <Trash2 size={12} style={{ marginRight: 4 }} />
                        {deleting === product._id ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
