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

export interface UserProfile {
  displayName: string
  email: string
  points: number
  membership: 'ESTÁNDAR' | 'GOLD' | 'NOIR'
  memberSince: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  logout: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// Crea o recupera el documento del usuario en Firestore
async function fetchOrCreateProfile(user: User): Promise<UserProfile> {
  const ref  = doc(db, 'usuarios', user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    return snap.data() as UserProfile
  }

  // Primera vez: creamos el documento con valores por defecto
  const newProfile: UserProfile = {
    displayName: user.displayName ?? user.email?.split('@')[0] ?? 'Nuevo Socio',
    email:       user.email ?? '',
    points:      0,
    membership:  'ESTÁNDAR',
    memberSince: new Date().toLocaleDateString('es-ES', {
      month: 'long',
      year:  'numeric',
    }),
  }
  await setDoc(ref, newProfile)
  return newProfile
}

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

  // Útil si actualizas puntos o membresía desde otra parte de la app
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