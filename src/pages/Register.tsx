import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import './Login.css'
import './Register.css'

interface FormData {
  name:       string
  email:      string
  phone:      string
  password:   string
  confirm:    string
  newsletter: boolean
  terms:      boolean
}

function getPasswordStrength(password: string): number {
  let score = 0
  if (password.length >= 8)           score++
  if (/[0-9!@#$%^&*]/.test(password)) score++
  if (password.length >= 12)          score++
  return score
}

export default function Register() {
  const navigate          = useNavigate()
  const { signInWithGoogle } = useAuth()

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', password: '', confirm: '',
    newsletter: false, terms: false,
  })
  const [showPass,    setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  const strength = getPasswordStrength(form.password)

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({
        ...prev,
        [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
      }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return }
    if (!form.terms)                    { setError('Debes aceptar los Términos de Servicio.'); return }
    if (form.password.length < 8)       { setError('La contraseña debe tener al menos 8 caracteres.'); return }

    setLoading(true)
    try {
      // 1. Crear usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)

      // 2. Actualizar el displayName en Auth
      await updateProfile(cred.user, { displayName: form.name })

      // 3. Crear documento en Firestore (colección 'usuarios')
      await setDoc(doc(db, 'usuarios', cred.user.uid), {
        displayName: form.name,
        email:       form.email,
        phone:       form.phone,
        role:        'cliente',
        points:      0,
        createdAt:   new Date().toLocaleDateString('es-CO', {
          day: 'numeric', month: 'long', year: 'numeric',
        }),
      })

      navigate('/')
    } catch (err: any) {
      if      (err.code === 'auth/email-already-in-use') setError('Ya existe una cuenta con ese correo.')
      else if (err.code === 'auth/weak-password')         setError('La contraseña es demasiado débil.')
      else if (err.code === 'auth/operation-not-allowed') setError('El registro por correo no está habilitado. Actívalo en Firebase Console → Authentication.')
      else {
        console.error(err)
        setError(`Error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err: any) {
      setError('Error al iniciar sesión con Google.')
    }
  }

  const strengthLabels = ['', 'Débil', 'Media', 'Alta']
  const strengthColors = ['', 'active-weak', 'active-medium', 'active-strong']

  return (
    <main className="auth-page">
      {/* ── LADO IZQUIERDO ── */}
      <div className="auth-left register-left">
        <div className="auth-left__bg register-left__bg" />
        <div className="auth-left__overlay" />
        <div className="auth-left__content">
          <span className="badge">
            <i className="bi bi-star" /> Golden Bite
          </span>
          <h1 className="auth-left__title">
            Crea tu cuenta y empieza a pedir.
          </h1>
          <p className="register-left__desc">
            Regístrate para hacer tus pedidos, ver tu historial
            y acumular puntos con cada compra.
          </p>
        </div>
      </div>

      {/* ── LADO DERECHO ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2 className="auth-title">Crear cuenta</h2>
          <p className="auth-subtitle">
            Completa el formulario para registrarte.
          </p>

          {/* Google */}
          <div className="auth-social">
            <button className="auth-social__btn" onClick={handleGoogle} type="button">
              <i className="bi bi-google" /> Continuar con Google
            </button>
          </div>

          <div className="auth-divider"><span>O con tu correo</span></div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">

            {/* Nombre */}
            <div className="auth-field">
              <label>Nombre completo</label>
              <div className="auth-field__input-wrap">
                <i className="bi bi-person auth-field__icon" />
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label>Correo electrónico</label>
              <div className="auth-field__input-wrap">
                <i className="bi bi-envelope auth-field__icon" />
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="auth-field">
              <label>Número de teléfono <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(opcional)</span></label>
              <div className="auth-field__input-wrap">
                <i className="bi bi-phone auth-field__icon" />
                <input
                  type="tel"
                  placeholder="300 123 4567"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
            </div>

            {/* Contraseñas */}
            <div className="auth-row">
              <div className="auth-field">
                <label>Contraseña</label>
                <div className="auth-field__input-wrap">
                  <i className="bi bi-lock auth-field__icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={form.password}
                    onChange={set('password')}
                    required
                  />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowPass(!showPass)}>
                    <i className={`bi bi-${showPass ? 'eye-slash' : 'eye'}`} />
                  </button>
                </div>
              </div>
              <div className="auth-field">
                <label>Confirmar contraseña</label>
                <div className="auth-field__input-wrap">
                  <i className="bi bi-lock auth-field__icon" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Repite la contraseña"
                    value={form.confirm}
                    onChange={set('confirm')}
                    required
                  />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowConfirm(!showConfirm)}>
                    <i className={`bi bi-${showConfirm ? 'eye-slash' : 'eye'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Indicador de fortaleza */}
            {form.password && (
              <div className="auth-strength">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Fortaleza
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--gold)' }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
                <div className="auth-strength__bar">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`auth-strength__segment ${strength >= i ? strengthColors[strength] : ''}`}
                    />
                  ))}
                </div>
                <div className="auth-strength__hints">
                  <span className={`auth-strength__hint ${form.password.length >= 8 ? 'ok' : ''}`}>
                    {form.password.length >= 8
                      ? <><i className="bi bi-check" /> Mínimo 8 caracteres</>
                      : <><i className="bi bi-circle" /> Mínimo 8 caracteres</>}
                  </span>
                  <span className={`auth-strength__hint ${/[0-9!@#$%^&*]/.test(form.password) ? 'ok' : ''}`}>
                    {/[0-9!@#$%^&*]/.test(form.password)
                      ? <><i className="bi bi-check" /> Un número o símbolo</>
                      : <><i className="bi bi-circle" /> Un número o símbolo</>}
                  </span>
                </div>
              </div>
            )}

            {/* Checkboxes */}
            <div className="auth-terms">
              <label className="auth-term-label">
                <input type="checkbox" checked={form.newsletter} onChange={set('newsletter')} />
                <span>Quiero recibir novedades y promociones de Golden Bite.</span>
              </label>
              <label className="auth-term-label">
                <input type="checkbox" checked={form.terms} onChange={set('terms')} required />
                <span>
                  He leído y acepto los <a href="#">Términos de Servicio</a> y la{' '}
                  <a href="#">Política de Privacidad</a> de Golden Bite.
                </span>
              </label>
            </div>

            <button type="submit" className="btn-gold auth-submit" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta →'}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </main>
  )
}