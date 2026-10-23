import { useState } from 'react'
import AdminLayout from '../../components/adminlayout'
import './AdminUsers.css'

const users = [
  { id: 'GB-8921',  ini: 'AV', name: 'Alejandro Valdés',     email: 'a.valdes@inversiones-av.es', mbr: 'NOIR',     pts: 14850, ltv: 18420 },
  { id: 'GB-7104',  ini: 'BT', name: 'Lady Beatrice Thorne', email: 'beatrice@thorne-intl.co.uk', mbr: 'NOIR',     pts: 11200, ltv: 14900 },
  { id: 'GB-5529',  ini: 'CM', name: 'Carlos Mendoza Suárez',email: 'cmendoza@arquitectura.mx',   mbr: 'GOLD',     pts: 6450,  ltv: 8230  },
  { id: 'GB-9801',  ini: 'HD', name: 'Dra. Hélène Dupont',   email: 'h.dupont@sorbonne.fr',       mbr: 'ESTÁNDAR', pts: 1820,  ltv: 2150  },
  { id: 'STAFF-04', ini: 'RS', name: 'Rodrigo San Martín',   email: 'r.sanmartin@goldenbite.com', mbr: 'STAFF',    pts: 0,     ltv: 0     },
]
const mbrColor: Record<string, string> = {
  NOIR: '#C9A84C', GOLD: '#D4AF37', ESTÁNDAR: '#8B7D5E', STAFF: '#5b9cf6',
}

export default function AdminUsers() {
  const [sel, setSel] = useState(users[0])
  const [q, setQ]     = useState('')

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <div>
          <p className="section-label" style={{ marginBottom: '4px' }}>Club Étoilé & Backoffice Concierge</p>
          <h1 className="admin-section-title" style={{ fontSize: 'clamp(18px,2.5vw,26px)' }}>
            Gestión de Usuarios y Socios Privé
          </h1>
          <p className="admin-section-sub">Administración de cuentas de comensales, membresías y perfiles de staff.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-outline" style={{ fontSize: '11px', padding: '9px 14px' }}>⬆ Exportar Base de Datos</button>
          <button className="btn-gold"    style={{ fontSize: '11px', padding: '9px 14px' }}>👤+ Crear Usuario</button>
        </div>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: 'Total Clientes',       icon: '👥', value: '3.420',  sub: '+142 nuevas altas este mes' },
          { label: 'Socios Nivel Noir',    icon: '⭐', value: '184',    sub: 'Activos 100%' },
          { label: 'Nuevas Solicitudes',   icon: '📥', value: '12',     sub: 'Pendientes de validación' },
          { label: 'Gasto Promedio Anual', icon: '💰', value: '€2.850', sub: '+18.5% vs ejercicio anterior' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__label">{s.label}<span>{s.icon}</span></div>
            <div className="admin-stat-card__value">{s.value}</div>
            <div className="admin-stat-card__sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="users-layout">
        {/* ── Lista ── */}
        <div className="users-panel">
          <div className="users-filters">
            <input
              className="users-search"
              placeholder="Buscar por nombre, email…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <select className="users-select">
              <option>Socios Noir</option>
              <option>Gold</option>
              <option>Todos</option>
            </select>
          </div>

          <div className="users-list-head">
            <span>Socio / Usuario</span>
            <span>Membresía</span>
            <span>Puntos</span>
            <span>LTV</span>
          </div>

          {filtered.map(u => (
            <button
              key={u.id}
              className={`users-row ${sel.id === u.id ? 'active' : ''}`}
              onClick={() => setSel(u)}
            >
              <div className="users-row__avatar">{u.ini}</div>
              <div className="users-row__info">
                <p className="users-row__name">{u.name}</p>
                <p className="users-row__email">#{u.id} · {u.email}</p>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: mbrColor[u.mbr], whiteSpace: 'nowrap' }}>
                ● {u.mbr}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {u.pts.toLocaleString()}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--gold)', fontFamily: 'var(--font-serif)', whiteSpace: 'nowrap' }}>
                €{u.ltv.toLocaleString()}
              </span>
            </button>
          ))}

          <p className="users-count">Mostrando {filtered.length} de 3.420 perfiles</p>
        </div>

        {/* ── Detalle ── */}
        <div className="users-detail">
          <span className="badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
            ● Ficha Activa · #{sel.id}
          </span>

          <div className="users-detail__profile">
            <div className="users-detail__avatar">{sel.ini}</div>
            <div>
              <h2 className="users-detail__name">{sel.name}</h2>
              <span className="badge" style={{ color: mbrColor[sel.mbr] }}>{sel.mbr} ELITE</span>
            </div>
          </div>

          <div className="users-detail__meta">
            <div className="users-detail__row"><span>Socio desde</span>    <span>Octubre 2021</span></div>
            <div className="users-detail__row"><span>Sede habitual</span>  <span>Madrid (Salamanca)</span></div>
            <div className="users-detail__row"><span>Email</span>          <span style={{ fontSize: '10px' }}>{sel.email}</span></div>
            <div className="users-detail__row"><span>Puntos</span>         <span style={{ color: 'var(--gold)' }}>{sel.pts.toLocaleString()}</span></div>
            <div className="users-detail__row"><span>LTV</span>            <span style={{ color: 'var(--gold)', fontFamily: 'var(--font-serif)' }}>€{sel.ltv.toLocaleString()}</span></div>
          </div>

          <div>
            <p className="users-detail__section-title">🍴 Preferencias de Alta Cocina</p>
            <div className="users-detail__pref">
              <p className="users-detail__pref-label">Cocción Predilecta</p>
              <p className="users-detail__pref-value">Punto Poco Hecho (Saignant / Rare)</p>
              <p className="users-detail__pref-sub">Maduración mínima 45 días, corte wagyu A5 o rubia gallega</p>
            </div>
            <div className="users-detail__pref users-detail__pref--alert">
              <p className="users-detail__pref-label">⚠ Alerta Médica de Cocina</p>
              <p className="users-detail__pref-value">Alergia Severa a Nueces y Frutos Secos</p>
              <p className="users-detail__pref-sub">Protocolo estricto de contaminación cruzada en repostería.</p>
            </div>
          </div>

          <div className="users-detail__meta">
            <div className="users-detail__row"><span>Mesa Preferente</span> <span style={{ color: 'var(--gold)' }}>Mesa 04 (Rincón Privé)</span></div>
            <div className="users-detail__row"><span>Crédito Privé</span>   <span style={{ color: 'var(--gold)' }}>€4.500 disponible</span></div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
            <button className="btn-outline" style={{ flex: 1, fontSize: '11px', padding: '10px' }}>✏ Modificar Ficha</button>
            <button className="btn-gold"    style={{ flex: 1, fontSize: '11px', padding: '10px' }}>🪑 Asignar Mesa</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}