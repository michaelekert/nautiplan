import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../api/auth'
import { setAccessToken } from '../api/client'

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthProviderProps = { children: ReactNode }

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  // Odczyt tokena po odświeżeniu strony
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) setAccessToken(token)
  }, [])

  function signOut() {
    setUser(null)
    setAccessToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be inside AuthProvider')
  return ctx
}
