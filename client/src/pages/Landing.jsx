import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const features = [
    { icon: '🎙️', title: 'Record Consultations', desc: 'Upload audio and video recordings of every session securely.' },
    { icon: '✨', title: 'AI Summaries', desc: 'Auto-generate professional consultation summaries using Claude AI.' },
    { icon: '👥', title: 'Multi-Role Access', desc: 'Separate dashboards for admins, astrologers, and clients.' },
    { icon: '🔍', title: 'Smart Search', desc: 'Filter and search consultations by client, astrologer, or topic.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track completed sessions, recordings, and upcoming appointments.' },
    { icon: '🔒', title: 'Secure & Private', desc: 'JWT authentication with role-based access control.' },
  ]

  const steps = [
    { step: '01', title: 'Register', desc: 'Create an account as an astrologer or client.' },
    { step: '02', title: 'Schedule', desc: 'Book and manage consultation sessions.' },
    { step: '03', title: 'Record', desc: 'Upload session recordings directly to the platform.' },
    { step: '04', title: 'Summarize', desc: 'Generate AI-powered summaries instantly.' },
  ]

  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-logo">⭐ <span>AstroConsult</span></div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          {user ? (
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => navigate('/login')}>Login</button>
              <button className="btn btn-primary" onClick={() => navigate('/signup')}>Get Started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">✨ AI-Powered Consultation Management</div>
          <h1 className="hero-title">
            Manage Astrology Consultations<br />
            <span>Smarter with AI</span>
          </h1>
          <p className="hero-desc">
            Record sessions, generate summaries, and manage your entire consultation workflow — all in one place. Built for astrologers who value their time.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
              Start Free Today →
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/login')}>
              Login to Dashboard
            </button>
          </div>
          <div className="hero-stats">
            <div><strong>3</strong><span>Roles</span></div>
            <div><strong>AI</strong><span>Summaries</span></div>
            <div><strong>50MB</strong><span>File Support</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">
              <span className="badge badge-completed">Completed</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Today 10:00 AM</span>
            </div>
            <h3>Career & Finance Guidance</h3>
            <p>Dr. Arjun Sharma → Anita Mehta</p>
            <div className="ai-summary" style={{ marginTop: 12 }}>
              <h4>✨ AI Summary</h4>
              <p>The consultation focused on career transitions and financial planning for the next quarter...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" id="features">
        <div className="section-header">
          <h2>Everything You Need</h2>
          <p>A complete platform for professional astrology consultation management</p>
        </div>
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="section section-dark" id="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in minutes</p>
        </div>
        <div className="steps-grid">
          {steps.map(s => (
            <div className="step-card" key={s.step}>
              <div className="step-number">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Transform Your Practice?</h2>
        <p>Join astrologers who are already managing sessions smarter.</p>
        <button className="btn btn-primary btn-lg" onClick={() => navigate('/signup')}>
          Create Your Free Account →
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>⭐ AstroConsult — Built for Humara Pandit Assignment</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
          Prabhjot Kaur · Chitkara University · 2026
        </p>
      </footer>
    </div>
  )
}