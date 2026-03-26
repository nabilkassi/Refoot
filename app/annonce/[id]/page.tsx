import Link from 'next/link'
import { MOCK_LISTINGS } from '@/lib/mock-data'

export default function AnnoncePage({ params }: { params: { id: string } }) {
  const listing = MOCK_LISTINGS.find(l => l.id === params.id)

  if (!listing) {
    return (
      <div style={{ padding: '5rem 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Annonce introuvable.</p>
        <Link href="/" style={{ color: 'var(--green)', marginTop: '1rem', display: 'inline-block' }}>
          ← Retour
        </Link>
      </div>
    )
  }

  const isUsed = listing.type === 'used'

  return (
    <div style={{ paddingTop: '80px', padding: '80px 16px 120px', maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--green)', fontSize: '14px', display: 'inline-block', marginBottom: '24px' }}>
        ← Retour aux résultats
      </Link>

      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
      }}>
        {/* Image placeholder */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          background: 'var(--surface2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '80px',
        }}>
          ⚽
        </div>

        <div style={{ padding: '24px' }}>
          {/* Badge */}
          <span style={{
            display: 'inline-block',
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '50px',
            background: isUsed ? 'var(--badge-used)' : 'var(--green)',
            color: '#000',
            marginBottom: '12px',
          }}>
            {isUsed ? 'Occasion' : 'Neuf'}
          </span>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
            {listing.brand}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(22px, 5vw, 36px)',
            marginBottom: '16px',
            lineHeight: 1.2,
          }}>
            {listing.model}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
            {[
              { label: 'Terrain', value: listing.terrain },
              { label: 'Pointure', value: `T.${listing.size}` },
              { label: 'Tige', value: listing.cut },
              { label: 'Empeigne', value: listing.upper },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                fontSize: '12px',
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{label} : </span>
                <span style={{ color: 'var(--text)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-syne), Syne, sans-serif',
                fontWeight: 800,
                fontSize: '36px',
                color: 'var(--green)',
              }}>
                {listing.price} €
              </span>
              {isUsed && listing.originalPrice && (
                <span style={{ fontSize: '16px', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '8px' }}>
                  {listing.originalPrice} €
                </span>
              )}
            </div>
            <button style={{
              background: 'var(--green)',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '14px 28px',
              fontFamily: 'var(--font-syne), Syne, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
            }}>
              {isUsed ? 'Contacter le vendeur' : 'Voir l\'offre →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
