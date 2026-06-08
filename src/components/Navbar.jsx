import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, Menu, X, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, openLogin } = useAuth();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleUserClick = () => {
    if (isAuthenticated) {
      setShowUserMenu((prev) => !prev);
    } else {
      openLogin();
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Links (Desktop) */}
        <ul className={`${styles.navLinks} d-none d-lg-flex`}>
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/shop">SHOP</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
        </ul>

        {/* Logo */}
        <Link to="/" className={styles.logo}>LUCIFER</Link>

        {/* Icons */}
        <div className={styles.navIcons}>
          <button className="d-none d-md-flex"><Search size={20} /></button>

          {/* User Icon with dropdown */}
          <div style={{ position: 'relative' }}>
            <button className="d-none d-md-flex" onClick={handleUserClick}>
              <User size={20} />
            </button>
            {showUserMenu && isAuthenticated && (
              <div className={styles.userDropdown}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user?.name}</span>
                  <span className={styles.userEmail}>{user?.email}</span>
                </div>
                <div className={styles.dropdownDivider} />
                <Link to="/orders" className={styles.dropdownItem} onClick={() => setShowUserMenu(false)}>
                  <Package size={14} /> My Orders
                </Link>
                <button className={`${styles.dropdownItem} ${styles.logoutItem}`} onClick={handleLogout}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link to="/wishlist" className={styles.iconLink}>
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className={styles.badge}>{wishlist.length}</span>
            )}
          </Link>

          {/* Cart */}
          <Link to="/cart" className={styles.iconLink}>
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.active : ''}`}>
        <ul className={styles.mobileNavLinks}>
          <li><Link to="/">HOME</Link></li>
          <li><Link to="/shop">SHOP</Link></li>
          <li><Link to="/about">ABOUT</Link></li>
          <li><Link to="/contact">CONTACT</Link></li>
          {isAuthenticated && <li><Link to="/orders">MY ORDERS</Link></li>}
        </ul>
        <div className={styles.mobileIcons}>
          <Search size={24} />
          {isAuthenticated ? (
            <button onClick={handleLogout} style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogOut size={24} />
            </button>
          ) : (
            <button onClick={() => { setIsMobileMenuOpen(false); openLogin(); }} style={{ color: 'var(--text-primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              <User size={24} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
