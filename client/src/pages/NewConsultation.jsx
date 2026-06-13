import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAstrologers, getClients, createConsultation, createClient } from '../api'

export default function NewConsultation() {
  const navigate = useNavigate()
  const [astrologers, setAstrologers] = useState([])
  const [clients, setClients] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [showNewClient, setShowNewClient] = useState(false)
  const [form, setForm] = useState({ astrologer_id: '', client_id: '', scheduled_at: '', topic: '', notes: '', duration_minutes: 30 })
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    getAstrologers().then(r => setAstrologers(r.data))
    getClients().then(r => setClients(r.data))
  }, [])

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleAddClient = async () => {
    if (!newClient.name) return alert('Client name required')
    const res = await createClient(newClient)
    setClients(p => [...p, res.data])
    setForm(p => ({ ...p, client_id: res.data.id }))
    setShowNewClient(false)
    setNewClient({ name: '', email: '', phone: '' })
  }

  const handleSubmit = async () => {
    if (!form.astrologer_id || !form.client_id || !form.scheduled_at)
      return alert('Please fill all required fields')
    setSubmitting(true)
    try {
      const res = await createConsultation(form)
      navigate(`/consultations/${res.data.id}`)
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create consultation')
    } finally { setSubmitting(false) }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      <div className="page-header">
        <h1 className="page-title">New Consultation</h1>
      </div>
      <div className="card"><div className="card-body">

        <div className="form-group">
          <label className="form-label">Astrologer *</label>
          <select name="astrologer_id" className="form-control" value={form.astrologer_id} onChange={handleChange}>
            <option value="">Select astrologer...</option>
            {astrologers.map(a => <option key={a.id} value={a.id}>{a.name} — {a.specialization}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Client *</label>
          <select name="client_id" className="form-control" value={form.client_id} onChange={handleChange}>
            <option value="">Select client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
          </select>
          <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}
            onClick={() => setShowNewClient(!showNewClient)}>
            {showNewClient ? 'Cancel' : '+ Add New Client'}
          </button>
        </div>

        {showNewClient && (
          <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 12 }}>New Client</p>
            {['name', 'email', 'phone'].map(f => (
              <div className="form-group" key={f}>
                <input className="form-control"
                  placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                  value={newClient[f]}
                  onChange={e => setNewClient(p => ({ ...p, [f]: e.target.value }))} />
              </div>
            ))}
            <button className="btn btn-primary btn-sm" onClick={handleAddClient}>Add Client</button>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Scheduled At *</label>
          <input type="datetime-local" name="scheduled_at" className="form-control" value={form.scheduled_at} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Topic</label>
          <input name="topic" className="form-control" placeholder="e.g. Career & Finance Guidance" value={form.topic} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Duration (minutes)</label>
          <input type="number" name="duration_minutes" className="form-control" value={form.duration_minutes} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea name="notes" className="form-control" rows={3}
            placeholder="Any pre-consultation notes..."
            value={form.notes} onChange={handleChange} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Consultation'}
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/consultations')}>Cancel</button>
        </div>

      </div></div>
    </div>
  )
}