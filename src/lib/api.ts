const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('gosulawesi_token')
}

export function setToken(token: string) {
  localStorage.setItem('gosulawesi_token', token)
}

export function clearToken() {
  localStorage.removeItem('gosulawesi_token')
}

export function getStoredUser() {
  const raw = localStorage.getItem('gosulawesi_user')
  return raw ? JSON.parse(raw) : null
}

export function setStoredUser(user: any) {
  localStorage.setItem('gosulawesi_user', JSON.stringify(user))
}

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  console.log(`[API] ${options.method || 'GET'} ${path}`)
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  const data = await res.json().catch(() => ({}))
  console.log(`[API] ${options.method || 'GET'} ${path} -> ${res.status}`, data)

  if (!res.ok) {
    throw new Error((data as any).error || `HTTP ${res.status}`)
  }

  return data as T
}

// ── Auth API ──
export const api = {
  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: {
    name: string
    email: string
    password: string
    role: 'tourist' | 'local' | 'admin'
    phone?: string
    business?: {
      businessName: string
      businessType: string
      city: string
      phone: string
      description?: string
      nib?: string
    }
  }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => request('/auth/me'),

  // ── Users ──
  getUsers: () => request('/users'),
  getUser: (id: number) => request(`/users/${id}`),
  updateUser: (id: number, data: any) =>
    request(`/users/${id}/update`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteUser: (id: number) =>
    request(`/users/${id}/delete`, { method: 'DELETE' }),
  uploadAvatar: async (id: number, file: File): Promise<{ message: string; avatar: string }> => {
    const token = getToken()
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await fetch(`${API_BASE}/users/${id}/avatar`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })
    const data = await res.json().catch(() => ({}))
    console.log(`[API] POST /users/${id}/avatar -> ${res.status}`, data)
    if (!res.ok) throw new Error((data as any).error || `HTTP ${res.status}`)
    return data as { message: string; avatar: string }
  },

  // ── Businesses ──
  getBusinesses: () => request('/businesses'),
  getBusiness: (id: number) => request(`/businesses/${id}`),
  createBusiness: (data: any) =>
    request('/businesses', { method: 'POST', body: JSON.stringify(data) }),
  updateBusiness: (id: number, data: any) =>
    request(`/businesses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBusiness: (id: number) =>
    request(`/businesses/${id}`, { method: 'DELETE' }),

  // ── Destinations ──
  getDestinations: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/destinations${qs}`)
  },
  getDestination: (id: number) => request(`/destinations/${id}`),
  createDestination: (data: any) =>
    request('/destinations', { method: 'POST', body: JSON.stringify(data) }),
  updateDestination: (id: number, data: any) =>
    request(`/destinations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDestination: (id: number) =>
    request(`/destinations/${id}`, { method: 'DELETE' }),

  // ── Bookings ──
  getBookings: () => request('/bookings'),
  createBooking: (data: any) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  updateBooking: (id: number, data: any) =>
    request(`/bookings/${id}/update`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBooking: (id: number) =>
    request(`/bookings/${id}/delete`, { method: 'DELETE' }),

  // ── Reviews ──
  getReviews: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : ''
    return request(`/reviews${qs}`)
  },
  createReview: (data: any) =>
    request('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  // ── Dashboard ──
  getDashboard: () => request('/dashboard'),

  // ── Public Stats ──
  getStats: () => request('/stats'),
}
