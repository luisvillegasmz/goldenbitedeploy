import AdminLayout from '../../components/AdminLayout'
import './AdminPromotions.css'

const promos = [
  {
    id: 1, status: 'ACTIVA',
    tags: ['Socios Noir', 'Trufa-Noir'],
    title: 'Experiencia Trufa Blanca de Alba & Champagne',
    desc:  '20% descuento exclusivo en maridaje vertical de Dom Pérignon con 4 pases de…',
    date:  'Hasta 30 Nov 2024', loc: 'Madrid & Barcelona',
    prog: 84, total: 100, metric: 'Cuota de Redención Privada',
  },
  {
    id: 2, status: 'ACTIVA',
    tags: ['Gourmet Club', 'Wagyu-A5'],
    title: 'Semana del Wagyu A5 Miyazaki',
    desc:  'Menú degustación con copa de bienvenida Laurent-Perrier Cuvée Rosé y corte…',
    date:  '15 Nov – 25 Nov 2024', loc: 'Madrid & Barcelona',
    prog: 156, total: 200, metric: 'Reservas Confirmadas',
  },
  {
    id: 3, status: 'ACTIVA',
    tags: ['Nuevos Clientes', 'Bienvenida-GB'],
    title: 'Maridaje de Bienvenida Primera Reserva',
    desc:  'Copa de Champagne Brut cortesía del Sommelier y bocado de aperitivo con flor…',
    date:  'Continuo Anual', loc: 'Madrid, Barcelona & CDMX',
    prog: 188, total: 300, metric: 'Conversión de Primera Mesa',
  },
  {
    id: 4, status: 'PROGRAMADA',
    tags: ['Segmento: Abierto', 'Valentín-Noir'],
    title: 'Cena Ciega San Valentín Gastro',
    desc:  'Menú 7 pasos cerrado con revelación a ciegas por el Chef Ejecutivo…',
    date:  'Febrero 14 – 16, 2025', loc: 'Todas las Sedes',
    prog: 0, total: 100, metric: 'Lista de Espera Privé',
  },
]

const rules = [
  { title: 'Regla de Reserva Anticipada', body: 'Las experiencias con maridaje vertical exigen notificación mínima de 24h para decantación y atemperado en cava subterráneo.' },
  { title: 'Límite por Mesa',             body: 'Máximo un código promocional por mesa o reserva corporativa. Acumulable únicamente con créditos directos Noir Club.' },
  { title: 'Exclusiones de Cosecha',      body: 'Vinos calificados "Gran Reserva Centenario" no entran dentro de descuentos porcentuales directos salvo autorización del Sommelier Jefe.' },
]

export default function AdminPromotions() {
  return (
    <AdminLayout>
      <div className="admin-section-header">
        <div>
          <p className="section-label" style={{ marginBottom:'4px' }}>Membresía & Experiencias · Estacional Otoño-Invierno</p>
          <h1 className="admin-section-title" style={{ fontSize:'clamp(18px,2.5vw,26px)' }}>
            Gestión de Promociones y Experiencias de Temporada
          </h1>
          <p className="admin-section-sub">
            Control de beneficios de membresía, códigos de cata privada y campañas gastronómicas activas.
          </p>
        </div>
        <button className="btn-gold" style={{ fontSize:'11px', padding:'10px 16px' }}>
          + Crear Nueva Promoción
        </button>
      </div>

      <div className="admin-stats">
        {[
          { label:'Promociones Activas',       icon:'🎯', value:'4',       sub:'2 finalizan en 14 días' },
          { label:'Redenciones Este Mes',       icon:'📋', value:'428 usos', sub:'+18.4% vs mes anterior' },
          { label:'Ingresos por Campañas',      icon:'💰', value:'€38.400', sub:'Ticket prom. €89.70/pax' },
          { label:'Tasa de Conversión Privé',   icon:'🏷', value:'34.2%',   sub:'Objetivo mensual superado' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__label">{s.label}<span>{s.icon}</span></div>
            <div className="admin-stat-card__value" style={{ fontSize:'20px' }}>{s.value}</div>
            <div className="admin-stat-card__sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="promos-tabs">
        {['Todas (6)', 'Campañas Activas (4)', 'Programadas (1)', 'Exclusivas Noir (2)', 'Finalizadas (8)'].map((t, i) => (
          <button key={t} className={`promos-tab ${i === 0 ? 'active' : ''}`}>{t}</button>
        ))}
      </div>

      {/* Grid de promociones */}
      <div className="promos-grid">
        {promos.map(p => (
          <div key={p.id} className="promo-card">
            <div className="promo-card__head">
              <div style={{ display:'flex', gap:'5px', flexWrap:'wrap' }}>
                {p.tags.map(t => <span key={t} className="badge" style={{ fontSize:'9px' }}>{t}</span>)}
              </div>
              <span className={`promo-card__status ${p.status === 'ACTIVA' ? 'active' : 'scheduled'}`}>
                ● {p.status}
              </span>
            </div>

            <h3 className="promo-card__title">{p.title}</h3>
            <p className="promo-card__desc">{p.desc}</p>

            <div className="promo-card__meta">
              <span>📅 {p.date}</span>
              <span>📍 {p.loc}</span>
            </div>

            {p.prog > 0 && (
              <div className="promo-card__prog">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                  <span style={{ fontSize:'10px', color:'var(--text-muted)' }}>{p.metric}</span>
                  <span style={{ fontSize:'10px', color:'var(--gold)', fontWeight:600 }}>
                    {p.prog} / {p.total} ({Math.round(p.prog / p.total * 100)}%)
                  </span>
                </div>
                <div className="promo-card__prog-bar">
                  <div className="promo-card__prog-fill" style={{ width:`${Math.min(p.prog / p.total * 100, 100)}%` }} />
                </div>
              </div>
            )}

            <div className="promo-card__actions">
              <button className="promo-card__link">📊 Ver Analítica</button>
              <button className="btn-outline promo-card__btn">⏸ Pausar</button>
              <button className="btn-gold promo-card__btn">✏ Editar</button>
            </div>
          </div>
        ))}
      </div>

      {/* Protocolo */}
      <div className="promos-protocol">
        <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'16px' }}>
          <span style={{ fontSize:'18px' }}>⭐</span>
          <div>
            <p style={{ fontSize:'13px', color:'var(--text)', fontWeight:500 }}>
              Protocolo de Aplicación y Exclusiones de Bodega
            </p>
            <p style={{ fontSize:'10px', color:'var(--text-dim)' }}>Actualizado por Maître D' hace 3 horas</p>
          </div>
        </div>
        <div className="promos-rules">
          {rules.map(r => (
            <div key={r.title} className="promos-rule">
              <p style={{ fontSize:'12px', color:'var(--gold)', fontWeight:600, marginBottom:'4px' }}>{r.title}</p>
              <p style={{ fontSize:'11px', color:'var(--text-muted)', lineHeight:'1.6' }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}