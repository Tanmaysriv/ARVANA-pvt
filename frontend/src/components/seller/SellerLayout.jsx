import { useState } from 'react'
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, ChevronLeft, Menu, X, Clock, ShieldCheck, ShieldX } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/seller/products', icon: Package, label: 'My Products' },
  { to: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
]

const SellerLayout = () => {
  const { user, isAuthenticated } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Guard: must be logged in
  if (!isAuthenticated) return <Navigate to="/login" replace />

  // Guard: must be seller role
  if (user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Access Denied</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">You need a seller account to view this page.</p>
          <a href="/" className="text-sky-600 hover:text-sky-700 font-medium">← Back to Store</a>
        </div>
      </div>
    )
  }

  // Guard: seller must be approved
  if (user?.sellerStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Clock className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Account Under Review</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            Your seller account is pending approval. Our admin team will review your application shortly.
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">Store: <span className="font-semibold text-slate-600 dark:text-slate-300">{user.storeName}</span></p>
          <a href="/" className="text-sky-600 hover:text-sky-700 font-medium">← Back to Store</a>
        </div>
      </div>
    )
  }

  if (user?.sellerStatus === 'blocked') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Account Blocked</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Your seller account has been blocked. Please contact support for assistance.
          </p>
          <a href="/" className="text-sky-600 hover:text-sky-700 font-medium">← Back to Store</a>
        </div>
      </div>
    )
  }

  const handleNavClick = () => setSidebarOpen(false)

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">Seller Panel</h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">{user?.storeName}</p>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <div className="px-3 py-2 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Approved Seller</span>
        </div>
        <a
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Store
        </a>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 pt-20">
      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-[5.5rem] left-4 z-40">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed left-0 top-20 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transform transition-transform duration-300 md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex fixed left-0 top-20 bottom-0 w-56 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-30 flex-col">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-0 md:ml-56 p-4 sm:p-6 min-h-[calc(100vh-5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default SellerLayout
