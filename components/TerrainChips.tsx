'use client'

import { type Terrain } from '@/lib/types'

const terrains: { value: Terrain; icon: string; label: string }[] = [
  { value: 'FG', icon: '🌿', label: 'FG — Herbe' },
  { value: 'SG', icon: '💧', label: 'SG — Gras' },
  { value: 'AG', icon: '🔷', label: 'AG — Synthétique' },
  { value: 'TF', icon: '⬛', label: 'TF — Turf' },
  { value: 'IC', icon: '🏟️', label: 'IC — Indoor' },
  { value: 'HG', icon: '🏙️', label: 'HG — Dur' },
]

interface TerrainChipsProps {
  selected: Terrain | null
  onChange: (terrain: Terrain | null) => void
}

export default function TerrainChips({ selected, onChange }: TerrainChipsProps) {
  return (
    <div>
      <div style={{
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '1.2px',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        padding: '0 16px',
        marginBottom: '10px',
      }} className="md:px-10">
        Type de terrain
      </div>
      <div
        className="no-scrollbar md:px-10"
        style={{
          display: 'flex',
          gap: '8px',
          padding: '0 16px 12px',
          overflowX: 'auto',
        }}
      >
        {terrains.map(t => {
          const active = selected === t.value
          return (
            <button
              key={t.value}
              onClick={() => onChange(active ? null : t.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: active ? 'var(--green-glow)' : 'var(--surface)',
                border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`,
                color: active ? 'var(--green)' : 'var(--text)',
                fontSize: '13px',
                fontWeight: 400,
                padding: '8px 14px',
                borderRadius: '50px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'border-color 0.2s, background 0.2s, color 0.2s',
                flexShrink: 0,
                fontFamily: 'var(--font-dm), DM Sans, sans-serif',
              }}
            >
              <span style={{ fontSize: '14px' }}>{t.icon}</span>
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
