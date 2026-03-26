'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useFavorites } from '@/context/FavoritesContext'

export default function Navbar() {
  const { user, profile, logout } = useAuth()
  const { favorites } = useFavorites()
  const router = useRouter()

  const displayName = profile?.name ?? user?.email?.split('@')[0] ?? 'U'
  const initials = user ? displayName.slice(0, 2).toUpperCase() : null

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
          fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px', color: 'var(--text)',
        }}>
          Re<span style={{ color: 'var(--green)' }}>Foot</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Link href="/vendre" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'var(--green)', color: '#000',
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 700, fontSize: '13px',
            padding: '8px 16px', borderRadius: '50px', border: 'none',
            cursor: 'pointer', letterSpacing: '0.2px', whiteSpace: 'nowrap',
            transition: 'background 0.2s',
          }}>
            <span className="sell-text">⚽ Vendez vos crampons</span>
          </button>
        </Link>

        {/* Favoris avec badge */}
        <Link href="/favoris" style={{ textDecoration: 'none', position: 'relative' }}>
          <div style={{
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%',
            border: '1px solid var(--border)',
            cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px',
            transition: 'border-color 0.2s, color 0.2s',
          }}>
            ❤️
          </div>
          {favorites.length > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: 'var(--green)', color: '#000',
              fontSize: '9px', fontWeight: 700,
              width: '16px', height: '16px',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}>
              {favorites.length}
            </span>
          )}
        </Link>

        {/* Compte */}
        {user ? (
          <Link href="/compte" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px',
              borderRadius: '50%',
              background: 'var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-syne), Syne, sans-serif',
              fontWeight: 800, fontSize: '13px', color: '#000',
              cursor: 'pointer',
            }}>
              {initials}
            </div>
          </Link>
        ) : (
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '50%', border: '1px solid var(--border)',
              cursor: 'pointer', color: 'var(--text-muted)', fontSize: '16px',
            }}>
              👤
            </div>
          </Link>
        )}
      </div>

      <style>{`
        @media (max-width: 380px) { .sell-text { display: none; } }
      `}</style>
    </nav>
  )
}
