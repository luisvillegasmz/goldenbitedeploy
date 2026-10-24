import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../context/AuthContext'

interface Props {
  children:  React.ReactNode
  roles?:    UserRole[]   // si no se pasa, solo verifica que esté logueado
}

export default function PrivateRoute({ children, roles }: Props) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div style={{
        minHeight:      '100vh',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        background:     'var(--bg)',
        color:          'var(--gold)',
        fontFamily:     'var(--font-serif)',
        fontSize:       '18px',
        letterSpacing:  '0.1em',
      }}>
        Verificando sesión...
      </div>
    )
  }

  // No está autenticado
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Está autenticado pero no tiene el rol requerido
  if (roles && profile && !roles.includes(profile.role)) {
    return <Navigate to="/no-autorizado" replace />
  }

  return <>{children}</>
}