import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAstrologers, getConsultations } from '../api'

export default function AstrologerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [astrologer, setAstrologer] = useState(null)
  const [consultations, setConsultations] = useState([])

  useEffect(() => {
    getAstrologers().then(r => {
      const found = r.data.find(a => a.id === parseInt(id))
      setAstrologer(found)
    })
    getConsultations({ astrologer_id: id }).then(r => setConsultations(r.data))
  }, [id])

  if (!astrologer) return <div className="loading-center"><div className="spinner" /></div>

  const completed = consultations.filter(c => c.status === 'completed').length
  const scheduled = consultations.filter(c => c.status === 'scheduled').length

  return (
    <div>
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>← Back</button>

      <div className="profile-header card" style={{ marginBottom: 20 }}>
        <div className="card-body">
          <div className="profile-info">
            <div className="profile-avatar">{astrologer.name.charAt(0)}</div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{astrologer.name}</h1>
              <p style={{ color: 'var(--text-muted)' }}>{astrologer.specialization || 'Astrologer'}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{astrologer.email}</p>
              {astrologer.phone && <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>📞 {astrologer.phone}</p>}
            </div>
          </div>
          <div className="profile-stats">
            <div className="stat-card"><h3>{consultations.length}</h3><p>Total Sessions</p></div>
            <div className="stat-card"><h3>{completed}</h3><p>Completed</p></div>
            <div className="stat-card"><h3>{scheduled}</h3><p>Upcoming</p></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h3 style={{ marginBottom: 16, fontWeight: 700 }}>Recent Consultations</h3>
          {consultations.length === 0 ? (
            <div className="empty-state"><p>No consultations yet</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Client</th><th>Topic</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {consultations.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/consultations/${c.id}`)}>
                      <td>{c.client.name}</td>
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