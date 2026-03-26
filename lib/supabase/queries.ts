import { createClient } from './client'
import type { Filters } from '@/lib/types'
import type { Database } from './database.types'

export type ListingRow = Database['public']['Tables']['listings']['Row']

export async function getListings(filters: Partial<Filters> = {}, sort = 'price_asc') {
  const supabase = createClient()

  let query = supabase
    .from('listings')
    .select('*, profiles(name, avatar_url)')
    .eq('status', 'active')

  if (filters.search) {
    query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%`)
  }
  if (filters.terrain) {
    query = query.eq('terrain', filters.terrain)
  }
  if (filters.brand && filters.brand !== 'Toutes') {
    query = query.eq('brand', filters.brand)
  }
  if (filters.availability === 'new')  query = query.eq('type', 'new')
  if (filters.availability === 'used') query = query.eq('type', 'used')
  if (filters.minPrice) query = query.gte('price', Number(filters.minPrice))
  if (filters.maxPrice) query = query.lte('price', Number(filters.maxPrice))
  if (filters.size && filters.size !== 'Toutes') {
    const sizeNum = parseFloat(filters.size.split('–')[0].trim())
    if (!isNaN(sizeNum)) query = query.gte('size', sizeNum).lt('size', sizeNum + 1)
  }

  if (sort === 'price_asc')  query = query.order('price', { ascending: true })
  if (sort === 'price_desc') query = query.order('price', { ascending: false })
  if (sort === 'recent')     query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getListing(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(name, avatar_url)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createListing(
  listing: Database['public']['Tables']['listings']['Insert'],
  images: File[]
) {
  const supabase = createClient()

  // 1. Créer l'annonce
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single()
  if (error) throw error

  // 2. Upload les photos
  if (images.length > 0) {
    const urls: string[] = []
    for (const file of images) {
      const ext = file.name.split('.').pop()
      const path = `${listing.seller_id}/${data.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(path, file)
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('listing-images')
          .getPublicUrl(path)
        urls.push(publicUrl)
      }
    }
    if (urls.length > 0) {
      await supabase
        .from('listings')
        .update({ images: urls })
        .eq('id', data.id)
      data.images = urls
    }
  }

  return data
}

export async function getMyListings(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', userId)
    .neq('status', 'deleted')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}
