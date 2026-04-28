import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { logout, subscribeResultsByStudentEmail } from '../services/firebase'
import { recommendScholarships } from '../services/gemini'
import { EmptyState, LoadingCard, Tag } from '../components/ui'
import {
  buildStudentRoadmap,
  buildStudentTrendData,
  formatShortDate,
  gradeFromPercentage,
  percentFromResult,
} from '../utils/insights'

const NAV = [
  { id: 'results', icon: '📊', label: 'My Results' },
  { id: 'scholarships', icon: '🎓', label: 'Scholarships' },
  { id: 'growth', icon: '🚀', label: 'Growth Plan' },
  { id: 'profile', icon: '👤', label: 'Profile' },
]

const gradeColor = (percentage) => (
  percentage >= 60 ? '#0F6E56' : percentage >= 50 ? '#BA7517' : '#A32D2D'
)

const gradeBg = (percentage) => (
  percentage >= 60 ? '#E1F5EE' : percentage >= 50 ? '#FAEEDA' : '#FCEBEB'
)

const confidenceTone = {
  high: { bg: '#E1F5EE', color: '#085041' },
  medium: { bg: '#FAEEDA', color: '#854F0B' },
  low: { bg: '#FCEBEB', color: '#A32D2D' },
}

export function StudentDashboard({ user }) {
  const [page, setPage] = useState('results')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [scholTarget, setScholTarget] = useState(null)

  useEffect(() => {
    if (!user?.email) return
    setLoading(true)
    const unsub = subscribeResultsByStudentEmail(
      user.email,
      (docs) => {
        setResults(docs)
        setLoading(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setLoading(false)
      }
    )
    return unsub
  }, [user])

  const eligibleCount = results.filter((item) => item.scholarshipEligible).length
  const best = results.length
    ? results.reduce((bestResult, current) => percentFromResult(current) > percentFromResult(bestResult) ? current : bestResult, results[0])
    : null
  const trendData = useMemo(() => buildStudentTrendData(results), [results])
  const roadmap = useMemo(() => buildStudentRoadmap(results), [results])

  const handleCheckSchol = (result) => {
    setScholTarget(result)
    setPage('scholarships')
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch {}
    window.location.reload()
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8F7F3' }}>
      <aside className="w-56 flex-col flex-shrink-0 hidden md:flex" style={{ background: '#04342C' }}>
        <div className="px-5 py-4" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: '#1D9E75' }}>
              ⚖️
            </div>
            <span style={{ color: '#fff', fontFamily: "'DM Serif Display',serif", fontSize: 17 }}>
              EduEquity AI
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(29,158,117,0.2)', color: '#5DCAA5' }}>
            🎒 Student Portal
          </span>
        </div>

        <nav className="flex-1 p-2.5 space-y-0.5">
          {NAV.map((item) => (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage(item.id)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl border-none cursor-pointer text-sm font-medium"
              style={{
                background: page === item.id ? 'rgba(29,158,117,0.25)' : 'transparent',
                color: page === item.id ? '#5DCAA5' : 'rgba(255,255,255,0.55)',
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </motion.button>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2 p-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: '#185FA5', color: '#fff' }}>
              {(user?.displayName || user?.email || 'S')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {user?.displayName || user?.email?.split('@')[0]}
              </div>
              <button onClick={handleLogout} className="text-xs border-none cursor-pointer p-0" style={{ background: 'none', color: 'rgba(255,255,255,0.35)' }}>
                Sign out
              </button>
            </div>
          </div>
          <div className="px-2 py-1.5 rounded-lg text-xs mt-2" style={{ background: 'rgba(24,95,165,0.16)' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)' }}>Growth status</div>
            <div className="font-medium" style={{ color: '#A7D1FF' }}>
              {eligibleCount > 0 ? `${eligibleCount} scholarship-ready result${eligibleCount > 1 ? 's' : ''}` : 'Keep building momentum'}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Student Dashboard · UN SDG 10</div>
              <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24 }}>
                {page === 'results' && 'My Evaluated Results'}
                {page === 'scholarships' && 'Scholarship Opportunities'}
                {page === 'growth' && 'Growth Plan'}
                {page === 'profile' && 'My Profile'}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {eligibleCount > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: '#E1F5EE', color: '#0F6E56' }}>
                  🎓 {eligibleCount} scholarship eligible
                </div>
              )}
              {best && (
                <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: '#EEF5FF', color: '#185FA5' }}>
                  Best: {percentFromResult(best)}%
                </div>
              )}
            </div>
          </div>

          {page === 'results' && <ResultsPage results={results} loading={loading} onCheckSchol={handleCheckSchol} />}
          {page === 'scholarships' && <ScholarshipPage results={results} prefill={scholTarget} onClearPrefill={() => setScholTarget(null)} />}
          {page === 'growth' && <GrowthPlanPage loading={loading} results={results} trendData={trendData} roadmap={roadmap} />}
          {page === 'profile' && <StudentProfile user={user} results={results} best={best} eligibleCount={eligibleCount} trendData={trendData} roadmap={roadmap} />}
        </div>
      </main>
    </div>
  )
}

