import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { dishes } from '../data/dishes'
import './Menu.css'

const categories = [
  'Todos',
  'Hamburguesas de Autor',
  'Cortes & Grill',
  'Entrantes Exclusivos',
  'Guarniciones Trufadas',
  'Postres & Vinos',
]

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [addedId, setAddedId] = useState<string | null>(null)
  const { addItem } = useCart()

  const filtered =
    activeCategory === 'Todos'
      ? dishes
      : dishes.filter((d) => d.category === activeCategory)

  const handleQuickAdd = (dish: typeof dishes[0]) => {
    addItem({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image,
    })
    setAddedId(dish.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <main className="menu-page">

      {/* ── HERO MENÚ ── */}
      <section className="menu-hero">
        <div className="menu-hero__bg" />
        <div className="menu-hero__overlay" />
        <div className="container menu-hero__content">
          <span className="badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
            🌿 TEMPORADA DE OTOÑO & CAZA
          </span>
          <h1 className="menu-hero__title">Nuestra Carta Gourmet</h1>
          <p className="menu-hero__subtitle">
            Sabores de autor elaborados con ingredientes de origen seleccionado,
            maduraciones artesanales y el fuego preciso de nuestro grill de encina.
          </p>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <div className="menu-filters">
        <div className="container menu-filters__inner">
          <div className="menu-filters__tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`menu-filters__tab ${activeCategory === cat ? 'menu-filters__tab--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="menu-filters__extra">⚙ Filtrar Alérgenos</button>
        </div>
      </div>

      {/* ── GRID DE PLATOS ── */}
      <section className="menu-grid-section">
        <div className="container">
          <p className="section-label" style={{ marginBottom: '8px' }}>CAPÍTULO I</p>
          <h2 className="menu-section-title">Selección Culinaria</h2>
          <p className="menu-section-desc">
            Platos cocinados a baja temperatura, ahumados con leña noble y
            rematados con salsas reducidas durante 36 horas.
          </p>

          <div className="menu-grid">
            {filtered.map((dish) => (
              <div key={dish.id} className="menu-card">
                <Link to={`/menu/${dish.id}`} className="menu-card__img-link">
                  <div className="menu-card__img-wrap">
                    <img src={dish.image} alt={dish.name} className="menu-card__img" />
                    <div className="menu-card__badges">
                      {dish.badges.map((b) => (
                        <span key={b} className="badge">{b}</span>
                      ))}
                    </div>
                    <span className="menu-card__price">{dish.price.toFixed(2)} €</span>
                    <div className="menu-card__hover-overlay">
                      <span>Ver Detalles</span>
                    </div>
                  </div>
                </Link>

                <div className="menu-card__body">
                  <Link to={`/menu/${dish.id}`} className="menu-card__name-link">
                    <h3 className="menu-card__name">{dish.name}</h3>
                  </Link>
                  <p className="menu-card__desc">{dish.desc}</p>

                  <div className="menu-card__options">
                    {dish.options.map((opt, i) => (
                      <button
                        key={opt}
                        className={`menu-card__opt ${i === 0 ? 'menu-card__opt--active' : ''}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div className="menu-card__actions">
                    <button
                      className={`menu-card__btn-add ${addedId === dish.id ? 'menu-card__btn-add--done' : ''}`}
                      onClick={() => handleQuickAdd(dish)}
                    >
                      {addedId === dish.id ? '✓ Añadido' : '🛒 Añadir'}
                    </button>
                    <Link to={`/menu/${dish.id}`} className="menu-card__btn-detail btn-outline">
                      Ver Plato
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATO INSIGNIA ── */}
      <section className="insignia">
        <div className="container insignia__inner">
          <div className="insignia__img-wrap">
            <img
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"
              alt="Costilla de Wagyu"
              className="insignia__img"
            />
            <div className="insignia__chef-tag">
              <span>CREACIÓN DEL CHEF EJECUTIVO</span>
              <strong>Mateo de la Riva • Edición Limitada</strong>
            </div>
          </div>

          <div className="insignia__content">
            <p className="section-label">🏆 Plato Insignia de la Casa</p>
            <h2 className="insignia__title">
              Costilla de Wagyu Glaseada con Reducción de Oporto &amp; Colmenillas
            </h2>
            <p className="insignia__desc">
              Cocción lenta al vacío durante 48 horas a 62°C para preservar una textura que se deshebra
              al tenedor. Terminada con un glaseado brillante de su propio jugo emulsionado y colmenillas
              silvestres recolectadas en los valles del norte.
            </p>

            <div className="insignia__details">
              <div className="insignia__detail">
                <span className="insignia__detail-icon">🍷</span>
                <div>
                  <p className="insignia__detail-label">Maridaje del Sumiller</p>
                  <p className="insignia__detail-text">
                    Château Margaux Premier Grand Cru Classé (2015) — Notas de cedro, grosella negra
                    y violetas silvestres.
                  </p>
                </div>
              </div>
            </div>

            <div className="insignia__footer">
              <div>
                <p className="section-label" style={{ marginBottom: '4px' }}>Experiencia Completa</p>
                <span className="insignia__price">
                  58,00 €
                  <em style={{ fontSize: '13px', fontStyle: 'normal', color: 'var(--text-muted)' }}>
                    {' '}(con maridaje +24,00 €)
                  </em>
                </span>
              </div>
              <button
                className="btn-gold"
                onClick={() =>
                  addItem({
                    id: 'insignia',
                    name: 'Costilla de Wagyu con Oporto & Colmenillas',
                    price: 58,
                    quantity: 1,
                    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80',
                  })
                }
              >
                🛒 Ordenar Especial
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}