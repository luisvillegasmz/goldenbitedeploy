import { Link } from 'react-router-dom'
import './Home.css'

// Datos de ejemplo — después vendrán de Firestore
const featuredDishes = [
  {
    id: '1',
    name: 'The Golden Truffle',
    price: 38,
    badge: 'Insignia',
    pairing: 'Ribera Gran Reserva',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  },
  {
    id: '2',
    name: 'Tartar Wagyu A5 & Caviar',
    price: 54,
    badge: 'Exclusivo',
    pairing: 'Champagne Blanc de Blancs',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  },
  {
    id: '3',
    name: 'Ribeye Añejo 60 Días',
    price: 92,
    badge: 'Corte Noble',
    pairing: 'Priorat Crance Especial',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  },
]

const locations = [
  {
    city: 'Madrid',
    district: 'Barrio de Salamanca',
    address: 'Calle de Jorge Juan, 12',
    capacity: '60 comensales',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  },
  {
    city: 'Barcelona',
    district: 'Sarrià - Sant Gervasi',
    address: 'Carrer Major de Sarrià, 88',
    capacity: '40 comensales',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
  },
  {
    city: 'Ciudad de México',
    district: 'Polanco IV Sección',
    address: 'Av. Campos Elíseos 204',
    capacity: '70 comensales',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  },
]

const pillars = [
  {
    icon: '⏱',
    label: 'Maduración Controlada',
    title: '45 Días en Cámara de Sal',
    desc: 'Nuestros cortes descansan en cámaras de microclima vigilado con muros de sal del Himalaya, concentrando los matices umami y una terneza insuperable.',
  },
  {
    icon: '🔥',
    label: 'Ancestralidad',
    title: 'Fuego y Ascuas de Encina',
    desc: 'La leña de encina centenaria aporta brasas densas y un aroma ahumado que sella la carne con precisión milimétrica en su propio jugo original.',
  },
  {
    icon: '🌿',
    label: 'De la Tierra a la Mesa',
    title: 'Huerto Biodinámico',
    desc: 'Tubérculos heirloom, brotes silvestres y trufa recolectada en terrenos protegidos garantizan una frescura en los intermediarios que dialoga con cada pieza de carne.',
  },
]

export default function Home() {
  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__overlay" />
        <div className="hero__content container">
          <div className="hero__awards">
            <span>🍴 GUÍA MICHELIN 2024</span>
            <span className="hero__dot">•</span>
            <span>DOS SOLES REPSOL</span>
          </div>
          <h1 className="hero__title">
            El Arte del Sabor en su{' '}
            <em>Máxima<br />Expresión</em>
          </h1>
          <p className="hero__subtitle">
            Cortes madurados pacientemente durante 45 días, la intensidad silvestre de la
            trufa negra fresca y la sofisticación del fuego en una experiencia culinaria inolvidable.
          </p>
          <div className="hero__ctas">
            <Link to="/menu" className="btn-gold">Explorar Menú</Link>
            <Link to="/reservas" className="btn-outline">Reservar Experiencia</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="hero__stats container">
          <div className="hero__stat">
            <span className="hero__stat-value">45</span>
            <span className="hero__stat-label">DÍAS DRY-AGED</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value">A5</span>
            <span className="hero__stat-label">WAGYU EXCLUSIVO</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-value">100%</span>
            <span className="hero__stat-label">LEÑA DE ENCINA</span>
          </div>
        </div>
      </section>

      {/* ── TRES PILARES ── */}
      <section className="pillars">
        <div className="container">
          <p className="section-label">La alquimia del origen</p>
          <h2 className="pillars__title">Tres Pilares de Nuestra Identidad</h2>
          <div className="pillars__grid">
            {pillars.map(p => (
              <div key={p.title} className="pillar-card">
                <div className="pillar-card__icon">{p.icon}</div>
                <p className="section-label" style={{ fontSize: '9px' }}>{p.label}</p>
                <h3 className="pillar-card__title">{p.title}</h3>
                <p className="pillar-card__desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATOS ESTRELLA ── */}
      <section className="featured">
        <div className="container">
          <div className="featured__header">
            <div>
              <p className="section-label">Selección de autor</p>
              <h2 className="featured__title">Platos Estrella de Temporada</h2>
            </div>
            <Link to="/menu" className="featured__link">
              Ver Carta Completa →
            </Link>
          </div>

          <div className="featured__grid">
            {featuredDishes.map(dish => (
              <Link to={`/menu/${dish.id}`} key={dish.id} className="dish-card">
                <div className="dish-card__img-wrap">
                  <img src={dish.image} alt={dish.name} className="dish-card__img" />
                  <span className="dish-card__badge badge">{dish.badge}</span>
                  <span className="dish-card__price">{dish.price}€</span>
                </div>
                <div className="dish-card__body">
                  <h3 className="dish-card__name">{dish.name}</h3>
                  <p className="dish-card__pairing">🍷 {dish.pairing}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── UBICACIONES ── */}
      <section className="locations-preview">
        <div className="container">
          <p className="section-label">Santuarios gastronómicos</p>
          <h2 className="locations-preview__title">Nuestras Casas Culinarias</h2>
          <div className="locations-preview__grid">
            {locations.map(loc => (
              <div key={loc.city} className="location-card">
                <div className="location-card__img-wrap">
                  <img src={loc.image} alt={loc.city} className="location-card__img" />
                </div>
                <div className="location-card__body">
                  <p className="location-card__city">{loc.city}</p>
                  <p className="location-card__district">{loc.district}</p>
                  <p className="location-card__address">{loc.address}</p>
                  <div className="location-card__footer">
                    <span className="location-card__capacity">Capacidad: {loc.capacity}</span>
                    <Link to="/ubicaciones" className="location-card__link">Ver Detalles</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLUB + RESERVA ── */}
      <section className="club-section">
        <div className="container club-section__inner">
          <div className="club-section__text">
            <span className="badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
              ★ MEMBRESÍA & PRIVILEGIOS PRIVADOS
            </span>
            <h2 className="club-section__title">
              Golden Bite Club: Privilegio Sensorial
            </h2>
            <ul className="club-section__perks">
              {[
                'Mesa prioritaria garantizada sin esperas públicas.',
                'Bodega privada con botellas de fuera de carta.',
                'Atención personalizada por nuestro Jefe de Sala.',
              ].map(p => (
                <li key={p}>✓ {p}</li>
              ))}
            </ul>
          </div>

          <div className="reserve-form">
            <p className="section-label">Solicitar Reserva</p>
            <div className="reserve-form__field">
              <label>Sede</label>
              <select>
                <option>Madrid (Barrio de Salamanca)</option>
                <option>Barcelona (Sarrià)</option>
                <option>Ciudad de México (Polanco)</option>
              </select>
            </div>
            <div className="reserve-form__row">
              <div className="reserve-form__field">
                <label>Fecha</label>
                <input type="date" />
              </div>
              <div className="reserve-form__field">
                <label>Comensales</label>
                <select>
                  <option>2 Personas</option>
                  <option>3 Personas</option>
                  <option>4 Personas</option>
                  <option>Grupo (+4)</option>
                </select>
              </div>
            </div>
            <div className="reserve-form__field">
              <label>Experiencia deseada</label>
              <select>
                <option>Menú Degustación Signature</option>
                <option>Carta Gourmet Libre</option>
                <option>Maridaje Privado</option>
              </select>
            </div>
            <button className="btn-gold" style={{ width: '100%', marginTop: '8px' }}>
              Confirmar Disponibilidad
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}