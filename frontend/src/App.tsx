import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import axios from 'axios'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'
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
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
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
      {/* Public Routes - Redirect if already logged in */}
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
