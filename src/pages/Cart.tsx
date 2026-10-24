import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatCOP } from '../utils/format'
import { useCart } from '../context/CartContext'
import './Cart.css'

const suggestions = [
  {
    id: 'b1',
    name: 'Jugo Natural',
    price: 7000,
    desc: 'Maracuyá, lulo, mora o naranja',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&q=80',
  },
  {
    id: 'd1',
    name: 'Arroz con Leche',
    price: 9000,
    desc: 'Con canela y panela, postre casero',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=200&q=80',
  },
]

const SHIPPING    = 8000
const TIP_OPTIONS = [0, 5, 10, 15] as const
type TipOption    = typeof TIP_OPTIONS[number]

export default function Cart() {
  const navigate = useNavigate()
  const { items, updateQuantity, removeItem, total, addItem } = useCart()

  const [delivery,   setDelivery]   = useState<'envio' | 'recogida'>('envio')
  const [tip,        setTip]        = useState<TipOption>(0)
  const [notes,      setNotes]      = useState('')
  const [promoCode,  setPromoCode]  = useState('')

  const shipping   = delivery === 'envio' ? SHIPPING : 0
  const tipAmount  = total * (tip / 100)
  const grandTotal = total + shipping + tipAmount

  if (items.length === 0) {
    return (
      <main className="cart-empty">
        <div className="cart-empty__content">
          <i className="bi bi-bag" style={{ fontSize: '48px', color: 'var(--gold)' }} />
          <h2>Tu carrito está vacío</h2>
          <p>Explora nuestro menú y agrega lo que quieras.</p>
          <Link to="/menu" className="btn-gold">Ver el Menú</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="cart-page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="cart-breadcrumb">
          <Link to="/menu">Menú</Link>
          <span>/</span>
          <span>Tu Carrito</span>
        </nav>

        <div className="cart-header">
          <h1 className="cart-title">
            Carrito
            <span className="cart-count">{items.length} {items.length === 1 ? 'producto' : 'productos'}</span>
          </h1>
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
                    <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                      <i className="bi bi-trash" />
                    </button>
                  </div>

                  {item.cooking && (
                    <div className="cart-item__tags">
                      <span className="cart-item__tag">
                        <i className="bi bi-check" /> {item.cooking}
                      </span>
                    </div>
                  )}

                  <div className="cart-item__bottom">
                    <div className="cart-item__qty">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <div>
                      <p className="cart-item__unit">
                        Precio unitario: {formatCOP(item.price)}
                      </p>
                      <p className="cart-item__total">
                        {formatCOP(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Notas para cocina */}
            <div className="cart-kitchen-notes">
              <p className="cart-kitchen-notes__label">
                <i className="bi bi-pencil" /> Instrucciones para cocina
              </p>
              <textarea
                className="cart-kitchen-notes__input"
                placeholder="Alergias, restricciones alimentarias o preferencias de preparación..."
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {/* Sugerencias */}
            <div className="cart-suggestions">
              <div className="cart-suggestions__header">
                <h3 className="cart-suggestions__title">
                  <i className="bi bi-stars" /> También te puede gustar
                </h3>
              </div>
              <div className="cart-suggestions__grid">
                {suggestions.map(s => (
                  <div key={s.id} className="suggestion-card">
                    <img src={s.image} alt={s.name} className="suggestion-card__img" />
                    <div className="suggestion-card__info">
                      <p className="suggestion-card__name">
                        {s.name}
                        <span className="suggestion-card__price"> · {formatCOP(s.price)}</span>
                      </p>
                      <p className="suggestion-card__desc">{s.desc}</p>
                      <button
                        className="suggestion-card__btn"
                        onClick={() =>
                          addItem({ id: s.id, name: s.name, price: s.price, quantity: 1, image: s.image })
                        }
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA: Resumen ── */}
          <div className="cart-summary">
            <div className="cart-summary__header">
              <h2 className="cart-summary__title">Resumen</h2>
            </div>

            {/* Tipo de entrega */}
            <div className="cart-delivery">
              <button
                className={`cart-delivery__btn ${delivery === 'envio' ? 'active' : ''}`}
                onClick={() => setDelivery('envio')}
              >
                <i className="bi bi-scooter" /> Domicilio
              </button>
              <button
                className={`cart-delivery__btn ${delivery === 'recogida' ? 'active' : ''}`}
                onClick={() => setDelivery('recogida')}
              >
                <i className="bi bi-shop" /> Recoger
              </button>
            </div>

            {delivery === 'envio' && (
              <div className="cart-delivery-time">
                <span><i className="bi bi-clock" /> Tiempo estimado</span>
                <span className="cart-delivery-time__value">40 – 60 min</span>
              </div>
            )}

            {/* Desglose */}
            <div className="cart-breakdown">
              <div className="cart-breakdown__row">
                <span>Subtotal ({items.length} productos)</span>
                <span>{formatCOP(total)}</span>
              </div>
              {delivery === 'envio' && (
                <div className="cart-breakdown__row">
                  <span>Domicilio</span>
                  <span>{formatCOP(SHIPPING)}</span>
                </div>
              )}
            </div>

            {/* Propina opcional */}
            <div className="cart-tip">
              <div className="cart-tip__header">
                <span>Propina</span>
                <span className="cart-tip__optional">opcional</span>
              </div>
              <div className="cart-tip__options">
                {TIP_OPTIONS.map(t => (
                  <button
                    key={t}
                    className={`cart-tip__btn ${tip === t ? 'active' : ''}`}
                    onClick={() => setTip(t)}
                  >
                    {t === 0 ? 'Sin propina' : `${t}%`}
                  </button>
                ))}
              </div>
              {tip > 0 && (
                <p className="cart-tip__amount">
                  Propina: +{formatCOP(tipAmount)}
                </p>
              )}
            </div>

            {/* Código de descuento */}
            <div className="cart-promo">
              <p className="cart-promo__label">
                <i className="bi bi-tag" /> Código de descuento
              </p>
              <div className="cart-promo__row">
                <input
                  type="text"
                  placeholder="Ingresa tu código"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                />
                <button className="btn-outline">Aplicar</button>
              </div>
            </div>

            {/* Total */}
            <div className="cart-total">
              <div>
                <p className="cart-total__label">Total</p>
                <p className="cart-total__sub">Precios incluyen IVA</p>
              </div>
              <span className="cart-total__amount">{formatCOP(grandTotal)}</span>
            </div>

            <button
              className="btn-gold cart-checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              <i className="bi bi-lock-fill" /> Ir a pagar
            </button>

            {/* Métodos de pago */}
            <div className="cart-payments">
              <p className="cart-payments__label">Métodos de pago aceptados</p>
              <div className="cart-payments__icons">
                {['VISA', 'MASTERCARD', 'NEQUI', 'DAVIPLATA', 'EFECTIVO'].map(m => (
                  <span key={m} className="cart-payment-badge">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}