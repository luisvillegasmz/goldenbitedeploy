import { useEffect, useState } from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import DashboardLayout from '../../components/dashboardlayout'
import { formatCOP } from '../../utils/format'
import type { Order } from '../../types/order'
import { STATUS_LABEL, STATUS_COLOR, timeAgo } from '../../types/order'

export default function DuenoDashboard() {
  const [orders,  setOrders]  = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(q, snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)))
      setLoading(false)
    })
    return unsub
  }, [])

  const today   = new Date().toDateString()
  const isToday = (ts: any) => ts?.toDate?.()?.toDateString?.() === today

  const hoy        = orders.filter(o => isToday(o.createdAt))
  const totalVentas = hoy.filter(o => o.status === 'entregado').reduce((a, o) => a + o.total, 0)

  const stats = [
    { label: 'Ventas del día',     value: formatCOP(totalVentas),                                          icon: 'bi-graph-up-arrow',  color: 'var(--gold)' },
    { label: 'Pedidos entregados', value: hoy.filter(o => o.status === 'entregado').length,                icon: 'bi-check-circle',    color: '#10b981'     },
    { label: 'En curso',           value: hoy.filter(o => !['entregado','cancelado'].includes(o.status)).length, icon: 'bi-arrow-repeat', color: '#3b82f6' },
    { label: 'Cancelados',         value: hoy.filter(o => o.status === 'cancelado').length,                icon: 'bi-x-circle',        color: '#ef4444'     },
  ]

  return (
    <DashboardLayout title="Panel Dueño" role="dueño">

      {/* Stats */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap:                 '16px',
        marginBottom:        '32px',
      }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background:   'var(--surface)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding:      '20px',
          }}>
            <i className={`bi ${s.icon}`} style={{ fontSize: '24px', color: s.color }} />
            <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '8px 0 4px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabla pedidos de hoy */}
      <div style={{
        background:   'var(--surface)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow:     'hidden',
      }}>
        <div style={{
          padding:        '16px 20px',
          borderBottom:   '1px solid var(--border)',
          display:        'flex',
          justifyContent: 'space-between',
          alignItems:     'center',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
            Pedidos de hoy ({hoy.length})
          </h2>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            Cargando...
          </div>
        ) : hoy.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            <i className="bi bi-inbox" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }} />
            No hay pedidos hoy todavía.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(201,168,76,0.04)' }}>
                  {['Código','Cliente','Ítems','Total','Método','Entrega','Estado','Hace'].map(h => (
                    <th key={h} style={{
                      padding:    '10px 16px',
                      textAlign:  'left',
                      color:      'var(--text-muted)',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hoy.map(o => (
                  <tr key={o.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--gold)' }}>
                      {o.code}
                    </td>
                    <td style={{
                      padding:      '12px 16px',
                      color:        'var(--text-muted)',
                      maxWidth:     '140px',
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                    }}>
                      {o.userEmail}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text)' }}>
                      {o.items.length} ítem{o.items.length !== 1 ? 's' : ''}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--gold)', whiteSpace: 'nowrap' }}>
                      {formatCOP(o.total)}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                      {o.paymentMethod}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                      {o.delivery === 'envio' ? 'Domicilio' : 'Recoger'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
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
                    <td style={{ padding: '12px 16px', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                      {timeAgo(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}