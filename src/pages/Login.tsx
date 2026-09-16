// REEMPLAZA tu archivo: src/pages/Login.tsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signInWithGoogle } = useAuth()

  // Redirigir de vuelta si venía de una ruta protegida
  const from = (location.state as any)?.from?.pathname || '/'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera unos minutos.')
      } else {
        setError('Error al iniciar sesión. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate(from, { replace: true })
    } catch (err: any) {
      setError('Error al iniciar sesión con Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      {/* ── LADO IZQUIERDO: imagen + frase ── */}
      <div className="auth-left">
        <div className="auth-left__bg" />
        <div className="auth-left__overlay" />
        <div className="auth-left__content">
          <span className="badge">⊙ Club Privé &amp; Bistro</span>
          <h1 className="auth-left__title">
            La elegancia de la alta cocina en su mesa.
          </h1>
          <blockquote className="auth-left__quote">
            <p>«La gastronomía es la alquimia que convierte un instante en memoria eterna.»</p>
            <cite>Maitre &amp; Sommelier Principal</cite>
          </blockquote>
        </div>
      </div>

      {/* ── LADO DERECHO: formulario ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <p className="section-label" style={{ marginBottom: '8px' }}>Acceso Exclusivo</p>
          <h2 className="auth-title">Bienvenido de Nuevo</h2>
          <p className="auth-subtitle">
            Accede a tus reservas, pedidos gourmet y beneficios de socio.
          </p>

          {/* Botones sociales */}
          <div className="auth-social">
            <button className="auth-social__btn" onClick={handleGoogle} disabled={loading}>
              <span>G</span> Continuar con Google
            </button>
          </div>

          <div className="auth-divider">
            <span>O ingresa con tus credenciales</span>
          </div>

          {/* Error global */}
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Correo Electrónico</label>
              <div className="auth-field__input-wrap">
                <span className="auth-field__icon">✉</span>
                <input
                  type="email"
                  placeholder="socio@goldenbite.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Contraseña</label>
              <div className="auth-field__input-wrap">
                <span className="auth-field__icon">🔒</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-field__toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div className="auth-remember-row">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span>Recordar en este dispositivo</span>
              </label>
              <Link to="/recuperar" className="auth-forgot">¿Olvidaste tu contraseña?</Link>
            </div>

            <button type="submit" className="btn-gold auth-submit" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión →'}
            </button>
          </form>

          <div className="auth-concierge">
            <span>🛎</span>
            <p>¿Problemas para acceder? <a href="mailto:concierge@goldenbite.com">Contactar al Concierge</a></p>
          </div>

          <p className="auth-switch">
            ¿Aún no eres miembro?{' '}
            <Link to="/registro">Crear una Cuenta</Link>
          </p>
        </div>
      </div>
    </main>
  )
}