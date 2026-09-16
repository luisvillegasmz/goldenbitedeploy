// REEMPLAZA el contenido de: src/pages/Checkout.tsx
// Este archivo agrega la integración real con Firebase Firestore

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import './Checkout.css'

type DeliveryMode = 'envio' | 'recogida'
type PaymentTab   = 'tarjeta' | 'digital' | 'club'
type TipOption    = 0 | 10 | 15 | 20

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const { user, profile } = useAuth()

  const [delivery, setDelivery]   = useState<DeliveryMode>('envio')
  const [payTab,   setPayTab]     = useState<PaymentTab>('tarjeta')
  const [tip,      setTip]        = useState<TipOption>(15)
  const [invoice,  setInvoice]    = useState(false)
  const [loading,  setLoading]    = useState(false)
  const [error,    setError]      = useState('')

  const [card, setCard] = useState({ holder: '', number: '', expiry: '', cvc: '' })
  const [addr, setAddr] = useState({ street: '', postal: '', notes: '' })

  const SHIPPING  = delivery === 'envio' ? 12.5 : 0
  const TAX       = total * 0.1
  const TIP_AMT   = total * (tip / 100)
  const GRAND     = total + SHIPPING + TAX + TIP_AMT

  const generateOrderCode = () => 'GB-' + Math.floor(Math.random() * 90000 + 10000)

  const handlePay = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }

    setError('')
    setLoading(true)

    try {
      const orderCode = generateOrderCode()

      // Guardar pedido en Firestore
      const orderData = {
        userId:    user.uid,
        userEmail: user.email,
        code:      orderCode,
        items:     items.map(i => ({
          id:       i.id,
          name:     i.name,
          price:    i.price,
          quantity: i.quantity,
          image:    i.image,
          cooking:  i.cooking || null,
        })),
        subtotal:   total,
        shipping:   SHIPPING,
        tax:        TAX,
        tip:        TIP_AMT,
        total:      GRAND,
        delivery,
        paymentMethod: payTab,
        address: delivery === 'envio' ? {
          street: addr.street,
          postal: addr.postal,
          notes:  addr.notes,
        } : null,
        invoiceRequested: invoice,
        status:    'processing',
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, 'orders'), orderData)

      // Sumar puntos al usuario (1 punto por euro)
      const pointsEarned = Math.floor(GRAND)
      await updateDoc(doc(db, 'users', user.uid), {
        points: increment(pointsEarned),
      })

      clearCart()
      navigate('/confirmacion', {
        state: { total: GRAND, code: orderCode, points: pointsEarned }
      })
    } catch (e) {
      console.error('Error saving order:', e)
      setError('Hubo un problema al procesar tu pedido. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const setCardField = (f: keyof typeof card) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setCard(p => ({ ...p, [f]: e.target.value }))

  const setAddrField = (f: keyof typeof addr) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setAddr(p => ({ ...p, [f]: e.target.value }))

  return (
    <main className="checkout-page">
      <div className="container">
        {/* Stepper */}
        <nav className="checkout-stepper">
          <span className="checkout-stepper__step done">① Carrito</span>
          <span className="checkout-stepper__line" />
          <span className="checkout-stepper__step done">② Datos &amp; Envío</span>
          <span className="checkout-stepper__line" />
          <span className="checkout-stepper__step active">③ Pago Seguro</span>
          <span className="checkout-stepper__lock">🔒 SSL-256-BIT PSD2</span>
        </nav>

        <p className="section-label">Haute Cuisine À Domicile</p>
        <h1 className="checkout-title">Finalización de Experiencia Privada</h1>
        <p className="checkout-subtitle">
          Confirmación de comandas exclusivas preparadas por nuestro equipo culinario
          bajo demanda y entregadas con protocolo White-Glove climatizado.
        </p>

        {/* Aviso sesión */}
        {!user && (
          <div className="auth-error" style={{ marginBottom: '24px' }}>
            ⚠ Debes iniciar sesión para finalizar tu compra.{' '}
            <a href="/login" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>Iniciar sesión</a>
          </div>
        )}

        {/* Error de pago */}
        {error && <div className="auth-error" style={{ marginBottom: '24px' }}>{error}</div>}

        <div className="checkout-layout">
          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="checkout-left">

            {/* A. Modalidad de Recepción */}
            <div className="checkout-section">
              <div className="checkout-section__header">
                <span className="checkout-section__letter">A</span>
                <h2 className="checkout-section__title">Modalidad de Recepción</h2>
                <span className="badge">Servicio Exclusivo</span>
              </div>

              <div className="checkout-delivery-opts">
                <label className={`checkout-delivery-opt ${delivery === 'envio' ? 'active' : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === 'envio'} onChange={() => setDelivery('envio')} />
                  <div className="checkout-delivery-opt__icon">🚗</div>
                  <div className="checkout-delivery-opt__content">
                    <p className="checkout-delivery-opt__name">Envío Gourmet White-Glove</p>
                    <p className="checkout-delivery-opt__desc">Transporte térmico especializado en estuche lacado sellado al vacío y presentación de mesa.</p>
                    <span className="checkout-delivery-opt__price">Suplemento: 12,50 €</span>
                    <span className="checkout-delivery-opt__time">45 – 55 min</span>
                  </div>
                </label>
                <label className={`checkout-delivery-opt ${delivery === 'recogida' ? 'active' : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === 'recogida'} onChange={() => setDelivery('recogida')} />
                  <div className="checkout-delivery-opt__icon">🏪</div>
                  <div className="checkout-delivery-opt__content">
                    <p className="checkout-delivery-opt__name">Recogida en Bistró (Pick-up)</p>
                    <p className="checkout-delivery-opt__desc">Retiro prioritario en nuestro mostrador privado concierge sin esperas ni colas.</p>
                    <span className="checkout-delivery-opt__price">Sin coste adicional</span>
                    <span className="checkout-delivery-opt__time">Listo en 30 min</span>
                  </div>
                </label>
              </div>

              {delivery === 'envio' && (
                <div className="checkout-address">
                  <div className="checkout-addr-row">
                    <div className="checkout-field" style={{ flex: 2 }}>
                      <label>Dirección Privada de Entrega</label>
                      <input type="text" placeholder="Calle, número, piso..." value={addr.street} onChange={setAddrField('street')} />
                    </div>
                    <div className="checkout-field">
                      <label>Código Postal</label>
                      <input type="text" placeholder="28006, Madrid" value={addr.postal} onChange={setAddrField('postal')} />
                    </div>
                  </div>
                  <div className="checkout-field">
                    <input
                      type="text"
                      placeholder="Instrucciones al sommelier o conserje..."
                      value={addr.notes}
                      onChange={setAddrField('notes')}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* B. Método de Pago */}
            <div className="checkout-section">
              <div className="checkout-section__header">
                <span className="checkout-section__letter">B</span>
                <h2 className="checkout-section__title">Método de Pago Encriptado</h2>
                <span className="badge">🔒 Garantía Bancaria 3D Secure</span>
              </div>

              <div className="checkout-pay-tabs">
                {([['tarjeta','💳 Tarjeta Bancaria'], ['digital','🍎 Apple / Google Pay'], ['club','⭐ Club Privé Concierge']] as const).map(([id, label]) => (
                  <button key={id} className={`checkout-pay-tab ${payTab === id ? 'active' : ''}`} onClick={() => setPayTab(id)}>
                    {label}
                  </button>
                ))}
              </div>

              {payTab === 'tarjeta' && (
                <div className="checkout-card-form">
                  <div className="checkout-card-brands">
                    {['VISA', 'MASTERCARD', 'AMEX CENTURION'].map(b => (
                      <span key={b} className="checkout-card-brand">{b}</span>
                    ))}
                  </div>
                  <div className="checkout-field">
                    <label>Titular de la Tarjeta</label>
                    <input type="text" placeholder="NOMBRE APELLIDO" value={card.holder} onChange={setCardField('holder')} />
                  </div>
                  <div className="checkout-field">
                    <label>Número de Tarjeta</label>
                    <input type="text" placeholder="•••• •••• •••• 4892" value={card.number} onChange={setCardField('number')} maxLength={19} />
                  </div>
                  <div className="checkout-addr-row">
                    <div className="checkout-field">
                      <label>Fecha de Caducidad</label>
                      <input type="text" placeholder="09 / 28" value={card.expiry} onChange={setCardField('expiry')} maxLength={7} />
                    </div>
                    <div className="checkout-field">
                      <label>Código CVC / CVV 🛡</label>
                      <input type="password" placeholder="•••" value={card.cvc} onChange={setCardField('cvc')} maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              {payTab === 'digital' && (
                <div className="checkout-digital">
                  <button className="checkout-digital__btn">🍎 Pagar con Apple Pay</button>
                  <button className="checkout-digital__btn">G Pagar con Google Pay</button>
                </div>
              )}

              {payTab === 'club' && (
                <div className="checkout-club-pay">
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Tu crédito Club Privé se aplicará automáticamente al confirmar el pedido.
                    {profile && <span> Puntos disponibles: <strong style={{ color: 'var(--gold)' }}>{profile.points ?? 0}</strong></span>}
                  </p>
                </div>
              )}

              {/* Tip */}
              <div className="checkout-tip">
                <div className="checkout-tip__header">
                  <span>Gratificación al Equipo de Cocina &amp; Sommelier</span>
                  <span className="checkout-tip__amount">+{tip}% ({TIP_AMT.toFixed(2)} €)</span>
                </div>
                <div className="checkout-tip__opts">
                  {([0, 10, 15, 20] as TipOption[]).map(t => (
                    <button key={t} className={`checkout-tip__btn ${tip === t ? 'active' : ''}`} onClick={() => setTip(t)}>
                      {t === 0 ? '0%' : `${t}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Factura fiscal */}
              <label className="checkout-invoice">
                <div>
                  <p className="checkout-invoice__label">¿Desea factura fiscal desglosada?</p>
                  <p className="checkout-invoice__sub">Válido para empresas y deducción ejecutiva.</p>
                </div>
                <div className={`checkout-toggle ${invoice ? 'on' : ''}`} onClick={() => setInvoice(!invoice)} />
              </label>
            </div>

            {/* Botón pagar */}
            <button
              className="btn-gold checkout-pay-btn"
              onClick={handlePay}
              disabled={loading || !user}
            >
              {loading
                ? 'Procesando pedido...'
                : !user
                  ? '🔒 Inicia sesión para pagar'
                  : `🔒 Confirmar y Pagar ${GRAND.toFixed(2)} € →`}
            </button>
            <p className="checkout-legal">
              Transacción procesada de forma segura. Al confirmar, aceptas nuestros Términos de Servicio.
            </p>
          </div>

          {/* ── COLUMNA DERECHA: Resumen ── */}
          <div className="checkout-summary">
            <p className="section-label" style={{ marginBottom: '4px' }}>Comanda Privada</p>
            <div className="checkout-summary__header">
              <h3 className="checkout-summary__title">Resumen de Degustación</h3>
              <span className="badge">{items.length} Artículos</span>
            </div>

            <div className="checkout-summary__items">
              {items.map(item => (
                <div key={item.id} className="checkout-summary__item">
                  <img src={item.image} alt={item.name} className="checkout-summary__img" />
                  <div className="checkout-summary__info">
                    <p className="checkout-summary__name">{item.name}</p>
                    {item.cooking && <span className="checkout-summary__tag">Punto: {item.cooking}</span>}
                  </div>
                  <span className="checkout-summary__price">{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
            </div>

            <div className="checkout-summary__breakdown">
              <div className="checkout-summary__row"><span>Subtotal Gastronómico</span><span>{total.toFixed(2)} €</span></div>
              <div className="checkout-summary__row"><span>Envío White-Glove Climatizado</span><span>{SHIPPING.toFixed(2)} €</span></div>
              <div className="checkout-summary__row"><span>Impuestos (IVA 10%)</span><span>{TAX.toFixed(2)} €</span></div>
              <div className="checkout-summary__row gold"><span>Gratificación ({tip}%)</span><span>+ {TIP_AMT.toFixed(2)} €</span></div>
            </div>

            <div className="checkout-summary__total">
              <span>Importe Total</span>
              <span className="checkout-summary__total-amount">{GRAND.toFixed(2)} €</span>
            </div>
            <p className="checkout-summary__total-sub">Cargos finales con IVA</p>

            {/* Puntos a ganar */}
            {user && (
              <div style={{
                background: 'rgba(201,168,76,0.08)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '12px 16px',
                marginTop: '16px',
                fontSize: '13px',
                color: 'var(--text-muted)',
              }}>
                ⭐ Ganarás <strong style={{ color: 'var(--gold)' }}>{Math.floor(GRAND)} puntos</strong> Gourmet Club con este pedido.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}