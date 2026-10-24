import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCOP } from '../utils/format'
import { useCart } from '../context/CartContext'
import { dishes, categories } from '../data/dishes'
import './Menu.css'

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [addedId,        setAddedId]        = useState<string | null>(null)
  const { addItem } = useCart()

  const filtered =
    activeCategory === 'Todos'
      ? dishes
      : dishes.filter(d => d.category === activeCategory)

  const handleQuickAdd = (dish: typeof dishes[0]) => {
    addItem({ id: dish.id, name: dish.name, price: dish.price, quantity: 1, image: dish.image })
    setAddedId(dish.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <main className="menu-page">

      {/* ── HERO ── */}
      <section className="menu-hero">
        <div className="menu-hero__bg" />
        <div className="menu-hero__overlay" />
        <div className="container menu-hero__content">
          <span className="badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
            <i className="bi bi-geo-alt" /> Medellín & Bogotá
          </span>
          <h1 className="menu-hero__title">Nuestro Menú</h1>
          <p className="menu-hero__subtitle">
            Cocina tradicional colombiana preparada con productos frescos de la región.
            Sabores de siempre, hechos con cariño.
          </p>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <div className="menu-filters">
        <div className="container menu-filters__inner">
          <div className="menu-filters__tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`menu-filters__tab ${activeCategory === cat ? 'menu-filters__tab--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── GRID ── */}
      <section className="menu-grid-section">
        <div className="container">
          <h2 className="menu-section-title">
            {activeCategory === 'Todos' ? 'Todos los platos' : activeCategory}
          </h2>
          <p className="menu-section-desc">
            {filtered.length} {filtered.length === 1 ? 'plato disponible' : 'platos disponibles'}
          </p>

          <div className="menu-grid">
            {filtered.map(dish => (
              <div key={dish.id} className="menu-card">
                <Link to={`/menu/${dish.id}`} className="menu-card__img-link">
                  <div className="menu-card__img-wrap">
                    <img src={dish.image} alt={dish.name} className="menu-card__img" />
                    <div className="menu-card__badges">
                      {dish.badges.map(b => (
                        <span key={b} className="badge">{b}</span>
                      ))}
                    </div>
                    <span className="menu-card__price">{formatCOP(dish.price)}</span>
                    <div className="menu-card__hover-overlay">
                      <span>Ver detalles</span>
                    </div>
                  </div>
                </Link>

                <div className="menu-card__body">
                  <Link to={`/menu/${dish.id}`} className="menu-card__name-link">
                    <h3 className="menu-card__name">{dish.name}</h3>
                  </Link>
                  <p className="menu-card__desc">{dish.desc}</p>

                  {dish.options.length > 0 && (
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
                  )}

                  <div className="menu-card__actions">
                    <button
                      className={`menu-card__btn-add ${addedId === dish.id ? 'menu-card__btn-add--done' : ''}`}
                      onClick={() => handleQuickAdd(dish)}
                    >
                      {addedId === dish.id
                        ? <><i className="bi bi-check" /> Agregado</>
                        : <><i className="bi bi-bag-plus" /> Agregar</>
                      }
                    </button>
                    <Link to={`/menu/${dish.id}`} className="menu-card__btn-detail btn-outline">
                      Ver plato
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATO DESTACADO ── */}
      <section className="insignia">
        <div className="container insignia__inner">
          <div className="insignia__img-wrap">
            <img
              src="https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80"
              alt="Bandeja Paisa"
              className="insignia__img"
            />
            <div className="insignia__chef-tag">
              <span>PLATO DE LA CASA</span>
              <strong>Receta tradicional antioqueña</strong>
            </div>
          </div>

          <div className="insignia__content">
            <p className="section-label">Plato Destacado</p>
            <h2 className="insignia__title">Bandeja Paisa</h2>
            <p className="insignia__desc">
              El plato más completo y representativo de la cocina antioqueña.
              Frijoles cargamanto rojos, arroz blanco, chicharrón crujiente, carne molida
              sazonada, chorizo antioqueño, huevo frito, aguacate fresco y arepa blanca.
              Cocinado con la receta de siempre.
            </p>

            <div className="insignia__footer">
              <div>
                <p className="section-label" style={{ marginBottom: '4px' }}>Precio</p>
                <span className="insignia__price">{formatCOP(42000)}</span>
              </div>
              <button
                className="btn-gold"
                onClick={() =>
                  addItem({
                    id:       'm1',
                    name:     'Bandeja Paisa',
                    price:    42000,
                    quantity: 1,
                    image:    'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&q=80',
                  })
                }
              >
                <i className="bi bi-bag-plus" /> Pedir ahora
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}