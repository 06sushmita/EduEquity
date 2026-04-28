import { motion } from 'framer-motion'
import { EmptyState } from '../components/ui'

const BIAS_COLOR = { Low: '#0F6E56', Moderate: '#BA7517', High: '#A32D2D' }
const BIAS_BG    = { Low: '#E1F5EE', Moderate: '#FAEEDA', High: '#FCEBEB' }

export function ProfilePage({ user, evals, schols }) {
  const allHistory = [
    ...evals.map(e => ({ ...e, kind: 'eval' })),
    ...schols.map(s => ({ ...s, kind: 'schol' })),
  ].sort((a, b) => {
    const da = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0)
    const db_ = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0)
    return db_ - da
  })

  const totalBiasFixed = evals.filter(e => e.adjustedScore > e.originalScore).length
  const avgAdjusted = evals.length
    ? Math.round(evals.reduce((a, e) => a + (e.adjustedScore || 0), 0) / evals.length)
    : null

  const fmtDate = val => {
    if (!val) return ''
    const d = val?.toDate ? val.toDate() : new Date(val)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="fade-in flex flex-col gap-5">
      <div>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24 }} className="mb-1">
          Profile & History
        </h2>
        <p className="text-sm text-gray-400">Your activity and results stored in Firestore.</p>
      </div>

      {/* User card */}
      <div className="card flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
          style={{ background: '#0F6E56', color: '#fff', fontFamily: "'DM Serif Display',serif" }}>
          {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-lg">{user?.displayName || 'User'}</div>
          <div className="text-sm text-gray-400 mb-2">{user?.email}</div>
          <div className="flex gap-2">
            <span className="tag tag-ok">✓ Verified</span>
            {user?.providerData?.[0]?.providerId === 'google.com' && (
              <span className="tag tag-info">Google Sign-In</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center" style={{ background: '#E1F5EE' }}>
          <div className="text-xs mb-1" style={{ color: '#1D9E75' }}>Evaluations Run</div>
          <div className="text-3xl font-bold" style={{ color: '#085041', fontFamily: "'DM Serif Display',serif" }}>
            {evals.length}
          </div>
        </div>
        <div className="card text-center" style={{ background: '#E6F1FB' }}>
          <div className="text-xs mb-1" style={{ color: '#185FA5' }}>Scholarship Searches</div>
          <div className="text-3xl font-bold" style={{ color: '#0C447C', fontFamily: "'DM Serif Display',serif" }}>
            {schols.length}
          </div>
        </div>
        <div className="card text-center" style={{ background: '#FAEEDA' }}>
          <div className="text-xs mb-1" style={{ color: '#854F0B' }}>Scores Corrected</div>
          <div className="text-3xl font-bold" style={{ color: '#633806', fontFamily: "'DM Serif Display',serif" }}>
            {totalBiasFixed}
          </div>
        </div>
      </div>

      {/* History */}
      <div className="card">
        <div className="font-semibold text-sm mb-4">Recent Activity</div>
        {allHistory.length === 0 ? (
          <EmptyState
            icon="📂"
            title="No activity yet"
            description="Run an evaluation or scholarship search to see your history here."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {allHistory.slice(0, 12).map((h, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                style={{ background: '#F8F7F3' }}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg flex-shrink-0">{h.kind === 'eval' ? '🔍' : '🎓'}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-sm">
                      {h.kind === 'eval' ? 'Bias Evaluation' : 'Scholarship Search'}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {h.kind === 'eval'
                        ? `Adjusted: ${h.adjustedScore}/100 · ${h.biasLevel || ''} bias`
                        : `${h.count} scholarships · GPA ${h.gpa}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {h.kind === 'eval' && h.biasLevel && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{ background: BIAS_BG[h.biasLevel] || '#F1EFE8', color: BIAS_COLOR[h.biasLevel] || '#444441' }}>
                      {h.biasLevel}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 whitespace-nowrap">{fmtDate(h.createdAt)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Firestore note */}
      <div className="card text-xs text-gray-500 flex gap-3 items-start">
        <span className="text-base flex-shrink-0">🔥</span>
        <div>
          <span className="font-medium text-gray-700">Firestore persistence active.</span>{' '}
          All your evaluations and scholarship searches are saved to your Firestore database
          under your user ID. Data persists across sessions and devices.
        </div>
      </div>
    </div>
  )
}
