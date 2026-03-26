'use client'

import { useState } from 'react'

export default function FavButton({ listingId }: { listingId: string }) {
  const [fav, setFav] = useState(false)

  return (
    <button
      onClick={() => setFav(f => !f)}
      aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      style={{
        background: fav ? 'rgba(239,68,68,0.1)' : 'var(--surface2)',
        border: `1px solid ${fav ? 'rgba(239,68,68,0.3)' : 'var(--border)'}`,
        borderRadius: '50%',
        width: '44px', height: '44px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
        transform: fav ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {fav ? '❤️' : '🤍'}
    </button>
  )
}
