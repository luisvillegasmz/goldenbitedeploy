import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './AdminLayout.css'

const nav = [
  { to: '/admin',           icon: '⊞', label: 'Dashboard' },
  { to: '/admin/reservas',  icon: '📅', label: 'Reservations' },
  { to: '/admin/menu',      icon: '✕', label: 'Culinary Menus' },
  { to: '/admin/bodega',    icon: '🍷', label: 'Wine Cellar' },
  { to: '/admin/usuarios',  icon: '👥', label: 'Staff & Tables' },
  { to: '/admin/analytics', icon: '📊', label: 'Analytics' },
]
const bottom = [
  { to: '/admin/settings', icon: '⚙', label: 'Location Settings' },
  { to: '/admin/audit',    icon: '🕐', label: 'Audit Log' },
]

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
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

        <div className="admin-sidebar__user">
          <div className="admin-sidebar__user-avatar">JM</div>
          <div>
            <p className="admin-sidebar__user-name">Jean-Luc Moreau</p>
            <p className="admin-sidebar__user-role">Grand Maître D'</p>
          </div>
          <span className="admin-sidebar__user-dot" />
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