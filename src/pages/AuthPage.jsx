import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { loginWithEmail, registerWithEmail, loginWithGoogle } from '../services/firebase'

const ROLES = [
  {
    id: 'teacher',
    emoji: '🏫',
    title: 'Teacher',
    subtitle: 'Upload answer sheets · Grade students · Manage results',
    accent: '#0F6E56',
    light:  '#E1F5EE',
    border: '#9FE1CB',
  },
  {
    id: 'student',
    emoji: '🎒',
    title: 'Student',
    subtitle: 'View your marks · Check feedback · Apply for scholarships',
    accent: '#185FA5',
    light:  '#E6F1FB',
    border: '#93C5FD',
  },
]

export function AuthPage({ onSuccess }) {
  const [step,     setStep]    = useState('role')   // 'role' | 'form'
  const [role,     setRole]    = useState(null)
  const [mode,     setMode]    = useState('login')  // 'login' | 'signup'
  const [name,     setName]    = useState('')
  const [email,    setEmail]   = useState('')
  const [password, setPass]    = useState('')
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState('')

  const clearErr = () => setError('')

  const pickRole = (r) => {
    setRole(r)
    setStep('form')
    clearErr()
  }

  // ── Email / Password submit ───────────────────────────
  const handleSubmit = async () => {
    if (!email.trim() || !password) { setError('Please fill in all fields.'); return }
    if (mode === 'signup' && !name.trim()) { setError('Please enter your name.'); return }
    if (!role) { setError('Please select a role first.'); return }

    setLoading(true)
    clearErr()
    try {
      let cred
      if (mode === 'login') {
        cred = await loginWithEmail(email.trim(), password)
      } else {
        cred = await registerWithEmail(name.trim(), email.trim(), password)
      }

      if (!cred?.user) throw new Error('Sign-in succeeded but no user was returned.')
      onSuccess(role, cred.user)

    } catch (e) {
      const msg = e.message || ''
      // Clean up Firebase's verbose error strings
      const clean = msg
        .replace('Firebase: ', '')
        .replace(/\(auth\/.*?\)\.?/, '')
        .trim()
      setError(clean || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Google sign-in ────────────────────────────────────
  const handleGoogle = async () => {
    if (!role) { setError('Please select a role first.'); return }
    setLoading(true)
    clearErr()
    try {
      const cred = await loginWithGoogle()
      if (!cred?.user) throw new Error('Google sign-in succeeded but no user was returned.')
      onSuccess(role, cred.user)
    } catch (e) {
      // Ignore popup-closed-by-user
      if (e.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-in failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Render ────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg,#F8F7F3 0%,#EAF7F1 100%)' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <motion.div className="text-center mb-8"
          initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 text-2xl"
            style={{ background: '#04342C', boxShadow: '0 4px 20px rgba(4,52,44,0.25)' }}>
            ⚖️
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 32, color: '#04342C' }}>
            EduEquity AI
          </h1>
          <p className="text-sm mt-1" style={{ color: '#5F5E5A' }}>
            Fair Evaluation · AI-Powered · Scholarship Ready
          </p>
        </motion.div>

        <AnimatePresence mode="wait">

          {/* ── STEP 1: Role picker ── */}
          {step === 'role' && (
            <motion.div key="role"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="card flex flex-col gap-5">

              <div className="text-center">
                <p style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20 }}
                  className="font-semibold">
                  I am joining as…
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Choose your role to continue
                </p>
              </div>

              {ROLES.map(r => (
                <motion.button key={r.id}
                  whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.975 }}
                  onClick={() => pickRole(r.id)}
                  className="flex items-center gap-4 rounded-2xl p-5 text-left w-full cursor-pointer border-none transition-all"
                  style={{ background: r.light, border: `1.5px solid ${r.border}` }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                    {r.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-base mb-0.5" style={{ color: r.accent }}>{r.title}</div>
                    <div className="text-xs leading-relaxed" style={{ color: '#5F5E5A' }}>{r.subtitle}</div>
                  </div>
                  <div className="text-xl" style={{ color: r.border }}>›</div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* ── STEP 2: Login / Signup form ── */}
          {step === 'form' && (
            <motion.div key="form"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="card flex flex-col gap-4">

              {/* Role badge + back button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 18 }}>
                    {role === 'teacher' ? '🏫' : '🎒'}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: role === 'teacher' ? '#E1F5EE' : '#E6F1FB',
                      color:      role === 'teacher' ? '#0F6E56' : '#185FA5',
                    }}>
                    {role === 'teacher' ? 'Teacher' : 'Student'}
                  </span>
                </div>
                <button
                  onClick={() => { setStep('role'); clearErr() }}
                  className="text-xs cursor-pointer border-none p-0"
                  style={{ background: 'none', color: '#888780' }}>
                  ← Change role
                </button>
              </div>

              <h2 className="text-center font-semibold"
                style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22 }}>
                {mode === 'login' ? 'Welcome back 👋' : 'Create your account'}
              </h2>

              {/* Name field — signup only */}
              <AnimatePresence>
                {mode === 'signup' && (
                  <motion.div key="nameField"
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <label className="block text-xs text-gray-500 mb-1.5">Full Name</label>
                    <input
                      className="inp"
                      placeholder="Your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Email address</label>
                <input
                  className="inp"
                  type="email"
                  placeholder={role === 'teacher' ? 'teacher@school.edu' : 'student@school.edu'}
                  value={email}
                  onChange={e => { setEmail(e.target.value); clearErr() }}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Password</label>
                <input
                  className="inp"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPass(e.target.value); clearErr() }}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                />
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    key="err"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs p-3 rounded-xl"
                    style={{ background: '#FCEBEB', color: '#A32D2D' }}>
                    ⚠ {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Primary CTA */}
              <button
                className="btn-primary flex items-center justify-center gap-2 py-3"
                onClick={handleSubmit}
                disabled={loading}>
                {loading
                  ? <><span className="spinner" /><span>Please wait…</span></>
                  : mode === 'login'
                    ? `Sign In as ${role === 'teacher' ? 'Teacher' : 'Student'}`
                    : 'Create Account'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background: '#E0DED6' }} />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px" style={{ background: '#E0DED6' }} />
              </div>

              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all"
                style={{ background: '#fff', border: '0.5px solid #D3D1C7', color: '#2C2C2A' }}>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Toggle login/signup */}
              <p className="text-center text-xs text-gray-400">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); clearErr() }}
                  className="border-none cursor-pointer text-xs font-semibold p-0"
                  style={{ background: 'none', color: '#0F6E56' }}>
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
