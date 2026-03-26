'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) return setError('Les mots de passe ne correspondent pas')
    if (form.password.length < 6) return setError('Mot de passe trop court (6 caractères minimum)')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)
      router.push('/')
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={wrapper}>
      <div style={card}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{
            fontFamily: 'var(--font-syne), Syne, sans-serif',
            fontWeight: 800, fontSize: '26px', letterSpacing: '-0.5px',
          }}>
            Re<span style={{ color: 'var(--green)' }}>Foot</span>
          </span>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
            Créez votre compte gratuitement
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '13px',
            color: '#f87171',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Prénom ou pseudo</label>
            <input
              type="text"
              required
              placeholder="Votre prénom"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Mot de passe</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="6 caractères minimum"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Confirmer le mot de passe</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ ...btnPrimary, width: '100%', marginTop: '4px', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Création...' : 'Créer mon compte →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: 'var(--green)', fontWeight: 500 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

const wrapper: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 16px 120px',
}

const card: React.CSSProperties = {
  width: '100%',
  maxWidth: '400px',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: '32px 28px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '7px',
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

const btnPrimary: React.CSSProperties = {
  background: 'var(--green)',
  color: '#000',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: '14px',
  fontFamily: 'var(--font-syne), Syne, sans-serif',
  fontWeight: 700,
  fontSize: '14px',
  cursor: 'pointer',
}
