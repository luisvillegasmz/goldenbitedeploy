import { Link, useLocation } from 'react-router-dom'
import { formatCOP } from '../utils/format'
import './OrderConfirmation.css'

export default function OrderConfirmation() {
  const location = useLocation()
  const { total = 0, code = 'GB-00000', points = 0 } =
    (location.state as any) || {}

  return (
    <main className="confirm-page">
      <div className="container">

        {/* Hero */}
        <div className="confirm-hero">
          <div className="confirm-hero__icon">
            <i className="bi bi-check-lg" />
          </div>
          <span className="badge confirm-hero__badge">
            <i className="bi bi-circle-fill" style={{ fontSize: '8px', marginRight: '4px' }} />
            Pedido recibido
          </span>
          <h1 className="confirm-hero__title">¡Tu pedido está en camino!</h1>
          <p className="confirm-hero__subtitle">
            Recibimos tu pedido. Nuestro equipo lo está preparando.
            Puedes ver el estado en tiempo real con tu código.
          </p>

          <div className="confirm-hero__info">
            <div className="confirm-hero__info-card">
              <span className="confirm-hero__info-label">
                <i className="bi bi-receipt" /> Código de pedido
              </span>
              <span className="confirm-hero__info-value"
                style={{ fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                {code}
              </span>
            </div>
            <div className="confirm-hero__info-card">
              <span className="confirm-hero__info-label">
                <i className="bi bi-cash-stack" /> Total pagado
              </span>
              <span className="confirm-hero__info-value">{formatCOP(total)}</span>
            </div>
          </div>

          {points > 0 && (
            <div style={{
              background:   'rgba(201,168,76,0.08)',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding:      '12px 20px',
              margin:       '0 auto 20px',
              maxWidth:     '360px',
              fontSize:     '13px',
              color:        'var(--text-muted)',
              textAlign:    'center',
            }}>
              <i className="bi bi-star-fill" style={{ color: 'var(--gold)' }} />{' '}
              Ganaste <strong style={{ color: 'var(--gold)' }}>{points} puntos</strong> con este pedido.
            </div>
          )}

          <div className="confirm-hero__ctas">
            <Link to="/seguimiento" className="btn-gold">
              <i className="bi bi-search" /> Seguir mi pedido
            </Link>
            <Link to="/menu" className="btn-outline">
              <i className="bi bi-bag" /> Seguir comprando
            </Link>
          </div>
        </div>

        {/* Info extra */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap:                 '16px',
          maxWidth:            '680px',
          margin:              '32px auto 0',
        }}>
          {[
            { icon: 'bi-headset',  title: '¿Necesitas ayuda?',  desc: 'Escríbenos por WhatsApp o llámanos al local.' },
            { icon: 'bi-clock',    title: 'Tiempo estimado',     desc: 'Domicilio: 40–60 min · Recoger: 25–30 min.'   },
          ].map(item => (
            <div key={item.title} style={{
              background:   'var(--surface)',
              border:       '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding:      '20px',
              textAlign:    'center',
            }}>
              <i className={`bi ${item.icon}`} style={{ fontSize: '28px', color: 'var(--gold)', display: 'block', marginBottom: '8px' }} />
              <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '4px', fontSize: '14px' }}>
                {item.title}
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}