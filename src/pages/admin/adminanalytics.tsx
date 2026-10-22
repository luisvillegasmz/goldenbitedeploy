import AdminLayout from '../../components/AdminLayout'
import './AdminAnalytics.css'

const sections = [
  { name:'Cortes Nobles & Grill',    pct:34, rev:62400 },
  { name:'Vinos & Cava de Reserva',  pct:26, rev:48200 },
  { name:'Hamburguesas de Autor',    pct:21, rev:38800 },
  { name:'Entrantes & Caviar',       pct:12, rev:22100 },
  { name:'Postres & Destilados',     pct:7,  rev:13150 },
]

const venues = [
  { name:'Madrid Salamanca',  addr:'Calle de Jorge Juan, 12', covers:782, total:184580, ticket:133.73, rating:4.94, margin:31.4 },
  { name:'Barcelona Sarrià',  addr:'Passeig de la Bonanova, 24', covers:513, total:52370,  ticket:102.08, rating:4.89, margin:28.2 },
  { name:'CDMX Polanco',      addr:'Campos Elíseos, 188',     covers:244, total:27700,  ticket:113.52, rating:4.96, margin:29.8 },
]

const top5 = [
  { rank:'#1 Platillo Estrella', qty:'824 uds.',    name:'The Golden Truffle Burger',  income:32136, margin:74.2 },
  { rank:'#2 Asador Selecto',    qty:'312 uds.',    name:'Ribeye Añejo 45 Días',       income:29640, margin:68.5 },
  { rank:'#3 Bodega Mítica',     qty:'48 botellas', name:'Vega Sicilia Único Reserva', income:24960, margin:62.0 },
  { rank:'#4 Entrante de Gala',  qty:'469 uds.',    name:'Tartar de Wagyu con Caviar', income:20700, margin:71.6 },
  { rank:'#5 Experiencia',       qty:'220 paxs',    name:'Maridaje Gran Degustación',  income:19800, margin:79.5 },
]

export default function AdminAnalytics() {
  return (
    <AdminLayout>
      <div className="admin-section-header">
        <div>
          <p className="section-label" style={{ marginBottom:'4px' }}>Métricas Financieras & Auditoría Gastronómica</p>
          <h1 className="admin-section-title" style={{ fontSize:'clamp(18px,2.5vw,26px)' }}>
            Reportes de Ventas & Rendimiento Comercial
          </h1>
          <p className="admin-section-sub">
            Consolidado de facturación de alta cocina, rendimiento de bodega, ticket medio y distribución por canales.
          </p>
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {['Últimos 30 Días', 'Este Mes', 'Trimestre Q1', 'Año 2025'].map((t, i) => (
            <button key={t} className={`analytics-period ${i === 0 ? 'active' : ''}`}>{t}</button>
          ))}
          <button className="btn-outline" style={{ fontSize:'10px', padding:'7px 12px' }}>⬇ Informe PDF / Excel</button>
        </div>
      </div>

      <div className="admin-stats">
        {[
          { label:'Facturación Neta Total',   icon:'💰', value:'€184.650', sub:'IVA Repercutido: €18.465',       trend:'+14.8% vs mes anterior' },
          { label:'Ticket Promedio/Comensal', icon:'🍽', value:'€142,50',  sub:'Objetivo mensual: €130,00',     trend:'✓ 109.5% Cumplimiento' },
          { label:'Distribución Canales',     icon:'📊', value:'72% / 28%',sub:'1.295 Sala · 504 White-Glove',  trend:'' },
          { label:'Ingresos Membresía Noir',  icon:'⭐', value:'€68.900',  sub:'37.3% de facturación total',     trend:'+6 Nuevos socios' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__label">{s.label}<span>{s.icon}</span></div>
            <div className="admin-stat-card__value" style={{ fontSize:'19px' }}>{s.value}</div>
            <div className="admin-stat-card__sub">{s.sub}</div>
            {s.trend && <div className="admin-stat-card__trend">{s.trend}</div>}
          </div>
        ))}
      </div>

      <div className="admin-grid-2" style={{ marginBottom:'24px' }}>
        {/* Distribución por sección */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'20px' }}>
          <p className="admin-section-title" style={{ marginBottom:'4px' }}>Distribución por Sección</p>
          <p className="admin-section-sub" style={{ marginBottom:'20px' }}>Aporte por línea de producto y maridaje en sala</p>
          <div className="analytics-bars">
            {sections.map(s => (
              <div key={s.name} className="analytics-bar-row">
                <span className="analytics-bar-label">{s.name}</span>
                <div className="analytics-bar-track">
                  <div className="analytics-bar-fill" style={{ width:`${s.pct * 3}%` }} />
                </div>
                <span className="analytics-bar-rev">€{s.rev.toLocaleString()}</span>
                <span className="analytics-bar-pct">{s.pct}%</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'14px', lineHeight:'1.5' }}>
            El 61% de las mesas nocturnas añadieron maridaje recomendado.
          </p>
        </div>

        {/* Tabla comparativa por sede */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'20px' }}>
          <p className="admin-section-title" style={{ marginBottom:'4px' }}>Tabla Comparativa por Sede</p>
          <p className="admin-section-sub" style={{ marginBottom:'16px' }}>Afluencia, márgenes de cava y nivel de servicio</p>
          <table className="admin-table" style={{ fontSize:'11px' }}>
            <thead>
              <tr>
                <th>Sede</th><th>Cubiertos</th><th>Facturación</th>
                <th>Ticket</th><th>★</th><th>Margen</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(v => (
                <tr key={v.name}>
                  <td>
                    <p style={{ color:'var(--text)', fontWeight:500 }}>{v.name}</p>
                    <p style={{ fontSize:'10px' }}>{v.addr}</p>
                  </td>
                  <td>{v.covers}</td>
                  <td style={{ color:'var(--gold)', fontFamily:'var(--font-serif)' }}>€{v.total.toLocaleString()}</td>
                  <td>€{v.ticket}</td>
                  <td style={{ color:'var(--gold)' }}>{v.rating}</td>
                  <td style={{ color:'#5cb85c', fontWeight:600 }}>{v.margin}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top 5 */}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', padding:'20px' }}>
        <div className="admin-section-header">
          <div>
            <p className="admin-section-title">Top 5 Artículos de Mayor Venta y Aporte al Margen</p>
            <p className="admin-section-sub">Jerarquía culinaria según volumen, facturación e impacto en rentabilidad neta</p>
          </div>
          <button className="btn-outline" style={{ fontSize:'10px', padding:'7px 12px' }}>📊 Auditoría de Escandallos</button>
        </div>
        <div className="analytics-top5">
          {top5.map(item => (
            <div key={item.rank} className="analytics-top5-card">
              <p className="analytics-top5-rank">{item.rank}</p>
              <p className="analytics-top5-qty">{item.qty}</p>
              <p className="analytics-top5-name">{item.name}</p>
              <div className="analytics-top5-footer">
                <div>
                  <p style={{ fontSize:'9px', color:'var(--text-dim)' }}>Ingresos</p>
                  <p style={{ fontSize:'14px', color:'var(--gold)', fontFamily:'var(--font-serif)' }}>
                    €{item.income.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize:'9px', color:'var(--text-dim)' }}>Aporte Margen</p>
                  <p style={{ fontSize:'14px', color:'#5cb85c', fontWeight:700 }}>{item.margin}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize:'10px', color:'var(--text-dim)', marginTop:'16px', textAlign:'center' }}>
          ● Sincronización en tiempo real activa con terminales TPV y cavas automáticas.
        </p>
      </div>
    </AdminLayout>
  )
}