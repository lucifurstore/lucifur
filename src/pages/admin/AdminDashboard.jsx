import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Users, DollarSign } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import styles from './admin.module.css';

const statusColors = {
  pending: 'pending',
  confirmed: 'confirmed',
  shipped: 'shipped',
  delivered: 'delivered',
  cancelled: 'cancelled',
};

const AdminDashboard = () => {
  useDocumentTitle('Admin Dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then((data) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <AdminLayout pageTitle="Dashboard">
      {loading ? (
        <div className={styles.loadingState}>Loading stats...</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <ShoppingBag size={22} className={styles.statIcon} />
              <div className={styles.statLabel}>Total Orders</div>
              <div className={styles.statValue}>{stats?.totalOrders ?? 0}</div>
            </div>
            <div className={styles.statCard}>
              <Package size={22} className={styles.statIcon} />
              <div className={styles.statLabel}>Active Products</div>
              <div className={styles.statValue}>{stats?.totalProducts ?? 0}</div>
            </div>
            <div className={styles.statCard}>
              <Users size={22} className={styles.statIcon} />
              <div className={styles.statLabel}>Registered Users</div>
              <div className={styles.statValue}>{stats?.totalUsers ?? 0}</div>
            </div>
            <div className={styles.statCard}>
              <DollarSign size={22} className={styles.statIcon} />
              <div className={styles.statLabel}>Total Revenue</div>
              <div className={`${styles.statValue} ${styles.revenueValue}`}>
                {formatCurrency(stats?.totalRevenue ?? 0)}
              </div>
            </div>
          </div>

          {/* Orders by Status */}
          {stats?.ordersByStatus?.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <div className={styles.sectionTitle}>Orders by Status</div>
              <div className={styles.statusGrid}>
                {stats.ordersByStatus.map((s) => (
                  <div key={s._id} className={styles.statCard}>
                    <div className={styles.statLabel}>{s._id}</div>
                    <div className={`${styles.statValue} ${styles.statusValue}`}>
                      {s.count}
                    </div>
                    <span className={`${styles.badge} ${styles[statusColors[s._id]]}`}>
                      {s._id}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders */}
          <div className={styles.tableWrapper}>
            <div className={styles.tableHeader}>
              <h2>Recent Orders</h2>
              <Link to="/admin/orders">
                <button className={`${styles.actionBtn} ${styles.primary}`}>View All</button>
              </Link>
            </div>
            {stats?.recentOrders?.length === 0 ? (
              <div className={styles.emptyState}>No orders yet</div>
            ) : (
              <table className={`${styles.table} ${styles.dashboardTable}`}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th className={styles.hideBelow480}>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className={styles.hideBelow600}>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.map((order) => (
                    <tr key={order._id}>
                      <td className={styles.monoCell}>
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td>
                        {order.user?.name || order.shippingAddress?.fullName || 'Guest'}
                        <br />
                        <span className={styles.hideBelow480} style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          {order.user?.email || order.shippingAddress?.email}
                        </span>
                      </td>
                      <td className={styles.hideBelow480} style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td className={styles.nowrapCell}>
                        {formatCurrency(order.totalAmount)}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className={styles.hideBelow600}>
                        <span className={`${styles.badge} ${styles[order.paymentStatus]}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
