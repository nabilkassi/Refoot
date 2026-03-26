'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface FavoritesContextValue {
  favorites: string[]
  toggle: (id: string) => void
  isFav: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('refoot_favorites')
      if (stored) setFavorites(JSON.parse(stored))
    } catch {}
  }, [])

  const toggle = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
      localStorage.setItem('refoot_favorites', JSON.stringify(next))
      return next
    })
  }

  const isFav = (id: string) => favorites.includes(id)

  return (
    <FavoritesContext.Provider value={{ favorites, toggle, isFav }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
