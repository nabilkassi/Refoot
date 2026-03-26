'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useFavorites } from '@/context/FavoritesContext'
import { MOCK_LISTINGS } from '@/lib/mock-data'

export default function ComptePage() {
  const { user, logout } = useAuth()
  const { favorites } = useFavorites()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user) {
    return (
      <div style={{ paddingTop: '60px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 120px' }}>
        <div style={{ textAlign: 'center', maxWidth: '360px' }}>
          <div style={{ fontSize: '52px', marginBottom: '16px' }}>👤</div>
          <h1 style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 800, fontSize: '24px', marginBottom: '10px',
          }}>
            Mon compte
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            Connectez-vous pour gérer vos annonces et favoris.
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

  const myListings = MOCK_LISTINGS.filter(l => l.sellerId === user.id)
  const initials = user.name.slice(0, 2).toUpperCase()

  return (
    <div style={{ paddingTop: '60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '24px 16px 120px' }} className="md:px-10">

        {/* Profil header */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '24px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{
            width: '60px', height: '60px',
            borderRadius: '50%',
            background: 'var(--green)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 800, fontSize: '22px', color: '#000',
            flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: '18px' }}>
              {user.name}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '2px' }}>
              {user.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              fontSize: '13px',
              padding: '8px 14px',
              cursor: 'pointer',
              fontFamily: 'var(--font-dm), DM Sans, sans-serif',
              transition: 'border-color 0.2s, color 0.2s',
            }}
          >
            Déconnexion
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          marginBottom: '24px',
        }}>
          {[
            { label: 'Annonces actives', value: myListings.length, icon: '⚽' },
            { label: 'Favoris', value: favorites.length, icon: '❤️' },
            { label: 'Ventes', value: 0, icon: '💶' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800, fontSize: '22px', color: 'var(--green)' }}>
                {s.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Vendre */}
        <Link href="/vendre" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(0,200,83,0.12) 0%, rgba(0,200,83,0.04) 100%)',
            border: '1px solid rgba(0,200,83,0.25)',
            borderRadius: 'var(--radius)',
            padding: '20px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                ⚽ Publier une annonce
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Vendez vos crampons en 2 minutes
              </div>
            </div>
            <span style={{ color: 'var(--green)', fontSize: '20px' }}>→</span>
          </div>
        </Link>

        {/* Mes annonces */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: '15px' }}>
              Mes annonces
            </span>
            <Link href="/vendre" style={{ fontSize: '13px', color: 'var(--green)', textDecoration: 'none' }}>
              + Nouvelle
            </Link>
          </div>

          {myListings.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
              Vous n'avez pas encore d'annonces publiées.
            </div>
          ) : (
            myListings.map((l, i) => (
              <Link key={l.id} href={`/annonce/${l.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 20px',
                  borderBottom: i < myListings.length - 1 ? '1px solid var(--border)' : 'none',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface2)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                >
                  <div style={{ width: '44px', height: '44px', background: 'var(--surface2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    ⚽
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.brand} {l.model}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      T.{l.size} · {l.terrain}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, color: 'var(--green)', fontSize: '15px', flexShrink: 0 }}>
                    {l.price} €
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
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
