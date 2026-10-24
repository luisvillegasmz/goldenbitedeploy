import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

// ── Tipos ──────────────────────────────────────────────────────────────────

export type UserRole = 'administrador' | 'dueño' | 'asesor' | 'cajero' | 'cliente'

export interface UserProfile {
  displayName: string
  email:       string
  role:        UserRole
  points:      number
  createdAt:   string
}

interface AuthContextType {
  user:          User | null
  profile:       UserProfile | null
  loading:       boolean
  logout:        () => Promise<void>
  signInWithGoogle: () => Promise<void>
  refreshProfile:   () => Promise<void>
}

// ── Helpers ────────────────────────────────────────────────────────────────

// Ruta del dashboard según el rol
export function getDashboardRoute(role: UserRole): string {
  switch (role) {
    case 'administrador': return '/admin'
    case 'dueño':         return '/dueno'
    case 'asesor':        return '/asesor'
    case 'cajero':        return '/cajero'
    default:              return '/'
  }
}

async function fetchOrCreateProfile(user: User): Promise<UserProfile> {
  const ref  = doc(db, 'usuarios', user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    return snap.data() as UserProfile
  }

  // Primera vez: se crea como cliente por defecto
  // Los demás roles se asignan manualmente desde el panel de administrador
  const newProfile: UserProfile = {
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Usuario',
    email:       user.email ?? '',
    role:        'cliente',
    points:      0,
    createdAt:   new Date().toLocaleDateString('es-CO', {
      day:   'numeric',
      month: 'long',
      year:  'numeric',
    }),
  }

  await setDoc(ref, newProfile)
  return newProfile
}

// ── Contexto ───────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser)
        const p = await fetchOrCreateProfile(firebaseUser)
        setProfile(p)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const logout = async () => {
    await signOut(auth)
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result   = await signInWithPopup(auth, provider)
    const p        = await fetchOrCreateProfile(result.user)
    setUser(result.user)
    setProfile(p)
  }

  const refreshProfile = async () => {
    if (!user) return
    const ref  = doc(db, 'usuarios', user.uid)
    const snap = await getDoc(ref)
    if (snap.exists()) setProfile(snap.data() as UserProfile)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, signInWithGoogle, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}