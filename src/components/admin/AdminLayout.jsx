import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingBag,
  Users,
  Tag,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import styles from './AdminLayout.module.css';

const navLinks = [
  {
    group: 'Overview',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    group: 'Catalog',
    items: [
      { to: '/admin/products', label: 'Products', icon: Package },
      { to: '/admin/collections', label: 'Collections', icon: FolderOpen },
    ],
  },
  {
    group: 'Commerce',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { to: '/admin/coupons', label: 'Coupons', icon: Tag },
    ],
  },
  {
    group: 'Users',
    items: [{ to: '/admin/users', label: 'Users', icon: Users }],
  },
];

const AdminLayout = ({ children, pageTitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  return (
    <div className={styles.adminLayout}>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarLogo}>
          <h2>LUCIFUR</h2>
          <span>ADMIN PANEL</span>
        </div>

        <nav className={styles.sidebarNav}>
          {navLinks.map((group) => (
            <div key={group.group} className={styles.navGroup}>
              <p className={styles.navGroupLabel}>{group.group}</p>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.active : ''}`
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button
              className={styles.mobileToggle}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <span className={styles.pageTitle}>{pageTitle}</span>
          </div>
          <div className={styles.topBarRight}>
            <span className={styles.adminBadge}>Admin</span>
            <span className={styles.adminName}>{adminInfo.name || 'Admin'}</span>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
