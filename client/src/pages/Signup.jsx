import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const res = await registerApi(form)
      login(res.data.token, res.data.user)
      toast.success(`Account created! Welcome, ${res.data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  const roles = [
    { value: 'client', icon: '👤', label: 'Client', desc: 'Book and view your consultations' },
    { value: 'astrologer', icon: '🔮', label: 'Astrologer', desc: 'Manage sessions and recordings' },
    { value: 'admin', icon: '👑', label: 'Admin', desc: 'Full platform access' },
  ]

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand" onClick={() => navigate('/')}>
          ⭐ <span>AstroConsult</span>
        </div>
        <h1>Create Account</h1>
        <p>Start managing your consultations today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input name="name" className="form-control" placeholder="Your full name"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" placeholder="Min 6 characters"
              value={form.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div className="role-selector">
              {roles.map(r => (
                <div
                  key={r.value}
                  className={`role-option ${form.role === r.value ? 'selected' : ''}`}
                  onClick={() => setForm(p => ({ ...p, role: r.value }))}
                >
                  <span className="role-icon">{r.icon}</span>
                  <span className="role-label">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <h2>Join AstroConsult</h2>
          <p>The smartest way to manage your astrology practice.</p>
          <div className="auth-features">
            {['⚡ Setup in minutes', '🔒 Secure JWT auth', '🎭 3 role types', '✨ AI-powered'].map(f => (
              <div key={f} className="auth-feature-item">{f}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}