'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthContext'

interface FavoritesContextValue {
  favorites: string[]
  toggle: (listingId: string) => Promise<void>
  isFav: (listingId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const { user } = useAuth()
  const supabase = createClient()

  // Charge les favoris selon l'état auth
  useEffect(() => {
    if (user) {
      loadFromDB()
    } else {
      loadFromStorage()
    }
  }, [user])

  const loadFromDB = async () => {
    const { data } = await supabase
      .from('favorites')
      .select('listing_id')
      .eq('user_id', user!.id)
    if (data) setFavorites(data.map(f => f.listing_id))
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('refoot_favorites')
      setFavorites(stored ? JSON.parse(stored) : [])
    } catch {
      setFavorites([])
    }
  }

  const toggle = async (listingId: string) => {
    const isFaved = favorites.includes(listingId)

    // Mise à jour optimiste
    const next = isFaved
      ? favorites.filter(id => id !== listingId)
      : [...favorites, listingId]
    setFavorites(next)

    if (user) {
      // Persistance en base
      if (isFaved) {
        await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, listing_id: listingId })
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId })
      }
    } else {
      // Persistance localStorage
      localStorage.setItem('refoot_favorites', JSON.stringify(next))
    }
  }

  const isFav = (listingId: string) => favorites.includes(listingId)

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
