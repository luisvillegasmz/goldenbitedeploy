import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import './Cart.css'

const suggestions = [
  {
    id: 's1',
    name: 'Coulant de Cacao 80%',
    price: 16,
    desc: 'Caramelo de mantequilla salada & oro',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80',
  },
  {
    id: 's2',
    name: 'Champagne Brut Grand Cru',
    price: 95,
    desc: 'Maridaje celestial para el Caviar',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&q=80',
  },
]

const SHIPPING = 6.5
const TAX_RATE = 0.1
const TIP_OPTIONS = [10, 15, 20, 0] // 0 = libre

export default function Cart() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, total } = useCart()
  const [delivery, setDelivery]   = useState<'envio' | 'recogida'>('envio')
  const [tip, setTip]             = useState(15)
  const [notes, setNotes]         = useState('')
  const [promoCode, setPromoCode] = useState('')

  const shipping  = delivery === 'envio' ? SHIPPING : 0
  const subtotal  = total
  const taxes     = subtotal * TAX_RATE
  const tipAmount = subtotal * (tip / 100)
  const grandTotal = subtotal + shipping + taxes + tipAmount

  if (items.length === 0) {
    return (
      <main className="cart-empty">
        <div className="cart-empty__content">
          <span className="cart-empty__icon">🛒</span>
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestra carta y añade tus platos favoritos.</p>
          <Link to="/menu" className="btn-gold">Ver la Carta</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="cart-breadcrumb">
          <Link to="/menu">Menú Gourmet</Link>
          <span>/</span>
          <span>Tu Selección</span>
        </nav>

        <div className="cart-header">
          <h1 className="cart-title">
            Carrito de Compras
            <span className="cart-count">{items.length} Artículos</span>
          </h1>
          <div className="cart-guarantee">
            🛡 Servicio White-Glove Garantizado
          </div>
        </div>

        <div className="cart-layout">
          {/* ── COLUMNA IZQUIERDA: Items ── */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item__img-wrap">
                  <img src={item.image} alt={item.name} className="cart-item__img" />
                </div>

                <div className="cart-item__info">
                  <div className="cart-item__top">
                    <h3 className="cart-item__name">{item.name}</h3>
                    <button className="cart-item__remove" onClick={() => removeItem(item.id)}>🗑</button>
                  </div>

                  {item.cooking && (
                    <div className="cart-item__tags">
                      <span className="cart-item__tag">✓ {item.cooking}</span>
                    </div>
                  )}

                  <div className="cart-item__bottom">
                    <div className="cart-item__qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div>
                      <p className="cart-item__unit">PRECIO UNITARIO: {item.price.toFixed(2)} €</p>
                      <p className="cart-item__total">{(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  </div>

                  <button className="cart-item__notes-btn">✏ Modificar notas culinarias para cocina</button>
                </div>
              </div>
            ))}

            {/* Notas para la cocina */}
            <div className="cart-kitchen-notes">
              <p className="cart-kitchen-notes__label">Indicaciones para la Cocina y Alérgenos</p>
              <textarea
                className="cart-kitchen-notes__input"
                placeholder="Indica requisitos dietéticos específicos, alergias o preferencias sobre el empaquetado térmico..."
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {/* Maridajes sugeridos */}
            <div className="cart-suggestions">
              <div className="cart-suggestions__header">
                <div>
                  <p className="section-label" style={{ marginBottom: '2px' }}>Armonía Gastronómica</p>
                  <h3 className="cart-suggestions__title">Maridajes recomendados para tu pedido</h3>
                </div>
                <div className="cart-suggestions__nav">
                  <button>←</button>
                  <button>→</button>
                </div>
              </div>
              <div className="cart-suggestions__grid">
                {suggestions.map(s => (
                  <div key={s.id} className="suggestion-card">
                    <img src={s.image} alt={s.name} className="suggestion-card__img" />
                    <div className="suggestion-card__info">
                      <p className="suggestion-card__name">
                        {s.name} <span className="suggestion-card__price">{s.price},00 €</span>
                      </p>
                      <p className="suggestion-card__desc">{s.desc}</p>
                      <button className="suggestion-card__btn">+ Añadir al Pedido</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA: Resumen ── */}
          <div className="cart-summary">
            <div className="cart-summary__header">
              <h2 className="cart-summary__title">Resumen de Cuenta</h2>
              <span className="badge">Mesa &amp; Domicilio</span>
            </div>

            {/* Tipo de entrega */}
            <div className="cart-delivery">
              <button
                className={`cart-delivery__btn ${delivery === 'envio' ? 'active' : ''}`}
                onClick={() => setDelivery('envio')}
              >
                🚗 Envío Gourmet
              </button>
              <button
                className={`cart-delivery__btn ${delivery === 'recogida' ? 'active' : ''}`}
                onClick={() => setDelivery('recogida')}
              >
                🏪 Recogida Bistro
              </button>
            </div>

            {delivery === 'envio' && (
              <div className="cart-delivery-time">
                <span>⏱ Tiempo estimado de llegada</span>
                <span className="cart-delivery-time__value">30 – 40 min</span>
                <p>Transporte climatizado de alta cocina</p>
              </div>
            )}

            {/* Desglose */}
            <div className="cart-breakdown">
              <div className="cart-breakdown__row">
                <span>Subtotal artículos ({items.length})</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              {delivery === 'envio' && (
                <div className="cart-breakdown__row">
                  <span>Gastos de Envío Exclusivo ⓘ</span>
                  <span>{SHIPPING.toFixed(2)} €</span>
                </div>
              )}
              <div className="cart-breakdown__row">
                <span>Impuestos (IVA 10% y 21% bodega)</span>
                <span>{taxes.toFixed(2)} €</span>
              </div>
            </div>

            {/* Propina */}
            <div className="cart-tip">
              <div className="cart-tip__header">
                <span>🙏 Gratificación al Equipo</span>
                <span className="cart-tip__optional">Opcional</span>
              </div>
              <div className="cart-tip__options">
                {TIP_OPTIONS.map(t => (
                  <button
                    key={t}
                    className={`cart-tip__btn ${tip === t ? 'active' : ''}`}
                    onClick={() => setTip(t)}
                  >
                    {t === 0 ? 'Libre' : `${t}%`}
                  </button>
                ))}
              </div>
              {tip > 0 && (
                <p className="cart-tip__amount">Propina seleccionada: +{tipAmount.toFixed(2)} €</p>
              )}
            </div>

            {/* Código promo */}
            <div className="cart-promo">
              <p className="cart-promo__label">Código de Invitación / Membresía</p>
              <div className="cart-promo__row">
                <input
                  type="text"
                  placeholder="Ej. GOLDENCLUB"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                />
                <button className="btn-outline">Aplicar</button>
              </div>
            </div>

            {/* Total */}
            <div className="cart-total">
              <div>
                <p className="cart-total__label">Total Liquidación</p>
                <p className="cart-total__sub">IVA & Servicio Incluidos</p>
              </div>
              <span className="cart-total__amount">{grandTotal.toFixed(2)} €</span>
            </div>

            <button className="btn-gold cart-checkout-btn" onClick={() => navigate('/checkout')}>
              🔒 Proceder al Pago Seguro
            </button>

            {/* Métodos de pago */}
            <div className="cart-payments">
              <p className="cart-payments__label">Métodos de Pago Encriptados</p>
              <div className="cart-payments__icons">
                {['Apple Pay', 'VISA', 'MC SECURE', 'AMEX'].map(m => (
                  <span key={m} className="cart-payment-badge">{m}</span>
                ))}
              </div>
              <p className="cart-payments__note">
                🔒 Cumplimiento estricto PSD2 y certificación bancaria SSL 256-bit
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}