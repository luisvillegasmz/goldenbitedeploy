import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { formatCOP } from '../utils/format'
import type { Order } from '../types/order'
import { STATUS_LABEL, STATUS_COLOR } from '../types/order'
import './Profile.css'

const tabs = [
  'Mis pedidos',
  'Mis datos',
  'Seguridad',
]

function formatDate(ts: any): string {
  if (!ts?.toDate) return '—'
  return ts.toDate().toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function Profile() {
  const navigate             = useNavigate()
  const { user, profile, logout } = useAuth()

  const [activeTab, setActiveTab]   = useState(0)
  const [orders,    setOrders]      = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  // Redirigir si no está autenticado
  useEffect(() => {
    if (user === null) navigate('/login')
  }, [user])

  // Cargar pedidos del usuario
  useEffect(() => {
    if (!user) return
    const fetch = async () => {
      setLoadingOrders(true)
      try {
        const q    = query(
          collection(db, 'pedidos'),
          where('userId', '==', user.uid)
        )
        const snap = await getDocs(q)
        const list = snap.docs
          .map(d => ({ id: d.id, ...d.data() } as Order))
          .sort((a, b) => {
            const ta = a.createdAt?.toDate?.()?.getTime() ?? 0
            const tb = b.createdAt?.toDate?.()?.getTime() ?? 0
            return tb - ta
          })
        setOrders(list)
      } finally {
        setLoadingOrders(false)
      }
    }
    fetch()
  }, [user])

  if (!user || !profile) return null

  const initials = profile.displayName
    .split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const totalGastado = orders
    .filter(o => o.status === 'entregado')
    .reduce((a, o) => a + o.total, 0)

  return (
    <main className="profile-page">
      <div className="container">
        <div className="profile-layout">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="profile-left">

            {/* Tarjeta de usuario */}
            <div className="membership-card">
              <div className="membership-card__top">
                <div>
                  <p className="membership-card__brand">Golden Bite</p>
                  <p className="membership-card__sub">
                    {profile.role === 'cliente' ? 'Cliente' : profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </p>
                </div>
                <div style={{
                  width:          '40px',
                  height:         '40px',
                  borderRadius:   '50%',
                  background:     'var(--gold)',
                  color:          '#000',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontWeight:     700,
                  fontSize:       '16px',
                }}>
                  {initials}
                </div>
              </div>
              <div className="membership-card__holder">
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '2px' }}>Nombre</p>
                <p style={{ fontSize: '18px', color: 'var(--text)', fontFamily: 'var(--font-serif)' }}>
                  {profile.displayName}
                </p>
              </div>
              <div className="membership-card__meta">
                <div>
                  <p style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Correo</p>
                  <p style={{ fontSize: '11px', color: 'var(--gold)', wordBreak: 'break-all' }}>
                    {profile.email}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Miembro desde</p>
                  <p style={{ fontSize: '12px', color: 'var(--text)' }}>{profile.createdAt}</p>
                </div>
              </div>
            </div>

            {/* Puntos */}
            <div className="profile-box">
              <p style={{
                fontSize:      '10px',
                color:         'var(--text-muted)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom:  '8px',
              }}>
                <i className="bi bi-star" /> Puntos acumulados
              </p>
              <p className="profile-points">
                {profile.points.toLocaleString('es-CO')} <span>Puntos</span>
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '14px', lineHeight: '1.5' }}>
                Ganas 1 punto por cada $1.000 COP en tus pedidos.
              </p>
            </div>

            {/* Resumen */}
            <div className="profile-box">
              <p style={{
                fontSize:      '10px',
                fontWeight:    600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:         'var(--text-muted)',
                marginBottom:  '12px',
              }}>
                <i className="bi bi-bar-chart" /> Resumen
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Total pedidos',   value: orders.length },
                  { label: 'Entregados',      value: orders.filter(o => o.status === 'entregado').length },
                  { label: 'Total gastado',   value: formatCOP(totalGastado) },
                ].map(item => (
                  <div key={item.label} style={{
                    display:        'flex',
                    justifyContent: 'space-between',
                    fontSize:       '13px',
                    padding:        '8px 0',
                    borderBottom:   '1px solid var(--border)',
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="btn-outline"
              style={{ width: '100%', padding: '11px', fontSize: '13px', marginTop: '4px' }}
            >
              <i className="bi bi-box-arrow-right" /> Cerrar sesión
            </button>
          </div>

          {/* ── COLUMNA DERECHA ── */}
          <div className="profile-right">

            {/* Tabs */}
            <div className="profile-tabs">
              {tabs.map((t, i) => (
                <button
                  key={t}
                  className={`profile-tab ${activeTab === i ? 'active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* ── TAB 0: Mis pedidos ── */}
            {activeTab === 0 && (
              <div className="profile-orders">
                {loadingOrders ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                    Cargando pedidos...
                  </div>
                ) : orders.length === 0 ? (
                  <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <i className="bi bi-bag" style={{ fontSize: '40px', display: 'block', marginBottom: '12px', color: 'var(--gold)' }} />
                    Aún no tienes pedidos.
                    <br />
                    <Link to="/menu" className="btn-gold" style={{ marginTop: '16px', display: 'inline-block', padding: '10px 20px', fontSize: '13px' }}>
                      Ver el menú
                    </Link>
                  </div>
                ) : orders.map(o => (
                  <div key={o.id} className="profile-order">
                    <div className="profile-order__header">
                      <div>
                        <p className="profile-order__title">
                          Pedido {o.code}
                        </p>
                        <p className="profile-order__meta">
                          {formatDate(o.createdAt)} ·{' '}
                          {o.delivery === 'envio' ? 'Domicilio' : 'Recogida en local'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <span style={{
                          fontSize:     '11px',
                          fontWeight:   600,
                          padding:      '3px 8px',
                          borderRadius: '20px',
                          background:   `${STATUS_COLOR[o.status]}22`,
                          color:        STATUS_COLOR[o.status],
                          whiteSpace:   'nowrap',
                        }}>
                          {STATUS_LABEL[o.status]}
                        </span>
                        <p style={{
                          fontFamily: 'var(--font-serif)',
                          fontSize:   '18px',
                          color:      'var(--gold)',
                          marginTop:  '6px',
                        }}>
                          {formatCOP(o.total)}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="profile-order__items">
                      {o.items.slice(0, 3).map((item, i) => (
                        <span key={i} className="profile-order__item">
                          x{item.quantity} {item.name}
                          {item.cooking ? ` (${item.cooking})` : ''}
                        </span>
                      ))}
                      {o.items.length > 3 && (
                        <span className="profile-order__item" style={{ color: 'var(--text-dim)' }}>
                          +{o.items.length - 3} más
                        </span>
                      )}
                    </div>

                    <div className="profile-order__footer">
                      <span style={{ fontSize: '11px', color: 'var(--gold)' }}>
                        <i className="bi bi-star" />{' '}
                        +{Math.floor(o.total / 1000)} puntos ganados
                      </span>
                      <Link
                        to="/seguimiento"
                        state={{ code: o.code }}
                        className="btn-outline"
                        style={{ fontSize: '11px', padding: '7px 12px' }}
                      >
                        <i className="bi bi-search" /> Ver estado
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB 1: Mis datos ── */}
            {activeTab === 1 && (
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '20px' }}>
                  Información de la cuenta
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { label: 'Nombre',          value: profile.displayName, icon: 'bi-person'   },
                    { label: 'Correo',           value: profile.email,       icon: 'bi-envelope' },
                    { label: 'Rol',              value: profile.role,        icon: 'bi-shield'   },
                    { label: 'Miembro desde',    value: profile.createdAt,   icon: 'bi-calendar3'},
                  ].map(item => (
                    <div key={item.label} style={{
                      background:   'var(--surface)',
                      border:       '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      padding:      '14px 16px',
                      display:      'flex',
                      alignItems:   'center',
                      gap:          '12px',
                    }}>
                      <i className={`bi ${item.icon}`} style={{ color: 'var(--gold)', fontSize: '16px', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                          {item.label}
                        </p>
                        <p style={{ fontSize: '14px', color: 'var(--text)', textTransform: item.label === 'Rol' ? 'capitalize' : 'none' }}>
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 2: Seguridad ── */}
            {activeTab === 2 && (
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
                  Seguridad
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Gestiona la seguridad de tu cuenta.
                </p>

                <div style={{
                  background:   'var(--surface)',
                  border:       '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding:      '20px',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'space-between',
                  gap:          '16px',
                  flexWrap:     'wrap',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      <i className="bi bi-lock" /> Contraseña
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Recibirás un correo con el enlace para cambiar tu contraseña.
                    </p>
                  </div>
                  <Link
                    to="/recuperar"
                    className="btn-outline"
                    style={{ fontSize: '12px', padding: '10px 16px', whiteSpace: 'nowrap' }}
                  >
                    Cambiar contraseña
                  </Link>
                </div>

                <div style={{
                  background:   'var(--surface)',
                  border:       '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding:      '20px',
                  marginTop:    '12px',
                  display:      'flex',
                  alignItems:   'center',
                  justifyContent: 'space-between',
                  gap:          '16px',
                  flexWrap:     'wrap',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                      <i className="bi bi-box-arrow-right" /> Cerrar sesión
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      Cierra sesión en este dispositivo.
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-outline"
                    style={{ fontSize: '12px', padding: '10px 16px', whiteSpace: 'nowrap', color: '#ef4444', borderColor: '#ef444460' }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}