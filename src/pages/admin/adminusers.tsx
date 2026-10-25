import { useEffect, useState } from 'react'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../context/AuthContext'
import AdminLayout from '../../components/adminlayout'
import './AdminUsers.css'

interface FirestoreUser {
  uid:         string
  displayName: string
  email:       string
  role:        UserRole
  points:      number
  createdAt:   string
}

const ROLES: UserRole[] = ['cliente', 'asesor', 'cajero', 'dueño', 'administrador']

const ROLE_COLOR: Record<string, string> = {
  administrador: '#ef4444',
  dueño:         '#f59e0b',
  asesor:        '#3b82f6',
  cajero:        '#10b981',
  cliente:       '#6b7280',
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth()
  const [users,    setUsers]    = useState<FirestoreUser[]>([])
  const [sel,      setSel]      = useState<FirestoreUser | null>(null)
  const [q,        setQ]        = useState('')
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [roleFilter, setRoleFilter] = useState<string>('todos')
  const [msg,      setMsg]      = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'usuarios'))
      const list = snap.docs.map(d => ({ uid: d.id, ...d.data() } as FirestoreUser))
      setUsers(list)
      if (!sel && list.length > 0) setSel(list[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const filtered = users.filter(u => {
    const matchQ = u.displayName.toLowerCase().includes(q.toLowerCase()) ||
                   u.email.toLowerCase().includes(q.toLowerCase())
    const matchR = roleFilter === 'todos' || u.role === roleFilter
    return matchQ && matchR
  })

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    if (uid === currentUser?.uid) {
      setMsg('No puedes cambiar tu propio rol.')
      setTimeout(() => setMsg(''), 3000)
      return
    }
    setSaving(true)
    try {
      await updateDoc(doc(db, 'usuarios', uid), { role: newRole })
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role: newRole } : u))
      if (sel?.uid === uid) setSel(prev => prev ? { ...prev, role: newRole } : prev)
      setMsg('Rol actualizado correctamente.')
      setTimeout(() => setMsg(''), 3000)
    } catch {
      setMsg('Error al actualizar el rol.')
    } finally {
      setSaving(false)
    }
  }

  const initials = (name: string) =>
    name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')

  const roleCount = (role: string) => users.filter(u => u.role === role).length

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <div>
          <h1 className="admin-section-title">Gestión de Usuarios</h1>
          <p className="admin-section-sub">
            Administra cuentas y asigna roles desde aquí. Los cambios aplican de inmediato.
          </p>
        </div>
        <button className="btn-outline" style={{ fontSize: '12px', padding: '9px 14px' }}
          onClick={fetchUsers}>
          <i className="bi bi-arrow-clockwise" /> Actualizar
        </button>
      </div>

      {msg && (
        <div style={{
          background:   msg.includes('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border:       `1px solid ${msg.includes('Error') ? '#ef4444' : '#10b981'}`,
          borderRadius: 'var(--radius)',
          padding:      '12px 16px',
          marginBottom: '16px',
          fontSize:     '13px',
          color:        msg.includes('Error') ? '#ef4444' : '#10b981',
        }}>
          <i className={`bi bi-${msg.includes('Error') ? 'exclamation-circle' : 'check-circle'}`} /> {msg}
        </div>
      )}

      {/* Stats rápidas */}
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total usuarios',  value: users.length,              color: 'var(--gold)' },
          { label: 'Clientes',        value: roleCount('cliente'),       color: '#6b7280'     },
          { label: 'Staff (asesor + cajero)', value: roleCount('asesor') + roleCount('cajero'), color: '#3b82f6' },
          { label: 'Admins + Dueños', value: roleCount('administrador') + roleCount('dueño'), color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__value" style={{ color: s.color }}>{s.value}</div>
            <div className="admin-stat-card__sub">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="users-layout">
        {/* Lista */}
        <div className="users-panel">
          <div className="users-filters">
            <input
              className="users-search"
              placeholder="Buscar por nombre o correo..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <select
              className="users-select"
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
            >
              <option value="todos">Todos los roles</option>
              {ROLES.map(r => (
                <option key={r} value={r} style={{ textTransform: 'capitalize' }}>{r}</option>
              ))}
            </select>
          </div>

          <div className="users-list-head">
            <span>Usuario</span>
            <span>Rol</span>
            <span>Puntos</span>
          </div>

          {loading ? (
            <p style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
              Cargando usuarios...
            </p>
          ) : filtered.length === 0 ? (
            <p style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No se encontraron usuarios.
            </p>
          ) : filtered.map(u => (
            <button
              key={u.uid}
              className={`users-row ${sel?.uid === u.uid ? 'active' : ''}`}
              onClick={() => setSel(u)}
            >
              <div className="users-row__avatar">{initials(u.displayName)}</div>
              <div className="users-row__info">
                <p className="users-row__name">
                  {u.displayName}
                  {u.uid === currentUser?.uid && (
                    <span style={{ fontSize: '10px', color: 'var(--text-dim)', marginLeft: '6px' }}>
                      (tú)
                    </span>
                  )}
                </p>
                <p className="users-row__email">{u.email}</p>
              </div>
              <span style={{
                fontSize:   '10px',
                fontWeight: 600,
                color:      ROLE_COLOR[u.role] ?? 'var(--text-muted)',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
              }}>
                <i className="bi bi-circle-fill" style={{ fontSize: '6px', marginRight: '4px' }} />
                {u.role}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {u.points.toLocaleString('es-CO')}
              </span>
            </button>
          ))}

          <p className="users-count">
            Mostrando {filtered.length} de {users.length} usuarios
          </p>
        </div>

        {/* Detalle */}
        {sel && (
          <div className="users-detail">
            <span className="badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
              <i className="bi bi-person-circle" /> Perfil de usuario
            </span>

            <div className="users-detail__profile">
              <div className="users-detail__avatar">{initials(sel.displayName)}</div>
              <div>
                <h2 className="users-detail__name">{sel.displayName}</h2>
                <span style={{
                  fontSize:      '11px',
                  fontWeight:    600,
                  color:         ROLE_COLOR[sel.role],
                  textTransform: 'capitalize',
                }}>
                  <i className="bi bi-circle-fill" style={{ fontSize: '7px', marginRight: '4px' }} />
                  {sel.role}
                </span>
              </div>
            </div>

            <div className="users-detail__meta">
              <div className="users-detail__row">
                <span><i className="bi bi-envelope" /> Correo</span>
                <span style={{ fontSize: '11px' }}>{sel.email}</span>
              </div>
              <div className="users-detail__row">
                <span><i className="bi bi-calendar3" /> Registro</span>
                <span>{sel.createdAt ?? '—'}</span>
              </div>
              <div className="users-detail__row">
                <span><i className="bi bi-star" /> Puntos</span>
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  {sel.points.toLocaleString('es-CO')}
                </span>
              </div>
              <div className="users-detail__row">
                <span><i className="bi bi-key" /> UID</span>
                <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'var(--text-dim)' }}>
                  {sel.uid.slice(0, 16)}...
                </span>
              </div>
            </div>

            {/* Cambiar rol */}
            <div style={{ marginTop: '20px' }}>
              <p style={{
                fontSize:     '12px',
                fontWeight:   600,
                color:        'var(--text)',
                marginBottom: '10px',
                textTransform:'uppercase',
                letterSpacing:'0.05em',
              }}>
                <i className="bi bi-shield" /> Cambiar rol
              </p>

              {sel.uid === currentUser?.uid ? (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No puedes cambiar tu propio rol.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {ROLES.map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(sel.uid, role)}
                      disabled={saving || sel.role === role}
                      style={{
                        padding:       '10px 14px',
                        borderRadius:  'var(--radius)',
                        border:        `1px solid ${sel.role === role ? ROLE_COLOR[role] : 'var(--border)'}`,
                        background:    sel.role === role ? `${ROLE_COLOR[role]}15` : 'transparent',
                        color:         sel.role === role ? ROLE_COLOR[role] : 'var(--text-muted)',
                        cursor:        sel.role === role ? 'default' : 'pointer',
                        fontSize:      '13px',
                        fontWeight:    sel.role === role ? 600 : 400,
                        textAlign:     'left',
                        textTransform: 'capitalize',
                        display:       'flex',
                        alignItems:    'center',
                        gap:           '8px',
                        opacity:       saving ? 0.6 : 1,
                        transition:    'all 0.15s',
                      }}
                    >
                      <i className="bi bi-circle-fill" style={{ fontSize: '7px', color: ROLE_COLOR[role] }} />
                      {role}
                      {sel.role === role && (
                        <span style={{ marginLeft: 'auto', fontSize: '11px' }}>Actual</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}