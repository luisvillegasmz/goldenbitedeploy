import { Link } from 'react-router-dom'
import './Footer.css'

const links = [
  { to: '/menu',       label: 'Menú' },
  { to: '/reservas',   label: 'Reservas' },
  { to: '/ubicaciones',label: 'Ubicaciones' },
  { to: '/contacto',   label: 'Contacto' },
  { to: '#',           label: 'Privacidad' },
  { to: '#',           label: 'Términos' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <h2 className="footer__logo">GOLDEN BITE</h2>
          <p className="footer__tagline">Restaurante & Domicilios — Medellín y Bogotá</p>
        </div>

        <nav className="footer__nav">
          {links.map(item => (
            <Link key={item.label} to={item.to} className="footer__link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="footer__bottom container">
        <p>© {new Date().getFullYear()} Golden Bite. Todos los derechos reservados.</p>
        <div className="footer__social">
          <a href="#" title="Instagram"><i className="bi bi-instagram" /></a>
          <a href="#" title="Facebook"><i className="bi bi-facebook" /></a>
          <a href="#" title="WhatsApp"><i className="bi bi-whatsapp" /></a>
        </div>
      </div>
    </footer>
  )
}