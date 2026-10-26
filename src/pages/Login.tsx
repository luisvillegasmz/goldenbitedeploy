import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth, getDashboardRoute } from '../context/AuthContext'
import type { UserProfile } from '../context/AuthContext'
import './Login.css'

export default function Login() {
  const navigate             = useNavigate()

  const { signInWithGoogle } = useAuth()



  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  // Redirige al dashboard según el rol del usuario
  const redirectByRole = async (uid: string) => {
    try {
      const snap    = await getDoc(doc(db, 'usuarios', uid))
      const profile = snap.data() as UserProfile | undefined
      const dest    = profile?.role ? getDashboardRoute(profile.role) : '/'
      navigate(dest, { replace: true })
    } catch {
      navigate('/', { replace: true })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      await redirectByRole(result.user.uid)
    } catch (err: any) {
      console.error('Login error:', err.code, err.message)
      if (['auth/user-not-found', 'auth/wrong-password', 'auth/invalid-credential'].includes(err.code)) {
        setError('Correo o contraseña incorrectos.')
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Espera unos minutos.')
      } else if (err.code === 'auth/user-disabled') {
        setError('Esta cuenta ha sido deshabilitada.')
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('El inicio de sesión por correo no está habilitado. Actívalo en Firebase Console.')
      } else {
        setError(`Error: ${err.code ?? err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithGoogle()
      // signInWithGoogle retorna el user — redirigimos por rol
      if (result?.uid) {
        await redirectByRole(result.uid)
      } else {
        navigate('/', { replace: true })
      }
    } catch (err: any) {
      console.error('Google login error:', err.code, err.message)
      setError('Error al iniciar sesión con Google.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      {/* ── LADO IZQUIERDO ── */}
      <div className="auth-left">
        <div className="auth-left__bg" />
        <div className="auth-left__overlay" />
        <div className="auth-left__content">
          <span className="badge">
            <i className="bi bi-star" /> Golden Bite
          </span>
          <h1 className="auth-left__title">
            Bienvenido de nuevo.
          </h1>
          <p className="auth-left__quote">
            Inicia sesión para ver tus pedidos y hacer nuevos.
          </p>
        </div>
      </div>

      {/* ── LADO DERECHO ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-subtitle">
            Ingresa con tu correo o con Google.
          </p>

          {/* Google */}
          <div className="auth-social">
            <button className="auth-social__btn" onClick={handleGoogle} disabled={loading} type="button">
              <i className="bi bi-google" /> Continuar con Google
            </button>
          </div>

          <div className="auth-divider">
            <span>O ingresa con tu correo</span>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label>Correo electrónico</label>
              <div className="auth-field__input-wrap">
                <i className="bi bi-envelope auth-field__icon" />
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Contraseña</label>
              <div className="auth-field__input-wrap">
                <i className="bi bi-lock auth-field__icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-field__toggle"
                  onClick={() => setShowPass(!showPass)}
                >
                  <i className={`bi bi-${showPass ? 'eye-slash' : 'eye'}`} />
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
                <span>Recordarme</span>
              </label>
              <Link to="/recuperar" className="auth-forgot">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button type="submit" className="btn-gold auth-submit" disabled={loading}>
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión →'}
            </button>
          </form>

          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </div>
      </div>
    </main>
  )
}