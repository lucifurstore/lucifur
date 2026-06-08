import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Global Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnnouncementStrip from './components/AnnouncementStrip';
import AuthModal from './components/AuthModal';

// Customer Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminCollections from './pages/admin/AdminCollections';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';

// Customer layout (keeps Navbar, Footer, AuthModal)
function CustomerLayout({ children }) {
  return (
    <div className="app-container">
      <AnnouncementStrip />
      <Navbar />
      <AuthModal />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <Routes>
              {/* ── Admin Routes (no customer chrome) ── */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard"   element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
              <Route path="/admin/products"    element={<ProtectedAdminRoute><AdminProducts /></ProtectedAdminRoute>} />
              <Route path="/admin/products/add"      element={<ProtectedAdminRoute><AdminProductForm /></ProtectedAdminRoute>} />
              <Route path="/admin/products/edit/:id" element={<ProtectedAdminRoute><AdminProductForm /></ProtectedAdminRoute>} />
              <Route path="/admin/collections" element={<ProtectedAdminRoute><AdminCollections /></ProtectedAdminRoute>} />
              <Route path="/admin/orders"      element={<ProtectedAdminRoute><AdminOrders /></ProtectedAdminRoute>} />
              <Route path="/admin/users"       element={<ProtectedAdminRoute><AdminUsers /></ProtectedAdminRoute>} />
              <Route path="/admin/coupons"     element={<ProtectedAdminRoute><AdminCoupons /></ProtectedAdminRoute>} />

              {/* ── Customer Routes ── */}
              <Route path="/*" element={
                <CustomerLayout>
                  <Routes>
                    <Route path="/"                            element={<Home />} />
                    <Route path="/shop"                        element={<Shop />} />
                    <Route path="/product/:id"                 element={<ProductDetails />} />
                    <Route path="/about"                       element={<About />} />
                    <Route path="/contact"                     element={<Contact />} />
                    <Route path="/cart"                        element={<Cart />} />
                    <Route path="/wishlist"                    element={<Wishlist />} />
                    <Route path="/checkout"                    element={<Checkout />} />
                    <Route path="/order-confirmation/:id"      element={<OrderConfirmation />} />
                    <Route path="/orders"                      element={<MyOrders />} />
                  </Routes>
                </CustomerLayout>
              } />
            </Routes>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
