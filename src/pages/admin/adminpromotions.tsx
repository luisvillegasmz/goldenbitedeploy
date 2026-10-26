import { useEffect, useState } from 'react'
import {
  collection, getDocs, addDoc, updateDoc,
  deleteDoc, doc, serverTimestamp, query, orderBy,
} from 'firebase/firestore'
import { db } from '../../firebase'
import AdminLayout from '../../components/adminlayout'
import { formatCOP } from '../../utils/format'
import './adminpromotions.css'

interface Descuento {
  id:          string
  code:        string
  type:        'percentage' | 'fixed'
  value:       number
  description: string
  active:      boolean
  uses:        number
  maxUses:     number | null
  createdAt:   any
}

const empty = { code: '', type: 'percentage' as const, value: 10, description: '', maxUses: '' }

export default function AdminPromotions() {
  const [descuentos, setDescuentos] = useState<Descuento[]>([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [showForm,   setShowForm]   = useState(false)
  const [form,       setForm]       = useState(empty)
  const [msg,        setMsg]        = useState('')

  const fetch = async () => {
    setLoading(true)
    try {
      const q    = query(collection(db, 'descuentos'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setDescuentos(snap.docs.map(d => ({ id: d.id, ...d.data() } as Descuento)))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetch() }, [])

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.code.trim()) return
    setSaving(true)
    try {
      await addDoc(collection(db, 'descuentos'), {
        code:        form.code.trim().toUpperCase(),
        type:        form.type,
        value:       Number(form.value),
        description: form.description,
        active:      true,
        uses:        0,
        maxUses:     form.maxUses ? Number(form.maxUses) : null,
        createdAt:   serverTimestamp(),
      })
      setForm(empty)
      setShowForm(false)
      await fetch()
      notify('Código creado correctamente.')
    } catch {
      notify('Error al crear el código.')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (d: Descuento) => {
    try {
      await updateDoc(doc(db, 'descuentos', d.id), { active: !d.active })
      setDescuentos(prev => prev.map(x => x.id === d.id ? { ...x, active: !x.active } : x))
    } catch {
      notify('Error al actualizar.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este código de descuento?')) return
    try {
      await deleteDoc(doc(db, 'descuentos', id))
      setDescuentos(prev => prev.filter(d => d.id !== id))
      notify('Código eliminado.')
    } catch {
      notify('Error al eliminar.')
    }
  }

  const inputStyle: React.CSSProperties = {
    width:        '100%',
    background:   'var(--bg)',
    border:       '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color:        'var(--text)',
    padding:      '10px 14px',
    fontSize:     '13px',
    boxSizing:    'border-box',
  }

  return (
    <AdminLayout>
      <div className="admin-section-header">
        <div>
          <h1 className="admin-section-title">Códigos de descuento</h1>
          <p className="admin-section-sub">
            Crea, activa y desactiva códigos para los clientes.
          </p>
        </div>
        <button className="btn-gold" style={{ fontSize: '12px', padding: '10px 16px' }}
          onClick={() => setShowForm(!showForm)}>
          <i className={`bi bi-${showForm ? 'x' : 'plus-lg'}`} />
          {showForm ? ' Cancelar' : ' Nuevo código'}
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

      {/* Formulario de creación */}
      {showForm && (
        <div style={{
          background:   'var(--surface)',
          border:       '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding:      '20px',
          marginBottom: '24px',
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '16px' }}>
            <i className="bi bi-tag" /> Nuevo código de descuento
          </h3>
          <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Código *
              </label>
              <input
                style={inputStyle}
                placeholder="ej: GOLDEN10"
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tipo
              </label>
              <select
                style={inputStyle}
                value={form.type}
                onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}
              >
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Valor fijo (COP)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {form.type === 'percentage' ? 'Descuento (%)' : 'Descuento (COP)'}
              </label>
              <input
                style={inputStyle}
                type="number"
                min="1"
                placeholder={form.type === 'percentage' ? '10' : '15000'}
                value={form.value}
                onChange={e => setForm(p => ({ ...p, value: Number(e.target.value) }))}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Usos máx. (vacío = ilimitado)
              </label>
              <input
                style={inputStyle}
                type="number"
                min="1"
                placeholder="100"
                value={form.maxUses}
                onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Descripción
              </label>
              <input
                style={inputStyle}
                placeholder="ej: 10% de descuento en tu primer pedido"
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-outline"
                style={{ fontSize: '12px', padding: '10px 16px' }}
                onClick={() => { setShowForm(false); setForm(empty) }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-gold"
                disabled={saving}
                style={{ fontSize: '12px', padding: '10px 20px' }}
              >
                {saving ? 'Guardando...' : <><i className="bi bi-check2" /> Crear código</>}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="admin-stats" style={{ marginBottom: '20px' }}>
        {[
          { label: 'Total códigos',   value: descuentos.length },
          { label: 'Activos',         value: descuentos.filter(d => d.active).length },
          { label: 'Inactivos',       value: descuentos.filter(d => !d.active).length },
          { label: 'Total usos',      value: descuentos.reduce((a, d) => a + (d.uses ?? 0), 0) },
        ].map(s => (
          <div key={s.label} className="admin-stat-card">
            <div className="admin-stat-card__value">{s.value}</div>
            <div className="admin-stat-card__sub">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Lista de códigos */}
      <div style={{
        background:   'var(--surface)',
        border:       '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow:     'hidden',
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            Cargando códigos...
          </div>
        ) : descuentos.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            <i className="bi bi-tag" style={{ fontSize: '36px', display: 'block', marginBottom: '12px' }} />
            No hay códigos de descuento todavía.
            <br />
            <span style={{ fontSize: '12px' }}>Crea el primero con el botón de arriba.</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descuento</th>
                  <th>Descripción</th>
                  <th>Usos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {descuentos.map(d => (
                  <tr key={d.id}>
                    <td>
                      <span style={{
                        fontFamily:    'monospace',
                        fontWeight:    700,
                        color:         'var(--gold)',
                        fontSize:      '14px',
                        letterSpacing: '0.05em',
                      }}>
                        {d.code}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text)', fontWeight: 600 }}>
                      {d.type === 'percentage'
                        ? `${d.value}%`
                        : formatCOP(d.value)}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px', maxWidth: '200px' }}>
                      {d.description || '—'}
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                      {d.uses ?? 0}
                      {d.maxUses ? ` / ${d.maxUses}` : ' / ∞'}
                    </td>
                    <td>
                      <span style={{
                        fontSize:     '11px',
                        fontWeight:   600,
                        padding:      '3px 10px',
                        borderRadius: '20px',
                        background:   d.active ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
                        color:        d.active ? '#10b981' : '#6b7280',
                      }}>
                        {d.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => toggleActive(d)}
                          title={d.active ? 'Desactivar' : 'Activar'}
                          style={{
                            background:   'transparent',
                            border:       '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            padding:      '6px 10px',
                            cursor:       'pointer',
                            color:        'var(--text-muted)',
                            fontSize:     '12px',
                          }}
                        >
                          <i className={`bi bi-${d.active ? 'pause' : 'play'}`} />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          title="Eliminar"
                          style={{
                            background:   'transparent',
                            border:       '1px solid #ef444440',
                            borderRadius: 'var(--radius)',
                            padding:      '6px 10px',
                            cursor:       'pointer',
                            color:        '#ef4444',
                            fontSize:     '12px',
                          }}
                        >
                          <i className="bi bi-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}