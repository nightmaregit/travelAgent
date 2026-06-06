import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [status, setStatus] = useState<string>('Loading...')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
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

  return (
    <div className="App">
      <h1>Travel Agent Project</h1>
      <div className="card">
        <p>Backend Status: <strong>{status}</strong></p>
        <p>{message}</p>
      </div>
      <p className="read-the-docs">
        Environment: Podman + Bun + Express + React + MySQL
      </p>
    </div>
  )
}

export default App
