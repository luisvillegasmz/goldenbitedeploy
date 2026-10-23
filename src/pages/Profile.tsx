import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Profile.css'

const orders = [
  {
    id: 'GB-2025-8819', date: '14 de Febrero, 2025',
    rest: 'Restaurante Salamanca', total: 285,
    status: 'Entregado / Disfrutado',
    items: ['Corte Wagyu Miyazaki', 'Risotto Meloso de Trufa', 'Valbuena 5° Año (2018)'],
    pts: 28,
  },
  {
    id: 'GB-2024-9104', date: '31 de Diciembre, 2024',
    rest: 'Evento Privado Domicilio', total: 520,
    status: 'Completado',
    items: ['Menú Degustación 7 Pasos — Chef Privado & Menaje incluido'],
    pts: 52,
  },
]

const privileges = [
  { tag:'Prioridad 1',    icon:'🍄', name:'Acceso a Trufa Blanca de Alba',    desc:'Reserva garantizada con 48h de antelación durante la veda de otoño en mesas centrales.' },
  { tag:'Bimestral',      icon:'🍾', name:'Cata Privada con Sumiller',         desc:'Invitación sin cargo para 2 personas en la Cripta Subterránea con maridaje vertical.' },
  { tag:'Línea Directa',  icon:'📞', name:'Línea de Sommelier 24/7',           desc:'Asesoramiento instantáneo para adquisición de caldos raros, cavas particulares y bodas.' },
]

const badges = [
  { icon:'🏆', name:'Catador Experto de Trufa', level:'Nivel Supremo' },
  { icon:'🪑', name:'Mesa Preferente',           level:'Siempre Disponible' },
  { icon:'🍷', name:'Socio Sommelier',            level:'Bodega de Guarda' },
]

