const BASE_URL = '/api';


/**
 * API client for Galaxy Restaurant server.
 * Automatically attaches JWT token from localStorage if available.
 * Handles token expiry by clearing stored credentials on 401/403.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('galaxy_token');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    // If token is invalid/expired, clear stored auth so UI updates
    if (response.status === 401 || response.status === 403) {
      // Don't clear on login/signup attempts (those don't use tokens)
      if (!endpoint.includes('/auth/signin') && !endpoint.includes('/auth/signup')) {
        localStorage.removeItem('galaxy_token');
        localStorage.removeItem('galaxy_user');
      }
    }
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

const api = {
  // Auth
  signup: (userData) => request('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
  signin: (credentials) => request('/auth/signin', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => request('/auth/me'),
  refreshToken: () => request('/auth/refresh', { method: 'POST' }),

  // Menu
  getMenu: (category) => request(`/menu${category && category !== 'All' ? `?category=${category}` : ''}`),
  getMenuItem: (id) => request(`/menu/${id}`),

  // Orders
  createOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  getMyOrders: () => request('/orders/my'),
  getUserOrders: (userId) => request(`/orders/user/${userId}`),

  // Contact
  sendMessage: (messageData) => request('/contact', { method: 'POST', body: JSON.stringify(messageData) }),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminMenu: () => request('/admin/menu'),
  addMenuItem: (item) => request('/admin/menu', { method: 'POST', body: JSON.stringify(item) }),
  updateMenuItem: (id, item) => request(`/admin/menu/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteMenuItem: (id) => request(`/admin/menu/${id}`, { method: 'DELETE' }),
  toggleMenuItem: (id) => request(`/admin/menu/${id}/toggle`, { method: 'PATCH' }),

  // Admin — Orders
  getAdminOrders: (status) => request(`/admin/orders${status && status !== 'all' ? `?status=${status}` : ''}`),
  updateOrderStatus: (id, status) => request(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Admin — Messages
  getAdminMessages: () => request('/admin/messages'),
  deleteAdminMessage: (id) => request(`/admin/messages/${id}`, { method: 'DELETE' }),

  // Admin — Customers
  getAdminCustomers: () => request('/admin/customers'),

  // Health
  health: () => request('/health'),
};

export default api;
