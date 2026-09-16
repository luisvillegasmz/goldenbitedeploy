import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <h2 className="footer__logo">GOLDEN BITE</h2>
          <p className="footer__tagline">Artisanal Bistro &amp; Fine Dining Experience</p>
        </div>

        <nav className="footer__nav">
          {['Menú', 'Reservas', 'Ubicaciones', 'Contacto', 'Privacidad', 'Términos'].map(item => (
            <Link key={item} to="#" className="footer__link">{item}</Link>
          ))}
        </nav>
      </div>

      <div className="footer__bottom container">
        <p>© 2025 Golden Bite Artisanal Bistro. Todos los derechos reservados.</p>
        <div className="footer__awards">
          <span>🍴 GUÍA MICHELIN 2024</span>
          <span>•</span>
          <span>DOS SOLES REPSOL</span>
        </div>
      </div>
    </footer>
  )
}