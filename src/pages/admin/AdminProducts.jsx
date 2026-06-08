import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import styles from './admin.module.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout pageTitle="Products">
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2>All Products ({filtered.length})</h2>
          <div className={styles.actionsGroup}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: 10, color: 'var(--text-secondary)' }}
              />
              <input
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  padding: '6px 12px 6px 30px',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-main)',
                  outline: 'none',
                  width: '180px',
                }}
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Link to="/admin/products/add">
              <button className={`${styles.actionBtn} ${styles.primary}`}>
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
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product._id}>
                  <td>
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
                  <td>
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
