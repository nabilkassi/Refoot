export type Terrain = 'FG' | 'SG' | 'AG' | 'TF' | 'IC' | 'HG'
export type Availability = 'all' | 'new' | 'used'
export type Condition = 'all' | 'new_tag' | 'very_good' | 'good' | 'correct'
export type PlayStyle = 'all' | 'speed' | 'control' | 'power' | 'versatile'
export type PlayerProfile = 'all' | 'junior' | 'amateur' | 'confirmed' | 'elite'
export type Upper = 'all' | 'leather' | 'synthetic' | 'microfiber' | 'knit'
export type Width = 'all' | 'narrow' | 'standard' | 'wide'
export type Closure = 'all' | 'laces' | 'laceless'
export type Cut = 'all' | 'low' | 'mid' | 'high'

export interface Listing {
  id: string
  type: 'new' | 'used'
  brand: string
  model: string
  terrain: Terrain
  size: number
  width: Width
  closure: Closure
  cut: Cut
  playStyle: PlayStyle
  playerProfile: PlayerProfile
  upper: Upper
  price: number
  originalPrice?: number
  condition?: Condition
  images: string[]
  sellerId: string
  createdAt: Date
}

export interface Filters {
  search: string
  terrain: Terrain | null
  brand: string
  size: string
  width: string
  closure: string
  cut: string
  playStyle: string
  playerProfile: string
  upper: string
  minPrice: string
  maxPrice: string
  availability: Availability
  condition: Condition
}
