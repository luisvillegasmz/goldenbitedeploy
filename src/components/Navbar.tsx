import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const links = [
  { to: '/menu',        label: 'Menú' },
  { to: '/reservas',    label: 'Reservas' },
  { to: '/ubicaciones', label: 'Ubicaciones' },
  { to: '/contacto',    label: 'Contacto' },
]

export default function Navbar() {
  const { pathname }    = useLocation()
  const navigate        = useNavigate()
  const { count }       = useCart()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

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
              className={`navbar__link ${pathname === l.to ? 'navbar__link--active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Acciones derecha */}
        <div className="navbar__actions">
          <span className="navbar__lang">ES</span>

          {/* Carrito */}
          <Link to="/carrito" className="navbar__cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span className="navbar__cart-badge">{count}</span>}
          </Link>

          {/* Usuario: si está logueado muestra perfil y logout, si no muestra login */}
          {user ? (
            <div className="navbar__user-menu">
              <Link to="/perfil" className="navbar__user-btn" title={user.displayName || user.email || 'Mi perfil'}>
                <div className="navbar__user-avatar">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              </Link>
              <button className="navbar__logout" onClick={handleLogout} title="Cerrar sesión">
                ⎋
              </button>
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