function ResultsPage({ results, loading, onCheckSchol }) {
  const [expanded, setExpanded] = useState(null)

  if (loading) {
    return <LoadingCard title="Fetching your results…" description="Loading evaluated answer sheets" tags={['Results', 'Feedback', 'Scholarships']} />
  }

  if (!results.length) {
    return (
      <div className="card text-center py-16">
        <div style={{ fontSize: 44 }} className="mb-3">📭</div>
        <div className="font-semibold text-gray-600 mb-2">No results yet</div>
        <div className="text-sm text-gray-400 leading-relaxed">
          Your teacher has not uploaded your answer sheets yet.
          <br />
          Check back after your exams are evaluated.
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in flex flex-col gap-4">
      {results.map((result, index) => {
        const percentage = percentFromResult(result)
        const open = expanded === index
        const tone = confidenceTone[result.confidence] || confidenceTone.medium

        return (
          <motion.div
            key={result.id || index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-base text-gray-800">{result.subject}</span>
                  {result.scholarshipEligible && <Tag variant="ok">Scholarship Eligible</Tag>}
                  {result.confidence && <Tag variant={result.confidence === 'high' ? 'ok' : result.confidence === 'medium' ? 'warn' : 'err'}>{result.confidence} confidence</Tag>}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  Graded by {result.teacherEmail} · {result.fileName} · {formatShortDate(result.createdAt ?? result.savedAt)}
                </div>
                <div className="h-2 rounded-full overflow-hidden w-full max-w-md" style={{ background: '#F1EFE8' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: gradeColor(percentage) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.9, delay: index * 0.06 + 0.2 }}
                  />
                </div>
                {result.overallFeedback && (
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">{result.overallFeedback}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl px-4 py-3 text-center flex-shrink-0" style={{ background: tone.bg }}>
                  <div className="text-[11px] text-gray-400 mb-0.5">Confidence</div>
                  <div className="text-sm font-semibold capitalize" style={{ color: tone.color }}>{result.confidence || 'medium'}</div>
                </div>
                <div className="flex flex-col items-center px-4 py-3 rounded-2xl flex-shrink-0" style={{ background: gradeBg(percentage) }}>
                  <div className="text-3xl font-bold leading-none" style={{ color: gradeColor(percentage), fontFamily: "'DM Serif Display',serif" }}>
                    {gradeFromPercentage(percentage)}
                  </div>
                  <div className="text-xs mt-1" style={{ color: gradeColor(percentage) }}>
                    {result.marksObtained}/{result.totalMarks}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => setExpanded(open ? null : index)} className="btn-secondary text-xs px-3 py-1.5">
                {open ? '▲ Hide Details' : '▼ View Details'}
              </button>
              {result.scholarshipEligible && (
                <button onClick={() => onCheckSchol(result)} className="btn-primary text-xs px-3 py-1.5">
                  🎓 Find Scholarships
                </button>
              )}
            </div>

            <AnimatePresence>
              {open && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-4 pt-4 flex flex-col gap-4" style={{ borderTop: '0.5px solid #E0DED6' }}>
                    {result.breakdown?.length > 0 && (
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-2.5">Question Breakdown</div>
                        <div className="flex flex-col gap-2">
                          {result.breakdown.map((item, detailIndex) => (
                            <div key={detailIndex} className="flex items-start gap-2.5 rounded-xl p-3" style={{ background: item.correct ? '#E1F5EE' : '#FFF8F0' }}>
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: item.correct ? '#1D9E75' : '#BA7517', color: '#fff' }}>
                                {item.qNo}
                              </div>
                              <div className="flex-1 text-xs text-gray-600 leading-relaxed">
                                <span className="font-medium">{item.topic}</span> — {item.feedback}
                              </div>
                              <div className="text-xs font-bold flex-shrink-0" style={{ color: item.correct ? '#0F6E56' : '#BA7517' }}>
                                {item.marksAwarded}/{item.maxMarks}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid xl:grid-cols-2 gap-4">
                      <div className="grid md:grid-cols-2 gap-3">
                        {result.strengths && (
                          <div className="rounded-xl p-3" style={{ background: '#E1F5EE' }}>
                            <div className="text-xs font-semibold mb-1" style={{ color: '#085041' }}>Strengths</div>
                            <p className="text-xs" style={{ color: '#0F6E56' }}>{result.strengths}</p>
                          </div>
                        )}
                        {result.improvements && (
                          <div className="rounded-xl p-3" style={{ background: '#FAEEDA' }}>
                            <div className="text-xs font-semibold mb-1" style={{ color: '#633806' }}>Improve</div>
                            <p className="text-xs" style={{ color: '#854F0B' }}>{result.improvements}</p>
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl p-4" style={{ background: '#F8F7F3' }}>
                        <div className="font-semibold text-xs text-gray-700 mb-2">Next steps</div>
                        <div className="flex flex-col gap-2">
                          {(result.nextSteps || []).slice(0, 3).map((step) => (
                            <div key={step} className="flex items-start gap-2 text-xs text-gray-600">
                              <span style={{ color: '#1D9E75' }}>●</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {result.learnerSignals && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          ['Mastery', result.learnerSignals.masteryBand],
                          ['Coverage', result.learnerSignals.conceptCoverage],
                          ['Depth', result.learnerSignals.responseDepth],
                          ['Focus', result.learnerSignals.subjectFocus],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-xl p-3" style={{ background: '#fff' }}>
                            <div className="text-xs text-gray-400 mb-1">{label}</div>
                            <div className="text-sm font-semibold text-gray-800">{value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}
    </div>
  )
}

function ScholarshipPage({ results, prefill, onClearPrefill }) {
  const eligible = results.filter((item) => item.scholarshipEligible)
  const [selected, setSelected] = useState(null)
  const [schols, setSchols] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (prefill) {
      setSelected(prefill)
      setSchols(null)
      onClearPrefill?.()
    }
  }, [prefill, onClearPrefill])

  useEffect(() => {
    if (selected) fetchSchols(selected)
  }, [selected])

  const fetchSchols = async (result) => {
    const percentage = percentFromResult(result)
    if (percentage < 60) {
      setError('Scholarship search requires at least 60% marks.')
      return
    }
    setLoading(true)
    setSchols(null)
    setError('')
    try {
      const data = await recommendScholarships({
        percentage,
        subject: result.subject,
        marksObtained: result.marksObtained,
        totalMarks: result.totalMarks,
      })
      setSchols(data)
    } catch (err) {
      setError(`Could not load scholarships: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!eligible.length) {
    return (
      <div className="card text-center py-16">
        <div style={{ fontSize: 44 }} className="mb-3">🎓</div>
        <div className="font-semibold text-gray-600 mb-2">No scholarship-eligible results yet</div>
        <div className="text-sm text-gray-400 leading-relaxed">
          Score 60% or above on any subject to unlock scholarship recommendations.
        </div>
      </div>
    )
  }

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="card flex flex-col gap-3">
        <div className="font-semibold text-sm">Select an exam result to find scholarships for</div>
        <div className="grid lg:grid-cols-2 gap-2">
          {eligible.map((result, index) => {
            const percentage = percentFromResult(result)
            const active = selected?.id === result.id || selected === result
            return (
              <button
                key={result.id || index}
                onClick={() => setSelected(result)}
                className="flex items-center justify-between rounded-xl p-3.5 text-left w-full cursor-pointer border-none transition-all"
                style={{
                  background: active ? '#E1F5EE' : '#F8F7F3',
                  border: `1.5px solid ${active ? '#1D9E75' : '#E0DED6'}`,
                }}
              >
                <div>
                  <div className="font-semibold text-sm">{result.subject}</div>
                  <div className="text-xs text-gray-400">{result.marksObtained}/{result.totalMarks} marks · {percentage}%</div>
                </div>
                {active && <span style={{ color: '#0F6E56', fontWeight: 'bold' }}>✓ Selected</span>}
              </button>
            )
          })}
        </div>
      </div>

      {loading && (
        <LoadingCard
          title="Finding scholarship matches…"
          description="Analysing your marks and subject to find the best-fit opportunities"
          tags={['Academic Match', 'Merit Check', 'Subject Fit', 'Eligibility', 'Roadmap']}
        />
      )}

      {error && <div className="card text-sm" style={{ background: '#FCEBEB', color: '#A32D2D' }}>{error}</div>}

      <AnimatePresence>
        {schols && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-4">
              <div className="card" style={{ background: '#04342C', border: 'none' }}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Based on your {selected?.subject} result</div>
                    <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: '#fff' }}>
                      🎓 Your Scholarship Matches
                    </div>
                    <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.62)' }}>{schols.summaryNote}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Merit-only evaluation</div>
                    <div className="text-sm font-medium" style={{ color: '#5DCAA5' }}>No bias. No background.</div>
                  </div>
                </div>
              </div>

              <div className="card" style={{ background: '#E1F5EE', border: 'none' }}>
                <div className="font-semibold mb-1" style={{ color: '#085041' }}>Fit Snapshot</div>
                <p className="text-sm mb-3" style={{ color: '#0F6E56' }}>{schols.overallProfile}</p>
                {schols.fitSnapshot && (
                  <div className="grid grid-cols-2 gap-2">
                    <FitTile label="GPA signal" value={schols.fitSnapshot.gpa?.toFixed?.(2) || schols.fitSnapshot.gpa} />
                    <FitTile label="Subject lane" value={schols.fitSnapshot.subject} />
                    <FitTile label="Top match score" value={schols.fitSnapshot.topMatchScore ? `${schols.fitSnapshot.topMatchScore}%` : '—'} />
                    <FitTile label="Income view" value={schols.fitSnapshot.income == null ? 'Not used' : `$${schols.fitSnapshot.income}`} />
                  </div>
                )}
              </div>
            </div>

            {schols.scholarships?.map((scholarship, index) => {
              const scoreColor = scholarship.matchScore >= 80 ? '#0F6E56' : scholarship.matchScore >= 60 ? '#BA7517' : '#888780'
              const scoreBg = scholarship.matchScore >= 80 ? '#E1F5EE' : scholarship.matchScore >= 60 ? '#FAEEDA' : '#F1EFE8'
              return (
                <motion.div
                  key={scholarship.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="card"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-800 mb-0.5">{scholarship.name}</div>
                      <div className="text-xs text-gray-400">{scholarship.provider}</div>
                    </div>
                    <div className="flex flex-col items-start lg:items-end gap-1 flex-shrink-0">
                      <div className="font-bold text-base" style={{ color: '#0F6E56' }}>{scholarship.amount}</div>
                      <div className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: scoreBg, color: scoreColor }}>
                        {scholarship.matchScore}% match
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{scholarship.reason}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {scholarship.criteria?.map((criterion) => (
                      <span key={criterion} className="tag text-xs" style={{ background: '#F1EFE8', color: '#5F5E5A' }}>
                        {criterion}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-gray-400">{scholarship.eligibility}</div>
                    {scholarship.applyLink && (
                      <a href={scholarship.applyLink} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-3 py-1.5 no-underline" style={{ textDecoration: 'none' }}>
                        Apply →
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {schols.roadmap?.length > 0 && (
              <div className="card">
                <div className="font-semibold text-sm mb-3">Application Roadmap</div>
                <div className="grid xl:grid-cols-3 gap-3">
                  {schols.roadmap.map((item) => (
                    <div key={item.title} className="rounded-xl p-4" style={{ background: '#F8F7F3' }}>
                      <div className="font-semibold text-sm text-gray-800 mb-1">{item.title}</div>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {schols.fairnessNote && (
              <div className="rounded-xl p-3 text-xs" style={{ background: '#E1F5EE', color: '#0F6E56' }}>
                ⚖️ {schols.fairnessNote}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GrowthPlanPage({ loading, results, trendData, roadmap }) {
  const average = results.length
    ? Math.round(results.reduce((sum, result) => sum + percentFromResult(result), 0) / results.length)
    : null

  if (loading) {
    return <LoadingCard title="Building your growth map…" description="Turning results into progress trends and next steps" tags={['Trend', 'Momentum', 'Roadmap']} />
  }

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="card" style={{ background: '#04342C', border: 'none' }}>
          <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Progress story</div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#fff' }}>
            {average != null ? `${average}% average across your recent results` : 'Your growth story begins after the first evaluation'}
          </div>
          <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.62)' }}>
            This page turns your evaluation history into a clear next-step plan instead of leaving you with isolated scores.
          </p>
        </div>
        <div className="card flex flex-col gap-3">
          <div className="font-semibold text-sm">Momentum markers</div>
          {[
            results.length ? `${results.length} evaluated result${results.length > 1 ? 's' : ''} on record` : 'No evaluated results yet',
            results.some((item) => item.scholarshipEligible) ? 'Scholarship pathways already unlocked' : 'Cross 60% to unlock scholarship matching',
            trendData.length >= 2 ? 'You can now track improvement over time' : 'More than one result will unlock stronger trend tracking',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <span style={{ color: '#1D9E75' }}>●</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.1fr_0.9fr] gap-5">
        <div className="card">
          <div className="font-semibold text-sm mb-4">Recent score trend</div>
          {trendData.length ? (
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ left: -18, right: 8 }}>
                  <defs>
                    <linearGradient id="studentTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1D9E75" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#1D9E75" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#888780' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888780' }} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Score']} labelFormatter={(label, payload) => payload?.[0]?.payload?.fullLabel || label} />
                  <Area type="monotone" dataKey="score" stroke="#1D9E75" fill="url(#studentTrend)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState icon="📈" title="Trend chart is waiting" description="Once you have evaluated results, your score trend will appear here." />
          )}
        </div>

        <div className="card">
          <div className="font-semibold text-sm mb-3">Your roadmap</div>
          <div className="flex flex-col gap-3">
            {roadmap.map((item) => (
              <div key={item.title} className="rounded-xl p-4" style={{ background: '#F8F7F3' }}>
                <div className="font-semibold text-sm text-gray-800 mb-1">{item.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StudentProfile({ user, results, best, eligibleCount, trendData, roadmap }) {
  const average = results.length
    ? Math.round(results.reduce((sum, result) => sum + percentFromResult(result), 0) / results.length)
    : null

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="card flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0" style={{ background: '#185FA5', color: '#fff' }}>
          {(user?.displayName || user?.email || 'S')[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-lg">{user?.displayName || 'Student'}</div>
          <div className="text-sm text-gray-400 mb-2">{user?.email}</div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#E6F1FB', color: '#185FA5' }}>
            🎒 Student
          </span>
        </div>
        <div className="rounded-2xl p-4" style={{ background: '#F8F7F3' }}>
          <div className="text-xs text-gray-400 mb-1">Best score</div>
          <div className="text-3xl font-bold" style={{ color: '#185FA5', fontFamily: "'DM Serif Display',serif" }}>
            {best ? `${percentFromResult(best)}%` : '—'}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Papers Evaluated', value: results.length, bg: '#E1F5EE', color: '#085041' },
          { label: 'Average Score', value: average != null ? `${average}%` : '—', bg: '#E6F1FB', color: '#0C447C' },
          { label: 'Scholarship Ready', value: eligibleCount, bg: '#FAEEDA', color: '#633806' },
          { label: 'Recent Trend Points', value: trendData.length, bg: '#F1EFE8', color: '#444441' },
        ].map((item) => (
          <div key={item.label} className="card text-center" style={{ background: item.bg }}>
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className="text-3xl font-bold" style={{ color: item.color, fontFamily: "'DM Serif Display',serif" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {best && (
        <div className="card" style={{ background: '#04342C', border: 'none' }}>
          <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Your best result</div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: '#fff' }}>
            {best.subject} — {best.marksObtained}/{best.totalMarks} marks
          </div>
          <div className="text-sm mt-1" style={{ color: '#5DCAA5' }}>
            {percentFromResult(best)}% · Grade {gradeFromPercentage(percentFromResult(best))}
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-[0.95fr_1.05fr] gap-5">
        <div className="card">
          <div className="font-semibold text-sm mb-3">Next best moves</div>
          <div className="flex flex-col gap-3">
            {roadmap.map((item) => (
              <div key={item.title} className="rounded-xl p-3" style={{ background: '#F8F7F3' }}>
                <div className="font-semibold text-sm text-gray-800 mb-1">{item.title}</div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card text-xs text-gray-500 flex gap-3 items-start">
          <span className="text-lg flex-shrink-0">🌍</span>
          <div>
            <span className="font-medium text-gray-700">UN SDG 10 — Reducing Inequalities. </span>
            EduEquity AI is designed so students are evaluated fairly, regardless of language, tone, or background.
            Your scholarship recommendations are derived from merit, need, skills, and potential rather than identity signals.
          </div>
        </div>
      </div>
    </div>
  )
}

function FitTile({ label, value }) {
  return (
    <div className="rounded-xl p-3" style={{ background: '#fff' }}>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="font-semibold text-sm text-gray-800">{value}</div>
    </div>
  )
}
