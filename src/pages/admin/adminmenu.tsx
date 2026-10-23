import { useState } from 'react'
import AdminLayout from '../../components/adminlayout'
import './AdminMenu.css'

const dishes = [
  { id:'GB-001', name:'The Golden Truffle Burger', cat:'Hamburguesas de Autor', price:38, fc:24, margin:76, stock:'Activo 3 Sedes',   badges:['Firma Chef','Noir'],      img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80' },
  { id:'GB-002', name:'Ribeye Añejo 45 Días',      cat:'Cortes & Grill',       price:64, fc:29, margin:71, stock:'Bajo Stock (6)',    badges:['Corte Noble','Sin Gluten'],img:'https://images.unsplash.com/photo-1544025162-d76694265947?w=200&q=80' },
  { id:'GB-003', name:'Tartar de Wagyu con Caviar',cat:'Entrantes & Caviar',   price:54, fc:31, margin:69, stock:'Disponible (14)',   badges:['Exclusivo Noir'],          img:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80' },
  { id:'GB-004', name:'Costilla de Wagyu Glaseada',cat:'Cortes & Grill',       price:46, fc:22, margin:78, stock:'Activo 3 Sedes',   badges:['Cocción Lenta'],           img:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&q=80' },
  { id:'GB-005', name:'Pulpo Braseado al Carbón',  cat:'Entrantes & Caviar',   price:36, fc:25, margin:75, stock:'Activo 3 Sedes',   badges:['Sin Gluten'],              img:'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=200&q=80' },
  { id:'GB-006', name:'Esfera de Cacao & Avellana',cat:'Postres Signature',    price:22, fc:18, margin:82, stock:'Activo 3 Sedes',   badges:['Postre Signature'],        img:'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&q=80' },
]

const ingredients = [
  { name:'Pattie Buey Dry-Aged (200g)',              cost: 4.28 },
  { name:'Trufa Negra Melanosporum fresca (4g)',      cost: 3.10 },
  { name:'Pan Brioche c/ Mantequilla Échiré',         cost: 0.85 },
  { name:'Queso Comté Reserva 24 Meses (40g)',        cost: 0.65 },
]

export default function AdminMenu() {
  const [sel, setSel] = useState(dishes[0])

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <div>
          <p className="section-label" style={{ marginBottom:'4px' }}>Haute Gastronomie Suite · Temporada</p>
          <h1 className="admin-section-title" style={{ fontSize:'clamp(18px,2.5vw,24px)' }}>
            Alta Cocina & Cava — Gestión Integral del Menú
          </h1>
          <p className="admin-section-sub">
            Control de recetas de autor, stock de despensa noble, escandallo, precios dinámicos y disponibilidad por sede.
          </p>
        </div>
        <div style={{ display:'flex', gap:'10px' }}>
          <button className="btn-outline" style={{ fontSize:'11px', padding:'9px 14px' }}>⬇ Exportar Carta Digital</button>
          <button className="btn-gold"    style={{ fontSize:'11px', padding:'9px 14px' }}>+ Añadir Nuevo Plato / Vino</button>
        </div>
      </div>

      <div className="admin-stats">
        {[
          { label:'Total Referencias Activas', icon:'🍴', value:'48',            sub:'platos y vinos' },
          { label:'Costo Promedio (Food Cost)', icon:'%',  value:'28.4%',         sub:'Margen bruto 71.5%' },
          { label:'Stock Crítico Noble',        icon:'📦', value:'3',             sub:'ingredientes en alerta' },
          { label:'Plato Más Rentable',         icon:'⭐', value:'Golden Truffle', sub:'Margen Neto 78.2%' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__label">{s.label}<span>{s.icon}</span></div>
            <div className="admin-stat-card__value" style={{ fontSize:'18px' }}>{s.value}</div>
            <div className="admin-stat-card__sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="menu-admin-layout">
        {/* ── Tabla ── */}
        <div>
          <div className="menu-admin-toolbar">
            <input className="menu-admin-search" placeholder="Filtrar por ingrediente…" />
            <select className="menu-admin-select"><option>Todas las Sedes</option></select>
            <select className="menu-admin-select"><option>En Carta Activa</option></select>
            <button className="btn-outline" style={{ fontSize:'10px', padding:'7px 12px' }}>
              ⊞ Ajuste Masivo de Precios
            </button>
          </div>

          <div className="menu-admin-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Plato / Referencia</th>
                  <th>Categoría</th>
                  <th>PVP</th>
                  <th>Food Cost & Margen</th>
                  <th>Stock / Sede</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map(d => (
                  <tr
                    key={d.id}
                    onClick={() => setSel(d)}
                    style={{ cursor:'pointer', background: sel.id===d.id ? 'rgba(201,168,76,0.06)' : '' }}
                  >
                    <td>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <img
                          src={d.img} alt={d.name}
                          style={{ width:'40px', height:'40px', borderRadius:'4px', objectFit:'cover', flexShrink:0 }}
                        />
                        <div>
                          <p style={{ color:'var(--text)', fontWeight:500, fontSize:'13px' }}>{d.name}</p>
                          <div style={{ display:'flex', gap:'4px', marginTop:'3px', flexWrap:'wrap' }}>
                            {d.badges.map(b => (
                              <span key={b} className="badge" style={{ fontSize:'8px' }}>{b}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{d.cat}</td>
                    <td style={{ color:'var(--gold)', fontFamily:'var(--font-serif)', fontSize:'15px' }}>
                      €{d.price}.00
                    </td>
                    <td>
                      <p style={{ color:'var(--text)', fontSize:'12px' }}>
                        {d.fc}% (€{(d.price * d.fc / 100).toFixed(2)})
                      </p>
                      <p style={{ color:'#5cb85c', fontSize:'11px' }}>Margen {d.margin}%</p>
                    </td>
                    <td>
                      <span style={{ fontSize:'11px', fontWeight:600, color: d.stock.includes('Bajo') ? '#e05555' : '#5cb85c' }}>
                        ● {d.stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Panel detalle ── */}
        <div className="menu-admin-detail">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
            <span className="section-label" style={{ fontSize:'9px' }}>Ficha Técnica Activa</span>
            <span className="badge">Ref #{sel.id}</span>
          </div>

          <h3 className="menu-admin-detail__title">Escandallo & Trazabilidad</h3>

          <img src={sel.img} alt={sel.name} className="menu-admin-detail__img" />

          <p style={{ fontSize:'13px', color:'var(--text)', fontWeight:500, marginBottom:'4px' }}>{sel.name}</p>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
            <span style={{ fontSize:'12px', color:'var(--text-muted)' }}>PVP: €{sel.price}.00</span>
            <span style={{ fontSize:'12px', color:'var(--gold)' }}>
              Coste: €{(sel.price * sel.fc / 100).toFixed(2)} ({sel.fc}%)
            </span>
          </div>

          <div className="menu-admin-detail__ingredients">
            <p className="menu-admin-detail__ing-label">Desglose de Ingredientes Clave</p>
            {ingredients.map(i => (
              <div key={i.name} className="menu-admin-detail__ing-row">
                <span>{i.name}</span>
                <span style={{ color:'var(--gold)' }}>€{i.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:'8px', margin:'12px 0' }}>
            <div className="menu-admin-detail__meta-card">
              <p style={{ fontSize:'9px', color:'var(--text-muted)', marginBottom:'3px' }}>⏱ TIEMPO PASE</p>
              <p style={{ fontSize:'16px', color:'var(--text)', fontWeight:600 }}>18 min</p>
            </div>
            <div className="menu-admin-detail__meta-card">
              <p style={{ fontSize:'9px', color:'var(--text-muted)', marginBottom:'3px' }}>⚠ ALÉRGENOS</p>
              <p style={{ fontSize:'12px', color:'#e05555' }}>Gluten · Lácteos</p>
            </div>
          </div>

          <button className="btn-gold" style={{ width:'100%', padding:'11px', fontSize:'11px' }}>
            ✏ Actualizar Ficha Técnica en Sala
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}