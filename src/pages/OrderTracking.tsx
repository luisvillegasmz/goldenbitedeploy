import { useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { formatCOP } from '../utils/format'
import type { Order } from '../types/order'
import { STATUS_LABEL, STATUS_COLOR, timeAgo } from '../types/order'
import './OrderTracking.css'

const PHASES: { statuses: Order['status'][]; label: string; icon: string }[] = [
  { statuses: ['pendiente'],      label: 'Pedido recibido', icon: 'bi-receipt'     },
  { statuses: ['en_preparacion'], label: 'En preparación',  icon: 'bi-fire'        },
  { statuses: ['listo'],          label: 'Listo',           icon: 'bi-bag-check'   },
  { statuses: ['entregado'],      label: 'Entregado',       icon: 'bi-house-check' },
]

export default function OrderTracking() {
  const { user } = useAuth()
  const [code,    setCode]    = useState('')
  const [order,   setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const search = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setLoading(true)
    setError('')
    setOrder(null)

    try {
      const q    = query(collection(db, 'pedidos'), where('code', '==', trimmed))
      const snap = await getDocs(q)

      if (snap.empty) {
        setError('No se encontró ningún pedido con ese código.')
      } else {
        const found = { id: snap.docs[0].id, ...snap.docs[0].data() } as Order
        if (user && found.userId !== user.uid) {
          setError('Este pedido no pertenece a tu cuenta.')
        } else {
          setOrder(found)
        }
      }
    } catch {
      setError('Hubo un problema al buscar el pedido. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const phaseIndex = order
    ? PHASES.findIndex(p => p.statuses.includes(order.status))
    : -1

  return (
    <main className="tracking-page">
      <div className="container">

        <nav className="tracking-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <span>Seguimiento</span>
        </nav>

        <h1 className="tracking-title">Seguimiento de pedido</h1>

        {/* Buscador */}
        <div style={{
          background:   'var(--surface)',
          border:       '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding:      '24px',
          marginBottom: '32px',
          maxWidth:     '480px',
        }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Ingresa el código de tu pedido (ej: GB-12345)
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="GB-XXXXX"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && search()}
              style={{
                flex:          1,
                background:    'var(--bg)',
                border:        '1px solid var(--border)',
                borderRadius:  'var(--radius)',
                color:         'var(--text)',
                padding:       '10px 14px',
                fontSize:      '14px',
                fontFamily:    'monospace',
                letterSpacing: '0.05em',
              }}
            />
            <button
              className="btn-gold"
              onClick={search}
              disabled={loading}
              style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
            >
              {loading
                ? 'Buscando...'
                : <><i className="bi bi-search" /> Buscar</>}
            </button>
          </div>
          {error && (
            <p style={{ fontSize: '13px', color: '#ef4444', marginTop: '10px' }}>
              <i className="bi bi-exclamation-circle" /> {error}
            </p>
          )}
        </div>

        {/* Resultado */}
        {order && (
          <div className="tracking-layout">
            <div className="tracking-left">

              {/* Estado */}
              <div className="tracking-eta">
                <div className="tracking-eta__top">
                  <span className="badge">{order.code}</span>
                  <div>
                    <p className="tracking-eta__label">Estado actual</p>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: STATUS_COLOR[order.status] }}>
                      {STATUS_LABEL[order.status]}
                    </p>
                  </div>
                </div>

                {order.status === 'cancelado' && (
                  <div style={{
                    background:   'rgba(239,68,68,0.1)',
                    border:       '1px solid #ef4444',
                    borderRadius: 'var(--radius)',
                    padding:      '12px',
                    marginBottom: '16px',
                    fontSize:     '13px',
                    color:        '#ef4444',
                  }}>
                    <i className="bi bi-x-circle" /> Este pedido fue cancelado.
                    Contáctanos si tienes preguntas.
                  </div>
                )}

                {/* Timeline */}
                <div className="tracking-timeline">
                  {PHASES.map((phase, i) => {
                    const isDone   = i < phaseIndex
                    const isActive = i === phaseIndex
                    return (
                      <div
                        key={i}
                        className={`tracking-phase ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                      >
                        <div className="tracking-phase__indicator">
                          <div className="tracking-phase__dot">
                            {isDone
                              ? <i className="bi bi-check" />
                              : <i className={`bi ${phase.icon}`} />}
                          </div>
                          {i < PHASES.length - 1 && <div className="tracking-phase__line" />}
                        </div>
                        <div className="tracking-phase__content">
                          <div className="tracking-phase__header">
                            <span className="tracking-phase__label">
                              {phase.label}
                              {isActive && (
                                <span className="tracking-phase__now">AHORA</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Detalle de ítems */}
              <div style={{
                background:   'var(--surface)',
                border:       '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding:      '20px',
                marginTop:    '16px',
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
                  Detalle del pedido
                </h3>
                {order.items.map((item, i) => (
                  <div key={i} style={{
                    display:        'flex',
                    justifyContent: 'space-between',
                    padding:        '6px 0',
                    borderBottom:   '1px solid var(--border)',
                    fontSize:       '13px',
                  }}>
                    <span style={{ color: 'var(--text)' }}>
                      x{item.quantity} {item.name}
                      {item.cooking && (
                        <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}>
                          {' '}· {item.cooking}
                        </span>
                      )}
                    </span>
                    <span style={{ color: 'var(--gold)' }}>
                      {formatCOP(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div style={{
                  display:        'flex',
                  justifyContent: 'space-between',
                  marginTop:      '12px',
                  fontWeight:     700,
                  fontSize:       '15px',
                }}>
                  <span style={{ color: 'var(--text)' }}>Total pagado</span>
                  <span style={{ color: 'var(--gold)' }}>{formatCOP(order.total)}</span>
                </div>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="tracking-right">
              <div style={{
                background:   'var(--surface)',
                border:       '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding:      '20px',
              }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
                  Información de entrega
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                  <div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <i className="bi bi-bag" /> Tipo de entrega
                    </p>
                    <p style={{ color: 'var(--text)' }}>
                      {order.delivery === 'envio' ? 'Domicilio' : 'Recoger en el restaurante'}
                    </p>
                  </div>

                  {order.delivery === 'envio' && order.address && (
                    <div>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>
                        <i className="bi bi-geo-alt" /> Dirección
                      </p>
                      <p style={{ color: 'var(--text)' }}>
                        {order.address.street}<br />{order.address.city}
                      </p>
                      {order.address.notes && (
                        <p style={{ color: 'var(--text-dim)', fontSize: '11px', marginTop: '2px' }}>
                          {order.address.notes}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <i className="bi bi-cash-stack" /> Método de pago
                    </p>
                    <p style={{ color: 'var(--text)', textTransform: 'capitalize' }}>
                      {order.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>
                      <i className="bi bi-clock" /> Pedido realizado
                    </p>
                    <p style={{ color: 'var(--text)' }}>{timeAgo(order.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}