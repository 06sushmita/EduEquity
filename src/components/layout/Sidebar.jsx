import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { logout } from '../../services/firebase'

const NAV_ITEMS = [
  { id: 'overview',    label: 'Overview',    icon: '⊞' },
  { id: 'evaluation',  label: 'Evaluation',  icon: '🔍' },
  { id: 'scholarship', label: 'Scholarships', icon: '🎓' },
  { id: 'profile',     label: 'Profile',     icon: '👤' },
]

export function Sidebar({ user, page, onNavigate }) {
  const { dark, toggle } = useTheme()

  const handleLogout = async () => {
    try { await logout() } catch { /* ignore */ }
    window.location.reload()
  }

  return (
    <aside className="w-56 flex flex-col flex-shrink-0" style={{ background: '#04342C' }}>
      {/* Logo */}
      <div className="px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: '#1D9E75' }}>⚖</div>
          <span style={{ color: '#fff', fontFamily: "'DM Serif Display',serif", fontSize: 17 }}>
            EduEquity AI
          </span>
        </div>
        <div className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          SDG 10 · Fair Education
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2.5 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate(item.id)}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl border-none cursor-pointer text-sm font-medium transition-all"
            style={{
              background: page === item.id ? 'rgba(29,158,117,0.25)' : 'transparent',
              color:      page === item.id ? '#5DCAA5' : 'rgba(255,255,255,0.55)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* Bottom area */}
      <div className="p-2.5 space-y-2" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs cursor-pointer border-none"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans',sans-serif" }}
        >
          <span>{dark ? '☀ Light mode' : '☾ Dark mode'}</span>
          <span style={{ background: dark ? '#1D9E75' : 'rgba(255,255,255,0.15)', width: 28, height: 16, borderRadius: 8, display: 'inline-block', position: 'relative', transition: 'background 0.2s' }}>
            <span style={{ position: 'absolute', top: 2, left: dark ? 14 : 2, width: 12, height: 12, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
          </span>
        </button>

        {/* User info */}
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
            style={{ background: '#085041', color: '#5DCAA5' }}>
            {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {user?.displayName || user?.email?.split('@')[0] || 'User'}
            </div>
            <button onClick={handleLogout}
              className="text-xs border-none cursor-pointer p-0"
              style={{ background: 'none', color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans',sans-serif" }}>
              Sign out
            </button>
          </div>
        </div>

        <div className="px-2 py-1.5 rounded-lg text-xs" style={{ background: 'rgba(29,158,117,0.1)' }}>
          <div className="mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>Evaluation engine</div>
          <div className="font-medium" style={{ color: '#5DCAA5' }}>Local Offline Evaluator</div>
        </div>
      </div>
    </aside>
  )
}
