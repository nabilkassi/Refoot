-- ============================================================
-- ReFoot — Schéma PostgreSQL Supabase
-- À exécuter dans : Supabase Dashboard → SQL Editor
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Profiles ────────────────────────────────────────────────
-- Étend auth.users avec les données publiques du vendeur
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger : crée le profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Listings ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.listings (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  type           TEXT        NOT NULL CHECK (type IN ('new', 'used')),
  brand          TEXT        NOT NULL,
  model          TEXT        NOT NULL,
  terrain        TEXT        NOT NULL CHECK (terrain IN ('FG','SG','AG','TF','IC','HG')),
  size           DECIMAL(4,1) NOT NULL,
  width          TEXT        NOT NULL DEFAULT 'standard' CHECK (width IN ('narrow','standard','wide')),
  closure        TEXT        NOT NULL DEFAULT 'laces'    CHECK (closure IN ('laces','laceless')),
  cut            TEXT        NOT NULL DEFAULT 'low'      CHECK (cut IN ('low','mid','high')),
  play_style     TEXT        NOT NULL DEFAULT 'versatile' CHECK (play_style IN ('speed','control','power','versatile')),
  player_profile TEXT        NOT NULL DEFAULT 'amateur'  CHECK (player_profile IN ('junior','amateur','confirmed','elite')),
  upper          TEXT        NOT NULL DEFAULT 'synthetic' CHECK (upper IN ('leather','synthetic','microfiber','knit')),
  price          DECIMAL(10,2) NOT NULL CHECK (price > 0),
  original_price DECIMAL(10,2),
  condition      TEXT        CHECK (condition IN ('new_tag','very_good','good','correct')),
  description    TEXT,
  images         TEXT[]      NOT NULL DEFAULT '{}',
  seller_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status         TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active','sold','deleted')),
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS listings_status_idx     ON public.listings(status);
CREATE INDEX IF NOT EXISTS listings_terrain_idx    ON public.listings(terrain);
CREATE INDEX IF NOT EXISTS listings_brand_idx      ON public.listings(brand);
CREATE INDEX IF NOT EXISTS listings_type_idx       ON public.listings(type);
CREATE INDEX IF NOT EXISTS listings_price_idx      ON public.listings(price);
CREATE INDEX IF NOT EXISTS listings_seller_idx     ON public.listings(seller_id);
CREATE INDEX IF NOT EXISTS listings_search_idx     ON public.listings USING GIN (to_tsvector('french', brand || ' ' || model));

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS listings_updated_at ON public.listings;
CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Favorites ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id  UUID        NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, listing_id)
);

CREATE INDEX IF NOT EXISTS favorites_user_idx ON public.favorites(user_id);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles : lecture publique, écriture par le propriétaire
CREATE POLICY "profiles_select_all"  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own"  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Listings : lecture publique des annonces actives
CREATE POLICY "listings_select_active" ON public.listings FOR SELECT
  USING (status = 'active' OR auth.uid() = seller_id);
CREATE POLICY "listings_insert_auth"   ON public.listings FOR INSERT
  WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "listings_update_own"    ON public.listings FOR UPDATE
  USING (auth.uid() = seller_id);
CREATE POLICY "listings_delete_own"    ON public.listings FOR DELETE
  USING (auth.uid() = seller_id);

-- Favorites : accès exclusif par l'utilisateur connecté
CREATE POLICY "favorites_select_own"  ON public.favorites FOR SELECT  USING (auth.uid() = user_id);
CREATE POLICY "favorites_insert_own"  ON public.favorites FOR INSERT  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "favorites_delete_own"  ON public.favorites FOR DELETE  USING (auth.uid() = user_id);

-- ============================================================
-- Storage : bucket pour les photos d'annonces
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "listing_images_select_all" ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');
CREATE POLICY "listing_images_insert_auth" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'listing-images' AND auth.role() = 'authenticated');
CREATE POLICY "listing_images_delete_own" ON storage.objects FOR DELETE
  USING (bucket_id = 'listing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- Données de démo (optionnel — commenter en production)
-- ============================================================
-- INSERT INTO public.listings (type, brand, model, terrain, size, play_style, price, seller_id)
-- VALUES ('new','Nike','Mercurial Vapor 16 Elite FG','FG',42,'speed',189,'<votre-user-id>');