const tabs = [
  'Historial de Pedidos & Experiencias',
  'Próximas Reservas de Mesa',
  'Direcciones & Preferencias',
  'Métodos de Pago & Seguridad',
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0)
  const { user, profile } = useAuth()

  // Mientras carga o no hay sesión, no renderizamos nada raro
  if (!user || !profile) return null

  return (
    <main className="profile-page">
      <div className="container">
        <div className="profile-layout">

          {/* ── COLUMNA IZQUIERDA ── */}
          <div className="profile-left">

            {/* Membership card */}
            <div className="membership-card">
              <div className="membership-card__top">
                <div>
                  <p className="membership-card__brand">Golden Bite</p>
                  <p className="membership-card__sub">Club Privé Haute Cuisine</p>
                </div>
                <span className="badge">Nivel {profile.membership}</span>
              </div>
              <div className="membership-card__holder">
                <p style={{ fontSize:'10px', color:'var(--text-muted)', marginBottom:'2px' }}>Titular de la Membresía</p>
                <p style={{ fontSize:'18px', color:'var(--text)', fontFamily:'var(--font-serif)' }}>{profile.displayName}</p>
              </div>
              <div className="membership-card__meta">
                <div>
                  <p style={{ fontSize:'9px', color:'var(--text-muted)' }}>N° Socio</p>
                  <p style={{ fontSize:'13px', color:'var(--gold)' }}>{user.uid.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p style={{ fontSize:'9px', color:'var(--text-muted)' }}>Miembro Desde</p>
                  <p style={{ fontSize:'13px', color:'var(--text)' }}>{profile.memberSince}</p>
                </div>
              </div>
              <p style={{ fontSize:'9px', color:'var(--text-dim)', marginTop:'10px' }}>
                ⊙ Concierge VIP Pass & Acceso Preferente · SEC-CODE: 4920-NOIR
              </p>
            </div>

            {/* Puntos */}
            <div className="profile-box">
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <p style={{ fontSize:'10px', color:'var(--text-muted)', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                  Balance de Puntos Gourmet
                </p>
                <span style={{ fontSize:'14px', cursor:'pointer' }}>👁</span>
              </div>
              <p className="profile-points">{profile.points.toLocaleString('es-ES')} <span>Puntos</span></p>
              
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'10px' }}>
                <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>Equivalente canjeable:</span>
                <span style={{ fontSize:'12px', color:'var(--gold)', fontWeight:600 }}>{(profile.points * 0.1).toFixed(2)} €</span>
              </div>
              <p style={{ fontSize:'11px', color:'var(--text-dim)', marginBottom:'14px', lineHeight:'1.5' }}>
                Aplicable en experiencias degustación, botellas de guarda o servicios de maridaje exclusivo.
              </p>
              <button className="btn-gold" style={{ width:'100%', padding:'11px', fontSize:'11px' }}>
                Canjear Puntos
              </button>
            </div>

            {/* Insignias */}
            <div className="profile-box">
              <p style={{ fontSize:'10px', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'12px' }}>
                Distinciones e Insignias del Socio
              </p>
              <div className="profile-badges-grid">
                {badges.map(b => (
                  <div key={b.name} className="profile-badge">
                    <div style={{ fontSize:'20px', marginBottom:'6px' }}>{b.icon}</div>
                    <p style={{ fontSize:'10px', color:'var(--text)', fontWeight:500, marginBottom:'2px' }}>{b.name}</p>
                    <p style={{ fontSize:'9px', color:'var(--gold)' }}>{b.level}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Privilegios */}
            <div className="profile-box">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <p style={{ fontSize:'13px', color:'var(--text)', fontWeight:500 }}>
                  ⭐ Privilegios Exclusivos Nivel Noir
                </p>
                <Link to="#" style={{ fontSize:'11px', color:'var(--gold)' }}>Contactar Mayordomo →</Link>
              </div>
              {privileges.map(p => (
                <div key={p.name} className="profile-privilege">
                  <span style={{ fontSize:'18px', flexShrink:0 }}>{p.icon}</span>
                  <div>
                    <p style={{ fontSize:'12px', color:'var(--text)', fontWeight:500, marginBottom:'3px' }}>
                      {p.name} <span className="badge" style={{ fontSize:'8px' }}>{p.tag}</span>
                    </p>
                    <p style={{ fontSize:'11px', color:'var(--text-muted)', lineHeight:'1.5' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── COLUMNA DERECHA ── */}
          <div className="profile-right">

            {/* Tabs */}
            <div className="profile-tabs">
              {tabs.map((t, i) => (
                <button
                  key={t}
                  className={`profile-tab ${activeTab === i ? 'active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Historial de pedidos */}
            {activeTab === 0 && (
              <div className="profile-orders">
                {orders.map(o => (
                  <div key={o.id} className="profile-order">
                    <div className="profile-order__header">
                      <div>
                        <p className="profile-order__title">
                          Experiencia '{o.items[0]}'
                        </p>
                        <p className="profile-order__meta">
                          Pedido nº {o.id} · Fecha: {o.date} · {o.rest}
                        </p>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <span className="badge">{o.status}</span>
                        <p style={{ fontFamily:'var(--font-serif)', fontSize:'20px', color:'var(--gold)', marginTop:'4px' }}>
                          {o.total.toFixed(2)} €
                        </p>
                      </div>
                    </div>

                    <div className="profile-order__items">
                      {o.items.map(item => (
                        <span key={item} className="profile-order__item">{item}</span>
                      ))}
                    </div>

                    <div className="profile-order__footer">
                      <span style={{ fontSize:'11px', color:'var(--gold)' }}>
                        +{o.pts} Puntos Gourmet acumulados en este pedido
                      </span>
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button className="btn-outline" style={{ fontSize:'10px', padding:'7px 12px' }}>
                          ⬇ Descargar Factura Oficial
                        </button>
                        <button className="btn-gold" style={{ fontSize:'10px', padding:'7px 12px' }}>
                          🔄 Repetir Pedido Culinario
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Otras tabs — placeholder */}
            {activeTab !== 0 && (
              <div className="profile-tab-placeholder">
                <p>🔒</p>
                <p>Sección en construcción</p>
                <p style={{ fontSize:'12px', color:'var(--text-dim)' }}>Disponible en la próxima actualización</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}