const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`
    }))
    throw new Error(error.message || 'Request failed')
  }
  return response.json()
}

const apiRequest = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...defaultOptions,
      ...options,
    })
    return await handleResponse(response)
  } catch (error) {
    console.error(`API Request Error (${endpoint}):`, error)
    throw error
  }
}

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  
  checkSession: () => apiRequest('/auth/session'),
}

// Confessions API
export const confessionsAPI = {
  getAll: () => apiRequest('/confessions'),
  
  getById: (id) => apiRequest(`/confessions/${id}`),
  
  create: (content) => apiRequest('/confessions', {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
  
  like: (id) => apiRequest(`/confessions/${id}/like`, {
    method: 'POST',
  }),
  
  delete: (id) => apiRequest(`/confessions/${id}`, {
    method: 'DELETE',
  }),
}

// Advice API
export const adviceAPI = {
  getAll: () => apiRequest('/advice'),
  
  getById: (id) => apiRequest(`/advice/${id}`),
  
  create: (content) => apiRequest('/advice', {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),
  
  like: (id) => apiRequest(`/advice/${id}/like`, {
    method: 'POST',
  }),
  
  delete: (id) => apiRequest(`/advice/${id}`, {
    method: 'DELETE',
  }),
}

// Export mock data for development
export const mockData = {
  confessions: [
    {
      id: 1,
      content: "I secretly enjoy pineapple on pizza. It's the perfect sweet and savory combination!",
      likes: 15,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isAnonymous: true
    },
    {
      id: 2,
      content: "I pretend to understand memes my younger colleagues share. Sometimes I laugh just to fit in.",
      likes: 8,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isAnonymous: true
    }
  ],
  advice: [
    {
      id: 1,
      content: "Progress, not perfection, is what matters. Celebrate small wins along the way.",
      likes: 25,
      createdAt: new Date().toISOString(),
      author: "Anonymous"
    }
  ]
}

export default {
  auth: authAPI,
  confessions: confessionsAPI,
  advice: adviceAPI,
  mockData
}