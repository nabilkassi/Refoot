'use client'

import Link from 'next/link'
import { useFavorites } from '@/context/FavoritesContext'
import { useAuth } from '@/context/AuthContext'
import { MOCK_LISTINGS } from '@/lib/mock-data'
import ProductCard from '@/components/ProductCard'

export default function FavorisPage() {
  const { user } = useAuth()
  const { favorites } = useFavorites()

  const favListings = MOCK_LISTINGS.filter(l => favorites.includes(l.id))

  if (!user) {
    return (
      <div style={{ paddingTop: '60px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 120px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>❤️</div>
          <h1 style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 800, fontSize: '24px', marginBottom: '10px',
          }}>
            Vos favoris
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            Connectez-vous pour sauvegarder vos crampons préférés et y accéder depuis n'importe quel appareil.
          </p>
          <Link href="/login">
            <button style={btnPrimary}>Se connecter</button>
          </Link>
          <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Pas de compte ?{' '}
            <Link href="/register" style={{ color: 'var(--green)' }}>S'inscrire</Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 120px' }} className="md:px-10">
        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-syne), Syne, sans-serif',
              fontWeight: 800, fontSize: 'clamp(22px, 4vw, 32px)',
            }}>
              Mes <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>favoris</em>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              {favListings.length} crampon{favListings.length !== 1 ? 's' : ''} sauvegardé{favListings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {favListings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤍</div>
            <p style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>
              Aucun favori pour l'instant
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
              Parcourez les crampons et cliquez sur 🤍 pour les sauvegarder ici.
            </p>
            <Link href="/">
              <button style={btnPrimary}>Parcourir les crampons</button>
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }} className="md:grid-cols-4 md:gap-4">
            {favListings.map(l => <ProductCard key={l.id} listing={l} />)}
          </div>
        )}
      </div>
    </div>
  )
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--green)',
  color: '#000',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: '13px 28px',
  fontFamily: 'var(--font-syne), Syne, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
}
