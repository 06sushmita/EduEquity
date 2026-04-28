import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [role,    setRole]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthChange((fbUser) => {
      setUser(fbUser)
      if (!fbUser) {
        setRole(null)
      } else {
        // Restore saved role for this user
        const saved = localStorage.getItem(`eduequity_role_${fbUser.uid}`)
        if (saved) setRole(saved)
        // If no saved role, role stays null — AuthPage will handle it
      }
      setLoading(false)
    })
    return unsub
  }, [])

  // Called right after login/signup with the chosen role
  const saveRole = (uid, r) => {
    localStorage.setItem(`eduequity_role_${uid}`, r)
    setRole(r)  // update state immediately — no need to wait for onAuthChange
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, saveRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
