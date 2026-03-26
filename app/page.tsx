'use client'

import { useState, useMemo } from 'react'
import SearchBox from '@/components/SearchBox'
import TerrainChips from '@/components/TerrainChips'
import FiltersPanel from '@/components/FiltersPanel'
import ProductCard from '@/components/ProductCard'
import { type Terrain, type Filters, type Listing } from '@/lib/types'
import { MOCK_LISTINGS } from '@/lib/mock-data'

const DEFAULT_FILTERS: Filters = {
  search: '',
  terrain: null,
  brand: '',
  size: '',
  width: '',
  closure: '',
  cut: '',
  playStyle: '',
  playerProfile: '',
  upper: '',
  minPrice: '',
  maxPrice: '',
  availability: 'all',
  condition: 'all',
}

type SortOption = 'price_asc' | 'price_desc' | 'recent'

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [sort, setSort] = useState<SortOption>('price_asc')

  const updateFilter = (partial: Partial<Filters>) => {
    setFilters(f => ({ ...f, ...partial }))
  }

  const handleSearch = () => {
    setActiveFilters({ ...filters })
  }

  const results = useMemo(() => {
    let list = [...MOCK_LISTINGS]

    if (activeFilters.search) {
      const q = activeFilters.search.toLowerCase()
      list = list.filter(l => l.brand.toLowerCase().includes(q) || l.model.toLowerCase().includes(q))
    }
    if (activeFilters.terrain) {
      list = list.filter(l => l.terrain === activeFilters.terrain)
    }
    if (activeFilters.brand && activeFilters.brand !== 'Toutes') {
      list = list.filter(l => l.brand === activeFilters.brand)
    }
    if (activeFilters.availability !== 'all') {
      list = list.filter(l => l.type === (activeFilters.availability === 'new' ? 'new' : 'used'))
    }
    if (activeFilters.minPrice) {
      list = list.filter(l => l.price >= Number(activeFilters.minPrice))
    }
    if (activeFilters.maxPrice) {
      list = list.filter(l => l.price <= Number(activeFilters.maxPrice))
    }

    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'recent') list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return list
  }, [activeFilters, sort])

  return (
    <>
      {/* HERO */}
      <section style={{ paddingTop: '80px', paddingBottom: 0, textAlign: 'center', position: 'relative' }}>
        {/* Background glow */}
        <div style={{
          position: 'absolute',
          top: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse at center, rgba(0,200,83,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Tag pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0,200,83,0.1)',
          border: '1px solid rgba(0,200,83,0.25)',
          color: 'var(--green)',
          fontSize: '12px',
          fontWeight: 500,
          padding: '5px 12px',
          borderRadius: '50px',
          marginBottom: '18px',
          letterSpacing: '0.3px',
        }}>
          ⚡ Neuf & Occasion au même endroit
        </div>

        {/* H1 */}
        <h1 style={{
          fontFamily: 'var(--font-syne), Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(28px, 7vw, 52px)',
          lineHeight: 1.1,
          letterSpacing: '-1px',
          padding: '0 16px',
          marginBottom: '10px',
        }}>
          Trouve tes<br />
          <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>crampons idéaux</em>
        </h1>

        {/* Subtitle */}
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '15px',
          fontWeight: 300,
          marginBottom: '28px',
          padding: '0 20px',
        }}>
          Comparez neuf et occasion en un seul moteur de recherche
        </p>
      </section>

      {/* SEARCH BOX */}
      <SearchBox
        value={filters.search}
        onChange={v => updateFilter({ search: v })}
        onSearch={handleSearch}
      />

      {/* TERRAIN CHIPS */}
      <TerrainChips
        selected={filters.terrain}
        onChange={t => updateFilter({ terrain: t })}
      />

      {/* FILTERS PANEL + CTA */}
      <FiltersPanel filters={filters} onChange={updateFilter} onSearch={handleSearch} />

      {/* DIVIDER */}
      <div style={{ height: '1px', background: 'var(--border)', margin: '0 16px 24px' }} className="md:mx-10" />

      {/* RESULTS HEADER */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        marginBottom: '14px',
      }} className="md:px-10">
        <div style={{
          fontFamily: 'var(--font-syne), Syne, sans-serif',
          fontWeight: 700,
          fontSize: '17px',
        }}>
          <span style={{ color: 'var(--green)' }}>{results.length}</span> crampons trouvés
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

      {/* CARDS GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '0 16px 100px',
      }} className="md:grid-cols-4 md:gap-4 md:px-10">
        {results.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
            Aucun crampon ne correspond à vos critères.
          </div>
        ) : (
          results.map(listing => (
            <ProductCard key={listing.id} listing={listing} />
          ))
        )}
      </div>
    </>
  )
}
