import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import styles from './admin.module.css';

const defaultForm = { name: '', description: '', image: '' };

const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCollections = () => {
    adminApi
      .getCollections()
      .then((d) => setCollections(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCollections(); }, []);

  const openAdd = () => {
    setForm(defaultForm);
    setEditId(null);
    setError('');
    setShowModal(true);
  };

  const openEdit = (col) => {
    setForm({ name: col.name, description: col.description, image: col.image });
    setEditId(col._id);
    setError('');
    setShowModal(true);
  };

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editId) {
        const updated = await adminApi.updateCollection(editId, form);
        setCollections((prev) => prev.map((c) => (c._id === editId ? updated.data : c)));
      } else {
        const created = await adminApi.createCollection(form);
        setCollections((prev) => [created.data, ...prev]);
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove collection "${name}"?`)) return;
    try {
      await adminApi.deleteCollection(id);
      setCollections((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout pageTitle="Collections">
      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 999, padding: 20,
          }}
        >
          <div
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              padding: '36px', width: '100%', maxWidth: '480px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase' }}>
                {editId ? 'Edit Collection' : 'New Collection'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {error && (
              <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff6666', padding: '10px 14px', marginBottom: 16, fontSize: '0.78rem' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave} className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Collection Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Summer Drop 2024" required />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Brief description of this collection..." />
              </div>
              <div className={styles.formGroup}>
                <label>Cover Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
                {form.image && (
                  <img src={form.image} alt="preview" style={{ marginTop: 8, height: 80, width: '100%', objectFit: 'cover', border: '1px solid var(--border)' }} />
                )}
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={`${styles.actionBtn} ${styles.primary}`} disabled={saving}>
                  {saving ? 'SAVING...' : editId ? 'UPDATE' : 'CREATE'}
                </button>
                <button type="button" className={styles.actionBtn} onClick={() => setShowModal(false)}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2>All Collections ({collections.length})</h2>
          <button className={`${styles.actionBtn} ${styles.primary}`} onClick={openAdd}>
            <Plus size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            New Collection
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading collections...</div>
        ) : collections.length === 0 ? (
          <div className={styles.emptyState}>No collections yet. Create your first one.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col._id}>
                  <td>
                    {col.image ? (
                      <img src={col.image} alt={col.name} className={styles.productThumb} />
                    ) : (
                      <div className={styles.productThumb} style={{ background: 'var(--border)' }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{col.name}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {col.slug}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', maxWidth: 200 }}>
                    {col.description || '—'}
                  </td>
                  <td>
                    <div className={styles.actionsGroup}>
                      <button className={styles.actionBtn} onClick={() => openEdit(col)}>
                        <Pencil size={12} style={{ marginRight: 4 }} />Edit
                      </button>
                      <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(col._id, col.name)}>
                        <Trash2 size={12} style={{ marginRight: 4 }} />Delete
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

export default AdminCollections;
