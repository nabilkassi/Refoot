# Guide de déploiement ReFoot

## 1. Créer le projet Supabase

1. Allez sur [supabase.com](https://supabase.com) → **New project**
2. Notez votre `Project URL` et `anon key` (Settings → API)

## 2. Initialiser la base de données

Dans **Supabase Dashboard → SQL Editor**, collez et exécutez le contenu de :
```
supabase/schema.sql
```

Cela crée :
- Table `profiles` (profils vendeurs)
- Table `listings` (annonces neuf + occasion)
- Table `favorites` (favoris utilisateurs)
- Bucket Storage `listing-images` (photos d'annonces)
- Toutes les politiques RLS

## 3. Configurer l'authentification Supabase

Dans **Authentication → URL Configuration** :
- **Site URL** : `https://refoot.vercel.app` (votre domaine futur)
- **Redirect URLs** : `https://refoot.vercel.app/**`

## 4. Variables d'environnement locales

```bash
cp .env.local.example .env.local
# Remplissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## 5. Déployer sur Vercel

### Via CLI
```bash
npm i -g vercel
vercel
```

### Via GitHub (recommandé)
1. [vercel.com](https://vercel.com) → **New Project** → importer `nabilkassi/Refoot`
2. Framework : **Next.js** (détecté automatiquement)
3. Ajoutez les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy** → Vercel génère une URL automatiquement

### Déploiements suivants
Chaque `git push origin master` déclenche un déploiement automatique.

## 6. Après le premier déploiement

Mettez à jour dans Supabase :
- **Site URL** → votre URL Vercel définitive
- **Redirect URLs** → `https://votre-url.vercel.app/**`

---

## Architecture de données

```
auth.users          ← géré par Supabase Auth
    └── profiles    ← nom, avatar (créé automatiquement par trigger)
    └── listings    ← annonces neuf + occasion
    └── favorites   ← table de jonction user ↔ listing
storage/listing-images ← photos uploadées lors du dépôt d'annonce
```
