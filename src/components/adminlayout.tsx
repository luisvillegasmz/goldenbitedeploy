import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './adminlayout.css'

const nav = [
  { to: '/admin',             icon: '⊞', label: 'Dashboard' },
  { to: '/admin/menu',        icon: '🍽', label: 'Menú' },
  { to: '/admin/promociones', icon: '🏷', label: 'Promociones' },
  { to: '/admin/usuarios',    icon: '👥', label: 'Usuarios' },
  { to: '/admin/analytics',   icon: '📊', label: 'Analytics' },
]
const bottom = [
  { to: '/', icon: '↩', label: 'Volver al Sitio' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname }      = useLocation()
  const navigate          = useNavigate()
  const { user, profile, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Iniciales para el avatar (ej: "Luis García" → "LG")
  const initials = (profile?.displayName ?? user?.email ?? 'Admin')
    .split(' ')
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')

  const isActive = (p: string) =>
    p === '/admin' ? pathname === p : pathname.startsWith(p)

  return (
    <div className="admin-shell">
      {/* ── SIDEBAR ── */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-icon">🍴</div>
          <div>
            <p className="admin-sidebar__brand-name">GOLDEN BITE</p>
            <p className="admin-sidebar__brand-sub">Haute Cuisine Backoffice</p>
          </div>
        </div>

        <Link to="/admin" className="admin-sidebar__new-btn">
          + New Reservation
        </Link>

        <nav className="admin-sidebar__nav">
          {nav.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-sidebar__link ${isActive(item.to) ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__divider" />

        <nav className="admin-sidebar__nav">
          {bottom.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-sidebar__link ${isActive(item.to) ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        // Después — datos reales + botón de logout:
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__user-avatar">{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="admin-sidebar__user-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.displayName ?? user?.email ?? 'Admin'}
            </p>
            <p className="admin-sidebar__user-role">
              Nivel {profile?.role ?? '—'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              fontSize: '16px',
              padding: '4px',
              flexShrink: 0,
            }}
          >
            ⎋
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__cities">
            {['Madrid', 'Barcelona', 'CDMX'].map((c, i) => (
              <button
                key={c}
                className={`admin-topbar__city ${i === 0 ? 'active' : ''}`}
              >
                {c}
              </button>
            ))}
            <span className="admin-topbar__system">● System Active</span>
          </div>
          <div className="admin-topbar__right">
            <button className="admin-topbar__emergency">🚨 Emergency Hold</button>
            <button className="admin-topbar__icon">🔔</button>
            <button className="admin-topbar__icon">👤</button>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}