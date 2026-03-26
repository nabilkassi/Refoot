import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MOCK_LISTINGS } from '@/lib/mock-data'
import FavButton from '@/components/FavButton'

const TERRAIN_LABELS: Record<string, string> = {
  FG: '🌿 FG — Herbe naturelle',
  SG: '💧 SG — Terrain gras',
  AG: '🔷 AG — Synthétique',
  TF: '⬛ TF — Turf',
  IC: '🏟️ IC — Indoor',
  HG: '🏙️ HG — Terrain dur',
}

const PLAY_STYLE_LABELS: Record<string, string> = {
  speed: '⚡ Vitesse',
  control: '🎯 Contrôle',
  power: '💪 Puissance',
  versatile: '🔄 Polyvalence',
}

const CONDITION_LABELS: Record<string, string> = {
  new_tag: 'Neuf avec étiquette',
  very_good: 'Très bon état',
  good: 'Bon état',
  correct: 'État correct',
}

export async function generateStaticParams() {
  return MOCK_LISTINGS.map(l => ({ id: l.id }))
}

export default async function AnnoncePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = MOCK_LISTINGS.find(l => l.id === id)
  if (!listing) notFound()

  const isUsed = listing.type === 'used'
  const discount = listing.originalPrice
    ? Math.round((1 - listing.price / listing.originalPrice) * 100)
    : null

  const specs = [
    { label: 'Marque', value: listing.brand },
    { label: 'Modèle', value: listing.model },
    { label: 'Terrain', value: TERRAIN_LABELS[listing.terrain] ?? listing.terrain },
    { label: 'Pointure', value: `EU ${listing.size}` },
    { label: 'Largeur', value: listing.width === 'narrow' ? 'Étroit' : listing.width === 'wide' ? 'Large' : 'Standard' },
    { label: 'Fermeture', value: listing.closure === 'laces' ? 'Avec lacets' : 'Sans lacets' },
    { label: 'Tige', value: listing.cut === 'low' ? 'Basse' : listing.cut === 'mid' ? 'Mi-haute' : 'Haute' },
    { label: 'Empeigne', value: listing.upper === 'leather' ? 'Cuir naturel' : listing.upper === 'synthetic' ? 'Synthétique' : listing.upper === 'microfiber' ? 'Microfibre' : 'Knit (tissé)' },
    { label: 'Style de jeu', value: PLAY_STYLE_LABELS[listing.playStyle] ?? listing.playStyle },
    { label: 'Profil', value: listing.playerProfile === 'junior' ? 'Enfant / Junior' : listing.playerProfile === 'amateur' ? 'Amateur' : listing.playerProfile === 'confirmed' ? 'Confirmé' : 'Pro / Elite' },
    ...(isUsed && listing.condition ? [{ label: 'État', value: CONDITION_LABELS[listing.condition] ?? listing.condition }] : []),
  ]

  return (
    <div style={{ paddingTop: '60px', minHeight: '100vh' }}>
      {/* Breadcrumb */}
      <div style={{ padding: '16px 16px 0', maxWidth: '1200px', margin: '0 auto' }} className="md:px-10">
        <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>
          ← Retour aux résultats
        </Link>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px 16px 120px',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '24px',
      }} className="md:px-10 md:grid-cols-2 md:items-start">

        {/* LEFT — Image */}
        <div>
          <div style={{
            width: '100%',
            aspectRatio: '1/1',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '100px',
            position: 'relative',
          }}>
            ⚽
            {/* Badge */}
            <span style={{
              position: 'absolute',
              top: '12px', left: '12px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: '50px',
              background: isUsed ? 'var(--badge-used)' : 'var(--green)',
              color: '#000',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              {isUsed ? 'Occasion' : 'Neuf'}
            </span>
            {discount && (
              <span style={{
                position: 'absolute',
                top: '12px', right: '12px',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '50px',
                background: '#ef4444',
                color: '#fff',
              }}>
                -{discount}%
              </span>
            )}
          </div>
        </div>

        {/* RIGHT — Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header */}
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
              {listing.brand}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <h1 style={{
                fontFamily: 'var(--font-syne), Syne, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(22px, 4vw, 34px)',
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
              }}>
                {listing.model}
              </h1>
              <FavButton listingId={listing.id} />
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span style={tagStyle}>{TERRAIN_LABELS[listing.terrain] ?? listing.terrain}</span>
            {listing.playStyle !== 'all' && (
              <span style={tagStyle}>{PLAY_STYLE_LABELS[listing.playStyle]}</span>
            )}
          </div>

          {/* Price */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
              <span style={{
                fontFamily: 'var(--font-syne), Syne, sans-serif',
                fontWeight: 800,
                fontSize: '40px',
                color: 'var(--green)',
              }}>
                {listing.price} €
              </span>
              {isUsed && listing.originalPrice && (
                <span style={{ fontSize: '18px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {listing.originalPrice} €
                </span>
              )}
            </div>

            <button style={{
              width: '100%',
              background: 'var(--green)',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '14px',
              fontFamily: 'var(--font-syne), Syne, sans-serif',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background 0.2s, transform 0.15s',
            }}>
              {isUsed ? '💬 Contacter le vendeur' : '🛒 Voir l\'offre →'}
            </button>

            {isUsed && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
                Paiement sécurisé • Protection acheteur incluse
              </p>
            )}
          </div>

          {/* Specs table */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: '14px' }}>
                Caractéristiques
              </span>
            </div>
            {specs.map(({ label, value }, i) => (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: i < specs.length - 1 ? '1px solid var(--border)' : 'none',
                fontSize: '13px',
              }}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ color: 'var(--text)', fontWeight: 500, textAlign: 'right' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const tagStyle: React.CSSProperties = {
  background: 'rgba(0,200,83,0.08)',
  border: '1px solid rgba(0,200,83,0.2)',
  color: 'var(--green)',
  fontSize: '12px',
  fontWeight: 500,
  padding: '4px 12px',
  borderRadius: '50px',
}
