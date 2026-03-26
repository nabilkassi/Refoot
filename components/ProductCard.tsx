'use client'

import { useState } from 'react'
import Link from 'next/link'
import { type Listing } from '@/lib/types'

interface ProductCardProps {
  listing: Listing
}

export default function ProductCard({ listing }: ProductCardProps) {
  const [fav, setFav] = useState(false)

  const isUsed = listing.type === 'used'

  return (
    <Link href={`/annonce/${listing.id}`} style={{ textDecoration: 'none' }}>
      <article
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'border-color 0.2s, transform 0.2s',
          position: 'relative',
        }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.transform = 'translateY(0)' }}
      >
        {/* Image */}
        <div style={{
          width: '100%',
          aspectRatio: '1/1',
          background: 'var(--surface2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '42px',
          position: 'relative',
        }}>
          {listing.images[0]
            ? <img src={listing.images[0]} alt={listing.model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : '⚽'
          }

          {/* Badge */}
          <span style={{
            position: 'absolute',
            top: '8px', left: '8px',
            fontSize: '10px',
            fontWeight: 700,
            padding: '3px 9px',
            borderRadius: '50px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            background: isUsed ? 'var(--badge-used)' : 'var(--green)',
            color: '#000',
          }}>
            {isUsed ? 'Occasion' : 'Neuf'}
          </span>

          {/* Fav */}
          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setFav(f => !f) }}
            style={{
              position: 'absolute',
              top: '8px', right: '8px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--border)',
              width: '28px', height: '28px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.5)' }}
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '10px 10px 12px' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '2px',
          }}>
            {listing.brand}
          </div>

          <div style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 600,
            fontSize: '13px',
            lineHeight: 1.3,
            marginBottom: '6px',
            color: 'var(--text)',
          }}>
            {listing.model}
          </div>

          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '10px', padding: '2px 7px', borderRadius: '4px' }}>
              {listing.terrain}
            </span>
            {listing.playStyle !== 'all' && (
              <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', fontSize: '10px', padding: '2px 7px', borderRadius: '4px' }}>
                {listing.playStyle === 'speed' ? '⚡ Vitesse'
                  : listing.playStyle === 'control' ? '🎯 Contrôle'
                  : listing.playStyle === 'power' ? '💪 Puissance'
                  : '🔄 Polyval.'}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{
                fontFamily: 'var(--font-syne), Syne, sans-serif',
                fontWeight: 700,
                fontSize: '16px',
                color: 'var(--text)',
              }}>
                {listing.price} €
              </span>
              {isUsed && listing.originalPrice && (
                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  textDecoration: 'line-through',
                  marginLeft: '4px',
                  fontWeight: 400,
                }}>
                  {listing.originalPrice} €
                </span>
              )}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              T.{listing.size}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
