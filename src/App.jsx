import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider }         from './context/ThemeContext'
import { LandingPage }           from './pages/LandingPage'
import { AuthPage }              from './pages/AuthPage'
import { TeacherDashboard }      from './pages/TeacherDashboard'
import { StudentDashboard }      from './pages/StudentDashboard'

function AppRouter() {
  const { user, role, loading, saveRole } = useAuth()

  // handleAuthSuccess: called by AuthPage after successful login/signup
  // Sets the role immediately so the router re-renders correctly
  const handleAuthSuccess = (selectedRole, fbUser) => {
    saveRole(fbUser.uid, selectedRole)
    // No setView needed — the role state change causes a re-render
  }

  // ── Loading splash ───────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F8F7F3' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: '#04342C' }}>⚖️</div>
        <div className="text-sm text-gray-400">Loading EduEquity…</div>
      </div>
    </div>
  )

  // ── Logged in + role known → show correct dashboard ──
  if (user && role === 'teacher') return <TeacherDashboard user={user} />
  if (user && role === 'student') return <StudentDashboard user={user} />

  // ── Logged in but no role (edge case) → re-pick role ─
  if (user && !role) return <AuthPage onSuccess={handleAuthSuccess} />

  // ── Not logged in → show auth (default) or landing ───
  return <AuthPageWrapper onSuccess={handleAuthSuccess} />
}

// Simple wrapper that lets LandingPage CTA navigate to AuthPage
function AuthPageWrapper({ onSuccess }) {
  const [showLanding, setShowLanding] = useState(true)
  if (showLanding) return <LandingPage onNavigate={() => setShowLanding(false)} />
  return <AuthPage onSuccess={onSuccess} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  )
}
