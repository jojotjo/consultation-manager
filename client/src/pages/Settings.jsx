import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateProfileApi } from '../api'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, logout } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: '', specialization: '' })
  const [saving, setSaving] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfileApi(form)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error('Failed to update profile')
    } finally { setSaving(false) }
  }

  const roleColor = { admin: '#e8a838', astrologer: '#7b5bb5', client: '#2e7d56' }

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
      </div>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <h3 style={{ marginBottom: 20, fontWeight: 700 }}>Profile Information</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div className="profile-avatar" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user?.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user?.email}</p>
              <span className="role-badge" style={{ background: roleColor[user?.role], color: 'white', padding: '2px 10px', borderRadius: 20, fontSize: '0.75rem' }}>
                {user?.role}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-control" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input name="phone" className="form-control" placeholder="Your phone number" value={form.phone} onChange={handleChange} />
          </div>
          {user?.role === 'astrologer' && (
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input name="specialization" className="form-control" placeholder="e.g. Vedic Astrology" value={form.specialization} onChange={handleChange} />
            </div>
          )}

          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Account info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Account Details</h3>
          {[
            { label: 'Email', value: user?.email },
            { label: 'Role', value: user?.role },
            { label: 'Member since', value: new Date(user?.created_at || Date.now()).toLocaleDateString() },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
              <span style={{ fontWeight: 500 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ border: '1px solid #f8d7da' }}>
        <div className="card-body">
          <h3 style={{ marginBottom: 8, fontWeight: 700, color: 'var(--danger)' }}>Danger Zone</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 16 }}>
            Once you log out, you'll need your credentials to sign back in.
          </p>
          <button className="btn btn-danger" onClick={logout}>Logout from all sessions</button>
        </div>
      </div>
    </div>
  )
}