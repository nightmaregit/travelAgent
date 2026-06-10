import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import LandingPage from './pages/LandingPage'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { PackageList } from './pages/PackageList'
import { PackageDetail } from './pages/PackageDetail'
import { BookingList } from './pages/BookingList'
import { BookingDetail } from './pages/BookingDetail'
import { AdminPackageTable } from './pages/admin/AdminPackageTable'
import { PackageForm } from './pages/admin/PackageForm'
import { AdminBookingTable } from './pages/admin/AdminBookingTable'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import './App.css'

function Dashboard() {
  const [status, setStatus] = useState<string>('Loading...')
  const [message, setMessage] = useState<string>('')
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const checkHealth = async () => {
      try {
        const response = await axios.get('/api/health')
        setStatus(response.data.status)
        setMessage(response.data.message)
      } catch (error) {
        setStatus('Error')
        setMessage('Could not connect to backend')
        console.error(error)
      }
    }
    checkHealth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="App">
      <h1>Travel Agent Dashboard</h1>
      <div className="card">
        {user && <p>Welcome, <strong>{user.full_name}</strong>!</p>}
        <p>Backend Status: <strong>{status}</strong></p>
        <p>{message}</p>
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/packages" style={{ padding: '10px', background: '#3498db', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
            Browse Packages
          </Link>
          <Link to="/bookings" style={{ padding: '10px', background: '#2ecc71', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
            My Bookings
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" style={{ padding: '10px', background: '#8e44ad', color: '#fff', textDecoration: 'none', borderRadius: '4px' }}>
              Admin Panel
            </Link>
          )}
          <button 
            onClick={handleLogout}
            style={{ padding: '10px', background: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
          >
            Logout
          </button>
        </div>
      </div>
      <p className="read-the-docs">
        Environment: Podman + Bun + Express + React + MySQL
      </p>
    </div>
  )
}

function App() {
  const token = localStorage.getItem('token');

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <Register />} />
      <Route path="/packages" element={<PackageList />} />
      <Route path="/packages/:id" element={<PackageDetail />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<BookingList />} />
        <Route path="/bookings/:id" element={<BookingDetail />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/bookings" element={<AdminBookingTable />} />
        <Route path="/admin/packages" element={<AdminPackageTable />} />
        <Route path="/admin/packages/new" element={<PackageForm />} />
        <Route path="/admin/packages/edit/:id" element={<PackageForm />} />
      </Route>
    </Routes>
  )
}

export default App
