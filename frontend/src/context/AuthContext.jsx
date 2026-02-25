import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // initial auth check
  const [authError, setAuthError] = useState(null)

  // ─── On mount: check for existing token ───
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('arvana_token')
      if (!token) {
        setLoading(false)
        return
      }
      try {
        const res = await api.getMe()
        setUser(res.data)
      } catch {
        // Token invalid/expired — clear it
        localStorage.removeItem('arvana_token')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  // ─── Register ───
  const register = useCallback(async (name, email, password, phone) => {
    setAuthError(null)
    try {
      const res = await api.register(name, email, password, phone)
      const { user: userData, token } = res.data
      localStorage.setItem('arvana_token', token)
      setUser(userData)
      return { success: true }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // ─── Login ───
  const login = useCallback(async (email, password) => {
    setAuthError(null)
    try {
      const res = await api.login(email, password)
      const { user: userData, token } = res.data
      localStorage.setItem('arvana_token', token)
      setUser(userData)
      return { success: true }
    } catch (err) {
      setAuthError(err.message)
      return { success: false, error: err.message }
    }
  }, [])

  // ─── Logout ───
  const logout = useCallback(() => {
    localStorage.removeItem('arvana_token')
    setUser(null)
    setAuthError(null)
  }, [])

  // ─── Update profile ───
  const updateProfile = useCallback(async (updates) => {
    try {
      const res = await api.updateProfile(updates)
      setUser(res.data)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  // ─── Change password ───
  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      const res = await api.changePassword(currentPassword, newPassword)
      // Update token
      if (res.data?.token) {
        localStorage.setItem('arvana_token', res.data.token)
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }, [])

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    clearError: () => setAuthError(null),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
