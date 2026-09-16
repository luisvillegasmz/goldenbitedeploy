import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

import type { User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

export interface UserProfile {
  name: string
  email: string
  phone?: string
  membership?: string
  points?: number
  newsletter?: boolean
  photoURL?: string
  createdAt?: any
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, 'users', uid))
      if (snap.exists()) setProfile(snap.data() as UserProfile)
    } catch (e) {
      console.error('Error fetching profile:', e)
    }
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.uid)
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        await fetchProfile(firebaseUser.uid)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const logout = async () => {
    await signOut(auth)
    setProfile(null)
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    // Si es un nuevo usuario de Google, creamos su perfil en Firestore
    const snap = await getDoc(doc(db, 'users', result.user.uid))
    if (!snap.exists()) {
      const { setDoc } = await import('firebase/firestore')
      await setDoc(doc(db, 'users', result.user.uid), {
        name: result.user.displayName || '',
        email: result.user.email || '',
        phone: '',
        newsletter: true,
        membership: 'standard',
        points: 0,
        photoURL: result.user.photoURL || '',
        createdAt: new Date(),
      })
    }
    await fetchProfile(result.user.uid)
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