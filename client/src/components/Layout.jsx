import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard', roles: ['admin', 'astrologer', 'client'] },
    { to: '/consultations', icon: '🎙️', label: 'Consultations', roles: ['admin', 'astrologer', 'client'] },
    { to: '/new', icon: '➕', label: 'New Consultation', roles: ['admin', 'astrologer'] },
  ]

  const roleColor = { admin: '#e8a838', astrologer: '#7b5bb5', client: '#2e7d56' }

  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-logo">
          {!collapsed && <span>⭐ <span style={{ color: 'var(--accent)' }}>AstroConsult</span></span>}
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '→' : '←'}
          </button>
        </div>

        <div className="user-card">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          {!collapsed && (
            <div className="user-info">
              <p className="user-name">{user?.name}</p>
              <span className="role-badge" style={{ background: roleColor[user?.role] }}>
                {user?.role}
              </span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems
            .filter(item => item.roles.includes(user?.role))
            .map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span>⚙️</span>{!collapsed && <span>Settings</span>}
          </NavLink>
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <span>🚪</span>{!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`main ${collapsed ? 'main-expanded' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}