import './OrderTracking.css'

const phases = [
  { id: 1, label: 'Comanda Confirmada',            time: '20:35 h', desc: 'Recepción por Jefa de Sala e inicio de mise en place.', done: true,  active: false },
  { id: 2, label: 'En Cocina de Autor & Maridaje', time: '20:53 h', desc: 'Cocción de precisión por Chef Mateo de la Riva y decantación de bodega.', done: false, active: true },
  { id: 3, label: 'En Tránsito Climatizado White-Glove', time: 'Est. 21:02 h', desc: 'Salida en cápsula térmica de doble zona térmica presurizada.', done: false, active: false },
  { id: 4, label: 'Entregado en Mesa',             time: 'Est. 21:15 h', desc: 'Apertura ceremonial de cloches y disposición de maridajes.', done: false, active: false },
]

export default function OrderTracking() {
  return (
    <main className="tracking-page">
      <div className="container">

        {/* Breadcrumb */}
        <nav className="tracking-breadcrumb">
          <span>Servicio de Alta Gastronomía a Domicilio</span>
          <span>/</span>
          <span>Mesa Privada #42</span>
        </nav>

        <div className="tracking-header">
          <h1 className="tracking-title">Seguimiento de Experiencia Gourmet</h1>
          <div className="tracking-header__actions">
            <button className="btn-outline tracking-action-btn">🧾 Factura Digital</button>
            <button className="btn-outline tracking-action-btn">🍷 Atención Sommelier</button>
          </div>
        </div>

        <div className="tracking-layout">
          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="tracking-left">

            {/* ETA Card */}
            <div className="tracking-eta">
              <div className="tracking-eta__top">
                <span className="badge">🍴 Fase 2 de 4 en Progreso</span>
                <div>
                  <p className="tracking-eta__label">Tiempo Estimado de Llegada</p>
                  <p className="tracking-eta__time">22 min <span>(21:15 h)</span></p>
                </div>
              </div>

              <div className="tracking-eta__status">
                <h2 className="tracking-eta__phase">En Fuego &amp; Emplatado Final</h2>
                <p className="tracking-eta__desc">
                  El <strong>Chef Mateo de la Riva</strong> está culminando el atemperado del Wagyu A5
                  y sellando al vacío el maridaje reserva en copas isotérmicas.
                </p>
              </div>

              {/* Timeline */}
              <div className="tracking-timeline">
                {phases.map((p, i) => (
                  <div key={p.id} className={`tracking-phase ${p.done ? 'done' : ''} ${p.active ? 'active' : ''}`}>
                    <div className="tracking-phase__indicator">
                      <div className="tracking-phase__dot">
                        {p.done ? '✓' : p.active ? '🍳' : ''}
                      </div>
                      {i < phases.length - 1 && <div className="tracking-phase__line" />}
                    </div>
                    <div className="tracking-phase__content">
                      <div className="tracking-phase__header">
                        <span className="tracking-phase__label">
                          {p.label}
                          {p.active && <span className="tracking-phase__now">AHORA</span>}
                        </span>
                        <span className="tracking-phase__time">{p.time}</span>
                      </div>
                      <p className="tracking-phase__desc">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Concierge card */}
            <div className="tracking-concierge">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80"
                alt="Concierge"
                className="tracking-concierge__img"
              />
              <div className="tracking-concierge__info">
                <div className="tracking-concierge__name">
                  Carlos M. <span className="badge">Concierge Certificado</span>
                </div>
                <p className="tracking-concierge__detail">🚗 Vehículo Climatizado Premium (Mercedes Clase E Híbrido)</p>
                <p className="tracking-concierge__detail">🛡 Protocolo White-Glove &amp; Desinfección UV-C</p>
              </div>
              <button className="btn-gold tracking-concierge__call">📞 Llamar al Concierge</button>
            </div>

            {/* Delivery info */}
            <div className="tracking-delivery-info">
              <div className="tracking-delivery-info__row">
                <div>
                  <p className="tracking-delivery-info__label">📍 Punto de Degustación</p>
                  <p className="tracking-delivery-info__value">Calle Claudio Coello 48, 3ª Izq.<br />Barrio de Salamanca, 28001 Madrid</p>
                </div>
                <div>
                  <p className="tracking-delivery-info__label">🎯 Entrega Personalizada</p>
                  <p className="tracking-delivery-info__note">
                    "Acceso por portal señorial, llamar al timbre 3B. Entrega ceremonial en cloches con explicación breve del sumiller."
                  </p>
                </div>
              </div>
            </div>

            {/* Platos accordion */}
            <div className="tracking-dishes">
              <div className="tracking-dishes__header">
                <div>
                  <p className="tracking-dishes__title">📖 Desglose de Platos &amp; Menú Degustación</p>
                  <p className="tracking-dishes__sub">3 pases de autor + maridaje de bodega reservada</p>
                </div>
                <span>∨</span>
              </div>
            </div>
          </div>

          {/* ── COLUMNA DERECHA ── */}
          <div className="tracking-right">

            {/* Mapa (simulado) */}
            <div className="tracking-map">
              <div className="tracking-map__header">
                <span className="tracking-map__dot" />
                <span>Telemetría GPS en Vivo</span>
                <span className="tracking-map__city">Madrid (Salamanca)</span>
                <span>📍</span>
              </div>
              <div className="tracking-map__canvas">
                {/* Mapa simulado con CSS */}
                <div className="tracking-map__bg">
                  <div className="tracking-map__route" />
                  <div className="tracking-map__marker tracking-map__marker--dest">
                    <div className="tracking-map__marker-label">Mesa del Cliente<br /><small>Claudio Coello 48</small></div>
                  </div>
                  <div className="tracking-map__marker tracking-map__marker--car">
                    <span>A</span>
                    <div className="tracking-map__speed">En Tránsito • 42 KM/H</div>
                  </div>
                  <div className="tracking-map__marker tracking-map__marker--origin">
                    <span>🍴</span>
                    <div className="tracking-map__origin-label">Golden Bite Salamanca<br /><small>Cocina Central</small></div>
                  </div>
                </div>
                <div className="tracking-map__stats">
                  <span>📏 Distancia: 1.8 KM</span>
                  <span>🚦 Tráfico: Óptimo</span>
                </div>
              </div>
            </div>

            {/* Temperatura cápsulas */}
            <div className="tracking-temp">
              <div className="tracking-temp__header">
                <span>❄🌡 Cápsula Isotérmica Dual Presurizada</span>
                <span className="badge">Garantizado</span>
              </div>
              <div className="tracking-temp__grid">
                <div className="tracking-temp__card">
                  <p className="tracking-temp__label">🔥 Pase Caliente</p>
                  <p className="tracking-temp__value">65°C <span>± 0.5°C</span></p>
                  <p className="tracking-temp__desc">Wagyu y guarniciones a temperatura óptima de servicio.</p>
                </div>
                <div className="tracking-temp__card">
                  <p className="tracking-temp__label">❄ Cava &amp; Maridaje</p>
                  <p className="tracking-temp__value">14°C <span>Estable</span></p>
                  <p className="tracking-temp__desc">Vega Sicilia 2011 decantado en atmósfera inerte.</p>
                </div>
              </div>
            </div>

            {/* Compromiso Michelin */}
            <div className="tracking-michelin">
              <div className="tracking-michelin__header">
                <span>⭐</span>
                <h3 className="tracking-michelin__title">Compromiso Gastronómico Michelin</h3>
              </div>
              <p className="tracking-michelin__desc">
                Si la textura, temperatura o presentación en destino no cumple con los estándares
                exigidos por nuestra dirección de sala, nuestro Concierge habilitará de inmediato
                una reposición integral prioritaria.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}