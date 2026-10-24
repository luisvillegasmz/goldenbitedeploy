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

type Tab = 'pendiente' | 'en_preparacion' | 'historial'

export default function AsesorDashboard() {
  const { user }   = useAuth()
  const [orders,   setOrders]   = useState<Order[]>([])
  const [tab,      setTab]      = useState<Tab>('pendiente')
  const [loading,  setLoading]  = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  // Escucha pedidos en tiempo real
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

  const pendientes    = orders.filter(o => o.status === 'pendiente')
  const enPreparacion = orders.filter(o => o.status === 'en_preparacion')
  const historial     = orders.filter(
    o => ['listo', 'entregado', 'cancelado'].includes(o.status) && isToday(o.createdAt)
  )

  const visibles =
    tab === 'pendiente'      ? pendientes :
    tab === 'en_preparacion' ? enPreparacion :
    historial

  const updateStatus = async (orderId: string, status: Order['status']) => {
    setUpdating(orderId)
    try {
      await updateDoc(doc(db, 'pedidos', orderId), {
        status,
        asesorId:          user?.uid,
        [`${status}At`]:   serverTimestamp(),
      })
    } finally {
      setUpdating(null)
    }
  }

  return (
    <DashboardLayout title="Panel Asesor" role="asesor">

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {([
          ['pendiente',      `Pendientes (${pendientes.length})`],
          ['en_preparacion', `En preparación (${enPreparacion.length})`],
          ['historial',      `Historial hoy (${historial.length})`],
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

      {/* Alerta si hay pendientes y estás en otra tab */}
      {pendientes.length > 0 && tab !== 'pendiente' && (
        <div style={{
          background:   'rgba(245,158,11,0.1)',
          border:       '1px solid #f59e0b',
          borderRadius: 'var(--radius)',
          padding:      '12px 16px',
          marginBottom: '16px',
          fontSize:     '13px',
          color:        '#f59e0b',
        }}>
          <i className="bi bi-exclamation-triangle" /> Hay{' '}
          {pendientes.length} pedido{pendientes.length > 1 ? 's' : ''} pendiente{pendientes.length > 1 ? 's' : ''} por confirmar.
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Cargando pedidos...</p>
      ) : visibles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
          <i className="bi bi-inbox" style={{ fontSize: '40px', display: 'block', marginBottom: '12px' }} />
          {tab === 'pendiente'
            ? 'No hay pedidos pendientes por ahora.'
            : tab === 'en_preparacion'
            ? 'No hay pedidos en preparación.'
            : 'No hay historial de hoy todavía.'}
        </div>
      ) : (
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap:                 '16px',
        }}>
          {visibles.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              updating={updating === order.id}
              onConfirm={() => updateStatus(order.id, 'en_preparacion')}
              onListo={()   => updateStatus(order.id, 'listo')}
              onCancel={() => updateStatus(order.id, 'cancelado')}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}

// ── Card de pedido ─────────────────────────────────────────────────────────

interface CardProps {
  order:     Order
  updating:  boolean
  onConfirm: () => void
  onListo:   () => void
  onCancel:  () => void
}

function OrderCard({ order, updating, onConfirm, onListo, onCancel }: CardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div style={{
      background:   'var(--surface)',
      border:       '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow:     'hidden',
      opacity:      updating ? 0.6 : 1,
      transition:   'opacity 0.2s',
    }}>
      {/* Cabecera */}
      <div style={{
        padding:        '14px 16px',
        borderBottom:   '1px solid var(--border)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <span style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '14px' }}>
            {order.code}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)', marginLeft: '8px' }}>
            {timeAgo(order.createdAt)}
          </span>
        </div>
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

      {/* Cuerpo */}
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
          {order.userEmail}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
          <span>
            <i className={`bi bi-${order.delivery === 'envio' ? 'scooter' : 'shop'}`} />{' '}
            {order.delivery === 'envio'
              ? `Domicilio · ${order.address?.city ?? ''}`
              : 'Recoger en local'}
          </span>
          <span style={{ textTransform: 'capitalize' }}>
            <i className="bi bi-cash-stack" /> {order.paymentMethod}
          </span>
        </div>

        {/* Items */}
        {order.items.slice(0, expanded ? undefined : 2).map((item, i) => (
          <div key={i} style={{
            display:        'flex',
            justifyContent: 'space-between',
            padding:        '5px 0',
            borderBottom:   '1px solid var(--border)',
            fontSize:       '13px',
          }}>
            <span style={{ color: 'var(--text)' }}>
              x{item.quantity} {item.name}
              {item.cooking && (
                <span style={{ color: 'var(--text-dim)', fontSize: '11px' }}> · {item.cooking}</span>
              )}
            </span>
            <span style={{ color: 'var(--gold)' }}>{formatCOP(item.price * item.quantity)}</span>
          </div>
        ))}

        {order.items.length > 2 && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              fontSize:   '11px',
              color:      'var(--text-dim)',
              background: 'none',
              border:     'none',
              cursor:     'pointer',
              padding:    '4px 0',
            }}
          >
            {expanded ? 'Ver menos' : `+ ${order.items.length - 2} más`}
          </button>
        )}

        <div style={{
          display:        'flex',
          justifyContent: 'space-between',
          fontWeight:     700,
          fontSize:       '15px',
          marginTop:      '10px',
        }}>
          <span style={{ color: 'var(--text)' }}>Total</span>
          <span style={{ color: 'var(--gold)' }}>{formatCOP(order.total)}</span>
        </div>
      </div>

      {/* Acciones */}
      {order.status === 'pendiente' && (
        <div style={{
          padding:   '12px 16px',
          borderTop: '1px solid var(--border)',
          display:   'flex',
          gap:       '8px',
        }}>
          <button
            onClick={onConfirm}
            disabled={updating}
            style={{
              flex:         1,
              padding:      '10px',
              background:   'var(--gold)',
              color:        '#000',
              border:       'none',
              borderRadius: 'var(--radius)',
              cursor:       'pointer',
              fontWeight:   600,
              fontSize:     '13px',
            }}
          >
            <i className="bi bi-check2" /> Confirmar
          </button>
          <button
            onClick={onCancel}
            disabled={updating}
            style={{
              padding:      '10px 14px',
              background:   'transparent',
              color:        '#ef4444',
              border:       '1px solid #ef4444',
              borderRadius: 'var(--radius)',
              cursor:       'pointer',
              fontSize:     '13px',
            }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}

      {order.status === 'en_preparacion' && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={onListo}
            disabled={updating}
            style={{
              width:        '100%',
              padding:      '10px',
              background:   '#10b981',
              color:        '#fff',
              border:       'none',
              borderRadius: 'var(--radius)',
              cursor:       'pointer',
              fontWeight:   600,
              fontSize:     '13px',
            }}
          >
            <i className="bi bi-bag-check" /> Marcar como listo
          </button>
        </div>
      )}
    </div>
  )
}