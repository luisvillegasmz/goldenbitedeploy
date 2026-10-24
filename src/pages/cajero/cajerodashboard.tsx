import { useEffect, useState } from 'react'
import {
  collection, query, orderBy, onSnapshot,
  doc, updateDoc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import DashboardLayout from '../../components/dashboardlayout'
import { formatCOP } from '../../utils/format'
import type { Order } from '../../types/order'
import { STATUS_LABEL, STATUS_COLOR, timeAgo } from '../../types/order'

type Tab = 'listos' | 'en_preparacion' | 'entregados'

const PAYMENT_LABEL: Record<string, string> = {
  tarjeta:  'Tarjeta',
  digital:  'Nequi / Daviplata',
  efectivo: 'Efectivo',
}

export default function CajeroDashboard() {
  const { user }   = useAuth()
  const [orders,   setOrders]   = useState<Order[]>([])
  const [tab,      setTab]      = useState<Tab>('listos')
  const [loading,  setLoading]  = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

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

  const listos        = orders.filter(o => o.status === 'listo')
  const enPreparacion = orders.filter(o => o.status === 'en_preparacion')
  const entregados    = orders.filter(o => o.status === 'entregado' && isToday(o.createdAt))
  const totalHoy      = entregados.reduce((acc, o) => acc + o.total, 0)

  const visibles =
    tab === 'listos'         ? listos :
    tab === 'en_preparacion' ? enPreparacion :
    entregados

  const markEntregado = async (orderId: string) => {
    setUpdating(orderId)
    try {
      await updateDoc(doc(db, 'pedidos', orderId), {
        status:      'entregado',
        cajeroId:    user?.uid,
        entregadoAt: serverTimestamp(),
      })
    } finally {
      setUpdating(null)
    }
  }

  const statsCards = [
    { label: 'Listos para entregar', value: listos.length,        icon: 'bi-bag-check',    color: '#10b981' },
    { label: 'En preparación',       value: enPreparacion.length, icon: 'bi-fire',          color: '#3b82f6' },
    { label: 'Entregados hoy',       value: entregados.length,    icon: 'bi-check-circle',  color: 'var(--gold)' },
    { label: 'Recaudado hoy',        value: formatCOP(totalHoy),  icon: 'bi-cash-stack',    color: 'var(--gold)' },
  ]

  return (
    <DashboardLayout title="Panel Cajero" role="cajero">

      {/* Resumen del día */}
      <div style={{
        display:             'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap:                 '16px',
        marginBottom:        '24px',
      }}>
        {statsCards.map(card => (
          <div key={card.label} style={{
            background:   'var(--surface)',
            border:       '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding:      '16px',
          }}>
            <i className={`bi ${card.icon}`} style={{ fontSize: '22px', color: card.color }} />
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: '6px 0 2px' }}>
              {card.value}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {([
          ['listos',         `Listos (${listos.length})`],
          ['en_preparacion', `En preparación (${enPreparacion.length})`],
          ['entregados',     `Entregados hoy (${entregados.length})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding:    '8px 16px',
              borderRadius:'var(--radius)',
              border:     `1px solid ${tab === key ? 'var(--gold)' : 'var(--border)'}`,
              background: tab === key ? 'rgba(201,168,76,0.1)' : 'var(--surface)',
              color:      tab === key ? 'var(--gold)' : 'var(--text-muted)',
              cursor:     'pointer',
              fontSize:   '13px',
              fontWeight: tab === key ? 600 : 400,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cargando pedidos...</p>
      ) : visibles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
          <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }} />
          {tab === 'listos'
            ? 'No hay pedidos listos para entregar.'
            : tab === 'en_preparacion'
            ? 'No hay pedidos en preparación.'
            : 'No hay pedidos entregados hoy todavía.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {visibles.map(order => (
            <div key={order.id} style={{
              background:   'var(--surface)',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding:      '16px',
              display:      'flex',
              alignItems:   'flex-start',
              gap:          '16px',
              flexWrap:     'wrap',
              opacity:      updating === order.id ? 0.6 : 1,
              transition:   'opacity 0.2s',
            }}>

              {/* Info principal */}
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '15px' }}>
                    {order.code}
                  </span>
                  <span style={{
                    fontSize:     '11px',
                    fontWeight:   600,
                    padding:      '2px 8px',
                    borderRadius: '20px',
                    background:   `${STATUS_COLOR[order.status]}22`,
                    color:        STATUS_COLOR[order.status],
                  }}>
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {order.userEmail} · {timeAgo(order.createdAt)}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text)' }}>
                  {order.items.map(i => `x${i.quantity} ${i.name}`).join(', ')}
                </div>
              </div>

              {/* Pago y entrega */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '150px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <i className="bi bi-cash-stack" />{' '}
                  {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <i className={`bi bi-${order.delivery === 'envio' ? 'scooter' : 'shop'}`} />{' '}
                  {order.delivery === 'envio'
                    ? `Domicilio · ${order.address?.city ?? ''}`
                    : 'Recoger'}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--gold)', marginTop: '4px' }}>
                  {formatCOP(order.total)}
                </div>
              </div>

              {/* Acción */}
              {order.status === 'listo' && (
                <button
                  onClick={() => markEntregado(order.id)}
                  disabled={updating === order.id}
                  style={{
                    padding:      '10px 20px',
                    background:   'var(--gold)',
                    color:        '#000',
                    border:       'none',
                    borderRadius: 'var(--radius)',
                    cursor:       'pointer',
                    fontWeight:   600,
                    fontSize:     '13px',
                    whiteSpace:   'nowrap',
                    alignSelf:    'center',
                  }}
                >
                  <i className="bi bi-check2-circle" /> Marcar entregado
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}