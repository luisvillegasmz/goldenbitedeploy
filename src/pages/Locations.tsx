import { useState } from 'react'
import './Locations.css'

const locations = [
  {
    id: 'madrid',
    city: 'Madrid',
    name: 'Golden Bite Salamanca',
    badge: 'Sede Central & I+D • Guía Repsol 2 Soles',
    tag: 'Haute Cuisine',
    district: 'Distrito Salamanca · Madrid',
    status: 'Servicio Activo',
    address: 'Calle de Claudio Coello, 48, 28001 Madrid',
    phone: '+34 914 882 190',
    email: 'salamanca@goldenbite.com',
    schedule: {
      lunch: 'Martes a Domingo: 13:30 – 16:00',
      dinner: 'Lunes a Sábado: 20:30 – 23:30',
    },
    environments: ['Salón Principal', 'Barra Mixología', 'Terraza Climatizada', 'Salón Privado VIP'],
    parking: 'Valet parking privado en la puerta principal. Parking concertado en Calle Hermosilla 24 con 3 horas bonificadas.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  },
  {
    id: 'barcelona',
    city: 'Barcelona',
    name: 'Golden Bite Sarrià',
    badge: 'Terraza & Cava',
    tag: '',
    district: 'Sarrià – Sant Gervasi · Barcelona',
    status: 'Apertura 11:00 h',
    address: 'Passeig de la Bonanova, 14, 08022 Barcelona',
    phone: '+34 932 405 771',
    email: '',
    schedule: {
      lunch: 'Martes a Domingo: 11:00 – 16:00',
      dinner: 'Miércoles a Sábado: 20:00 – 23:00',
    },
    environments: ['Salón Cava Subterráneo', 'Patio de Olivos Climatizado', 'Mesa del Chef Privada (8 pax)'],
    parking: '',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
  },
  {
    id: 'cdmx',
    city: 'CDMX',
    name: 'Golden Bite Polanco',
    badge: 'Sede Internacional',
    tag: 'Zone Horaria GMT-6',
    district: 'Campos Elíseos · Polanco, CDMX',
    status: '',
    address: 'Campos Elíseos 204, Polanco IV, Secc. Miguel Hidalgo, 11550 CDMX',
    phone: '+52 55 5280 9411',
    email: '',
    schedule: {
      lunch: 'Martes a Sábado: 13:00 – 16:30',
      dinner: 'Martes a Sábado: 19:30 – 23:00',
    },
    environments: ['Agave & Mezcal Sanctum', 'Terraza Jardín Botánico', 'Salón Presidencial'],
    parking: '',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  },
]

export default function Locations() {
  const [active, setActive] = useState('madrid')
  const selected = locations.find(l => l.id === active)!

  return (
    <main className="locations-page">

      {/* Hero */}
      <section className="locations-hero">
        <div className="locations-hero__bg" />
        <div className="locations-hero__overlay" />
        <div className="container locations-hero__content">
          <span className="badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
            🗺 Guía de Espacios Culinarios
          </span>
          <h1 className="locations-hero__title">Nuestras Sedes &amp; Ambientes</h1>
          <p className="locations-hero__subtitle">
            Arquitectura sensorial, gastronomía de autor y santuarios de hospitalidad
            en las capitales más vibrantes.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <div className="container">
        <div className="locations-layout">

          {/* ── COLUMNA IZQUIERDA: Mapa + navegación ── */}
          <div className="locations-sidebar">
            {/* Selector de ciudad */}
            <div className="locations-city-tabs">
              {locations.map(l => (
                <button
                  key={l.id}
                  className={`locations-city-tab ${active === l.id ? 'active' : ''}`}
                  onClick={() => setActive(l.id)}
                >
                  {l.city}
                </button>
              ))}
            </div>

            {/* Mapa simulado */}
            <div className="locations-map">
              <div className="locations-map__placeholder">
                <div className="locations-map__pin">📍</div>
                <p className="locations-map__label">{selected.name}</p>
                <p className="locations-map__city">{selected.district}</p>
              </div>
              <div className="locations-map__route">
                <span>🔵 ¿Cómo llegar?</span>
                <input type="text" placeholder={selected.address} readOnly />
                <button className="locations-map__gps">GPS ×</button>
              </div>
            </div>

            {/* Mini lista */}
            <div className="locations-list">
              {locations.map(l => (
                <button
                  key={l.id}
                  className={`locations-list__item ${active === l.id ? 'active' : ''}`}
                  onClick={() => setActive(l.id)}
                >
                  <div className="locations-list__indicator" />
                  <div>
                    <p className="locations-list__name">{l.name}</p>
                    <p className="locations-list__addr">{l.address.substring(0, 35)}…</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Valet */}
            <div className="locations-valet">
              <span>🚗</span>
              <div>
                <p className="locations-valet__title">Servicio de Valet &amp; Concierge</p>
                <p className="locations-valet__desc">Recepción de vehículos custodiada y gestión de transfer privado en todas las sedes.</p>
              </div>
            </div>

            <div className="locations-city-tabs" style={{ marginTop: '0' }}>
              {['Madrid', 'Barcelona', 'CDMX'].map(c => (
                <button key={c} className="locations-city-tab" style={{ flex: '1', fontSize: '10px', padding: '8px' }}>{c}</button>
              ))}
            </div>
          </div>

          {/* ── COLUMNA DERECHA: Detalle sede ── */}
          <div className="locations-detail">

            {locations.map(loc => (
              <div key={loc.id} className={`locations-card ${active === loc.id ? 'active' : ''}`}>
                {/* Imagen */}
                <div className="locations-card__img-wrap">
                  <img src={loc.image} alt={loc.name} className="locations-card__img" />
                  <div className="locations-card__img-overlay">
                    <span className="badge">{loc.badge}</span>
                    {loc.tag && <span className="badge" style={{ marginLeft: '6px' }}>{loc.tag}</span>}
                  </div>
                </div>

                {/* Info */}
                <div className="locations-card__body">
                  <div className="locations-card__header">
                    <div>
                      <p className="locations-card__district">{loc.district}</p>
                      <h2 className="locations-card__name">{loc.name}</h2>
                    </div>
                    {loc.status && (
                      <span className="locations-card__status">● {loc.status}</span>
                    )}
                  </div>

                  <div className="locations-card__contact">
                    <div>
                      <p className="locations-card__contact-label">📍 Dirección</p>
                      <p className="locations-card__contact-value">{loc.address}</p>
                      <a href="#" className="locations-card__map-link">Indicaciones en mapa &amp; parking</a>
                    </div>
                    <div>
                      <p className="locations-card__contact-label">📞 Contacto &amp; Concierge</p>
                      <p className="locations-card__contact-value">{loc.phone}</p>
                      {loc.email && <p className="locations-card__contact-value" style={{ fontSize: '12px', color: 'var(--text-dim)' }}>{loc.email}</p>}
                    </div>
                  </div>

                  {/* Horarios */}
                  <div className="locations-card__schedule">
                    <p className="locations-card__section-label">⏰ Horarios de Servicio</p>
                    <div className="locations-card__schedule-grid">
                      <div className="locations-card__schedule-card">
                        <p className="locations-card__schedule-type">Almuerzo Degustación</p>
                        <p className="locations-card__schedule-time">{loc.schedule.lunch}</p>
                      </div>
                      <div className="locations-card__schedule-card">
                        <p className="locations-card__schedule-type">Cena Sensorial</p>
                        <p className="locations-card__schedule-time">{loc.schedule.dinner}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ambientes */}
                  <div className="locations-card__envs">
                    <p className="locations-card__section-label">🏛 Ambientes Disponibles</p>
                    <div className="locations-card__env-list">
                      {loc.environments.map(env => (
                        <span key={env} className="locations-card__env-tag">{env}</span>
                      ))}
                    </div>
                  </div>

                  {/* Parking */}
                  {loc.parking && (
                    <p className="locations-card__parking">🅿 {loc.parking}</p>
                  )}

                  {/* CTAs */}
                  <div className="locations-card__ctas">
                    <button className="btn-gold locations-card__cta">
                      📅 Reservar Mesa en {loc.city}
                    </button>
                    <button className="btn-outline locations-card__cta">
                      🍽 Ver Menú Local / Pedir Takeaway
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Eventos privados */}
            <div className="locations-events">
              <div className="locations-events__text">
                <span className="badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
                  ★ Experiencias Privadas &amp; Corporativas
                </span>
                <h2 className="locations-events__title">
                  Eventos a Medida, Catas Privadas &amp; Catering de Autor
                </h2>
                <p className="locations-events__desc">
                  Reserve en exclusividad cualquiera de nuestros salones o traslade la experiencia
                  gastronómica de Golden Bite a su residencia o evento corporativo.
                </p>
                <div className="locations-events__ctas">
                  <button className="btn-gold">Solicitar Dossier de Eventos</button>
                  <button className="btn-outline">💬 Hablar con Event Concierge</button>
                </div>
              </div>
              <div className="locations-events__img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500&q=80"
                  alt="Eventos"
                  className="locations-events__img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}