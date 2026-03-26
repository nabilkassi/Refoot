'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

// TODO: remplacer par appels Supabase Auth
async function mockLogin(email: string, password: string): Promise<User> {
  await new Promise(r => setTimeout(r, 600))
  if (password.length < 6) throw new Error('Mot de passe incorrect')
  return {
    id: 'user_' + btoa(email).slice(0, 8),
    email,
    name: email.split('@')[0],
  }
}

async function mockRegister(name: string, email: string, _password: string): Promise<User> {
  await new Promise(r => setTimeout(r, 600))
  return {
    id: 'user_' + btoa(email).slice(0, 8),
    email,
    name,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('refoot_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const u = await mockLogin(email, password)
    setUser(u)
    localStorage.setItem('refoot_user', JSON.stringify(u))
  }

  const register = async (name: string, email: string, password: string) => {
    const u = await mockRegister(name, email, password)
    setUser(u)
    localStorage.setItem('refoot_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('refoot_user')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
