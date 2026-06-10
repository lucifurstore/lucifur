import React, { useState, useEffect, useRef } from 'react';
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);
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
    setShowSearch(false);
  }, [location]);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Focus input when search opens
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close search on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setShowSearch(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setShowSearch(false);
    setSearchQuery('');
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  const openSearch = () => {
    setIsMobileMenuOpen(false);
    setShowSearch(true);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Links (Desktop) */}
          <ul className={`${styles.navLinks} d-none d-lg-flex`}>
            <li><Link to="/" className={location.pathname === '/' ? styles.activeNavLink : ''}>HOME</Link></li>
            <li><Link to="/shop" className={location.pathname.startsWith('/shop') ? styles.activeNavLink : ''}>SHOP</Link></li>
            <li><Link to="/about" className={location.pathname === '/about' ? styles.activeNavLink : ''}>ABOUT</Link></li>
            <li><Link to="/contact" className={location.pathname === '/contact' ? styles.activeNavLink : ''}>CONTACT</Link></li>
          </ul>

          {/* Logo */}
          <Link to="/" className={styles.logo}>LUCIFUR</Link>

          {/* Icons */}
          <div className={styles.navIcons}>
            {/* Search */}
            <button
              className={`d-none d-md-flex ${styles.iconBtn}`}
              onClick={openSearch}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* User Icon with dropdown */}
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button className={`d-none d-md-flex ${styles.iconBtn}`} onClick={handleUserClick} aria-label="Account">
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
            <Link to="/wishlist" className={styles.iconLink} aria-label="Wishlist">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className={styles.badge}>{wishlist.length}</span>
              )}
            </Link>

            {/* My Orders */}
            <Link
              to={isAuthenticated ? '/orders' : '#'}
              className={styles.iconLink}
              title="My Orders"
              aria-label="My Orders"
              onClick={(e) => { if (!isAuthenticated) { e.preventDefault(); openLogin(); } }}
            >
              <Package size={20} />
            </Link>

            {/* Cart */}
            <Link to="/cart" className={styles.iconLink} aria-label="Cart">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Slide-down Search Bar */}
      <div className={`${styles.searchBar} ${showSearch ? styles.searchBarOpen : ''} ${isScrolled ? styles.searchBarScrolled : ''}`}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <Search size={18} className={styles.searchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH PRODUCTS..."
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchSubmit}>SEARCH</button>
          <button type="button" className={styles.searchClose} onClick={() => setShowSearch(false)} aria-label="Close search">
            <X size={20} />
          </button>
        </form>
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
          {/* Search button — properly wrapped */}
          <button
            className={styles.mobileIconBtn}
            onClick={openSearch}
            aria-label="Search"
          >
            <Search size={24} />
          </button>
          <Link to="/wishlist" className={styles.mobileIconBtn} aria-label="Wishlist">
            <Heart size={24} />
            {wishlist.length > 0 && <span className={styles.mobileBadge}>{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className={styles.mobileIconBtn} aria-label="Cart">
            <ShoppingCart size={24} />
            {cartCount > 0 && <span className={styles.mobileBadge}>{cartCount}</span>}
          </Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className={styles.mobileIconBtn} aria-label="Logout">
              <LogOut size={24} />
            </button>
          ) : (
            <button onClick={() => { setIsMobileMenuOpen(false); openLogin(); }} className={styles.mobileIconBtn} aria-label="Sign in">
              <User size={24} />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
