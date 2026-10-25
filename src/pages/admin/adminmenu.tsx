import { useEffect, useState } from 'react'
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../../firebase'
import AdminLayout from '../../components/adminlayout'
import { formatCOP } from '../../utils/format'
import { dishes as staticDishes } from '../../data/dishes'
import type { Dish } from '../../data/dishes'
import './AdminMenu.css'

const CATEGORIES = [
  'Entradas', 'Sopas y Caldos', 'Parrilla',
  'Platos Principales', 'Postres', 'Bebidas',
]

const BADGE_OPTIONS = [
  'Popular', 'Tradicional', 'Recomendado', 'Parrilla',
  'Típico', 'Del Río', 'Natural', 'Casero',
  'Para compartir', 'Refrescante', 'Vegetariano',
]

const ALLERGEN_OPTIONS = [
  'Gluten', 'Lácteos', 'Huevo', 'Pescado', 'Maní', 'Mariscos',
]

interface PlatoForm {
  name:      string
  category:  string
  price:     string
  desc:      string
  fullDesc:  string
  image:     string
  badges:    string[]
  allergens: string[]
  options:   string   // comma-separated
  active:    boolean
}

const emptyForm: PlatoForm = {
  name: '', category: CATEGORIES[0], price: '', desc: '',
  fullDesc: '', image: '', badges: [], allergens: [], options: '', active: true,
}

function formFromDish(d: Dish): PlatoForm {
  return {
    name:      d.name,
    category:  d.category,
    price:     String(d.price),
    desc:      d.desc,
    fullDesc:  d.fullDesc,
    image:     d.image,
    badges:    d.badges,
    allergens: d.allergens ?? [],
    options:   d.options.join(', '),
    active:    (d as any).active !== false,
  }
}

type View = 'list' | 'form'

