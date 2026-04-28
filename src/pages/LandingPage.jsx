import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: '🔍',
    title: 'Bias Detection Engine',
    desc: 'The offline evaluator scans for writing style, vocabulary, tone, and fluency bias while grading only on content accuracy.',
  },
  {
    icon: '🎓',
    title: 'Fair Scholarship Finder',
    desc: 'Recommendations are based solely on GPA, financial need, skills, and achievements. College tier and location are ignored.',
  },
  {
    icon: '📊',
    title: 'Transparent Score Comparison',
    desc: 'Side-by-side original and bias-adjusted scores make the fairness logic clear and reviewable.',
  },
]

export function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#04342C', color: '#fff' }}>
      <nav className="flex items-center justify-between px-10 py-4"
        style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: '#1D9E75', fontSize: 18 }}>⚖</div>
          <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, letterSpacing: -0.5 }}>
            EduEquity AI
          </span>
        </div>
        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onNavigate('auth')}
            className="text-sm font-medium px-4 py-2 rounded-xl cursor-pointer border-none"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontFamily: "'DM Sans',sans-serif" }}>
            Sign in
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => onNavigate('auth')}
            className="btn-primary" style={{ background: '#1D9E75' }}>
            Get Started
          </motion.button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-20 text-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm font-medium px-3.5 py-1.5 rounded-full"
          style={{ background: 'rgba(29,158,117,0.2)', border: '0.5px solid rgba(29,158,117,0.4)', color: '#5DCAA5' }}>
          🎯 Aligned with UN SDG 10: Reduced Inequalities
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontFamily: "'DM Serif Display',serif", lineHeight: 1.1, maxWidth: 680, letterSpacing: -1 }}>
          AI that grades on
          <br />
          <em style={{ color: '#5DCAA5' }}>merit, not background</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg max-w-lg" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
          EduEquity detects and reduces bias in student evaluation and scholarship selection so every learner is judged on what they know, not how they write.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => onNavigate('auth')}
          className="text-base font-medium px-8 py-3.5 rounded-xl cursor-pointer border-none"
          style={{ background: '#1D9E75', color: '#fff', fontFamily: "'DM Sans',sans-serif" }}>
          Launch Dashboard →
        </motion.button>

        <div className="grid grid-cols-3 gap-4 max-w-2xl mt-4">
          {FEATURES.map((feature, index) => (
            <motion.div key={feature.title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              className="text-left rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)' }}>
              <div className="text-2xl mb-2">{feature.icon}</div>
              <div className="font-semibold text-sm mb-1.5">{feature.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{feature.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center py-4 text-xs" style={{ borderTop: '0.5px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' }}>
        EduEquity AI · Built for UN SDG 10 · Powered by a local offline evaluator
      </div>
    </div>
  )
}
