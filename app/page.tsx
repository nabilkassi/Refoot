'use client'

import { useState, useEffect, useCallback } from 'react'
import SearchBox from '@/components/SearchBox'
import TerrainChips from '@/components/TerrainChips'
import FiltersPanel from '@/components/FiltersPanel'
import ProductCard from '@/components/ProductCard'
import { type Terrain, type Filters } from '@/lib/types'
import { getListings, type ListingRow } from '@/lib/supabase/queries'

const DEFAULT_FILTERS: Filters = {
  search: '', terrain: null, brand: '', size: '', width: '',
  closure: '', cut: '', playStyle: '', playerProfile: '', upper: '',
  minPrice: '', maxPrice: '', availability: 'all', condition: 'all',
}

type SortOption = 'price_asc' | 'price_desc' | 'recent'

// Adapte une row Supabase au format attendu par ProductCard
function rowToListing(row: ListingRow) {
  return {
    id: row.id,
    type: row.type as 'new' | 'used',
    brand: row.brand,
    model: row.model,
    terrain: row.terrain as Terrain,
    size: row.size,
    width: row.width as any,
    closure: row.closure as any,
    cut: row.cut as any,
    playStyle: row.play_style as any,
    playerProfile: row.player_profile as any,
    upper: row.upper as any,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    condition: row.condition as any,
    images: row.images ?? [],
    sellerId: row.seller_id,
    createdAt: new Date(row.created_at),
  }
}

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('price_asc')
  const [results, setResults] = useState<ReturnType<typeof rowToListing>[]>([])
  const [loading, setLoading] = useState(true)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getListings(activeFilters, sort)
      setResults(data.map(rowToListing))
    } catch {
      // Fallback sur données mock si Supabase non configuré
      const { MOCK_LISTINGS } = await import('@/lib/mock-data')
      setResults(MOCK_LISTINGS as any)
    } finally {
      setLoading(false)
    }
  }, [activeFilters, sort])

  useEffect(() => { fetchResults() }, [fetchResults])

  const updateFilter = (partial: Partial<Filters>) =>
    setFilters(f => ({ ...f, ...partial }))

  const handleSearch = () => setActiveFilters({ ...filters })

  return (
    <>
      {/* HERO */}
      <section style={{ paddingTop: '80px', textAlign: 'center', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(0,200,83,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.25)',
          color: 'var(--green)', fontSize: '12px', fontWeight: 500,
          padding: '5px 12px', borderRadius: '50px', marginBottom: '18px',
        }}>
          ⚡ Neuf & Occasion au même endroit
        </div>
        <h1 style={{
          fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(28px, 7vw, 52px)', lineHeight: 1.1,
          letterSpacing: '-1px', padding: '0 16px', marginBottom: '10px',
        }}>
          Trouve tes<br />
          <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>crampons idéaux</em>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: 300, marginBottom: '28px', padding: '0 20px' }}>
          Comparez neuf et occasion en un seul moteur de recherche
        </p>
      </section>

      <SearchBox value={filters.search} onChange={v => updateFilter({ search: v })} onSearch={handleSearch} />
      <TerrainChips selected={filters.terrain} onChange={t => updateFilter({ terrain: t })} />
      <FiltersPanel filters={filters} onChange={updateFilter} onSearch={handleSearch} />

      <div style={{ height: '1px', background: 'var(--border)', margin: '0 16px 24px' }} className="md:mx-10" />

      {/* Résultats */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', marginBottom: '14px' }} className="md:px-10">
        <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, fontSize: '17px' }}>
          {loading ? (
            <span style={{ color: 'var(--text-muted)' }}>Recherche...</span>
          ) : (
            <><span style={{ color: 'var(--green)' }}>{results.length}</span> crampons trouvés</>
          )}
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value as SortOption)}
          style={{ width: 'auto', padding: '7px 32px 7px 12px', fontSize: '13px', color: 'var(--text-muted)' }}
        >
          <option value="price_asc">↕ Prix croissant</option>
          <option value="price_desc">↕ Prix décroissant</option>
          <option value="recent">↕ Plus récent</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 16px 100px' }} className="md:grid-cols-4 md:gap-4 md:px-10">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius)', aspectRatio: '3/4',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          ))
        ) : results.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
            Aucun crampon ne correspond à vos critères.
          </div>
        ) : (
          results.map(l => <ProductCard key={l.id} listing={l} />)
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  )
}
