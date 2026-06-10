import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import styles from './admin.module.css';

const defaultForm = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minOrderAmount: 0,
  maxUses: 100,
  expiresAt: '',
};

const AdminCoupons = () => {
  useDocumentTitle('Admin Coupons');
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getCoupons()
      .then((d) => setCoupons(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const created = await adminApi.createCoupon({
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount),
        maxUses: Number(form.maxUses),
      });
      setCoupons((prev) => [created.data, ...prev]);
      setShowModal(false);
      setForm(defaultForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await adminApi.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const updated = await adminApi.updateCoupon(coupon._id, { isActive: !coupon.isActive });
      setCoupons((prev) => prev.map((c) => (c._id === coupon._id ? updated.data : c)));
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <AdminLayout pageTitle="Coupons">
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '0.85rem', letterSpacing: '3px', textTransform: 'uppercase' }}>New Coupon</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {error && <div style={{ background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff6666', padding: '10px 14px', marginBottom: 16, fontSize: '0.78rem' }}>{error}</div>}
            <form onSubmit={handleCreate} className={styles.formGrid}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Coupon Code *</label>
                  <input name="code" value={form.code} onChange={handleChange} placeholder="e.g. SAVE20" required style={{ textTransform: 'uppercase' }} />
                </div>
                <div className={styles.formGroup}>
                  <label>Discount Type</label>
                  <select name="discountType" value={form.discountType} onChange={handleChange}>
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Discount Value *</label>
                  <input name="discountValue" type="number" value={form.discountValue} onChange={handleChange} placeholder={form.discountType === 'percentage' ? '20' : '100'} min="0" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Min Order Amount (₹)</label>
                  <input name="minOrderAmount" type="number" value={form.minOrderAmount} onChange={handleChange} min="0" />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Max Uses</label>
                  <input name="maxUses" type="number" value={form.maxUses} onChange={handleChange} min="1" />
                </div>
                <div className={styles.formGroup}>
                  <label>Expires At *</label>
                  <input name="expiresAt" type="date" value={form.expiresAt} onChange={handleChange} required />
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={`${styles.actionBtn} ${styles.primary}`} disabled={saving}>{saving ? 'CREATING...' : 'CREATE COUPON'}</button>
                <button type="button" className={styles.actionBtn} onClick={() => setShowModal(false)}>CANCEL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2>All Coupons ({coupons.length})</h2>
          <div className={styles.headerActions}>
            <button className={`${styles.actionBtn} ${styles.primary}`} onClick={() => { setForm(defaultForm); setError(''); setShowModal(true); }} style={{ width: '100%' }}>
              <Plus size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />New Coupon
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className={styles.emptyState}>No coupons yet</div>
        ) : (
          <table className={`${styles.table} ${styles.tableCoupons}`}>
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th className={styles.hideBelow768}>Min Order</th>
                <th className={styles.hideBelow600}>Usage</th>
                <th>Expires</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => {
                const isExpired = new Date(c.expiresAt) < new Date();
                return (
                  <tr key={c._id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, letterSpacing: '2px' }}>{c.code}</td>
                    <td>
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}
                    </td>
                    <td className={styles.hideBelow768} style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>₹{c.minOrderAmount}</td>
                    <td className={styles.hideBelow600} style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{c.usedCount} / {c.maxUses}</td>
                    <td style={{ color: isExpired ? '#f87171' : 'var(--text-secondary)', fontSize: '0.78rem' }}>{formatDate(c.expiresAt)}</td>
                    <td>
                      {isExpired ? (
                        <span className={`${styles.badge} ${styles.cancelled}`}>Expired</span>
                      ) : c.isActive ? (
                        <span className={`${styles.badge} ${styles.delivered}`}>Active</span>
                      ) : (
                        <span className={`${styles.badge} ${styles.user}`}>Inactive</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionsGroup}>
                        <button className={styles.actionBtn} onClick={() => handleToggleActive(c)}>
                          {c.isActive ? 'Disable' : 'Enable'}
                        </button>
                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDelete(c._id, c.code)}>
                          <Trash2 size={12} style={{ marginRight: 4 }} />Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;
