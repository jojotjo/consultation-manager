import React, { useEffect, useState } from 'react'
import { getConsultations, deleteConsultation } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Consultations() {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const navigate = useNavigate()

  const fetchData = () => {
    setLoading(true)
    getConsultations({ search, status: statusFilter })
      .then(r => setConsultations(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [search, statusFilter])

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    if (!window.confirm('Delete this consultation?')) return
    await deleteConsultation(id)
    fetchData()
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Consultations</h1>
        <button className="btn btn-primary" onClick={() => navigate('/new')}>+ New</button>
      </div>

      <div className="filter-bar">
        <input
          placeholder="Search by client, astrologer, topic..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="loading-center"><div className="spinner" /> Loading...</div>
          ) : consultations.length === 0 ? (
            <div className="empty-state"><h3>No consultations found</h3></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Client</th><th>Astrologer</th><th>Topic</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {consultations.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/consultations/${c.id}`)}>
                      <td>
                        <strong>{c.client.name}</strong>
                        <br /><small style={{ color: 'var(--text-muted)' }}>{c.client.phone}</small>
                      </td>
                      <td>
                        {c.astrologer.name}
                        <br /><small style={{ color: 'var(--text-muted)' }}>{c.astrologer.specialization}</small>
                      </td>
                      <td>{c.topic || '—'}</td>
                      <td>{new Date(c.scheduled_at).toLocaleString()}</td>
                      <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="btn btn-danger btn-sm" onClick={e => handleDelete(c.id, e)}>Delete</button>
                      </td>
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