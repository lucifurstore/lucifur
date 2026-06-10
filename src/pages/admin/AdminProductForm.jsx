import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Plus } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import styles from './admin.module.css';

const CATEGORIES = ['HOODIES', 'TSHIRT', 'PANTS', 'OUTERWEAR', 'SHOES', 'JEANS', 'ACCESSORIES'];
const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const defaultForm = {
  name: '',
  description: '',
  price: '',
  category: 'TSHIRT',
  collection: '',
  sizes: ['S', 'M', 'L', 'XL'],
  colors: '',
  stock: '',
  badge: '',
  isFeatured: false,
  images: [],
};

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  useDocumentTitle(isEdit ? 'Edit Product' : 'Add Product');

  const [form, setForm] = useState(defaultForm);
  const [collections, setCollections] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.getCollections().then((d) => setCollections(d.data)).catch(console.error);

    if (isEdit) {
      adminApi
        .getProduct(id)
        .then((d) => {
          const p = d.data;
          setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            collection: p.collection?._id || '',
            sizes: p.sizes,
            colors: p.colors.join(', '),
            stock: p.stock,
            badge: p.badge || '',
            isFeatured: p.isFeatured,
            images: p.images || [],
          });
        })
        .catch(console.error)
        .finally(() => setFetchingProduct(false));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addImageUrl = () => {
    if (!imageUrl.trim()) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, imageUrl.trim()] }));
    setImageUrl('');
  };

  const removeImage = (idx) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.description.trim()) {
      setError('Product description is required');
      return;
    }
    if (form.price === '' || Number(form.price) <= 0) {
      setError('Price must be greater than 0');
      return;
    }
    if (form.stock === '' || Number(form.stock) < 0) {
      setError('Stock must be a non-negative number');
      return;
    }
    if (form.images.length === 0) {
      setError('At least one product image is required');
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
      collection: form.collection || null,
    };

    try {
      if (isEdit) {
        await adminApi.updateProduct(id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) return <AdminLayout pageTitle="Edit Product"><div className={styles.loadingState}>Loading...</div></AdminLayout>;

  return (
    <AdminLayout pageTitle={isEdit ? 'Edit Product' : 'Add Product'}>
      <div className={styles.formPage}>
        <button
          className={`${styles.actionBtn} ${styles.backBtn}`}
          onClick={() => navigate('/admin/products')}
        >
          <ArrowLeft size={14} /> Back to Products
        </button>

        {error && (
          <div
            style={{
              background: 'rgba(255,68,68,0.1)',
              border: '1px solid rgba(255,68,68,0.3)',
              color: '#ff6666',
              padding: '10px 16px',
              marginBottom: 20,
              fontSize: '0.82rem',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGrid}>
          {/* Basic Info */}
          <div className={styles.formCard}>
            <h3>Basic Information</h3>
            <div className={styles.formGroup} style={{ marginBottom: 16 }}>
              <label>Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. LUCIFUR OVERSIZED HOODIE"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product description..."
                required
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className={styles.formCard}>
            <h3>Pricing & Inventory</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Price (₹) *</label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Stock Quantity *</label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className={styles.formCard}>
            <h3>Classification</h3>
            <div className={styles.formRow} style={{ marginBottom: 16 }}>
              <div className={styles.formGroup}>
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Collection</label>
                <select name="collection" value={form.collection} onChange={handleChange}>
                  <option value="">— No Collection —</option>
                  {collections.map((col) => (
                    <option key={col._id} value={col._id}>{col.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Badge Label</label>
                <input
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  placeholder="e.g. NEW ARRIVAL, BEST SELLER"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Colors (comma-separated)</label>
                <input
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="e.g. Black, White, Grey"
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className={styles.formCard}>
            <h3>Available Sizes</h3>
            <div className={styles.checkboxGroup}>
              {ALL_SIZES.map((size) => (
                <label key={size} className={styles.checkboxItem}>
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(size)}
                    onChange={() => toggleSize(size)}
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className={styles.formCard}>
            <h3>Product Images</h3>
            <div className={styles.imageUrlRow}>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste image URL..."
                className={styles.imageUrlInput}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImageUrl())}
              />
              <button
                type="button"
                className={`${styles.actionBtn} ${styles.primary} ${styles.imageUrlBtn}`}
                onClick={addImageUrl}
              >
                <Plus size={14} />
              </button>
            </div>
            {form.images.length > 0 && (
              <div className={styles.imagePreviewGrid}>
                {form.images.map((url, idx) => (
                  <div key={idx} className={styles.imagePreviewItem}>
                    <img src={url} alt="" />
                    <button
                      type="button"
                      className={styles.imageRemoveBtn}
                      onClick={() => removeImage(idx)}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Toggle */}
          <div className={styles.formCard}>
            <h3>Visibility</h3>
            <label className={styles.checkboxItem}>
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
              />
              Feature this product on the homepage
            </label>
          </div>

          {/* Submit */}
          <div className={styles.formActions}>
            <button
              type="submit"
              className={`${styles.actionBtn} ${styles.primary}`}
              style={{ padding: '12px 32px', fontSize: '0.78rem', letterSpacing: '2px' }}
              disabled={loading}
            >
              {loading ? 'SAVING...' : isEdit ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
            </button>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => navigate('/admin/products')}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProductForm;
