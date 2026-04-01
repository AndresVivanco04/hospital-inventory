import { useState } from 'react'
import { supabase } from './supabaseClient'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Inventario Hospitalario</h2>
        <p style={styles.subtitle}>Iniciar Sesión</p>
        <input
          style={styles.input}
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button
          style={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f2f5'
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '360px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  title: {
    margin: 0,
    textAlign: 'center',
    color: '#343a40'
  },
  subtitle: {
    margin: 0,
    textAlign: 'center',
    color: '#6c757d',
    marginBottom: '8px'
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    fontSize: '14px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#343a40',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '14px',
    cursor: 'pointer',
    marginTop: '8px'
  },
  error: {
    color: '#dc3545',
    fontSize: '13px',
    margin: 0
  }
}

export default Login
