import { motion } from 'framer-motion'

export function OverviewPage({ user, evals, schols, onNavigate }) {
  const totalEvals  = evals.length
  const totalSchols = schols.length
  const avgAdjusted = totalEvals
    ? Math.round(evals.reduce((a, e) => a + (e.adjustedScore || 0), 0) / totalEvals)
    : null

  const stats = [
    { label: 'Evaluations Run',      value: totalEvals,  bg: '#E1F5EE', tc: '#085041', sc: '#1D9E75' },
    { label: 'Scholarship Searches', value: totalSchols, bg: '#E6F1FB', tc: '#0C447C', sc: '#185FA5' },
    { label: 'Avg Adjusted Score',   value: avgAdjusted != null ? `${avgAdjusted}%` : '—', bg: '#FAEEDA', tc: '#633806', sc: '#854F0B' },
  ]

  const quickActions = [
    { icon: '🔍', label: 'Analyze an answer for bias', btn: 'Start Evaluation', page: 'evaluation', bg: '#E1F5EE', btnBg: '#0F6E56' },
    { icon: '🎓', label: 'Find fair scholarship matches', btn: 'Find Scholarships', page: 'scholarship', bg: '#E6F1FB', btnBg: '#185FA5' },
  ]

  return (
    <div className="fade-in flex flex-col gap-5">
      {/* Welcome */}
      <div className="card" style={{ background: '#04342C', border: 'none' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Welcome back</p>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 26, color: '#fff' }}>
              {user?.displayName || user?.email?.split('@')[0] || 'Educator'} 👋
            </h2>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
              AI-powered fair education tools — aligned with UN SDG 10
            </p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>Fairness Commitment</div>
            <div className="text-sm font-medium" style={{ color: '#5DCAA5' }}>No bias. No background. Just merit.</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card text-center" style={{ background: s.bg }}>
            <div className="text-xs mb-1.5" style={{ color: s.sc }}>{s.label}</div>
            <div className="text-3xl font-bold" style={{ color: s.tc, fontFamily: "'DM Serif Display',serif" }}>
              {s.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((a, i) => (
          <motion.div key={a.label}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="card flex flex-col gap-3" style={{ background: a.bg, border: 'none' }}>
            <div className="text-2xl">{a.icon}</div>
            <p className="text-sm font-medium text-gray-800">{a.label}</p>
            <button onClick={() => onNavigate(a.page)}
              className="btn-primary self-start text-xs px-4 py-2"
              style={{ background: a.btnBg }}>
              {a.btn}
            </button>
          </motion.div>
        ))}
      </div>

      {/* SDG 10 Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="card flex gap-4 items-start">
        <div className="text-3xl flex-shrink-0">🌍</div>
        <div>
          <div className="font-semibold text-sm mb-1">UN Sustainable Development Goal 10</div>
          <p className="text-xs text-gray-500 leading-relaxed">
            EduEquity AI is built to advance SDG 10: Reduced Inequalities. By removing bias from
            student evaluation and ensuring scholarships are awarded on merit and need alone, we help
            level the educational playing field for all learners — regardless of their background,
            language, or institution.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
