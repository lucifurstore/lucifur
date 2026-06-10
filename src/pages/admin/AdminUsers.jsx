import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminApi } from '../../utils/adminApi';
import { useDocumentTitle } from '../../utils/useDocumentTitle';
import styles from './admin.module.css';

const AdminUsers = () => {
  useDocumentTitle('Admin Users');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getUsers()
      .then((d) => setUsers(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <AdminLayout pageTitle="Users">
      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <h2>Registered Users ({users.length})</h2>
        </div>

        {loading ? (
          <div className={styles.loadingState}>Loading users...</div>
        ) : users.length === 0 ? (
          <div className={styles.emptyState}>No registered users yet</div>
        ) : (
          <table className={`${styles.table} ${styles.tableUsers}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className={styles.hideBelow768}>Wishlist</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ fontWeight: 500 }}>{user.name}</td>
                  <td className={styles.emailColumn} style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{user.email}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className={styles.hideBelow768} style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    {user.wishlist?.length ?? 0} items
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                    {formatDate(user.createdAt)}
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

export default AdminUsers;
