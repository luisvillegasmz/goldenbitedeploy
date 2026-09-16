import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'
import './Login.css'
import './ForgotPassword.css'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [sent, setSent]       = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Firebase envía el correo de recuperación automáticamente
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setError('No encontramos una cuenta con ese correo.')
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
        <div className="forgot-icon">🔑</div>

        <p className="section-label" style={{ textAlign: 'center', marginBottom: '8px' }}>
          Acceso Exclusivo
        </p>
        <h1 className="forgot-title">Recuperar Contraseña</h1>
        <p className="forgot-desc">
          Introduce el correo electrónico asociado a tu cuenta o membresía.
          Te enviaremos un enlace de restablecimiento seguro válido por 15 minutos.
        </p>

        {/* Estado: enviado */}
        {sent ? (
          <div className="auth-success" style={{ textAlign: 'center' }}>
            ✓ Enlace enviado a <strong>{email}</strong>. Revisa tu bandeja de entrada.
          </div>
        ) : (
          <>
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Correo Electrónico</label>
                  <span style={{ fontSize: '10px', color: 'var(--gold)', letterSpacing: '0.08em' }}>REQUERIDO</span>
                </div>
                <div className="auth-field__input-wrap">
                  <span className="auth-field__icon">✉</span>
                  <input
                    type="email"
                    placeholder="ejemplo@goldenbite.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-gold auth-submit" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar Enlace de Recuperación →'}
              </button>
            </form>
          </>
        )}

        {/* Asistencia concierge */}
        <div className="forgot-concierge">
          <span className="forgot-concierge__dot">·</span>
          <div>
            <p className="forgot-concierge__label">Asistencia de Concierge</p>
            <p className="forgot-concierge__text">
              ¿No recibes el correo? Revisa tu bandeja de spam o solicita asistencia
              inmediata a{' '}
              <a href="mailto:concierge@goldenbite.com">concierge@goldenbite.com</a>.
            </p>
          </div>
        </div>

        <Link to="/login" className="forgot-back">← Volver a Iniciar Sesión</Link>

        <div className="forgot-footer">
          <span>🔒 Cifrado de 256 Bits</span>
          <span>•</span>
          <span>🛡 Privacidad Gourmet</span>
        </div>
      </div>
    </main>
  )
}