import React, { useEffect, useState } from 'react'
import { getStats, getConsultations } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(console.error)
    getConsultations({ status: 'scheduled' }).then(r => setRecent(r.data.slice(0, 5))).catch(console.error)
  }, [])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <button className="btn btn-primary" onClick={() => navigate('/new')}>+ New Consultation</button>
      </div>

      <div className="stats-grid">
        {[
          { label: 'Total Consultations', value: stats?.total_consultations ?? '—' },
          { label: 'Completed', value: stats?.completed ?? '—' },
          { label: 'Upcoming', value: stats?.scheduled ?? '—' },
          { label: 'Recordings', value: stats?.total_recordings ?? '—' },
        ].map((s) => (
          <div className="stat-card" key={s.label}>
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <h2 style={{ marginBottom: 16, fontSize: '1rem', fontWeight: 700 }}>Upcoming Consultations</h2>
          {recent.length === 0 ? (
            <div className="empty-state"><p>No upcoming consultations</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Client</th><th>Astrologer</th><th>Topic</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {recent.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/consultations/${c.id}`)}>
                      <td>{c.client.name}</td>
                      <td>{c.astrologer.name}</td>
                      <td>{c.topic || '—'}</td>
                      <td>{new Date(c.scheduled_at).toLocaleString()}</td>
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