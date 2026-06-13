import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getConsultationById, uploadRecording, generateSummary, deleteRecording, getRecordingUrl, updateConsultation } from '../api'

export default function ConsultationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [consultation, setConsultation] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [transcript, setTranscript] = useState('')
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [dragging, setDragging] = useState(false)

  const fetchData = () => getConsultationById(id).then(r => setConsultation(r.data)).catch(console.error)
  useEffect(() => { fetchData() }, [id])

  const handleFileUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setProgress(0)
    try {
      await uploadRecording(id, file, setProgress)
      await fetchData()
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed')
    } finally { setUploading(false); setProgress(0) }
  }

  const handleSummary = async () => {
    setGeneratingSummary(true)
    try {
      await generateSummary(id, transcript)
      await fetchData()
    } catch (err) {
      alert('Failed to generate summary')
    } finally { setGeneratingSummary(false) }
  }

  const handleDeleteRecording = async () => {
    if (!window.confirm('Delete this recording?')) return
    await deleteRecording(id)
    fetchData()
  }

  const handleStatusChange = async (status) => {
    await updateConsultation(id, { status })
    fetchData()
  }

  if (!consultation) return <div className="loading-center"><div className="spinner" /> Loading...</div>

  const { astrologer, client, recording } = consultation

  return (
    <div>
      <div className="page-header">
        <div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/consultations')} style={{ marginBottom: 8 }}>← Back</button>
          <h1 className="page-title">{consultation.topic || 'Consultation'}</h1>
        </div>
        <span className={`badge badge-${consultation.status}`} style={{ fontSize: '0.9rem', padding: '6px 14px' }}>
          {consultation.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card"><div className="card-body">
          <h3 style={{ marginBottom: 12, fontSize: '0.9rem', color: 'var(--text-muted)' }}>ASTROLOGER</h3>
          <p><strong>{astrologer.name}</strong></p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{astrologer.specialization}</p>
        </div></div>
        <div className="card"><div className="card-body">
          <h3 style={{ marginBottom: 12, fontSize: '0.9rem', color: 'var(--text-muted)' }}>CLIENT</h3>
          <p><strong>{client.name}</strong></p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{client.email} · {client.phone}</p>
        </div></div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}><div className="card-body">
        <h3 style={{ marginBottom: 12, fontSize: '0.9rem', color: 'var(--text-muted)' }}>DETAILS</h3>
        <p><strong>Scheduled:</strong> {new Date(consultation.scheduled_at).toLocaleString()}</p>
        <p><strong>Duration:</strong> {consultation.duration_minutes} min</p>
        {consultation.notes && <p style={{ marginTop: 8 }}><strong>Notes:</strong> {consultation.notes}</p>}
        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          {['scheduled', 'completed', 'cancelled'].map(s => (
            <button key={s}
              className={`btn btn-sm ${consultation.status === s ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleStatusChange(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div></div>

      <div className="card" style={{ marginBottom: 20 }}><div className="card-body">
        <h3 style={{ marginBottom: 16, fontSize: '0.9rem', color: 'var(--text-muted)' }}>RECORDING</h3>
        {recording ? (
          <div>
            <p style={{ fontSize: '0.875rem' }}>📁 {recording.file_name} ({(recording.file_size / 1024 / 1024).toFixed(2)} MB)</p>
            <audio controls src={getRecordingUrl(id)} />
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteRecording}>Delete Recording</button>
            </div>
            {recording.ai_summary && (
              <div className="ai-summary">
                <h4>✨ AI Summary</h4>
                <p>{recording.ai_summary}</p>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`upload-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); handleFileUpload(e.dataTransfer.files[0]) }}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <input id="fileInput" type="file" accept="audio/*,video/*" style={{ display: 'none' }}
              onChange={e => handleFileUpload(e.target.files[0])} />
            <p style={{ fontSize: '1.5rem' }}>🎙️</p>
            <p style={{ fontWeight: 600, margin: '8px 0' }}>Drop audio/video file here</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>MP3, MP4, WAV, OGG — Max 50MB</p>
            {uploading && (
              <div className="progress" style={{ marginTop: 12 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        )}
      </div></div>

      {recording && !recording.ai_summary && (
        <div className="card"><div className="card-body">
          <h3 style={{ marginBottom: 12, fontSize: '0.9rem', color: 'var(--text-muted)' }}>GENERATE AI SUMMARY</h3>
          <textarea className="form-control" rows={4}
            placeholder="Paste transcript here (optional)..."
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            style={{ marginBottom: 12 }} />
          <button className="btn btn-primary" onClick={handleSummary} disabled={generatingSummary}>
            {generatingSummary ? '⏳ Generating...' : '✨ Generate Summary'}
          </button>
        </div></div>
      )}
    </div>
  )
}