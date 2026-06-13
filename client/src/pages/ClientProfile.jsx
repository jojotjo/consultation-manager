import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getClients, getConsultations } from '../api'

export default function ClientProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [consultations, setConsultations] = useState([])

  useEffect(() => {
    getClients().then(r => {
      const found = r.data.find(c => c.id === parseInt(id))
      setClient(found)
    })
    getConsultations({ client_id: id }).then(r => setConsultations(r.data))
  }, [id])

  if (!client) return <div className="loading-center"><div className="spinner" /></div>

  return (
    <div>
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Back</button>

      <div className="profile-header card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div className="profile-info">
            <div className="profile-avatar" style={{ background: 'var(--success)' }}>{client.name.charAt(0)}</div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{client.name}</h1>
              <p style={{ color: 'var(--text-muted)' }}>{client.email}</p>
              {client.phone && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>📞 {client.phone}</p>}
              {client.birth_date && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>🎂 {new Date(client.birth_date).toLocaleDateString()}</p>}
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat-card"><h3>{consultations.length}</h3><p>Total Sessions</p></div>
            <div className="stat-card"><h3>{consultations.filter(c => c.status === 'completed').length}</h3><p>Completed</p></div>
            <div className="stat-card"><h3>{consultations.filter(c => c.recording).length}</h3><p>Recordings</p></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Consultation History</h3>
          {consultations.length === 0 ? (
            <div className="empty-state"><p>No consultations yet</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Astrologer</th><th>Topic</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {consultations.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/consultations/${c.id}`)}>
                      <td>{c.astrologer.name}</td>
                      <td>{c.topic || '—'}</td>
                      <td>{new Date(c.scheduled_at).toLocaleDateString()}</td>
                      <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}