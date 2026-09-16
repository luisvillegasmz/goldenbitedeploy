import { useLocation, Link } from 'react-router-dom'
import './OrderConfirmation.css'

const orderItems = [
  { name: 'Wagyu A5 Glaseado al Miso', price: 68, qty: 1, desc: 'Reducción de trufa negra melanosporum, chalota asada y brotes silvestres.', tag: 'Cant: 1 • Punto: Al Punto', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=80' },
  { name: 'Ravioli de Bogavante Azul', price: 44, qty: 1, desc: 'Bisque perfumada al azafrán de La Mancha y perlas de lima kaffir.', tag: 'Cant: 1 • Especialidad', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80' },
  { name: 'Esfera de Cacao Criollo 72%', price: 22, qty: 1, desc: 'Praliné crujiente de avellana piamontesa y caramelo salado al bourbon.', tag: 'Cant: 1 • Postre', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80' },
]

export default function OrderConfirmation() {
  const location = useLocation()
  const { total = 156.2, code = 'GB-84920' } = (location.state as any) || {}

  const subtotal = 134
  const service  = 8
  const iva      = 14.2

  return (
    <main className="confirm-page">
      <div className="container">

        {/* ── HERO CONFIRMACIÓN ── */}
        <div className="confirm-hero">
          <div className="confirm-hero__icon">✓</div>
          <span className="badge confirm-hero__badge">● Comanda Confirmada</span>
          <h1 className="confirm-hero__title">
            Su Experiencia Gastronómica<br />está en Marcha
          </h1>
          <p className="confirm-hero__subtitle">
            Hemos recibido su comanda con éxito. La cocina de Golden Bite Salamanca
            está preparando sus platos con máxima delicadeza.
          </p>

          <div className="confirm-hero__info">
            <div className="confirm-hero__info-card">
              <span className="confirm-hero__info-label">🧾 Código de Comanda</span>
              <span className="confirm-hero__info-value">#{code}</span>
            </div>
            <div className="confirm-hero__info-card">
              <span className="confirm-hero__info-label">⏱ Entrega Estimada</span>
              <span className="confirm-hero__info-value">Hoy a las 21:15 h</span>
            </div>
          </div>

          <div className="confirm-hero__ctas">
            <Link to="/seguimiento" className="btn-gold">Seguir Pedido en Tiempo Real →</Link>
            <button className="btn-outline">⬇ Descargar Recibo / Factura</button>
          </div>
          <button className="confirm-hero__calendar">📅 Añadir a Calendario</button>
        </div>

        {/* ── DETALLE ── */}
        <div className="confirm-layout">

          {/* Items */}
          <div className="confirm-detail">
            <div className="confirm-detail__header">
              <div>
                <h2 className="confirm-detail__title">Selección Culinaria</h2>
                <p className="confirm-detail__sub">3 platos elaborados por el Chef Ejecutivo</p>
              </div>
              <span className="badge">Menú Degustación</span>
            </div>

            {orderItems.map(item => (
              <div key={item.name} className="confirm-item">
                <img src={item.image} alt={item.name} className="confirm-item__img" />
                <div className="confirm-item__info">
                  <p className="confirm-item__name">{item.name}</p>
                  <p className="confirm-item__desc">{item.desc}</p>
                  <span className="confirm-item__tag">{item.tag}</span>
                </div>
                <span className="confirm-item__price">{item.price.toFixed(2)} €</span>
              </div>
            ))}

            <div className="confirm-breakdown">
              <div className="confirm-breakdown__row"><span>Subtotal Comanda</span><span>{subtotal.toFixed(2)} €</span></div>
              <div className="confirm-breakdown__row"><span>Servicio Sommelier &amp; Vajilla Térmica</span><span>{service.toFixed(2)} €</span></div>
              <div className="confirm-breakdown__row"><span>IVA (10%)</span><span>{iva.toFixed(2)} €</span></div>
              <div className="confirm-breakdown__total"><span>Total Abonado</span><span>{total.toFixed(2)} €</span></div>
            </div>

            {/* Club */}
            <div className="confirm-club">
              <span>⭐</span>
              <div>
                <p className="confirm-club__title">Membresía Gourmet Club</p>
                <p className="confirm-club__points">Ha sumado 230 puntos Gourmet Club por esta orden</p>
              </div>
              <span className="badge">Nivel Oro</span>
            </div>
          </div>

          {/* Detalles entrega */}
          <div className="confirm-sidebar">
            <h3 className="confirm-sidebar__title">Detalles de Entrega &amp; Facturación</h3>

            <div className="confirm-info-row">
              <span>📍</span>
              <div>
                <p className="confirm-info-row__label">Dirección Confirmada</p>
                <p className="confirm-info-row__value">Calle de Serrano, 48, 4º Dcha.<br />28001 Barrio de Salamanca, Madrid</p>
                <span className="confirm-info-row__badge">Entrega en mano con guante blanco</span>
              </div>
            </div>

            <div className="confirm-info-row">
              <span>💳</span>
              <div>
                <p className="confirm-info-row__label">Método de Pago</p>
                <p className="confirm-info-row__value">Apple Pay •••• 4092</p>
                <span className="confirm-info-row__note">Transacción encriptada y autenticada</span>
              </div>
            </div>

            <div className="confirm-info-row">
              <span>🍳</span>
              <div>
                <p className="confirm-info-row__label">Estado en Sala de Cocina</p>
                <div className="confirm-progress">
                  <div className="confirm-progress__bar" style={{ width: '55%' }} />
                </div>
                <p className="confirm-info-row__value">Emplatado y control de temperatura</p>
              </div>
            </div>

            {/* Concierge */}
            <div className="confirm-concierge">
              <div className="confirm-concierge__header">
                <span>🛎 Asistencia Privada</span>
              </div>
              <h4 className="confirm-concierge__title">Concierge de Guardia</h4>
              <p className="confirm-concierge__desc">
                ¿Desea incluir maridaje adicional, copas Riedel o indicar alguna preferencia para la llegada del camarero?
              </p>
              <div className="confirm-concierge__actions">
                <div>
                  <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginBottom: '2px' }}>Llamada Directa</p>
                  <p style={{ fontSize: '13px', color: 'var(--text)' }}>+34 910 384 920</p>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--gold)', fontWeight: 600 }}>Inmediato</span>
              </div>
              <Link to="/seguimiento" className="btn-gold" style={{ display: 'block', textAlign: 'center', marginTop: '12px', padding: '12px' }}>
                💬 Chat con el Sumiller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}