import AdminLayout from '../../components/adminlayout'
import './AdminDashboard.css'

const orders = [
  { ref: '#GB-9402', time: '21:14', client: 'Lord Alistair Sterling', mbr: 'CLUB NOIR', table: 'Mesa 08',         loc: 'Salón de los Espejos',      status: 'En Cocina',    total: 1120 },
  { ref: '#GB-9398', time: '20:55', client: 'Dra. Valeria Fontana',   mbr: 'PRIVÉ',     table: 'Domicilio Élite', loc: 'Paseo de la Castellana 44', status: 'En Reparto',   total: 540  },
  { ref: '#GB-9385', time: '20:30', client: 'Marqués de Salamanca',   mbr: 'CLUB NOIR', table: 'Mesa 02 (Terraza)',loc: 'Maître Moreau asignado',    status: 'Mesa Ocupada', total: 890  },
  { ref: '#GB-9372', time: '19:46', client: 'Familia Gómez-Navarro',  mbr: 'RESERVA',   table: 'Mesa 14',         loc: 'Salón Privado Cava',        status: 'Completado',   total: 1650 },
]

const dishes = [
  { name: 'Wagyu A5 Miyazaki',    price: 195, stock: 6,  orders: 22, rating: 4.98, img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&q=80' },
  { name: 'Golden Truffle Burger',price: 68,  stock: 11, orders: 38, rating: 4.92, img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80' },
  { name: 'Caviar Oscietra I.',   price: 220, stock: 4,  orders: 9,  rating: 5.0,  img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80' },
]

const statusColor: Record<string, string> = {
  'En Cocina':    '#f0a500',
  'En Reparto':   '#5b9cf6',
  'Mesa Ocupada': '#9b59b6',
  'Completado':   '#5cb85c',
}

const rev  = [8200, 11400, 9800, 13200, 14850, 18900, 12300]
const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie ★', 'Sáb', 'Dom']
const maxR = Math.max(...rev)

export default function AdminDashboard() {
  return (
    <AdminLayout>
      {/* Cabecera */}
      <div className="dash-header">
        <div>
          <p className="dash-service">Gran Salón Madrid · Servicio Nocturno en Marcha</p>
          <h1 className="dash-title">Panóptico del Servicio & Salones</h1>
        </div>
        <span className="badge">📅 Turno Cena · 20:00 – 00:00</span>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: 'Ingresos del Día',   icon: '💰', value: '€14.850',   sub: 'Meta: €18.000',            trend: '+16% vs semana anterior' },
          { label: 'Comandas Activas',   icon: '🍳', value: '28 Órdenes', sub: '19 Cocina · 9 Transit',   trend: 'Promedio pase: 18 min' },
          { label: 'Ocupación de Mesas', icon: '🪑', value: '92% Lleno',  sub: '24/26 Mesas activas',     trend: '2 Disponibles 22:30' },
          { label: 'Club Privé Hoy',     icon: '⭐', value: '+14 Socios', sub: '3 Nuevos miembros',       trend: 'Gasto promedio alto' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__label">{s.label}<span>{s.icon}</span></div>
            <div className="admin-stat-card__value">{s.value}</div>
            <div className="admin-stat-card__sub">{s.sub}</div>
            <div className="admin-stat-card__trend">{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2" style={{ marginBottom: '24px' }}>
        {/* Gráfico ingresos */}
        <div className="dash-card">
          <p className="admin-section-title" style={{ marginBottom: '4px' }}>Rendimiento Culinario & Ventas de Bodega</p>
          <p className="admin-section-sub" style={{ marginBottom: '20px' }}>Desglose de recaudación por sede y turno</p>
          <div className="dash-chart">
            {rev.map((v, i) => (
              <div key={i} className="dash-chart__col">
                <div className="dash-chart__bar-wrap">
                  <div className="dash-chart__bar" style={{ height: `${(v / maxR) * 100}%` }} />
                </div>
                <span className={`dash-chart__label ${i === 4 ? 'highlight' : ''}`}>{days[i]}</span>
              </div>
            ))}
          </div>
          <p className="dash-chart__note">Pico histórico Viernes Noche (€34.890)</p>
          <div className="dash-venues">
            {[
              { name: 'Madrid · Gran Salón Retiro', tag: 'Líder', total: 8420, target: 10000 },
              { name: 'Barcelona · Passeig de Gràcia',             total: 4980, target: 7000  },
              { name: 'CDMX · Polanco Private Mansion',            total: 1450, target: 3000  },
            ].map(v => (
              <div key={v.name} className="dash-venue">
                <div className="dash-venue__header">
                  <span className="dash-venue__name">{v.name}</span>
                  {v.tag && <span className="badge">{v.tag}</span>}
                  <span className="dash-venue__total">€{v.total.toLocaleString()}</span>
                </div>
                <div className="dash-venue__bar">
                  <div className="dash-venue__fill" style={{ width: `${(v.total / v.target) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="dash-card">
          <p className="admin-section-title" style={{ marginBottom: '16px' }}>Alertas del Servicio en Curso</p>
          <div className="dash-alerts">
            {[
              { label: 'Comanda VIP Nivel Noir',     msg: 'Conde de Montemayor (Alergia a mariscos). Comienza pase de Menú…', sub: 'Chef Ejecutivo asignado' },
              { label: 'Cápsula Térmica en Ruta',    msg: 'Solomillo Rossini en camino a Suite 4. Sensor: 58.4°C (Óptimo).',  sub: 'Chofer Élite: Carlos M.' },
              { label: 'Solicitud Sumiller Especial',msg: 'Solicitan decantación de Pétrus Grand Cru 1996 en mesa.',           sub: 'Sumiller: Elena R.' },
            ].map(a => (
              <div key={a.label} className="dash-alert">
                <div className="dash-alert__dot" />
                <div>
                  <p className="dash-alert__label">{a.label}</p>
                  <p className="dash-alert__msg">{a.msg}</p>
                  <p className="dash-alert__sub">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platos estrella */}
      <div className="dash-card" style={{ marginBottom: '24px' }}>
        <p className="admin-section-title" style={{ marginBottom: '16px' }}>Rendimiento de Platos Estrella</p>
        <div className="dash-dishes">
          {dishes.map(d => (
            <div key={d.name} className="dash-dish">
              <div className="dash-dish__img-wrap">
                <img src={d.img} alt={d.name} className="dash-dish__img" />
                <span className="dash-dish__stock">Stock: {d.stock}</span>
              </div>
              <div className="dash-dish__body">
                <p className="dash-dish__name">{d.name}</p>
                <p className="dash-dish__price">€{d.price}</p>
                <p className="dash-dish__meta">★ {d.rating} · {d.orders} órdenes hoy</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla órdenes */}
      <div className="dash-card">
        <div className="admin-section-header">
          <div>
            <p className="admin-section-title">Últimas Órdenes de la Noche</p>
            <p className="admin-section-sub">Seguimiento en tiempo real de salones y servicios a domicilio</p>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Comensal</th>
                <th>Mesa / Destino</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.ref}>
                  <td>
                    <p style={{ color: 'var(--text)', fontWeight: 500 }}>{o.ref}</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{o.time} h</p>
                  </td>
                  <td>
                    <p style={{ color: 'var(--text)' }}>{o.client}</p>
                    <span className="badge" style={{ fontSize: '9px' }}>{o.mbr}</span>
                  </td>
                  <td>
                    <p style={{ color: 'var(--text)' }}>{o.table}</p>
                    <p style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{o.loc}</p>
                  </td>
                  <td>
                    <span style={{ color: statusColor[o.status], fontSize: '12px', fontWeight: 600 }}>
                      ● {o.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)', fontSize: '15px' }}>
                    €{o.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '12px', textAlign: 'center' }}>
          Mostrando 4 de 28 comandas activas en la noche
        </p>
      </div>
    </AdminLayout>
  )
}