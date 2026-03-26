'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createListing } from '@/lib/supabase/queries'

const BRANDS = ['Nike', 'adidas', 'Puma', 'New Balance', 'Mizuno', 'Asics', 'Joma', 'Autre']
const TERRAINS = [
  { value: 'FG', label: '🌿 FG — Herbe naturelle' },
  { value: 'SG', label: '💧 SG — Terrain gras' },
  { value: 'AG', label: '🔷 AG — Synthétique' },
  { value: 'TF', label: '⬛ TF — Turf' },
  { value: 'IC', label: '🏟️ IC — Indoor' },
  { value: 'HG', label: '🏙️ HG — Terrain dur' },
]
const CONDITIONS = [
  { value: 'new_tag', label: 'Neuf avec étiquette' },
  { value: 'very_good', label: 'Très bon état — Porté quelques fois' },
  { value: 'good', label: 'Bon état — Marques d\'usure légères' },
  { value: 'correct', label: 'État correct — Usure visible' },
]

interface FormData {
  brand: string
  model: string
  terrain: string
  size: string
  condition: string
  price: string
  description: string
  images: File[]
}

export default function VendrePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<FormData>({
    brand: '', model: '', terrain: '', size: '',
    condition: '', price: '', description: '', images: [],
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (key: keyof FormData, value: string) =>
    setForm(f => ({ ...f, [key]: value }))

  const canGoStep2 = form.brand && form.model && form.terrain && form.size
  const canGoStep3 = form.condition && form.price

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push('/login'); return }
    setSubmitError('')
    setSubmitting(true)
    try {
      await createListing(
        {
          type: 'used',
          brand: form.brand,
          model: form.model,
          terrain: form.terrain as any,
          size: Number(form.size),
          condition: form.condition as any,
          price: Number(form.price),
          description: form.description || null,
          seller_id: user.id,
        },
        form.images
      )
      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message ?? 'Erreur lors de la publication')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div style={{ paddingTop: '60px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h1 style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 800,
            fontSize: '28px',
            marginBottom: '12px',
          }}>
            Annonce publiée !
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
            Votre annonce est en cours de validation et sera visible sous peu.
          </p>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setForm({ brand: '', model: '', terrain: '', size: '', condition: '', price: '', description: '', images: [] }) }}
            style={btnPrimary}
          >
            Publier une autre annonce
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingTop: '60px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto', padding: '24px 16px 120px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(24px, 5vw, 36px)',
            marginBottom: '6px',
          }}>
            Vendez vos <em style={{ color: 'var(--green)', fontStyle: 'normal' }}>crampons</em>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Déposez votre annonce en moins de 2 minutes.
          </p>
        </div>

        {/* Stepper */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px' }}>
          {[
            { n: 1, label: 'Le produit' },
            { n: 2, label: 'L\'état & prix' },
            { n: 3, label: 'Publication' },
          ].map(s => (
            <div key={s.n} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                height: '3px',
                borderRadius: '2px',
                background: step >= s.n ? 'var(--green)' : 'var(--surface2)',
                transition: 'background 0.3s',
              }} />
              <span style={{
                fontSize: '11px',
                color: step >= s.n ? 'var(--green)' : 'var(--text-muted)',
                fontWeight: step === s.n ? 600 : 400,
              }}>
                {s.n}. {s.label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* STEP 1 — Produit */}
          {step === 1 && (
            <div style={card}>
              <h2 style={cardTitle}>Le produit</h2>

              <div style={fieldGroup}>
                <label style={labelStyle}>Marque *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {BRANDS.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => set('brand', b)}
                      style={{
                        ...chipBtn,
                        background: form.brand === b ? 'var(--green-glow)' : 'var(--surface2)',
                        borderColor: form.brand === b ? 'var(--green)' : 'var(--border)',
                        color: form.brand === b ? 'var(--green)' : 'var(--text-muted)',
                      }}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Modèle *</label>
                <input
                  type="text"
                  placeholder="ex: Mercurial Vapor 16, Predator Elite..."
                  value={form.model}
                  onChange={e => set('model', e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Type de terrain *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {TERRAINS.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => set('terrain', t.value)}
                      style={{
                        ...radioBtn,
                        background: form.terrain === t.value ? 'var(--green-glow)' : 'var(--surface2)',
                        borderColor: form.terrain === t.value ? 'var(--green)' : 'var(--border)',
                        color: form.terrain === t.value ? 'var(--green)' : 'var(--text)',
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Pointure *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => set('size', s)}
                      style={{
                        ...chipBtn,
                        background: form.size === s ? 'var(--green-glow)' : 'var(--surface2)',
                        borderColor: form.size === s ? 'var(--green)' : 'var(--border)',
                        color: form.size === s ? 'var(--green)' : 'var(--text-muted)',
                        minWidth: '48px',
                        justifyContent: 'center',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!canGoStep2}
                style={{ ...btnPrimary, width: '100%', opacity: canGoStep2 ? 1 : 0.4 }}
              >
                Continuer →
              </button>
            </div>
          )}

          {/* STEP 2 — État & Prix */}
          {step === 2 && (
            <div style={card}>
              <h2 style={cardTitle}>État & prix</h2>

              <div style={fieldGroup}>
                <label style={labelStyle}>État du produit *</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {CONDITIONS.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => set('condition', c.value)}
                      style={{
                        ...radioBtn,
                        background: form.condition === c.value ? 'var(--green-glow)' : 'var(--surface2)',
                        borderColor: form.condition === c.value ? 'var(--green)' : 'var(--border)',
                        color: form.condition === c.value ? 'var(--green)' : 'var(--text)',
                      }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Prix de vente (€) *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    placeholder="0"
                    min={1}
                    value={form.price}
                    onChange={e => set('price', e.target.value)}
                    style={{ ...inputStyle, paddingRight: '40px' }}
                  />
                  <span style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-muted)', fontSize: '16px', fontWeight: 600,
                  }}>€</span>
                </div>
                {form.price && Number(form.price) > 0 && (
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Vous recevrez environ <strong style={{ color: 'var(--green)' }}>{Math.round(Number(form.price) * 0.9)} €</strong> après commission (10%)
                  </p>
                )}
              </div>

              <div style={fieldGroup}>
                <label style={labelStyle}>Description (optionnel)</label>
                <textarea
                  placeholder="Décrivez l'état, les éventuels défauts, la fréquence d'utilisation..."
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    fontFamily: 'var(--font-dm), DM Sans, sans-serif',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ ...btnOutline, flex: 1 }}>
                  ← Retour
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!canGoStep3}
                  style={{ ...btnPrimary, flex: 2, opacity: canGoStep3 ? 1 : 0.4 }}
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Photos & Publication */}
          {step === 3 && (
            <div style={card}>
              <h2 style={cardTitle}>Photos & publication</h2>

              {/* Récap */}
              <div style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 16px',
                marginBottom: '20px',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <div style={{ fontFamily: 'var(--font-syne), Syne, sans-serif', fontWeight: 700, marginBottom: '4px' }}>
                  Récapitulatif
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Produit</span>
                  <span>{form.brand} {form.model}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Pointure</span>
                  <span>EU {form.size}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Terrain</span>
                  <span>{form.terrain}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Prix</span>
                  <span style={{ color: 'var(--green)', fontWeight: 700 }}>{form.price} €</span>
                </div>
              </div>

              {/* Upload photos */}
              <div style={fieldGroup}>
                <label style={labelStyle}>Photos (jusqu'à 6)</label>
                <label style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: '2px dashed var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '32px 16px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                }}>
                  <span style={{ fontSize: '32px' }}>📷</span>
                  <span>Cliquez ou glissez vos photos ici</span>
                  <span style={{ fontSize: '12px' }}>JPG, PNG — max 5 Mo par photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => {
                      const files = Array.from(e.target.files ?? []).slice(0, 6)
                      setForm(f => ({ ...f, images: files }))
                    }}
                  />
                </label>
                {form.images.length > 0 && (
                  <p style={{ fontSize: '12px', color: 'var(--green)', marginTop: '8px' }}>
                    {form.images.length} photo{form.images.length > 1 ? 's' : ''} sélectionnée{form.images.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {submitError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '13px', color: '#f87171' }}>
                  {submitError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setStep(2)} style={{ ...btnOutline, flex: 1 }}>
                  ← Retour
                </button>
                <button type="submit" disabled={submitting} style={{ ...btnPrimary, flex: 2, opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Publication...' : '⚽ Publier l\'annonce'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

// Styles partagés
const card: React.CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}

const cardTitle: React.CSSProperties = {
  fontFamily: 'var(--font-syne), Syne, sans-serif',
  fontWeight: 700,
  fontSize: '18px',
  marginBottom: '-4px',
}

const fieldGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--surface2)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--text)',
  fontFamily: 'var(--font-dm), DM Sans, sans-serif',
  fontSize: '15px',
  padding: '12px 14px',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const chipBtn: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '7px 14px',
  borderRadius: '50px',
  border: '1px solid var(--border)',
  fontSize: '13px',
  cursor: 'pointer',
  transition: 'all 0.15s',
  fontFamily: 'var(--font-dm), DM Sans, sans-serif',
}

const radioBtn: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border)',
  fontSize: '14px',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.15s',
  fontFamily: 'var(--font-dm), DM Sans, sans-serif',
}

const btnPrimary: React.CSSProperties = {
  background: 'var(--green)',
  color: '#000',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: '14px 20px',
  fontFamily: 'var(--font-syne), Syne, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background 0.2s',
}

const btnOutline: React.CSSProperties = {
  background: 'transparent',
  color: 'var(--text-muted)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-sm)',
  padding: '14px 20px',
  fontFamily: 'var(--font-dm), DM Sans, sans-serif',
  fontWeight: 500,
  fontSize: '14px',
  cursor: 'pointer',
}
