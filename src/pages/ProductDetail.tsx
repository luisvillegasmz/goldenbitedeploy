import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { dishes } from '../data/dishes'
import './ProductDetail.css'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()

  const product = dishes.find((d) => d.id === id)

  const [activeImage, setActiveImage] = useState(0)
  const [cooking, setCooking] = useState(
    product?.cookingOptions?.[1]?.id ?? ''
  )
  const [selectedExtras, setSelectedExtras] = useState<string[]>([])
  const [addPairing, setAddPairing] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [added, setAdded] = useState(false)

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
    setSelectedExtras((prev) =>
      prev.includes(exId) ? prev.filter((e) => e !== exId) : [...prev, exId]
    )
  }

  const totalPrice = () => {
    let total = product.price
    selectedExtras.forEach((exId) => {
      const e = product.extras?.find((ex) => ex.id === exId)
      if (e) total += e.price
    })
    if (addPairing && product.pairing) total += product.pairing.price
    return (total * quantity).toFixed(2)
  }

  const handleAddToCart = () => {
    const cookingLabel =
      product.cookingOptions?.find((c) => c.id === cooking)?.label
    addItem({
      id: `${product.id}-${cooking}-${selectedExtras.join('-')}-${addPairing}`,
      name: product.name,
      price: parseFloat(totalPrice()) / quantity,
      quantity,
      image: product.images[0],
      cooking: cookingLabel,
      notes: notes || undefined,
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      navigate('/carrito')
    }, 900)
  }

  const relatedDishes = dishes
    .filter((d) => d.id !== product.id && d.category === product.category)
    .concat(dishes.filter((d) => d.id !== product.id && d.category !== product.category))
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

          {/* ── COLUMNA IZQUIERDA: Galería ── */}
          <div className="detail-gallery">
            <div className="detail-gallery__main">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="detail-gallery__img"
              />
              <span className="badge detail-gallery__label">
                Emplatado de Autor · Foto {activeImage + 1} de {product.images.length}
              </span>
            </div>

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

            {/* Alérgenos */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="detail-allergens">
                <p className="detail-allergens__label">⚠ Alérgenos</p>
                <div className="detail-allergens__tags">
                  {product.allergens.map((a) => (
                    <span key={a} className="detail-allergens__tag">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Maridaje del sommelier */}
            {product.pairing && (
              <div className="detail-pairing">
                <div className="detail-pairing__icon">🍷</div>
                <div className="detail-pairing__info">
                  <p className="detail-pairing__label">Maridaje seleccionado por sommelier</p>
                  <p className="detail-pairing__name">{product.pairing.name}</p>
                  <p className="detail-pairing__desc">{product.pairing.desc}</p>
                </div>
                <div className="detail-pairing__right">
                  <span className="detail-pairing__price">+{product.pairing.price},00 €</span>
                  <button
                    className={`btn-outline detail-pairing__btn ${addPairing ? 'active' : ''}`}
                    onClick={() => setAddPairing(!addPairing)}
                  >
                    {addPairing ? '✓ Añadida' : '+ Añadir Copa'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── COLUMNA DERECHA: Info + Personalización ── */}
          <div className="detail-info">
            {/* Badges */}
            <div className="detail-info__badges">
              {product.badges.map((b) => <span key={b} className="badge">{b}</span>)}
            </div>

            {/* Nombre y precio */}
            <div className="detail-info__header">
              <h1 className="detail-info__name">{product.name}</h1>
              <span className="detail-info__price">{product.price.toFixed(2)} €</span>
            </div>

            <p className="detail-info__desc">{product.fullDesc}</p>

            {/* Punto de la carne */}
            {product.cookingOptions && product.cookingOptions.length > 0 && (
              <div className="detail-section">
                <div className="detail-section__header">
                  <p className="detail-section__label">Punto de la Carne</p>
                  <span className="detail-section__note">*Recomendación del Chef: {product.cookingOptions[0].label}</span>
                </div>
                <div className="detail-cooking-opts">
                  {product.cookingOptions.map((opt) => (
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
                <p className="detail-section__label">Extras Gastronómicos</p>
                <div className="detail-extras">
                  {product.extras.map((ex) => (
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
                      <span className="detail-extra__price">+{ex.price},00 €</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Nota especial */}
            <div className="detail-section">
              <p className="detail-section__label">Peticiones Especiales para el Chef</p>
              <textarea
                className="detail-textarea"
                placeholder="Indique requerimientos específicos o preferencias de servicio..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Cantidad + Añadir al pedido */}
            <div className="detail-add">
              <div className="detail-quantity">
                <button
                  className="detail-quantity__btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >−</button>
                <span className="detail-quantity__value">{quantity}</span>
                <button
                  className="detail-quantity__btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >+</button>
              </div>

              <button
                className={`btn-gold detail-add__btn ${added ? 'detail-add__btn--done' : ''}`}
                onClick={handleAddToCart}
                disabled={added}
              >
                {added ? '✓ ¡Añadido al carrito!' : `🛒 Añadir al Pedido · ${totalPrice()} €`}
              </button>
            </div>

            <p className="detail-add__note">
              Servicio exclusivo para comensales en sala y experiencia privada a domicilio.
            </p>
          </div>
        </div>

        {/* ── COMPLEMENTOS ── */}
        {relatedDishes.length > 0 && (
          <section className="detail-related">
            <p className="section-label">Armonías Culinarias</p>
            <h2 className="detail-related__title">Complementos Ideales de Nuestra Carta</h2>
            <div className="detail-related__grid">
              {relatedDishes.map((r) => (
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
                      <span className="related-card__price">{r.price.toFixed(2)} €</span>
                      <button
                        className="btn-outline related-card__btn"
                        onClick={() =>
                          addItem({
                            id: r.id,
                            name: r.name,
                            price: r.price,
                            quantity: 1,
                            image: r.image,
                          })
                        }
                      >
                        + Añadir
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