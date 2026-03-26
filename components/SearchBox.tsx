'use client'

import { useState } from 'react'

interface SearchBoxProps {
  value: string
  onChange: (v: string) => void
  onSearch: () => void
}

export default function SearchBox({ value, onChange, onSearch }: SearchBoxProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ padding: '0 16px 20px' }} className="md:px-10 md:pb-6">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--surface)',
        border: `1.5px solid ${focused ? 'var(--green)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        padding: '14px 16px',
        gap: '10px',
        transition: 'border-color 0.2s',
        boxShadow: focused ? '0 0 0 3px var(--green-glow)' : 'none',
        cursor: 'text',
      }}>
        <span style={{ color: 'var(--green)', fontSize: '18px', flexShrink: 0 }}>🔍</span>
        <input
          type="text"
          placeholder="Marque, modèle, référence..."
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => e.key === 'Enter' && onSearch()}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font-dm), DM Sans, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
          }}
        />
        <button
          onClick={onSearch}
          style={{
            background: 'var(--green)',
            color: '#000',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 18px',
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--green-dark)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--green)' }}
        >
          Rechercher
        </button>
      </div>
    </div>
  )
}
