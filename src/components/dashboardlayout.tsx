import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { UserRole } from '../context/AuthContext'

const ROLE_LABEL: Record<string, string> = {
  administrador: 'Administrador',
  dueño:         'Dueño',
  asesor:        'Asesor',
  cajero:        'Cajero',
}

interface Props {
  children: ReactNode
  title:    string
  role:     UserRole
}

export default function DashboardLayout({ children, title, role }: Props) {
  const navigate = useNavigate()
  const { profile, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

      {/* Barra superior */}
      <header style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 24px',
        height:         '60px',
        background:     'var(--surface)',
        borderBottom:   '1px solid var(--border)',
        position:       'sticky',
        top:            0,
        zIndex:         100,
        gap:            '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: 'var(--font-serif)',
            color:      'var(--gold)',
            fontWeight: 700,
            fontSize:   '16px',
          }}>
            GOLDEN BITE
          </span>
          <span style={{ color: 'var(--border)' }}>|</span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge" style={{ fontSize: '11px' }}>
            {ROLE_LABEL[role] ?? role}
          </span>
          <span style={{ fontSize: '13px', color: 'var(--text)' }}>
            {profile?.displayName ?? 'Usuario'}
          </span>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{
              background:   'none',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding:      '6px 12px',
              color:        'var(--text-muted)',
              cursor:       'pointer',
              fontSize:     '13px',
            }}
          >
            <i className="bi bi-box-arrow-right" /> Salir
          </button>
        </div>
      </header>

      {/* Contenido */}
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {children}
      </div>
    </div>
  )
}