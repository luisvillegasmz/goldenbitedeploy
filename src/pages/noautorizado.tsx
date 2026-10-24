import { useNavigate } from 'react-router-dom'

export default function NoAutorizado() {
  const navigate = useNavigate()
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
                   alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: '16px' }}>
      <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '26px' }}>
        Acceso no autorizado
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
        No tienes permisos para ver esta página.
      </p>
      <button className="btn-gold" onClick={() => navigate('/')}>
        Volver al inicio
      </button>
    </main>
  )
}