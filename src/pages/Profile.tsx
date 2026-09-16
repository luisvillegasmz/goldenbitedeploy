import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { doc, updateDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

interface Order {
  id: string
  code: string
  total: number
  status: string
  createdAt: any
  items: any[]
}

type Tab = 'perfil' | 'pedidos' | 'membresia' | 'seguridad'

export default function Profile() {
  const navigate = useNavigate()
  const { user, profile, logout, refreshProfile } = useAuth()
  const [tab, setTab]             = useState<Tab>('perfil')
  const [saving, setSaving]       = useState(false)
  const [success, setSuccess]     = useState('')
  const [error, setError]         = useState('')
  const [orders, setOrders]       = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  // Formulario de datos personales
  const [form, setForm] = useState({
    name: profile?.name || user?.displayName || '',
    phone: profile?.phone || '',
    newsletter: profile?.newsletter ?? true,
  })

  // Formulario de contraseña
  const [passForm, setPassForm] = useState({
    current: '',
    newPass: '',
    confirm: '',
  })

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || user?.displayName || '',
        phone: profile.phone || '',
        newsletter: profile.newsletter ?? true,
      })
    }
  }, [profile, user])

  useEffect(() => {
    if (tab === 'pedidos') fetchOrders()
  }, [tab])

  const fetchOrders = async () => {
    if (!user) return
    setLoadingOrders(true)
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(q)
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
    } catch (e) {
      console.error('Error fetching orders:', e)
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return
    setError('')
    setSuccess('')
    setSaving(true)
    try {
      await updateProfile(user, { displayName: form.name })
      await updateDoc(doc(db, 'users', user.uid), {
        name: form.name,
        phone: form.phone,
        newsletter: form.newsletter,
      })
      await refreshProfile()
      setSuccess('Perfil actualizado correctamente.')
    } catch (e) {
      setError('Error al actualizar el perfil.')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!user || !user.email) return
    setError('')
    setSuccess('')
    if (passForm.newPass !== passForm.confirm) {
      setError('Las contraseñas nuevas no coinciden.')
      return
    }
    if (passForm.newPass.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    setSaving(true)
    try {
      const credential = EmailAuthProvider.credential(user.email, passForm.current)
      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, passForm.newPass)
      setSuccess('Contraseña actualizada correctamente.')
      setPassForm({ current: '', newPass: '', confirm: '' })
    } catch (e: any) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        setError('La contraseña actual es incorrecta.')
      } else {
        setError('Error al cambiar la contraseña. Intenta de nuevo.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || 'Miembro'
  const membershipLabel = profile?.membership === 'noir' ? 'Club Noir' : profile?.membership === 'gold' ? 'Club Oro' : 'Standard'

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'perfil',     label: 'Mi Perfil',      icon: '👤' },
    { id: 'pedidos',    label: 'Mis Pedidos',     icon: '🧾' },
    { id: 'membresia',  label: 'Membresía',       icon: '⭐' },
    { id: 'seguridad',  label: 'Seguridad',       icon: '🔒' },
  ]

  return (
    <main className="profile-page">
      <div className="container">

        {/* ── HERO ── */}
        <div className="profile-hero">
          <div className="profile-avatar">
            {user?.photoURL
              ? <img src={user.photoURL} alt={displayName} className="profile-avatar__img" />
              : <span className="profile-avatar__initials">{displayName.charAt(0).toUpperCase()}</span>
            }
          </div>
          <div className="profile-hero__info">
            <span className="badge">⭐ {membershipLabel}</span>
            <h1 className="profile-hero__name">{displayName}</h1>
            <p className="profile-hero__email">{user?.email}</p>
            <div className="profile-hero__stats">
              <div className="profile-stat">
                <span className="profile-stat__value">{profile?.points ?? 0}</span>
                <span className="profile-stat__label">Puntos Gourmet</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__value">{orders.length || '—'}</span>
                <span className="profile-stat__label">Pedidos</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat__value">{membershipLabel}</span>
                <span className="profile-stat__label">Nivel</span>
              </div>
            </div>
          </div>
          <button className="profile-logout-btn" onClick={handleLogout}>
            Cerrar Sesión →
          </button>
        </div>

        {/* ── TABS + CONTENIDO ── */}
        <div className="profile-layout">

          {/* Sidebar nav */}
          <aside className="profile-sidebar">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`profile-tab-btn ${tab === t.id ? 'active' : ''}`}
                onClick={() => { setTab(t.id); setSuccess(''); setError('') }}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
            <div className="profile-sidebar__divider" />
            <Link to="/menu" className="profile-tab-btn">
              <span>🍽</span> Explorar Menú
            </Link>
            <Link to="/carrito" className="profile-tab-btn">
              <span>🛒</span> Ver Carrito
            </Link>
          </aside>

          {/* Contenido principal */}
          <div className="profile-content">

            {/* Mensajes */}
            {success && <div className="auth-success profile-alert">{success}</div>}
            {error   && <div className="auth-error   profile-alert">{error}</div>}

            {/* ── TAB: PERFIL ── */}
            {tab === 'perfil' && (
              <div className="profile-section">
                <div className="profile-section__header">
                  <h2 className="profile-section__title">Datos Personales</h2>
                  <span className="badge">Cuenta Golden Bite</span>
                </div>

                <div className="profile-form">
                  <div className="profile-field">
                    <label>Nombre Completo</label>
                    <div className="auth-field__input-wrap">
                      <span className="auth-field__icon">👤</span>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Tu nombre completo"
                      />
                    </div>
                  </div>

                  <div className="profile-field">
                    <label>Correo Electrónico</label>
                    <div className="auth-field__input-wrap">
                      <span className="auth-field__icon">✉</span>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        style={{ opacity: 0.5, cursor: 'not-allowed' }}
                      />
                    </div>
                    <span className="profile-field__hint">El correo no puede modificarse por seguridad.</span>
                  </div>

                  <div className="profile-field">
                    <label>Teléfono de Contacto</label>
                    <div className="auth-field__input-wrap">
                      <span className="auth-field__icon">📱</span>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                        placeholder="612 345 678"
                      />
                    </div>
                  </div>

                  <label className="profile-checkbox">
                    <input
                      type="checkbox"
                      checked={form.newsletter}
                      onChange={e => setForm(p => ({ ...p, newsletter: e.target.checked }))}
                    />
                    <span>Recibir invitaciones a catas privadas y novedades de temporada</span>
                  </label>

                  <button className="btn-gold profile-save-btn" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Cambios →'}
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB: PEDIDOS ── */}
            {tab === 'pedidos' && (
              <div className="profile-section">
                <div className="profile-section__header">
                  <h2 className="profile-section__title">Historial de Pedidos</h2>
                  <span className="badge">{orders.length} registros</span>
                </div>

                {loadingOrders ? (
                  <p className="profile-loading">Cargando pedidos...</p>
                ) : orders.length === 0 ? (
                  <div className="profile-empty">
                    <span>🍽</span>
                    <h3>Aún no tienes pedidos</h3>
                    <p>Explora nuestra carta y realiza tu primera experiencia gastronómica.</p>
                    <Link to="/menu" className="btn-gold">Explorar Menú</Link>
                  </div>
                ) : (
                  <div className="profile-orders">
                    {orders.map(order => (
                      <div key={order.id} className="profile-order-card">
                        <div className="profile-order-card__top">
                          <div>
                            <p className="profile-order-card__code">#{order.code}</p>
                            <p className="profile-order-card__date">
                              {order.createdAt?.toDate
                                ? order.createdAt.toDate().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                : 'Fecha no disponible'}
                            </p>
                          </div>
                          <div className="profile-order-card__right">
                            <span className={`profile-order-status ${order.status}`}>
                              {order.status === 'delivered' ? '✓ Entregado'
                                : order.status === 'processing' ? '⏳ En proceso'
                                : order.status === 'cancelled' ? '✗ Cancelado'
                                : order.status || 'Completado'}
                            </span>
                            <span className="profile-order-card__total">{(order.total || 0).toFixed(2)} €</span>
                          </div>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div className="profile-order-card__items">
                            {order.items.slice(0, 3).map((item: any, i: number) => (
                              <span key={i} className="profile-order-card__item">{item.name}</span>
                            ))}
                            {order.items.length > 3 && (
                              <span className="profile-order-card__item">+{order.items.length - 3} más</span>
                            )}
                          </div>
                        )}
                        <div className="profile-order-card__actions">
                          <Link to="/seguimiento" state={{ orderId: order.id }} className="btn-outline" style={{ fontSize: '12px', padding: '8px 16px' }}>
                            Ver Seguimiento
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: MEMBRESÍA ── */}
            {tab === 'membresia' && (
              <div className="profile-section">
                <div className="profile-section__header">
                  <h2 className="profile-section__title">Tu Membresía</h2>
                  <span className="badge">⭐ {membershipLabel}</span>
                </div>

                <div className="profile-membership">
                  <div className="profile-membership__card">
                    <div className="profile-membership__card-top">
                      <span className="profile-membership__tier">{membershipLabel}</span>
                      <span className="profile-membership__logo">GOLDEN BITE</span>
                    </div>
                    <p className="profile-membership__name">{displayName}</p>
                    <div className="profile-membership__card-bottom">
                      <div>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>PUNTOS ACUMULADOS</p>
                        <p style={{ fontSize: '22px', fontFamily: 'var(--font-serif)', color: '#fff' }}>{profile?.points ?? 0}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginBottom: '2px' }}>MIEMBRO DESDE</p>
                        <p style={{ fontSize: '13px', color: '#fff' }}>
                          {profile?.createdAt?.toDate
                            ? profile.createdAt.toDate().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
                            : '2025'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="profile-membership__benefits">
                    <h3 className="profile-membership__benefits-title">Beneficios Actuales</h3>
                    {[
                      { icon: '🍷', label: 'Acceso a catas privadas bimestrales' },
                      { icon: '🥂', label: 'Prioridad en reservas de mesa' },
                      { icon: '🎁', label: '1 punto por cada euro gastado' },
                      { icon: '📦', label: 'Envío gourmet con descuento del 10%' },
                    ].map(b => (
                      <div key={b.label} className="profile-benefit">
                        <span>{b.icon}</span>
                        <p>{b.label}</p>
                      </div>
                    ))}
                  </div>

                  {profile?.membership !== 'noir' && (
                    <div className="profile-membership__upgrade">
                      <h3>Escala a Club Noir</h3>
                      <p>Disfruta de acceso a mesas secretas, sommelier personal y degustaciones de trufa blanca.</p>
                      <a href="mailto:concierge@goldenbite.com" className="btn-gold" style={{ display: 'inline-block', marginTop: '16px' }}>
                        Solicitar Upgrade →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB: SEGURIDAD ── */}
            {tab === 'seguridad' && (
              <div className="profile-section">
                <div className="profile-section__header">
                  <h2 className="profile-section__title">Seguridad de la Cuenta</h2>
                  <span className="badge">🔒 Protección 256-bit</span>
                </div>

                {user?.providerData[0]?.providerId === 'google.com' ? (
                  <div className="profile-google-auth">
                    <span>🔗</span>
                    <div>
                      <p className="profile-google-auth__title">Cuenta vinculada con Google</p>
                      <p className="profile-google-auth__desc">
                        Tu autenticación está gestionada por Google. Para cambiar la contraseña,
                        visita la configuración de seguridad de tu cuenta de Google.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="profile-form">
                    <div className="profile-field">
                      <label>Contraseña Actual</label>
                      <div className="auth-field__input-wrap">
                        <span className="auth-field__icon">🔒</span>
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={passForm.current}
                          onChange={e => setPassForm(p => ({ ...p, current: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="profile-field">
                      <label>Nueva Contraseña</label>
                      <div className="auth-field__input-wrap">
                        <span className="auth-field__icon">🔑</span>
                        <input
                          type="password"
                          placeholder="Mínimo 8 caracteres"
                          value={passForm.newPass}
                          onChange={e => setPassForm(p => ({ ...p, newPass: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="profile-field">
                      <label>Confirmar Nueva Contraseña</label>
                      <div className="auth-field__input-wrap">
                        <span className="auth-field__icon">🔑</span>
                        <input
                          type="password"
                          placeholder="Repite la nueva contraseña"
                          value={passForm.confirm}
                          onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))}
                        />
                      </div>
                    </div>
                    <button
                      className="btn-gold profile-save-btn"
                      onClick={handleChangePassword}
                      disabled={saving}
                    >
                      {saving ? 'Actualizando...' : 'Cambiar Contraseña →'}
                    </button>
                  </div>
                )}

                <div className="profile-danger-zone">
                  <h3 className="profile-danger-zone__title">Zona de Peligro</h3>
                  <p>Si deseas eliminar tu cuenta, contacta a nuestro equipo de concierge para proceder de forma segura.</p>
                  <a href="mailto:concierge@goldenbite.com" className="btn-outline" style={{ fontSize: '12px', padding: '10px 20px', display: 'inline-block', marginTop: '12px' }}>
                    Contactar Concierge
                  </a>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}