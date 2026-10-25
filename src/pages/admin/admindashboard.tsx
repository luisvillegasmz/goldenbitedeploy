import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminLayout from '../../components/adminlayout'
import { formatCOP } from '../../utils/format'
import type { Order } from '../../types/order'
import { STATUS_LABEL, STATUS_COLOR, timeAgo } from '../../types/order'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'), limit(100))
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
      setLoading(false)
    })
    return unsub
  }, [])

  const today   = new Date().toDateString()
  const isToday = (ts: any) => ts?.toDate?.()?.toDateString?.() === today

  const hoy          = orders.filter(o => isToday(o.createdAt))
  const entregados   = hoy.filter(o => o.status === 'entregado')
  const enCurso      = hoy.filter(o => !['entregado', 'cancelado'].includes(o.status))
  const cancelados   = hoy.filter(o => o.status === 'cancelado')
  const totalVentas  = entregados.reduce((a, o) => a + o.total, 0)
  const recientes    = orders.slice(0, 8)

  const stats = [
    { label: 'Ventas del día',      value: formatCOP(totalVentas),  icon: 'bi-graph-up-arrow', color: 'var(--gold)' },
    { label: 'Pedidos entregados',  value: entregados.length,       icon: 'bi-check-circle',   color: '#10b981'     },
    { label: 'En curso ahora',      value: enCurso.length,          icon: 'bi-arrow-repeat',   color: '#3b82f6'     },
    { label: 'Cancelados hoy',      value: cancelados.length,       icon: 'bi-x-circle',       color: '#ef4444'     },
  ]

  return (
    <AdminLayout>
      {/* Cabecera */}
      <div className="dash-header">
        <div>
          <p className="dash-service">
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="dash-title">Panel de Control</h1>
        </div>
        <span className="badge">
          <i className="bi bi-circle-fill" style={{ fontSize: '8px', color: '#10b981', marginRight: '6px' }} />
          En línea
        </span>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {stats.map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__label">
              {s.label}
              <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: '16px' }} />
            </div>
            <div className="admin-stat-card__value">{s.value}</div>
            <div className="admin-stat-card__sub">Hoy · {new Date().toLocaleDateString('es-CO')}</div>
          </div>
        ))}
      </div>

      {/* Alertas de pedidos pendientes */}
      {enCurso.filter(o => o.status === 'pendiente').length > 0 && (
        <div style={{
          background:   'rgba(245,158,11,0.08)',
          border:       '1px solid #f59e0b',
          borderRadius: 'var(--radius)',
          padding:      '14px 18px',
          marginBottom: '24px',
          fontSize:     '13px',
          color:        '#f59e0b',
          display:      'flex',
          alignItems:   'center',
          gap:          '10px',
        }}>
          <i className="bi bi-exclamation-triangle" style={{ fontSize: '18px' }} />
          <span>
            Hay <strong>{enCurso.filter(o => o.status === 'pendiente').length}</strong> pedido(s) pendiente(s)
            esperando confirmación del asesor.
          </span>
        </div>
      )}

      {/* Últimos pedidos */}
      <div className="dash-card">
        <div className="admin-section-header" style={{ marginBottom: '16px' }}>
          <div>
            <p className="admin-section-title">Pedidos recientes</p>
            <p className="admin-section-sub">
              {loading ? 'Cargando...' : `${orders.length} pedidos en total`}
            </p>
          </div>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '20px 0' }}>
            Cargando pedidos...
          </p>
        ) : recientes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
            <i className="bi bi-inbox" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }} />
            No hay pedidos todavía.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Entrega</th>
                  <th>Estado</th>
                  <th>Hace</th>
                </tr>
              </thead>
              <tbody>
                {recientes.map(o => (
                  <tr key={o.id}>
                    <td>
                      <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{o.code}</span>
                    </td>
                    <td>
                      <span style={{
                        color:        'var(--text-muted)',
                        fontSize:     '12px',
                        maxWidth:     '140px',
                        overflow:     'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace:   'nowrap',
                        display:      'block',
                      }}>
                        {o.userEmail}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text)' }}>
                      {o.items.length} ítem{o.items.length !== 1 ? 's' : ''}
                    </td>
                    <td style={{ color: 'var(--gold)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {formatCOP(o.total)}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      <i className={`bi bi-${o.delivery === 'envio' ? 'scooter' : 'shop'}`} />{' '}
                      {o.delivery === 'envio' ? 'Domicilio' : 'Recoger'}
                    </td>
                    <td>
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
                    </td>
                    <td style={{ color: 'var(--text-dim)', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {timeAgo(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}