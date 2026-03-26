'use client'

import { useState } from 'react'
import { type Filters } from '@/lib/types'

interface FiltersPanelProps {
  filters: Filters
  onChange: (f: Partial<Filters>) => void
  onSearch: () => void
}

const BRANDS = ['Toutes', 'Nike', 'adidas', 'Puma', 'New Balance', 'Mizuno', 'Asics', 'Joma']
const SIZES = ['Toutes', '36 – 36.5', '37 – 37.5', '38 – 38.5', '39 – 39.5', '40 – 40.5', '41 – 41.5', '42 – 42.5', '43 – 43.5', '44 – 44.5', '45 – 46', '47+']
const WIDTHS = ['Toutes', 'Étroit', 'Standard', 'Large']
const CLOSURES = ['Toutes', 'Avec lacets', 'Sans lacets']
const CUTS = ['Toutes', 'Basse', 'Mi-haute', 'Haute']
const PLAY_STYLES = ['Tous', '⚡ Vitesse', '🎯 Contrôle', '💪 Puissance', '🔄 Polyvalence']
const PROFILES = ['Tous', 'Enfant / Junior', 'Amateur', 'Confirmé', 'Pro / Elite']
const UPPERS = ['Toutes', 'Cuir naturel', 'Synthétique', 'Microfibre', 'Knit (tissé)']

const CONDITIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'new_tag', label: 'Neuf/étiq.' },
  { value: 'very_good', label: 'Très bon' },
  { value: 'good', label: 'Bon' },
  { value: 'correct', label: 'Correct' },
]

function FilterSelect({ label, value, options, onChange }: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: '6px',
        fontFamily: 'var(--font-dm), DM Sans, sans-serif',
      }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

function ToggleGroup({ options, value, onChange }: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden',
    }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            flex: 1,
            padding: '10px 8px',
            background: value === o.value ? 'var(--green)' : 'transparent',
            border: 'none',
            color: value === o.value ? '#000' : 'var(--text-muted)',
            fontFamily: 'var(--font-dm), DM Sans, sans-serif',
            fontSize: '13px',
            fontWeight: value === o.value ? 600 : 400,
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
            textAlign: 'center',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function FiltersPanel({ filters, onChange, onSearch }: FiltersPanelProps) {
  const [open, setOpen] = useState(false)

  const activeCount = [
    filters.brand && filters.brand !== 'Toutes',
    filters.size && filters.size !== 'Toutes',
    filters.width && filters.width !== 'Toutes',
    filters.closure && filters.closure !== 'Toutes',
    filters.cut && filters.cut !== 'Toutes',
    filters.playStyle && filters.playStyle !== 'Tous',
    filters.playerProfile && filters.playerProfile !== 'Tous',
    filters.upper && filters.upper !== 'Toutes',
    filters.minPrice,
    filters.maxPrice,
    filters.availability !== 'all',
  ].filter(Boolean).length

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  }

  return (
    <>
      {/* Toggle button */}
      <div
        onClick={() => setOpen(o => !o)}
        className="md:mx-10"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '4px 16px 14px',
          padding: '12px 14px',
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text)' }}>
          <span>⚙️</span>
          <span>Filtres avancés</span>
          {activeCount > 0 && (
            <span style={{
              background: 'var(--green)',
              color: '#000',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 7px',
              borderRadius: '50px',
            }}>
              {activeCount}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          {open ? 'Masquer ↑' : 'Afficher ↓'}
        </span>
      </div>

      {/* Panel */}
      {open && (
        <div
          className="animate-slide-down md:px-10"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '0 16px 16px',
          }}
        >
          {/* Marque + Pointure */}
          <div style={rowStyle} className="md:grid-cols-4">
            <FilterSelect label="Marque" value={filters.brand || 'Toutes'} options={BRANDS} onChange={v => onChange({ brand: v })} />
            <FilterSelect label="Pointure" value={filters.size || 'Toutes'} options={SIZES} onChange={v => onChange({ size: v })} />
          </div>

          {/* Largeur + Fermeture */}
          <div style={rowStyle} className="md:grid-cols-4">
            <FilterSelect label="Largeur pied" value={filters.width || 'Toutes'} options={WIDTHS} onChange={v => onChange({ width: v })} />
            <FilterSelect label="Fermeture" value={filters.closure || 'Toutes'} options={CLOSURES} onChange={v => onChange({ closure: v })} />
          </div>

          {/* Tige + Style de jeu */}
          <div style={rowStyle} className="md:grid-cols-4">
            <FilterSelect label="Tige / Coupe" value={filters.cut || 'Toutes'} options={CUTS} onChange={v => onChange({ cut: v })} />
            <FilterSelect label="Style de jeu" value={filters.playStyle || 'Tous'} options={PLAY_STYLES} onChange={v => onChange({ playStyle: v })} />
          </div>

          {/* Profil + Empeigne */}
          <div style={rowStyle} className="md:grid-cols-4">
            <FilterSelect label="Profil joueur" value={filters.playerProfile || 'Tous'} options={PROFILES} onChange={v => onChange({ playerProfile: v })} />
            <FilterSelect label="Matière empeigne" value={filters.upper || 'Toutes'} options={UPPERS} onChange={v => onChange({ upper: v })} />
          </div>

          {/* Budget */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '6px',
            }}>
              Budget (€)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                placeholder="0 €"
                min={0}
                value={filters.minPrice}
                onChange={e => onChange({ minPrice: e.target.value })}
                style={{ flex: 1 }}
              />
              <span style={{ color: 'var(--text-muted)', fontSize: '13px', flexShrink: 0 }}>→</span>
              <input
                type="number"
                placeholder="400 €"
                max={400}
                value={filters.maxPrice}
                onChange={e => onChange({ maxPrice: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Disponibilité */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '6px',
            }}>
              Disponibilité
            </label>
            <ToggleGroup
              value={filters.availability}
              options={[
                { value: 'all', label: 'Tous' },
                { value: 'new', label: '🟢 Neuf' },
                { value: 'used', label: '🟡 Occasion' },
              ]}
              onChange={v => onChange({ availability: v as 'all' | 'new' | 'used', condition: 'all' })}
            />
          </div>

          {/* État (occasion uniquement) */}
          {filters.availability === 'used' && (
            <div className="animate-slide-down">
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 500,
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '6px',
              }}>
                État (occasion)
              </label>
              <ToggleGroup
                value={filters.condition}
                options={CONDITIONS}
                onChange={v => onChange({ condition: v as any })}
              />
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onSearch}
        className="md:mx-10"
        style={{
          margin: '0 16px 28px',
          background: 'var(--green)',
          color: '#000',
          fontFamily: 'var(--font-syne), Syne, sans-serif',
          fontWeight: 700,
          fontSize: '15px',
          padding: '15px',
          borderRadius: 'var(--radius)',
          border: 'none',
          width: 'calc(100% - 32px)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'background 0.2s, transform 0.15s',
        }}
        onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'var(--green-dark)'; b.style.transform = 'scale(0.99)' }}
        onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = 'var(--green)'; b.style.transform = 'scale(1)' }}
      >
        Voir les résultats →
      </button>
    </>
  )
}
