// API helper for communicating with the backend
// In development, Vite proxy forwards /api to localhost:5000
// In production, configure the base URL accordingly

const API_BASE = '/api'

// ─── Helper: normalise a product from the backend ───
// Backend uses `productId`, frontend expects `id`
const normalizeProduct = (p) => ({
  ...p,
  id: p.productId ?? p.id,
})

const normalizeCategory = (c) => ({
  ...c,
  id: c.categoryId ?? c.id,
})

// ─── Safe fetch wrapper ───
const safeFetch = async (url, options = {}) => {
  // Auto-attach auth token if available
  const token = localStorage.getItem('arvana_token')
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const res = await fetch(url, options)
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

const api = {
  // ─── Products ──────────────────────────────────
  getProducts: async (params = {}) => {
    const query = new URLSearchParams(params).toString()
    const data = await safeFetch(`${API_BASE}/products${query ? `?${query}` : ''}`)
    return {
      ...data,
      data: (data.data || []).map(normalizeProduct),
    }
  },

  getProduct: async (id) => {
    const data = await safeFetch(`${API_BASE}/products/${id}`)
    return {
      ...data,
      data: data.data ? normalizeProduct(data.data) : null,
    }
  },

  // ─── Categories ────────────────────────────────
  getCategories: async () => {
    const data = await safeFetch(`${API_BASE}/categories`)
    return {
      ...data,
      data: (data.data || []).map(normalizeCategory),
    }
  },

  // ─── Cart ──────────────────────────────────────
  getCart: async (userId = 'guest') => {
    return safeFetch(`${API_BASE}/cart?userId=${userId}`)
  },

  addToCart: async (productId, quantity = 1, userId = 'guest') => {
    return safeFetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity, userId })
    })
  },

  updateCartItem: async (itemId, quantity, userId = 'guest') => {
    return safeFetch(`${API_BASE}/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity, userId })
    })
  },

  removeFromCart: async (itemId, userId = 'guest') => {
    return safeFetch(`${API_BASE}/cart/${itemId}?userId=${userId}`, {
      method: 'DELETE'
    })
  },

  clearCart: async (userId = 'guest') => {
    return safeFetch(`${API_BASE}/cart?userId=${userId}`, {
      method: 'DELETE'
    })
  },

  // ─── Wishlist ──────────────────────────────────
  getWishlist: async (userId = 'guest') => {
    return safeFetch(`${API_BASE}/wishlist?userId=${userId}`)
  },

  addToWishlist: async (productId, userId = 'guest') => {
    return safeFetch(`${API_BASE}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userId })
    })
  },

  removeFromWishlist: async (productId, userId = 'guest') => {
    return safeFetch(`${API_BASE}/wishlist/${productId}?userId=${userId}`, {
      method: 'DELETE'
    })
  },

  // ─── Orders ────────────────────────────────────
  placeOrder: async ({ items, shippingAddress, paymentMethod }) => {
    return safeFetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, shippingAddress, paymentMethod }),
    })
  },

  getOrders: async () => {
    return safeFetch(`${API_BASE}/orders`)
  },

  getOrder: async (id) => {
    return safeFetch(`${API_BASE}/orders/${id}`)
  },

  cancelOrder: async (id) => {
    return safeFetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'PATCH',
    })
  },

  // ─── Newsletter ────────────────────────────────
  subscribe: async (email) => {
    return safeFetch(`${API_BASE}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
  },

  // ─── Reviews ───────────────────────────────────
  getReviews: async (productId = null) => {
    const query = productId ? `?productId=${productId}` : ''
    return safeFetch(`${API_BASE}/reviews${query}`)
  },

  addReview: async (productId, userName, rating, comment) => {
    return safeFetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userName, rating, comment })
    })
  },

  // ─── Auth ──────────────────────────────────────
  register: async (name, email, password, phone = '', opts = {}) => {
    return safeFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone, ...opts })
    })
  },

  login: async (email, password) => {
    return safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
  },

  getMe: async () => {
    return safeFetch(`${API_BASE}/auth/me`)
  },

  updateProfile: async (updates) => {
    return safeFetch(`${API_BASE}/auth/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
  },

  changePassword: async (currentPassword, newPassword) => {
    return safeFetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    })
  },

  // ─── Health ────────────────────────────────────
  health: async () => {
    const res = await fetch(`${API_BASE}/health`)
    return res.json()
  },

  // ─── Admin ─────────────────────────────────────
  admin: {
    getStats: () => safeFetch(`${API_BASE}/admin/stats`),

    // Orders
    getOrders: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return safeFetch(`${API_BASE}/admin/orders${query ? `?${query}` : ''}`)
    },
    getOrder: (id) => safeFetch(`${API_BASE}/admin/orders/${id}`),
    updateOrderStatus: (id, status) =>
      safeFetch(`${API_BASE}/admin/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }),

    // Products
    uploadImage: async (file) => {
      const formData = new FormData()
      formData.append('image', file)
      const token = localStorage.getItem('arvana_token')
      const res = await fetch(`${API_BASE}/admin/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      return json
    },
    createProduct: (data) =>
      safeFetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    updateProduct: (id, data) =>
      safeFetch(`${API_BASE}/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    deleteProduct: (id) =>
      safeFetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' }),

    // Categories
    createCategory: (data) =>
      safeFetch(`${API_BASE}/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    updateCategory: (id, data) =>
      safeFetch(`${API_BASE}/admin/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    deleteCategory: (id) =>
      safeFetch(`${API_BASE}/admin/categories/${id}`, { method: 'DELETE' }),

    // Users
    getUsers: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return safeFetch(`${API_BASE}/admin/users${query ? `?${query}` : ''}`)
    },

    // Seller management
    getSellers: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return safeFetch(`${API_BASE}/admin/sellers${query ? `?${query}` : ''}`)
    },
    updateSellerStatus: (id, sellerStatus) =>
      safeFetch(`${API_BASE}/admin/sellers/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerStatus }),
      }),
  },

  // ─── Seller Dashboard ──────────────────────────
  seller: {
    getStats: () => safeFetch(`${API_BASE}/seller/stats`),

    // Products
    getProducts: () => safeFetch(`${API_BASE}/seller/products`),
    uploadImage: async (file) => {
      const formData = new FormData()
      formData.append('image', file)
      const token = localStorage.getItem('arvana_token')
      const res = await fetch(`${API_BASE}/seller/upload`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      return json
    },
    createProduct: (data) =>
      safeFetch(`${API_BASE}/seller/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    updateProduct: (id, data) =>
      safeFetch(`${API_BASE}/seller/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    deleteProduct: (id) =>
      safeFetch(`${API_BASE}/seller/products/${id}`, { method: 'DELETE' }),

    // Orders
    getOrders: (params = {}) => {
      const query = new URLSearchParams(params).toString()
      return safeFetch(`${API_BASE}/seller/orders${query ? `?${query}` : ''}`)
    },
    getOrder: (id) => safeFetch(`${API_BASE}/seller/orders/${id}`),
    updateOrderStatus: (id, status) =>
      safeFetch(`${API_BASE}/seller/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }),

    // Categories (read-only)
    getCategories: () => safeFetch(`${API_BASE}/seller/categories`),
  },
}

export default api
