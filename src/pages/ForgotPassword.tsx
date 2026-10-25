import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import './Login.css'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [sent,    setSent]    = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      // Firebase no revela si el correo existe o no (seguridad)
      // Solo fallará por errores de red o correo mal formado
      if (err.code === 'auth/invalid-email') {
        setError('El correo ingresado no tiene un formato válido.')
      } else {
        setError('Error al enviar el correo. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="forgot-page">
      <div className="forgot-card">

        {/* Ícono */}
        <div className="forgot-icon">
          <i className="bi bi-lock" />
        </div>

        <h1 className="forgot-title">Recuperar contraseña</h1>
        <p className="forgot-desc">
          Ingresa el correo de tu cuenta y te enviaremos un enlace
          para restablecer tu contraseña.
        </p>

        {sent ? (
          <div className="auth-success" style={{ textAlign: 'center' }}>
            <i className="bi bi-check-circle" style={{ fontSize: '20px', display: 'block', marginBottom: '8px' }} />
            Enviamos un enlace a <strong>{email}</strong>.
            <br />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'block' }}>
              Revisa tu bandeja de entrada y también la carpeta de spam.
            </span>
          </div>
        ) : (
          <>
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

              <button type="submit" className="btn-gold auth-submit" disabled={loading}>
                {loading
                  ? 'Enviando...'
                  : <><i className="bi bi-send" /> Enviar enlace de recuperación</>}
              </button>
            </form>
          </>
        )}

        <div className="forgot-concierge">
          <i className="bi bi-info-circle" />
          <p className="forgot-concierge__text">
            ¿No recibes el correo? Revisa la carpeta de spam o escríbenos a{' '}
            <a href="mailto:soporte@goldenbite.com">soporte@goldenbite.com</a>.
          </p>
        </div>

        <Link to="/login" className="forgot-back">
          <i className="bi bi-arrow-left" /> Volver a iniciar sesión
        </Link>
      </div>
    </main>
  )
}