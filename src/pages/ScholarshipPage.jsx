import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { recommendScholarships } from '../services/gemini'
import { Tag, LoadingCard } from '../components/ui'

const PRESETS = [
  { name: 'Priya Sharma',   gpa: '3.8', income: '18000', skills: 'Mathematics, Robotics, Community Volunteering', achievements: 'State science olympiad finalist' },
  { name: 'Marcus Johnson', gpa: '3.5', income: '24000', skills: 'Biology, First-Generation Student, Part-time Worker', achievements: 'Hospital volunteer, 200+ hours' },
  { name: 'Amara Osei',     gpa: '3.9', income: '14000', skills: 'Computer Science, Machine Learning, Research', achievements: 'Published paper in school journal, open-source contributor' },
]

const TYPE_STYLE = {
  Merit:      { bg: '#E6F1FB', color: '#185FA5' },
  'Need-Based': { bg: '#E1F5EE', color: '#0F6E56' },
  'Skill-Based': { bg: '#EEEDFE', color: '#534AB7' },
  STEM:       { bg: '#EEEDFE', color: '#534AB7' },
  Research:   { bg: '#FAEEDA', color: '#854F0B' },
  Community:  { bg: '#E1F5EE', color: '#0F6E56' },
}

function MatchRing({ score }) {
  const color = score >= 80 ? '#1D9E75' : score >= 60 ? '#BA7517' : '#888780'
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="text-2xl font-bold" style={{ color, fontFamily: "'DM Serif Display',serif" }}>
        {score}%
      </div>
      <div className="text-xs text-gray-400">match</div>
    </div>
  )
}

export function ScholarshipPage({ user, onSave }) {
  const [preset, setPreset]   = useState(-1)
  const [form, setForm]       = useState({ gpa: '', income: '', skills: '', achievements: '' })
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const loadPreset = i => {
    setPreset(i)
    const p = PRESETS[i]
    setForm({ gpa: p.gpa, income: p.income, skills: p.skills, achievements: p.achievements })
    setResult(null); setError('')
  }

  const find = async () => {
    if (!form.gpa || !form.income || !form.skills) { setError('Please fill GPA, income, and skills.'); return }
    setLoading(true); setResult(null); setError('')
    try {
      const data = await recommendScholarships(form)
      setResult(data)
      await onSave({
        type: 'scholarship',
        gpa: form.gpa,
        count: data.scholarships?.length || 0,
        topMatch: data.scholarships?.[0]?.name || '',
      })
    } catch (e) {
      setError('Recommendation failed: ' + (e.message || 'Please review the student profile and try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fade-in flex flex-col gap-5">
      <div>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24 }} className="mb-1">
          Fair Scholarship Finder
        </h2>
        <p className="text-sm text-gray-400">
          Recommendations based only on GPA, financial need, skills, and achievements.
          College name, city, and background are never factored in.
        </p>
      </div>

      {/* Input */}
      <div className="card flex flex-col gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-2">Load sample student profile:</p>
          <div className="flex gap-2 flex-wrap">
            {PRESETS.map((p, i) => (
              <button key={i} onClick={() => loadPreset(i)}
                className={preset === i ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: 12, padding: '5px 12px' }}>
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">GPA (out of 4.0)</label>
            <input className="inp" type="number" min="0" max="4" step="0.01"
              placeholder="e.g. 3.7" value={form.gpa} onChange={set('gpa')} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Annual Family Income (USD)</label>
            <input className="inp" type="number" placeholder="e.g. 22000"
              value={form.income} onChange={set('income')} />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Skills & Strengths</label>
          <input className="inp" placeholder="e.g. Mathematics, Community Service, First-Gen Student"
            value={form.skills} onChange={set('skills')} />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Achievements (optional)</label>
          <input className="inp" placeholder="e.g. Science fair winner, published research"
            value={form.achievements} onChange={set('achievements')} />
        </div>

        {/* Fairness banner */}
        <div className="rounded-xl p-3 text-xs leading-relaxed"
          style={{ background: '#E1F5EE', color: '#085041' }}>
          <strong>🛡 Fairness Guarantee:</strong> This engine does NOT consider college name, city,
          social media presence, ethnicity, or family background. Only GPA, income, and skills are evaluated.
        </div>

        {error && <p className="text-xs p-2.5 rounded-lg" style={{ background: '#FCEBEB', color: '#A32D2D' }}>{error}</p>}

        <button className="btn-primary flex items-center justify-center gap-2"
          onClick={find} disabled={loading || !form.gpa || !form.income || !form.skills}>
          {loading
            ? <><span className="spinner" /><span>Finding scholarships…</span></>
            : '🎓 Find Scholarships'}
        </button>
      </div>

      <AnimatePresence>
        {loading && (
          <LoadingCard
            title="Matching scholarships…"
            description="Evaluating merit, financial need, and skills — ignoring all background factors"
            tags={['GPA', 'Income', 'Skills', 'Achievements']}
          />
        )}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3">

            {/* Summary */}
            <div className="card" style={{ background: '#E1F5EE', border: 'none' }}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold mb-1" style={{ color: '#085041' }}>
                    ✅ {result.scholarships?.length} scholarships matched
                  </div>
                  <p className="text-sm" style={{ color: '#0F6E56' }}>{result.overallProfile}</p>
                </div>
                <p className="text-xs text-right max-w-[220px]" style={{ color: '#1D9E75', flexShrink: 0 }}>
                  {result.fairnessNote}
                </p>
              </div>
            </div>

            {/* Scholarship cards */}
            {result.scholarships?.map((s, i) => {
              const ts = TYPE_STYLE[s.type] || { bg: '#F1EFE8', color: '#5F5E5A' }
              return (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} className="card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-semibold text-base">{s.name}</span>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: ts.bg, color: ts.color }}>{s.type}</span>
                      </div>
                      <div className="text-xs text-gray-400">{s.provider}</div>
                    </div>
                    <div className="flex-shrink-0 ml-3 text-right">
                      <MatchRing score={s.matchScore} />
                    </div>
                  </div>

                  {/* Match bar */}
                  <div className="h-1.5 rounded-full mb-3 overflow-hidden" style={{ background: '#F1EFE8' }}>
                    <motion.div className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${s.matchScore}%` }}
                      transition={{ duration: 0.8, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      style={{ background: s.matchScore >= 80 ? '#1D9E75' : s.matchScore >= 60 ? '#EF9F27' : '#B4B2A9' }}
                    />
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed mb-3">{s.matchReason}</p>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {s.criteria?.map((c, j) => (
                        <span key={j} className="tag text-xs" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>{c}</span>
                      ))}
                    </div>
                    <div className="font-semibold text-sm flex-shrink-0" style={{ color: '#0F6E56' }}>
                      {s.amount}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
