import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginApi } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginApi(form)
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally { setLoading(false) }
  }

  const demoLogin = async (email, password) => {
    setForm({ email, password })
    setLoading(true)
    try {
      const res = await loginApi({ email, password })
      login(res.data.token, res.data.user)
      toast.success(`Logged in as ${res.data.user.role}`)
      navigate('/dashboard')
    } catch (err) {
      toast.error('Demo login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand" onClick={() => navigate('/')}>
          ⭐ <span>AstroConsult</span>
        </div>
        <h1>Welcome Back</h1>
        <p>Sign in to manage your consultations</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control" placeholder="••••••••"
              value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Try demo accounts:</p>
          <div className="demo-btns">
            <button className="btn btn-outline btn-sm" onClick={() => demoLogin('admin@astroconsult.com', 'password')}>
              👑 Admin
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => demoLogin('arjun@example.com', 'password')}>
              🔮 Astrologer
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => demoLogin('anita@example.com', 'password')}>
              👤 Client
            </button>
          </div>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-right-content">
          <h2>Manage consultations with AI</h2>
          <p>Record sessions, generate summaries, and grow your practice.</p>
          <div className="auth-features">
            {['🎙️ Recording uploads', '✨ AI summaries', '📊 Analytics dashboard', '🔒 Secure access'].map(f => (
              <div key={f} className="auth-feature-item">{f}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}