import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'

const th = {
  padding: '10px 12px',
  textAlign: 'left',
  whiteSpace: 'nowrap'
}

const td = {
  padding: '8px 12px',
  whiteSpace: 'nowrap'
}

function App() {
  const [inventory, setInventory] = useState([])
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

useEffect(() => {
  if (!session) return
  async function fetchData() {
    console.log('Session:', session)
    console.log('User:', session.user.email)
    
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
    
    console.log('Data:', data)
    console.log('Error:', error)
    console.log('Row count:', data?.length)
    
    if (error) console.error(error)
    else setInventory(data)
  }
  fetchData()
}, [session])

  async function handleLogout() {
    await supabase.auth.signOut()
    setInventory([])
  }

  function getMaintenanceColor(dateStr) {
    if (!dateStr) return ''
    const today = new Date()
    const last = new Date(dateStr)
    const monthsDiff = (today - last) / (1000 * 60 * 60 * 24 * 30)
    if (monthsDiff < 6) return '#d4edda'
    if (monthsDiff < 12) return '#fff3cd'
    return '#f8d7da'
  }

  if (loading) return <p style={{ padding: '20px' }}>Cargando...</p>
  if (!session) return <Login />

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Inventario Hospital</h1>
        <div>
          <span style={{ marginRight: '16px', color: '#6c757d', fontSize: '14px' }}>
            {session.user.email}
          </span>
          <button
            onClick={handleLogout}
            style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#343a40', color: 'white' }}>
              <th style={th}>ID</th>
              <th style={th}>No. Inventario</th>
              <th style={th}>Nombre</th>
              <th style={th}>Marca</th>
              <th style={th}>Modelo</th>
              <th style={th}>No. Serie</th>
              <th style={th}>Fecha Adquisición</th>
              <th style={th}>Años</th>
              <th style={th}>Operacional</th>
              <th style={th}>Condición</th>
              <th style={th}>Último Mantenimiento</th>
              <th style={th}>Estrategia</th>
              <th style={th}>Fin de Póliza</th>
              <th style={th}>Prioridad</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                <td style={td}>{item.id}</td>
                <td style={td}>{item.inventory_number}</td>
                <td style={td}>{item.name}</td>
                <td style={td}>{item.brand}</td>
                <td style={td}>{item.model}</td>
                <td style={td}>{item.serial_number}</td>
                <td style={td}>{item.acquisition_date}</td>
                <td style={td}>{item.age_years}</td>
                <td style={td}>{item.is_operational}</td>
                <td style={td}>{item.condition}</td>
                <td style={{ ...td, backgroundColor: getMaintenanceColor(item.last_maintenance_date) }}>
                  {item.last_maintenance_date}
                </td>
                <td style={td}>{item.maintenance_strategy}</td>
                <td style={td}>{item.policy_end_date}</td>
                <td style={td}>{item.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
