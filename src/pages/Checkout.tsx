import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import './Checkout.css'

type DeliveryMode = 'envio' | 'recogida'
type PaymentTab   = 'tarjeta' | 'digital' | 'efectivo'
type TipOption    = 0 | 5 | 10 | 15

const formatCOP = (n: number) =>
  new Intl.NumberFormat('es-CO', {
    style:                 'currency',
    currency:              'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()

  const [delivery,     setDelivery]     = useState<DeliveryMode>('envio')
  const [payTab,       setPayTab]       = useState<PaymentTab>('tarjeta')
  const [tip,          setTip]          = useState<TipOption>(0)
  const [invoice,      setInvoice]      = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [discountCode, setDiscountCode] = useState('')
  const [discount,     setDiscount]     = useState(0)
  const [discountMsg,  setDiscountMsg]  = useState('')

  const [card, setCard] = useState({ holder: '', number: '', expiry: '', cvc: '' })
  const [addr, setAddr] = useState({ street: '', city: 'Medellín', notes: '' })

  const SHIPPING = delivery === 'envio' ? 8000 : 0
  const TIP_AMT  = total * (tip / 100)
  const GRAND    = total + SHIPPING + TIP_AMT - discount

  const generateOrderCode = () => 'GB-' + Math.floor(Math.random() * 90000 + 10000)

  const applyDiscount = async () => {
    const trimmed = discountCode.trim().toUpperCase()
    if (!trimmed) return

    try {
      const q    = query(collection(db, 'descuentos'), where('code', '==', trimmed))
      const snap = await getDocs(q)

      if (snap.empty) {
        setDiscount(0)
        setDiscountMsg('')
        setError('Código de descuento inválido.')
        return
      }

      const data   = snap.docs[0].data()
      const ref    = snap.docs[0].ref

      if (!data.active) {
        setError('Este código ya no está activo.')
        return
      }

      if (data.maxUses && data.uses >= data.maxUses) {
        setError('Este código ha alcanzado su límite de usos.')
        return
      }

      const amount = data.type === 'percentage'
        ? total * (data.value / 100)
        : Math.min(data.value, total)

      setDiscount(amount)
      setDiscountMsg(
        data.type === 'percentage'
          ? `Descuento del ${data.value}% aplicado: -${formatCOP(amount)}`
          : `Descuento de ${formatCOP(data.value)} aplicado`
      )
      setError('')

      // Incrementar el contador de usos
      await updateDoc(ref, { uses: increment(1) })

    } catch {
      setError('Error al validar el código. Intenta de nuevo.')
    }
  }

  const handlePay = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    setError('')
    setLoading(true)
    try {
      const orderCode = generateOrderCode()
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
        subtotal:         total,
        shipping:         SHIPPING,
        tip:              TIP_AMT,
        discount:         discount,
        total:            GRAND,
        delivery,
        paymentMethod:    payTab,
        address: delivery === 'envio'
          ? { street: addr.street, city: addr.city, notes: addr.notes }
          : null,
        invoiceRequested: invoice,
        status:           'pendiente',
        createdAt:        serverTimestamp(),
      }

      await addDoc(collection(db, 'pedidos'), orderData)

      // 1 punto por cada $1.000 COP
      const pointsEarned = Math.floor(GRAND / 1000)
      await updateDoc(doc(db, 'usuarios', user.uid), {
        points: increment(pointsEarned),
      })

      clearCart()
      navigate('/confirmacion', {
        state: { total: GRAND, code: orderCode, points: pointsEarned }
      })
    } catch (e) {
      console.error('Error al guardar pedido:', e)
      setError('Hubo un problema al procesar tu pedido. Intenta de nuevo.')
      setLoading(false)
    }
  }

  const setCardField = (f: keyof typeof card) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setCard(p => ({ ...p, [f]: e.target.value }))

  const setAddrField = (f: keyof typeof addr) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setAddr(p => ({ ...p, [f]: e.target.value }))

  return (
    <main className="checkout-page">
      <div className="container">

        {/* Stepper */}
        <nav className="checkout-stepper">
          <span className="checkout-stepper__step done">① Carrito</span>
          <span className="checkout-stepper__line" />
          <span className="checkout-stepper__step done">② Datos & Envío</span>
          <span className="checkout-stepper__line" />
          <span className="checkout-stepper__step active">③ Pago</span>
          <span className="checkout-stepper__lock">
            <i className="bi bi-lock-fill" /> Pago seguro
          </span>
        </nav>

        <h1 className="checkout-title">Finalizar pedido</h1>
        <p className="checkout-subtitle">
          Revisa tu pedido y elige cómo quieres recibirlo.
        </p>

        {!user && (
          <div className="auth-error" style={{ marginBottom: '24px' }}>
            <i className="bi bi-exclamation-triangle" /> Debes iniciar sesión para finalizar tu pedido.{' '}
            <a href="/login" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
              Iniciar sesión
            </a>
          </div>
        )}
        {error && <div className="auth-error" style={{ marginBottom: '24px' }}>{error}</div>}

        <div className="checkout-layout">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="checkout-left">

            {/* A. Entrega */}
            <div className="checkout-section">
              <div className="checkout-section__header">
                <span className="checkout-section__letter">A</span>
                <h2 className="checkout-section__title">¿Cómo quieres recibir tu pedido?</h2>
              </div>

              <div className="checkout-delivery-opts">
                <label className={`checkout-delivery-opt ${delivery === 'envio' ? 'active' : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === 'envio'}
                    onChange={() => setDelivery('envio')} />
                  <div className="checkout-delivery-opt__icon">
                    <i className="bi bi-scooter" />
                  </div>
                  <div className="checkout-delivery-opt__content">
                    <p className="checkout-delivery-opt__name">Domicilio</p>
                    <p className="checkout-delivery-opt__desc">
                      Te lo llevamos a tu puerta. Tiempo estimado de 40 a 60 minutos.
                    </p>
                    <span className="checkout-delivery-opt__price">
                      Costo: {formatCOP(8000)}
                    </span>
                    <span className="checkout-delivery-opt__time">40 – 60 min</span>
                  </div>
                </label>

                <label className={`checkout-delivery-opt ${delivery === 'recogida' ? 'active' : ''}`}>
                  <input type="radio" name="delivery" checked={delivery === 'recogida'}
                    onChange={() => setDelivery('recogida')} />
                  <div className="checkout-delivery-opt__icon">
                    <i className="bi bi-shop" />
                  </div>
                  <div className="checkout-delivery-opt__content">
                    <p className="checkout-delivery-opt__name">Recoger en el restaurante</p>
                    <p className="checkout-delivery-opt__desc">
                      Ven a recoger tu pedido directamente en el local.
                    </p>
                    <span className="checkout-delivery-opt__price">Sin costo adicional</span>
                    <span className="checkout-delivery-opt__time">Listo en 25 – 30 min</span>
                  </div>
                </label>
              </div>

              {delivery === 'envio' && (
                <div className="checkout-address">
                  <div className="checkout-addr-row">
                    <div className="checkout-field" style={{ flex: 2 }}>
                      <label>Dirección</label>
                      <input
                        type="text"
                        placeholder="Calle, número, apartamento..."
                        value={addr.street}
                        onChange={setAddrField('street')}
                      />
                    </div>
                    <div className="checkout-field">
                      <label>Ciudad</label>
                      <select value={addr.city} onChange={setAddrField('city')}
                        style={{
                          width: '100%', background: 'var(--surface)',
                          border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                          color: 'var(--text)', padding: '10px 14px', fontSize: '13px',
                        }}>
                        <option>Medellín</option>
                        <option>Bogotá</option>
                      </select>
                    </div>
                  </div>
                  <div className="checkout-field">
                    <input
                      type="text"
                      placeholder="Barrio, punto de referencia..."
                      value={addr.notes}
                      onChange={setAddrField('notes')}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* B. Método de pago */}
            <div className="checkout-section">
              <div className="checkout-section__header">
                <span className="checkout-section__letter">B</span>
                <h2 className="checkout-section__title">Método de pago</h2>
                <span className="badge">
                  <i className="bi bi-lock-fill" /> Seguro
                </span>
              </div>

              <div className="checkout-pay-tabs">
                {([
                  ['tarjeta', 'bi bi-credit-card', 'Tarjeta'],
                  ['digital', 'bi bi-phone',        'Nequi / Daviplata'],
                  ['efectivo','bi bi-cash-stack',    'Efectivo'],
                ] as const).map(([id, icon, label]) => (
                  <button
                    key={id}
                    className={`checkout-pay-tab ${payTab === id ? 'active' : ''}`}
                    onClick={() => setPayTab(id)}
                  >
                    <i className={icon} /> {label}
                  </button>
                ))}
              </div>

              {payTab === 'tarjeta' && (
                <div className="checkout-card-form">
                  <div className="checkout-card-brands">
                    {['VISA', 'MASTERCARD', 'AMEX'].map(b => (
                      <span key={b} className="checkout-card-brand">{b}</span>
                    ))}
                  </div>
                  <div className="checkout-field">
                    <label>Nombre en la tarjeta</label>
                    <input type="text" placeholder="NOMBRE APELLIDO"
                      value={card.holder} onChange={setCardField('holder')} />
                  </div>
                  <div className="checkout-field">
                    <label>Número de tarjeta</label>
                    <input type="text" placeholder="•••• •••• •••• 0000"
                      value={card.number} onChange={setCardField('number')} maxLength={19} />
                  </div>
                  <div className="checkout-addr-row">
                    <div className="checkout-field">
                      <label>Vencimiento</label>
                      <input type="text" placeholder="MM / AA"
                        value={card.expiry} onChange={setCardField('expiry')} maxLength={7} />
                    </div>
                    <div className="checkout-field">
                      <label>CVC</label>
                      <input type="password" placeholder="•••"
                        value={card.cvc} onChange={setCardField('cvc')} maxLength={4} />
                    </div>
                  </div>
                </div>
              )}

              {payTab === 'digital' && (
                <div className="checkout-digital">
                  <button className="checkout-digital__btn">
                    <i className="bi bi-phone" /> Pagar con Nequi
                  </button>
                  <button className="checkout-digital__btn">
                    <i className="bi bi-phone" /> Pagar con Daviplata
                  </button>
                </div>
              )}

              {payTab === 'efectivo' && (
                <div className="checkout-club-pay">
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    <i className="bi bi-info-circle" /> Pagas en efectivo al recibir o recoger el
                    pedido. Ten el valor exacto listo si es posible.
                  </p>
                </div>
              )}

              {/* Propina opcional */}
              <div className="checkout-tip">
                <div className="checkout-tip__header">
                  <span>
                    Propina{' '}
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>(opcional)</span>
                  </span>
                  {tip > 0 && (
                    <span className="checkout-tip__amount">
                      +{tip}% ({formatCOP(TIP_AMT)})
                    </span>
                  )}
                </div>
                <div className="checkout-tip__opts">
                  {([0, 5, 10, 15] as TipOption[]).map(t => (
                    <button
                      key={t}
                      className={`checkout-tip__btn ${tip === t ? 'active' : ''}`}
                      onClick={() => setTip(t)}
                    >
                      {t === 0 ? 'Sin propina' : `${t}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Código de descuento */}
              <div className="checkout-discount">
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)', marginBottom: '8px' }}>
                  <i className="bi bi-tag" /> Código de descuento
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Ingresa tu código aquí"
                    value={discountCode}
                    onChange={e => setDiscountCode(e.target.value)}
                    style={{
                      flex: 1, background: 'var(--surface)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                      color: 'var(--text)', padding: '10px 14px', fontSize: '13px',
                    }}
                  />
                  <button
                    className="btn-outline"
                    onClick={applyDiscount}
                    style={{ fontSize: '12px', padding: '10px 16px', whiteSpace: 'nowrap' }}
                  >
                    Aplicar
                  </button>
                </div>
                {discountMsg && (
                  <p style={{ fontSize: '12px', color: '#5cb85c', marginTop: '6px' }}>
                    <i className="bi bi-check-circle" /> {discountMsg}
                  </p>
                )}
              </div>

              {/* Factura */}
              <label className="checkout-invoice">
                <div>
                  <p className="checkout-invoice__label">¿Necesitas factura?</p>
                  <p className="checkout-invoice__sub">
                    Indícanos tus datos de facturación al finalizar.
                  </p>
                </div>
                <div
                  className={`checkout-toggle ${invoice ? 'on' : ''}`}
                  onClick={() => setInvoice(!invoice)}
                />
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
                  ? 'Inicia sesión para pagar'
                  : `Confirmar y pagar ${formatCOP(GRAND)} →`}
            </button>
            <p className="checkout-legal">
              Al confirmar, aceptas nuestros Términos de Servicio. Precios incluyen IVA.
            </p>
          </div>

          {/* ── COLUMNA DERECHA: Resumen ── */}
          <div className="checkout-summary">
            <div className="checkout-summary__header">
              <h3 className="checkout-summary__title">Resumen del pedido</h3>
              <span className="badge">
                {items.length} {items.length === 1 ? 'producto' : 'productos'}
              </span>
            </div>

            <div className="checkout-summary__items">
              {items.map(item => (
                <div key={item.id} className="checkout-summary__item">
                  <img src={item.image} alt={item.name} className="checkout-summary__img" />
                  <div className="checkout-summary__info">
                    <p className="checkout-summary__name">{item.name}</p>
                    {item.cooking && (
                      <span className="checkout-summary__tag">Término: {item.cooking}</span>
                    )}
                    <span className="checkout-summary__tag">x{item.quantity}</span>
                  </div>
                  <span className="checkout-summary__price">
                    {formatCOP(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary__breakdown">
              <div className="checkout-summary__row">
                <span>Subtotal</span><span>{formatCOP(total)}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Domicilio</span>
                <span>{SHIPPING > 0 ? formatCOP(SHIPPING) : 'Gratis'}</span>
              </div>
              {tip > 0 && (
                <div className="checkout-summary__row">
                  <span>Propina ({tip}%)</span><span>+ {formatCOP(TIP_AMT)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="checkout-summary__row" style={{ color: '#5cb85c' }}>
                  <span>Descuento</span><span>- {formatCOP(discount)}</span>
                </div>
              )}
            </div>

            <div className="checkout-summary__total">
              <span>Total</span>
              <span className="checkout-summary__total-amount">{formatCOP(GRAND)}</span>
            </div>
            <p className="checkout-summary__total-sub">Precios incluyen IVA</p>

            {user && (
              <div style={{
                background: 'rgba(201,168,76,0.08)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '12px 16px',
                marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)',
              }}>
                <i className="bi bi-star" /> Ganarás{' '}
                <strong style={{ color: 'var(--gold)' }}>
                  {Math.floor(GRAND / 1000)} puntos
                </strong>{' '}
                con este pedido.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}