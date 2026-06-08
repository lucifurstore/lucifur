// Centralized API utility for admin panel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAdminToken = () => localStorage.getItem('adminToken');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getAdminToken()}`,
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'API Error');
  return data;
};

export const adminApi = {
  // Dashboard
  getStats: () =>
    fetch(`${API_URL}/admin/stats`, { headers: authHeaders() }).then(handleResponse),

  // Products
  getProducts: (params = '') =>
    fetch(`${API_URL}/products?${params}&limit=50`, { headers: authHeaders() }).then(handleResponse),
  getProduct: (id) =>
    fetch(`${API_URL}/products/${id}`, { headers: authHeaders() }).then(handleResponse),
  createProduct: (body) =>
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  updateProduct: (id, body) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  deleteProduct: (id) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),

  // Collections
  getCollections: () =>
    fetch(`${API_URL}/collections`, { headers: authHeaders() }).then(handleResponse),
  createCollection: (body) =>
    fetch(`${API_URL}/collections`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  updateCollection: (id, body) =>
    fetch(`${API_URL}/collections/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  deleteCollection: (id) =>
    fetch(`${API_URL}/collections/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),

  // Orders
  getOrders: (params = '') =>
    fetch(`${API_URL}/admin/orders?${params}`, { headers: authHeaders() }).then(handleResponse),
  updateOrder: (id, body) =>
    fetch(`${API_URL}/admin/orders/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  // Users
  getUsers: () =>
    fetch(`${API_URL}/admin/users`, { headers: authHeaders() }).then(handleResponse),

  // Coupons
  getCoupons: () =>
    fetch(`${API_URL}/admin/coupons`, { headers: authHeaders() }).then(handleResponse),
  createCoupon: (body) =>
    fetch(`${API_URL}/admin/coupons`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  updateCoupon: (id, body) =>
    fetch(`${API_URL}/admin/coupons/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  deleteCoupon: (id) =>
    fetch(`${API_URL}/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    }).then(handleResponse),
};
