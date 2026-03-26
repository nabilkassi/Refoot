'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      height: '60px',
      background: 'rgba(10,10,10,0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'var(--font-syne), Syne, sans-serif',
          fontWeight: 800,
          fontSize: '22px',
          letterSpacing: '-0.5px',
          color: 'var(--text)',
        }}>
          Re<span style={{ color: 'var(--green)' }}>Foot</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/vendre" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'var(--green)',
            color: '#000',
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            padding: '8px 16px',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.2px',
            whiteSpace: 'nowrap',
            transition: 'background 0.2s, transform 0.15s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--green-dark)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--green)' }}
          >
            <span className="sell-text">⚽ Vendez vos crampons</span>
          </button>
        </Link>

        <Link href="/compte" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontSize: '16px',
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--green)'; el.style.color = 'var(--green)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border)'; el.style.color = 'var(--text-muted)' }}
          >
            🤍
          </div>
        </Link>
      </div>

      <style>{`
        @media (max-width: 380px) {
          .sell-text { display: none; }
        }
      `}</style>
    </nav>
  )
}
