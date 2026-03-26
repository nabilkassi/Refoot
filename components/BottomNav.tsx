'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useFavorites } from '@/context/FavoritesContext'

export default function BottomNav() {
  const pathname = usePathname()
  const { favorites } = useFavorites()

  const items = [
    { href: '/', icon: '🔍', label: 'Recherche' },
    { href: '/favoris', icon: '❤️', label: 'Favoris', badge: favorites.length },
    { href: '/vendre', icon: '⚽', label: 'Vendre' },
    { href: '/compte', icon: '👤', label: 'Compte' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '10px 0 14px',
      zIndex: 100,
    }} className="md:hidden">
      {items.map(item => {
        const active = pathname === item.href
        return (
          <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              cursor: 'pointer',
              color: active ? 'var(--green)' : 'var(--text-muted)',
              fontSize: '10px', fontWeight: 500,
              padding: '4px 16px', borderRadius: '8px',
              transition: 'color 0.2s',
              position: 'relative',
            }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!!('badge' in item && (item as any).badge) && (
                <span style={{
                  position: 'absolute', top: 0, right: '8px',
                  background: 'var(--green)', color: '#000',
                  fontSize: '8px', fontWeight: 700,
                  width: '14px', height: '14px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {(item as any).badge}
                </span>
              )}
              <span>{item.label}</span>
            </div>
          </Link>
        )
      })}
    </nav>
  )
}