export default function AdminMenu() {
  const [platos,   setPlatos]   = useState<(Dish & { firestoreId?: string })[]>([])
  const [view,     setView]     = useState<View>('list')
  const [editId,   setEditId]   = useState<string | null>(null)
  const [form,     setForm]     = useState<PlatoForm>(emptyForm)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [q,        setQ]        = useState('')
  const [catFilter,setCatFilter]= useState('Todas')
  const [msg,      setMsg]      = useState('')

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const fetchPlatos = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'platos'))
      if (snap.empty) {
        // Mostrar los estáticos como referencia (no tienen firestoreId)
        setPlatos(staticDishes.map(d => ({ ...d, firestoreId: undefined })))
      } else {
        setPlatos(snap.docs.map(d => ({
          ...(d.data() as Dish),
          id:          d.id,
          firestoreId: d.id,
          images:      d.data().image ? [d.data().image] : [],
        })))
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPlatos() }, [])

  const filtered = platos.filter(p => {
    const matchQ   = p.name.toLowerCase().includes(q.toLowerCase())
    const matchCat = catFilter === 'Todas' || p.category === catFilter
    return matchQ && matchCat
  })

  const openCreate = () => {
    setForm(emptyForm)
    setEditId(null)
    setView('form')
  }

  const openEdit = (p: Dish & { firestoreId?: string }) => {
    setForm(formFromDish(p))
    setEditId(p.firestoreId ?? null)
    setView('form')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        name:      form.name.trim(),
        category:  form.category,
        price:     Number(form.price),
        desc:      form.desc.trim(),
        fullDesc:  form.fullDesc.trim(),
        image:     form.image.trim(),
        badges:    form.badges,
        allergens: form.allergens,
        options:   form.options.split(',').map(s => s.trim()).filter(Boolean),
        active:    form.active,
        updatedAt: serverTimestamp(),
      }

      if (editId) {
        await updateDoc(doc(db, 'platos', editId), data)
        notify('Plato actualizado correctamente.')
      } else {
        await addDoc(collection(db, 'platos'), { ...data, createdAt: serverTimestamp() })
        notify('Plato creado correctamente.')
      }
      await fetchPlatos()
      setView('list')
    } catch {
      notify('Error al guardar el plato.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (firestoreId: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"?`)) return
    try {
      await deleteDoc(doc(db, 'platos', firestoreId))
      await fetchPlatos()
      notify('Plato eliminado.')
    } catch {
      notify('Error al eliminar.')
    }
  }

  const toggleActive = async (p: Dish & { firestoreId?: string }) => {
    if (!p.firestoreId) { notify('Este plato es de datos base. Crea uno en Firestore para editarlo.'); return }
    try {
      await updateDoc(doc(db, 'platos', p.firestoreId), { active: !(p as any).active })
      await fetchPlatos()
    } catch {
      notify('Error al actualizar.')
    }
  }

  const toggleCheck = (field: 'badges' | 'allergens', val: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter(x => x !== val)
        : [...prev[field], val],
    }))
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', color: 'var(--text)', padding: '10px 14px',
    fontSize: '13px', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '11px', color: 'var(--text-muted)', display: 'block',
    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em',
  }

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <div>
          <h1 className="admin-section-title">Gestión del Menú</h1>
          <p className="admin-section-sub">
            Crea, edita y desactiva platos. Los cambios se reflejan en el menú al instante.
          </p>
        </div>
        {view === 'list' ? (
          <button className="btn-gold" style={{ fontSize: '12px', padding: '10px 16px' }} onClick={openCreate}>
            <i className="bi bi-plus-lg" /> Nuevo plato
          </button>
        ) : (
          <button className="btn-outline" style={{ fontSize: '12px', padding: '10px 16px' }} onClick={() => setView('list')}>
            <i className="bi bi-arrow-left" /> Volver
          </button>
        )}
      </div>

      {msg && (
        <div style={{
          background:   msg.includes('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
          border:       `1px solid ${msg.includes('Error') ? '#ef4444' : '#10b981'}`,
          borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: '16px',
          fontSize: '13px', color: msg.includes('Error') ? '#ef4444' : '#10b981',
        }}>
          <i className={`bi bi-${msg.includes('Error') ? 'exclamation-circle' : 'check-circle'}`} /> {msg}
        </div>
      )}

      {/* ── LISTA ── */}
      {view === 'list' && (
        <>
          {/* Stats */}
          <div className="admin-stats" style={{ marginBottom: '20px' }}>
            {[
              { label: 'Total platos',   value: platos.length },
              { label: 'Activos',        value: platos.filter(p => (p as any).active !== false).length },
              { label: 'Inactivos',      value: platos.filter(p => (p as any).active === false).length },
              { label: 'Categorías',     value: CATEGORIES.length },
            ].map(s => (
              <div key={s.label} className="admin-stat-card">
                <div className="admin-stat-card__value">{s.value}</div>
                <div className="admin-stat-card__sub">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filtros */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <input
              style={{ ...inputStyle, flex: 1, minWidth: '180px' }}
              placeholder="Buscar plato..."
              value={q}
              onChange={e => setQ(e.target.value)}
            />
            <select
              style={{ ...inputStyle, width: 'auto' }}
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
            >
              <option value="Todas">Todas las categorías</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Tabla */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                Cargando platos...
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Plato</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <tr key={p.firestoreId ?? p.id ?? i}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {p.image ? (
                              <img
                                src={p.image} alt={p.name}
                                style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                              />
                            ) : (
                              <div style={{ width: '40px', height: '40px', borderRadius: '4px', background: 'var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="bi bi-image" style={{ color: 'var(--text-dim)' }} />
                              </div>
                            )}
                            <div>
                              <p style={{ color: 'var(--text)', fontWeight: 500, fontSize: '13px' }}>{p.name}</p>
                              <div style={{ display: 'flex', gap: '4px', marginTop: '3px', flexWrap: 'wrap' }}>
                                {p.badges.slice(0, 2).map(b => (
                                  <span key={b} className="badge" style={{ fontSize: '8px' }}>{b}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{p.category}</td>
                        <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{formatCOP(p.price)}</td>
                        <td>
                          <span style={{
                            fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px',
                            background: (p as any).active !== false ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                            color:      (p as any).active !== false ? '#10b981' : '#6b7280',
                          }}>
                            {(p as any).active !== false ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {p.firestoreId && (
                              <>
                                <button
                                  onClick={() => openEdit(p)}
                                  title="Editar"
                                  style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px' }}
                                >
                                  <i className="bi bi-pencil" />
                                </button>
                                <button
                                  onClick={() => toggleActive(p)}
                                  title={(p as any).active !== false ? 'Desactivar' : 'Activar'}
                                  style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px' }}
                                >
                                  <i className={`bi bi-${(p as any).active !== false ? 'eye-slash' : 'eye'}`} />
                                </button>
                                <button
                                  onClick={() => handleDelete(p.firestoreId!, p.name)}
                                  title="Eliminar"
                                  style={{ background: 'transparent', border: '1px solid #ef444440', borderRadius: 'var(--radius)', padding: '6px 10px', cursor: 'pointer', color: '#ef4444', fontSize: '12px' }}
                                >
                                  <i className="bi bi-trash" />
                                </button>
                              </>
                            )}
                            {!p.firestoreId && (
                              <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                                Dato base
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {!loading && platos.every(p => !p.firestoreId) && (
            <div style={{
              background: 'rgba(201,168,76,0.06)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', padding: '14px 18px', marginTop: '16px',
              fontSize: '13px', color: 'var(--text-muted)',
            }}>
              <i className="bi bi-info-circle" style={{ color: 'var(--gold)' }} />{' '}
              Estás viendo los platos base del archivo estático.
              Cuando crees platos en Firestore, estos aparecerán aquí y el menú del sitio los usará automáticamente.
            </div>
          )}
        </>
      )}

      {/* ── FORMULARIO ── */}
      {view === 'form' && (
        <form onSubmit={handleSave}>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '24px',
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '20px' }}>
              <i className="bi bi-journal-text" /> {editId ? 'Editar plato' : 'Nuevo plato'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>

              {/* Nombre */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Nombre del plato *</label>
                <input style={inputStyle} placeholder="ej: Bandeja Paisa"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>

              {/* Categoría y precio */}
              <div>
                <label style={labelStyle}>Categoría *</label>
                <select style={inputStyle} value={form.category}
                  onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Precio (COP) *</label>
                <input style={inputStyle} type="number" min="0" placeholder="42000"
                  value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
              </div>

              {/* URL imagen */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>URL de la imagen</label>
                <input style={inputStyle} placeholder="https://..."
                  value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} />
                {form.image && (
                  <img src={form.image} alt="preview" style={{ marginTop: '8px', height: '80px', borderRadius: '4px', objectFit: 'cover' }} />
                )}
              </div>

              {/* Descripción corta */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descripción corta * (se muestra en el menú)</label>
                <input style={inputStyle} placeholder="Descripción breve del plato..."
                  value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} required />
              </div>

              {/* Descripción completa */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Descripción completa (detalle del plato)</label>
                <textarea
                  style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                  placeholder="Descripción detallada, ingredientes y preparación..."
                  value={form.fullDesc}
                  onChange={e => setForm(p => ({ ...p, fullDesc: e.target.value }))}
                />
              </div>

              {/* Opciones */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Opciones de preparación (separadas por coma)</label>
                <input style={inputStyle} placeholder="ej: Pipián, Carne, Mixtas"
                  value={form.options} onChange={e => setForm(p => ({ ...p, options: e.target.value }))} />
              </div>

              {/* Badges */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Insignias</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {BADGE_OPTIONS.map(b => (
                    <label key={b} style={{
                      display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                      padding: '6px 10px', borderRadius: 'var(--radius)',
                      border: `1px solid ${form.badges.includes(b) ? 'var(--gold)' : 'var(--border)'}`,
                      background: form.badges.includes(b) ? 'rgba(201,168,76,0.1)' : 'transparent',
                      fontSize: '12px', color: form.badges.includes(b) ? 'var(--gold)' : 'var(--text-muted)',
                    }}>
                      <input type="checkbox" style={{ display: 'none' }}
                        checked={form.badges.includes(b)} onChange={() => toggleCheck('badges', b)} />
                      {b}
                    </label>
                  ))}
                </div>
              </div>

              {/* Alérgenos */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Alérgenos</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ALLERGEN_OPTIONS.map(a => (
                    <label key={a} style={{
                      display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                      padding: '6px 10px', borderRadius: 'var(--radius)',
                      border: `1px solid ${form.allergens.includes(a) ? '#ef4444' : 'var(--border)'}`,
                      background: form.allergens.includes(a) ? 'rgba(239,68,68,0.08)' : 'transparent',
                      fontSize: '12px', color: form.allergens.includes(a) ? '#ef4444' : 'var(--text-muted)',
                    }}>
                      <input type="checkbox" style={{ display: 'none' }}
                        checked={form.allergens.includes(a)} onChange={() => toggleCheck('allergens', a)} />
                      <i className="bi bi-exclamation-triangle" style={{ fontSize: '10px' }} /> {a}
                    </label>
                  ))}
                </div>
              </div>

              {/* Activo */}
              <div>
                <label style={labelStyle}>Estado</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--text)' }}>
                  <div
                    onClick={() => setForm(p => ({ ...p, active: !p.active }))}
                    className={`checkout-toggle ${form.active ? 'on' : ''}`}
                  />
                  {form.active ? 'Activo en el menú' : 'Inactivo (oculto)'}
                </label>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <button type="button" className="btn-outline"
                style={{ fontSize: '13px', padding: '10px 20px' }}
                onClick={() => setView('list')}>
                Cancelar
              </button>
              <button type="submit" className="btn-gold"
                disabled={saving}
                style={{ fontSize: '13px', padding: '10px 24px' }}>
                {saving
                  ? 'Guardando...'
                  : <><i className="bi bi-check2" /> {editId ? 'Guardar cambios' : 'Crear plato'}</>}
              </button>
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  )
}