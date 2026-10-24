import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { formatCOP } from '../utils/format'
import { useCart } from '../context/CartContext'
import { dishes } from '../data/dishes'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id }     = useParams<{ id: string }>()
  const navigate   = useNavigate()
  const { addItem } = useCart()

  const product = dishes.find(d => d.id === id)

  const [activeImage,    setActiveImage]    = useState(0)
  const [cooking,        setCooking]        = useState(product?.cookingOptions?.[1]?.id ?? '')
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [quantity,       setQuantity]       = useState(1)
  const [notes,          setNotes]          = useState('')
  const [added,          setAdded]          = useState(false)

  if (!product) {
    return (
      <main className="detail-page">
        <div className="container" style={{ paddingTop: '80px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--text)', marginBottom: '16px' }}>Plato no encontrado</h2>
          <Link to="/menu" className="btn-gold">← Volver al Menú</Link>
        </div>
      </main>
    )
  }

  const toggleExtra = (exId: string) => {
    setSelectedExtras(prev =>
      prev.includes(exId) ? prev.filter(e => e !== exId) : [...prev, exId]
    )
  }

  const totalPrice = (): number => {
    let price = product.price
    selectedExtras.forEach(exId => {
      const e = product.extras?.find(ex => ex.id === exId)
      if (e) price += e.price
    })
    return price * quantity
  }

  const handleAddToCart = () => {
    const cookingLabel = product.cookingOptions?.find(c => c.id === cooking)?.label
    addItem({
      id:       `${product.id}-${cooking}-${selectedExtras.join('-')}`,
      name:     product.name,
      price:    totalPrice() / quantity,
      quantity,
      image:    product.images[0],
      cooking:  cookingLabel,
      notes:    notes || undefined,
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      navigate('/carrito')
    }, 900)
  }

  const relatedDishes = dishes
    .filter(d => d.id !== product.id && d.category === product.category)
    .concat(dishes.filter(d => d.id !== product.id && d.category !== product.category))
    .slice(0, 3)

  return (
    <main className="detail-page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="detail-breadcrumb">
          <Link to="/menu">Menú</Link>
          <span>/</span>
          <Link to="/menu">{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="detail-layout">

          {/* ── GALERÍA ── */}
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="detail-gallery__img"
              />
            </div>

            {product.images.length > 1 && (
              <div className="detail-gallery__thumbs">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`detail-gallery__thumb ${activeImage === i ? 'detail-gallery__thumb--active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`Vista ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Alérgenos */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="detail-allergens">
                <p className="detail-allergens__label">
                  <i className="bi bi-exclamation-triangle" /> Alérgenos
                </p>
                <div className="detail-allergens__tags">
                  {product.allergens.map(a => (
                    <span key={a} className="detail-allergens__tag">{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── INFO ── */}
          <div className="detail-info">

            {/* Badges */}
            <div className="detail-info__badges">
              {product.badges.map(b => <span key={b} className="badge">{b}</span>)}
            </div>

            {/* Nombre y precio */}
            <div className="detail-info__header">
              <h1 className="detail-info__name">{product.name}</h1>
              <span className="detail-info__price">{formatCOP(product.price)}</span>
            </div>

            <p className="detail-info__desc">{product.fullDesc}</p>

            {/* Término de cocción */}
            {product.cookingOptions && product.cookingOptions.length > 0 && (
              <div className="detail-section">
                <p className="detail-section__label">Término de cocción</p>
                <div className="detail-cooking-opts">
                  {product.cookingOptions.map(opt => (
                    <button
                      key={opt.id}
                      className={`detail-cooking-opt ${cooking === opt.id ? 'detail-cooking-opt--active' : ''}`}
                      onClick={() => setCooking(opt.id)}
                    >
                      <span className="detail-cooking-opt__label">{opt.label}</span>
                      <span className="detail-cooking-opt__sub">{opt.sublabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Extras */}
            {product.extras && product.extras.length > 0 && (
              <div className="detail-section">
                <p className="detail-section__label">Adicionales</p>
                <div className="detail-extras">
                  {product.extras.map(ex => (
                    <label
                      key={ex.id}
                      className={`detail-extra ${selectedExtras.includes(ex.id) ? 'detail-extra--active' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(ex.id)}
                        onChange={() => toggleExtra(ex.id)}
                      />
                      <div className="detail-extra__content">
                        <span className="detail-extra__name">{ex.label}</span>
                        <span className="detail-extra__desc">{ex.desc}</span>
                      </div>
                      <span className="detail-extra__price">+{formatCOP(ex.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Notas */}
            <div className="detail-section">
              <p className="detail-section__label">
                <i className="bi bi-pencil" /> Instrucciones para cocina
              </p>
              <textarea
                className="detail-textarea"
                placeholder="Alergias, preferencias o indicaciones especiales..."
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {/* Cantidad + Agregar */}
            <div className="detail-add">
              <div className="detail-quantity">
                <button
                  className="detail-quantity__btn"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >−</button>
                <span className="detail-quantity__value">{quantity}</span>
                <button
                  className="detail-quantity__btn"
                  onClick={() => setQuantity(q => q + 1)}
                >+</button>
              </div>

              <button
                className={`btn-gold detail-add__btn ${added ? 'detail-add__btn--done' : ''}`}
                onClick={handleAddToCart}
                disabled={added}
              >
                {added
                  ? <><i className="bi bi-check" /> ¡Agregado!</>
                  : <><i className="bi bi-bag-plus" /> Agregar · {formatCOP(totalPrice())}</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Otros platos */}
        {relatedDishes.length > 0 && (
          <section className="detail-related">
            <h2 className="detail-related__title">También te puede gustar</h2>
            <div className="detail-related__grid">
              {relatedDishes.map(r => (
                <div key={r.id} className="related-card">
                  <Link to={`/menu/${r.id}`} className="related-card__img-link">
                    <div className="related-card__img-wrap">
                      <img src={r.image} alt={r.name} className="related-card__img" />
                      <span className="badge related-card__badge">{r.category}</span>
                    </div>
                  </Link>
                  <div className="related-card__body">
                    <h3 className="related-card__name">{r.name}</h3>
                    <div className="related-card__footer">
                      <span className="related-card__price">{formatCOP(r.price)}</span>
                      <button
                        className="btn-outline related-card__btn"
                        onClick={() => addItem({ id: r.id, name: r.name, price: r.price, quantity: 1, image: r.image })}
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}