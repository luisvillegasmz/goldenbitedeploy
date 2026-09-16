import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import './Login.css'
import './Register.css'

interface FormData {
  name: string
  email: string
  phone: string
  password: string
  confirm: string
  newsletter: boolean
  terms: boolean
}

function getPasswordStrength(password: string): number {
  let score = 0
  if (password.length >= 8) score++
  if (/[0-9!@#$%^&*]/.test(password)) score++
  if (password.length >= 12) score++
  return score
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', password: '', confirm: '',
    newsletter: true, terms: false,
  })
  const [showPass, setShowPass]     = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  const strength = getPasswordStrength(form.password)

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return }
    if (!form.terms) { setError('Debes aceptar los Términos de Servicio.'); return }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return }

    setLoading(true)
    try {
      // 1. Crear usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, form.email, form.password)

      // 2. Guardar nombre en el perfil de Auth
      await updateProfile(cred.user, { displayName: form.name })

      // 3. Guardar datos extra en Firestore
      await setDoc(doc(db, 'users', cred.user.uid), {
        name: form.name,
        email: form.email,
        phone: form.phone,
        newsletter: form.newsletter,
        membership: 'standard',
        points: 0,
        createdAt: new Date(),
      })

      navigate('/')
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Ya existe una cuenta con ese correo.')
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es demasiado débil.')
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const strengthLabels = ['', 'Débil', 'Media', 'Alta (Recomendada)']
  const strengthColors = ['', 'active-weak', 'active-medium', 'active-strong']

  return (
    <main className="auth-page">
      {/* ── LADO IZQUIERDO ── */}
      <div className="auth-left register-left">
        <div className="auth-left__bg register-left__bg" />
        <div className="auth-left__overlay" />
        <div className="auth-left__content">
          <span className="badge">★ Privilegios Exclusivos</span>
          <h1 className="auth-left__title">
            Una mesa reservada para los sentidos más audaces.
          </h1>
          <p className="register-left__desc">
            Forme parte de nuestra cofradía gastronómica. Los miembros de Golden Bite disfrutan
            de acceso preferente a temporadas de trufa blanca, maridajes de añadas irrepetibles
            y mesas secretas.
          </p>
          <div className="register-feature-card">
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80"
              alt="Cava Privada"
              className="register-feature-card__img"
            />
            <div className="register-feature-card__body">
              <h3>Cava Privada</h3>
              <span className="badge">Nivel Noir</span>
              <p>Degustaciones bimestrales con sumiller</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── LADO DERECHO ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <p className="section-label" style={{ marginBottom: '8px' }}>Membresía Culinaria</p>
          <h2 className="auth-title">Únete a Golden Bite Club</h2>
          <p className="auth-subtitle">
            Acceso a mesas prioritarias, eventos de cata privada y maridajes exclusivos.
          </p>

          <div className="auth-social">
            <button className="auth-social__btn"><span>🍎</span> Continuar con Apple</button>
            <button className="auth-social__btn"><span>G</span> Continuar con Google</button>
          </div>

          <div className="auth-divider"><span>O con tu correo electrónico</span></div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Nombre */}
            <div className="auth-field">
              <label>Nombre Completo</label>
              <div className="auth-field__input-wrap">
                <span className="auth-field__icon">👤</span>
                <input type="text" placeholder="Ej. Alejandro Valdés" value={form.name} onChange={set('name')} required />
              </div>
            </div>

            {/* Email */}
            <div className="auth-field">
              <label>Correo Electrónico Institucional o Personal</label>
              <div className="auth-field__input-wrap">
                <span className="auth-field__icon">✉</span>
                <input type="email" placeholder="valdes@gourmet.com" value={form.email} onChange={set('email')} required />
              </div>
            </div>

            {/* Teléfono */}
            <div className="auth-field">
              <label>Número de Teléfono</label>
              <div className="auth-field__input-wrap">
                <span className="auth-field__icon">📱</span>
                <input type="tel" placeholder="612 345 678" value={form.phone} onChange={set('phone')} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                Utilizado exclusivamente para confirmación de reservas de mesa.
              </span>
            </div>

            {/* Contraseñas */}
            <div className="auth-row">
              <div className="auth-field">
                <label>Contraseña Segura</label>
                <div className="auth-field__input-wrap">
                  <span className="auth-field__icon">🔒</span>
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={form.password}
                    onChange={set('password')}
                    required
                  />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="auth-field">
                <label>Confirmar Contraseña</label>
                <div className="auth-field__input-wrap">
                  <span className="auth-field__icon">🔒</span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={form.confirm}
                    onChange={set('confirm')}
                    required
                  />
                  <button type="button" className="auth-field__toggle" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
            </div>

            {/* Indicador de fortaleza */}
            {form.password && (
              <div className="auth-strength">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
                    Fortaleza de Contraseña
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--gold)' }}>{strengthLabels[strength]}</span>
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
                    {form.password.length >= 8 ? '✓' : '○'} Mínimo 8 caracteres
                  </span>
                  <span className={`auth-strength__hint ${/[0-9!@#$%^&*]/.test(form.password) ? 'ok' : ''}`}>
                    {/[0-9!@#$%^&*]/.test(form.password) ? '✓' : '○'} Un número o símbolo
                  </span>
                </div>
              </div>
            )}

            {/* Checkboxes */}
            <div className="auth-terms">
              <label className="auth-term-label">
                <input type="checkbox" checked={form.newsletter} onChange={set('newsletter')} />
                <span>Deseo recibir invitaciones a catas privadas y novedades culinarias de la temporada.</span>
              </label>
              <label className="auth-term-label">
                <input type="checkbox" checked={form.terms} onChange={set('terms')} required />
                <span>
                  He leído y acepto los <a href="#">Términos de Servicio</a> y la{' '}
                  <a href="#">Política de Privacidad</a> de Golden Bite Bistro.
                </span>
              </label>
            </div>

            <button type="submit" className="btn-gold auth-submit" disabled={loading}>
              {loading ? 'Creando membresía...' : 'Crear Mi Membresía →'}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes una cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </main>
  )
}