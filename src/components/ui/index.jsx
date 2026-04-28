import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

// ─── Spinner ────────────────────────────────────────────────────────────────
export function Spinner({ size = 18, color = '#fff' }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: `2.5px solid rgba(255,255,255,0.3)`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )
}

// ─── Tag / Badge ─────────────────────────────────────────────────────────────
export function Tag({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    ok:      'tag-ok',
    warn:    'tag-warn',
    err:     'tag-err',
    info:    'tag-info',
    teal:    'bg-teal-50 text-teal-600',
    amber:   'bg-amber-50 text-amber-600',
    blue:    'bg-blue-50 text-blue-600',
    purple:  'bg-purple-50 text-purple-600',
  }
  return (
    <span className={`tag ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}

// ─── Score Bar ───────────────────────────────────────────────────────────────
export function ScoreBar({ label, score, color, max = 100 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => { const t = setTimeout(() => setWidth(score), 120); return () => clearTimeout(t) }, [score])

  return (
    <div className="mb-2.5">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-gray-500">{label}</span>
        <span className="font-semibold" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="score-bar-fill h-full rounded-full"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, bg = '#E1F5EE', textColor = '#085041', subColor = '#1D9E75' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card text-center"
      style={{ background: bg }}
    >
      <div className="text-xs mb-1" style={{ color: subColor }}>{label}</div>
      <div className="text-4xl font-bold" style={{ color: textColor, fontFamily: "'DM Serif Display', serif" }}>
        {value}
      </div>
    </motion.div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon = '📂', title, description }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-4xl mb-3">{icon}</div>
      <div className="font-medium text-gray-600 mb-1">{title}</div>
      <div className="text-sm">{description}</div>
    </div>
  )
}

// ─── Loading Overlay ─────────────────────────────────────────────────────────
export function LoadingCard({ title, description, tags = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="card text-center py-10"
    >
      <div className="text-3xl mb-3">🔬</div>
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-gray-400 mb-4">{description}</div>
      {tags.length > 0 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {tags.map((t, i) => (
            <span key={t} className="tag tag-warn pulse-dot" style={{ animationDelay: `${i * 0.2}s` }}>
              ● {t}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}
