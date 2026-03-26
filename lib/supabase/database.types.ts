export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          avatar_url?: string | null
        }
      }
      listings: {
        Row: {
          id: string
          type: 'new' | 'used'
          brand: string
          model: string
          terrain: 'FG' | 'SG' | 'AG' | 'TF' | 'IC' | 'HG'
          size: number
          width: string
          closure: string
          cut: string
          play_style: string
          player_profile: string
          upper: string
          price: number
          original_price: number | null
          condition: string | null
          description: string | null
          images: string[]
          seller_id: string
          status: 'active' | 'sold' | 'deleted'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'new' | 'used'
          brand: string
          model: string
          terrain: 'FG' | 'SG' | 'AG' | 'TF' | 'IC' | 'HG'
          size: number
          width?: string
          closure?: string
          cut?: string
          play_style?: string
          player_profile?: string
          upper?: string
          price: number
          original_price?: number | null
          condition?: string | null
          description?: string | null
          images?: string[]
          seller_id: string
          status?: 'active' | 'sold' | 'deleted'
        }
        Update: {
          price?: number
          description?: string | null
          images?: string[]
          status?: 'active' | 'sold' | 'deleted'
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
        }
        Update: {
          listing_id?: string
        }
      }
    }
  }
}
