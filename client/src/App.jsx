import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Consultations from './pages/Consultations'
import ConsultationDetail from './pages/ConsultationDetail'
import NewConsultation from './pages/NewConsultation'
import AstrologerProfile from './pages/AstrologerProfile'
import ClientProfile from './pages/ClientProfile'
import Settings from './pages/Settings'

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading-center"><div className="spinner" /></div>
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="consultations" element={<Consultations />} />
          <Route path="consultations/:id" element={<ConsultationDetail />} />
          <Route path="new" element={
            <ProtectedRoute roles={['admin', 'astrologer']}>
              <NewConsultation />
            </ProtectedRoute>
          } />
          <Route path="astrologer/:id" element={<AstrologerProfile />} />
          <Route path="client/:id" element={<ClientProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}