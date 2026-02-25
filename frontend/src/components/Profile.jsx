import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, ChevronLeft, CheckCircle2, AlertCircle, Package, Shield, MapPin } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user, isAuthenticated, updateProfile, changePassword } = useAuth()

  // Profile form
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [profileMsg, setProfileMsg] = useState(null) // { type, text }
  const [profileLoading, setProfileLoading] = useState(false)

  // Address form
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
    country: user?.address?.country || 'India',
  })
  const [addressMsg, setAddressMsg] = useState(null)
  const [addressLoading, setAddressLoading] = useState(false)

  // Password form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4">
        <div className="max-w-md mx-auto text-center py-20">
          <User className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Login Required</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Please sign in to view your profile.</p>
          <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      setProfileMsg({ type: 'error', text: 'Name is required' })
      return
    }
    setProfileLoading(true)
    setProfileMsg(null)
    const res = await updateProfile({ name: name.trim(), phone: phone.trim() })
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
    } else {
      setProfileMsg({ type: 'error', text: res.error || 'Failed to update profile' })
    }
    setProfileLoading(false)
  }

  const handleAddressUpdate = async (e) => {
    e.preventDefault()
    setAddressLoading(true)
    setAddressMsg(null)
    const res = await updateProfile({ address })
    if (res.success) {
      setAddressMsg({ type: 'success', text: 'Address saved successfully!' })
    } else {
      setAddressMsg({ type: 'error', text: res.error || 'Failed to save address' })
    }
    setAddressLoading(false)
  }

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }))
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordMsg(null)

    if (!currentPassword || !newPassword) {
      setPasswordMsg({ type: 'error', text: 'Both fields are required' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match' })
      return
    }

    setPasswordLoading(true)
    const res = await changePassword(currentPassword, newPassword)
    if (res.success) {
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setPasswordMsg({ type: 'error', text: res.error || 'Failed to change password' })
    }
    setPasswordLoading(false)
  }

  const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 mb-6 text-sm font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to Store
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate">{user.name}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
              <div className="flex items-center gap-3 mt-2">
                {user.role === 'admin' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-lg">
                    <Shield className="w-3 h-3" />
                    Admin
                  </span>
                )}
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
            <Link to="/orders" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-700/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              <Package className="w-4 h-4" />
              My Orders
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-700/50 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <Shield className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
          </div>
        </motion.div>

        {/* Edit Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            Edit Profile
          </h2>

          {profileMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
              profileMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            }`}>
              {profileMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {profileLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>

        {/* Saved Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600" />
            Delivery Address
          </h2>

          {addressMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
              addressMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            }`}>
              {addressMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {addressMsg.text}
            </div>
          )}

          <form onSubmit={handleAddressUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Street Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <textarea
                  value={address.street}
                  onChange={e => handleAddressChange('street', e.target.value)}
                  placeholder="House no, Building, Street, Area"
                  rows={2}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">City</label>
                <input
                  type="text"
                  value={address.city}
                  onChange={e => handleAddressChange('city', e.target.value)}
                  placeholder="Mumbai"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={e => handleAddressChange('state', e.target.value)}
                  placeholder="Maharashtra"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Pincode</label>
                <input
                  type="text"
                  value={address.pincode}
                  onChange={e => handleAddressChange('pincode', e.target.value)}
                  placeholder="400001"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Country</label>
                <input
                  type="text"
                  value={address.country}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addressLoading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {addressLoading ? 'Saving...' : 'Save Address'}
            </button>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center">This address will be auto-filled during checkout</p>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
        >
          <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2">
            <Lock className="w-5 h-5 text-sky-600" />
            Change Password
          </h2>

          {passwordMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
              passwordMsg.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            }`}>
              {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {passwordMsg.text}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-3 bg-slate-800 dark:bg-slate-600 hover:bg-slate-900 dark:hover:bg-slate-500 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-colors text-sm"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Profile
