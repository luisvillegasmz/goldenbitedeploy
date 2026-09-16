// REEMPLAZA tu archivo: src/components/Navbar.tsx
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import './Navbar.css'

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const { count } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const links = [
    { to: '/menu',        label: 'Menú' },
    { to: '/reservas',    label: 'Reservas' },
    { to: '/ubicaciones', label: 'Ubicaciones' },
    { to: '/contacto',    label: 'Contacto' },
  ]

  const handleLogout = async () => {
    setUserMenuOpen(false)
    await logout()
    navigate('/login')
  }

  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || ''

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">GOLDEN BITE</Link>

        {/* Links centrales */}
        <nav className="navbar__links">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`navbar__link ${location.pathname === l.to ? 'navbar__link--active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Acciones derecha */}
        <div className="navbar__actions">
          <span className="navbar__lang">ES</span>

          <Link to="/carrito" className="navbar__cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className="navbar__cart-badge">{count}</span>}
          </Link>

          {/* Usuario autenticado */}
          {user ? (
            <div className="navbar__user-wrap">
              <button
                className="navbar__user-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user.photoURL
                  ? <img src={user.photoURL} alt={displayName} className="navbar__user-avatar" />
                  : <span className="navbar__user-initial">{displayName.charAt(0).toUpperCase()}</span>
                }
                <span className="navbar__user-name">{displayName.split(' ')[0]}</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="var(--text-muted)">
                  <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none"/>
                </svg>
              </button>

              {userMenuOpen && (
                <div className="navbar__user-menu">
                  <Link to="/perfil" className="navbar__user-menu-item" onClick={() => setUserMenuOpen(false)}>
                    👤 Mi Perfil
                  </Link>
                  <Link to="/perfil" className="navbar__user-menu-item" onClick={() => setUserMenuOpen(false)}>
                    🧾 Mis Pedidos
                  </Link>
                  <Link to="/perfil" className="navbar__user-menu-item" onClick={() => setUserMenuOpen(false)}>
                    ⭐ Membresía
                  </Link>
                  <div className="navbar__user-menu-divider" />
                  <button className="navbar__user-menu-item navbar__user-menu-logout" onClick={handleLogout}>
                    Cerrar Sesión →
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__icon" title="Iniciar sesión">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>
          )}

          <Link to="/reservas" className="btn-gold navbar__reservar">Reservar</Link>
        </div>
      </div>
    </header>
  )
}