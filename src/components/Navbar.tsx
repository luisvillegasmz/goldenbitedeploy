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

          {/* Carrito */}
          <Link to="/carrito" className="navbar__cart">
            <i className="bi bi-bag" style={{ fontSize: '20px' }} />
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
              <i className="bi bi-person" style={{ fontSize: '20px' }} />
            </Link>
          )}

          <Link to="/reservas" className="btn-gold navbar__reservar">Reservar</Link>
        </div>
      </div>
    </header>
  )
}