import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { logout, subscribeResultsByStudentEmail } from '../services/firebase'
import { recommendScholarships } from '../services/gemini'
import { LoadingCard } from '../components/ui'

const NAV = [
  { id:'results',      icon:'📊', label:'My Results'        },
  { id:'scholarships', icon:'🎓', label:'Scholarships'      },
  { id:'profile',      icon:'👤', label:'Profile'           },
]

const calcGrade  = p => p>=90?'A+':p>=80?'A':p>=70?'B':p>=60?'C':p>=50?'D':'F'
const gradeColor = p => p>=60?'#0F6E56':p>=50?'#BA7517':'#A32D2D'
const gradeBg    = p => p>=60?'#E1F5EE':p>=50?'#FAEEDA':'#FCEBEB'

export function StudentDashboard({ user }) {
  const [page,        setPage]       = useState('results')
  const [results,     setResults]    = useState([])
  const [loading,     setLoading]    = useState(true)
  const [scholTarget, setScholTarget] = useState(null)  // result selected for scholarship

  // Real-time listener: results appear the moment a teacher saves them,
  // and are restored automatically on every page refresh.
  useEffect(() => {
    if (!user?.email) return
    setLoading(true)
    const unsub = subscribeResultsByStudentEmail(
      user.email,
      (docs) => { setResults(docs); setLoading(false) },
      (err)  => { console.error('Firestore error:', err); setLoading(false) }
    )
    return unsub  // unsubscribe on unmount / user change
  }, [user])

  const handleCheckSchol = (r) => {
    setScholTarget(r)
    setPage('scholarships')
  }

  const handleLogout = async () => {
    try { await logout() } catch {}
    window.location.reload()
  }

  const eligibleCount = results.filter(r => r.scholarshipEligible).length
  const best = results.length
    ? results.reduce((a,b) => (b.percentage??0)>(a.percentage??0)?b:a, results[0])
    : null

  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'#F8F7F3' }}>

      {/* Sidebar */}
      <aside className="w-56 flex flex-col flex-shrink-0" style={{ background:'#04342C' }}>
        <div className="px-5 py-4" style={{ borderBottom:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
              style={{ background:'#1D9E75' }}>⚖️</div>
            <span style={{ color:'#fff', fontFamily:"'DM Serif Display',serif", fontSize:17 }}>
              EduEquity AI
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background:'rgba(29,158,117,0.2)', color:'#5DCAA5' }}>
            🎒 Student Portal
          </span>
        </div>

        <nav className="flex-1 p-2.5 space-y-0.5">
          {NAV.map(n => (
            <motion.button key={n.id} whileTap={{ scale:0.97 }}
              onClick={() => setPage(n.id)}
              className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl border-none cursor-pointer text-sm font-medium"
              style={{
                background: page===n.id ? 'rgba(29,158,117,0.25)' : 'transparent',
                color:      page===n.id ? '#5DCAA5' : 'rgba(255,255,255,0.55)',
              }}>
              <span style={{ fontSize:16 }}>{n.icon}</span>{n.label}
            </motion.button>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2 p-2 rounded-xl"
            style={{ background:'rgba(255,255,255,0.05)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background:'#185FA5', color:'#fff' }}>
              {(user?.displayName||user?.email||'S')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color:'rgba(255,255,255,0.85)' }}>
                {user?.displayName || user?.email?.split('@')[0]}
              </div>
              <button onClick={handleLogout}
                className="text-xs border-none cursor-pointer p-0"
                style={{ background:'none', color:'rgba(255,255,255,0.35)' }}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Student Dashboard · UN SDG 10</div>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24 }}>
                {page==='results'      && 'My Evaluated Results'}
                {page==='scholarships' && 'Scholarship Opportunities'}
                {page==='profile'      && 'My Profile'}
              </h1>
            </div>
            {eligibleCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background:'#E1F5EE', color:'#0F6E56' }}>
                🎓 {eligibleCount} scholarship eligible
              </div>
            )}
          </div>

          {page==='results'      && <ResultsPage results={results} loading={loading} onCheckSchol={handleCheckSchol} />}
          {page==='scholarships' && <ScholarshipPage results={results} prefill={scholTarget} onClearPrefill={() => setScholTarget(null)} />}
          {page==='profile'      && <StudentProfile user={user} results={results} best={best} eligibleCount={eligibleCount} />}
        </div>
      </main>
    </div>
  )
}

/* ── Results page ──────────────────────────────────── */
function ResultsPage({ results, loading, onCheckSchol }) {
  const [expanded, setExpanded] = useState(null)

  if (loading) return <LoadingCard title="Fetching your results…" description="Loading evaluated answer sheets" tags={['Loading']} />

  if (results.length === 0) return (
    <div className="card text-center py-16">
      <div style={{ fontSize:44 }} className="mb-3">📭</div>
      <div className="font-semibold text-gray-600 mb-2">No results yet</div>
      <div className="text-sm text-gray-400 leading-relaxed">
        Your teacher hasn't uploaded your answer sheets yet.<br/>
        Check back after your exams are evaluated.
      </div>
    </div>
  )

  return (
    <div className="fade-in flex flex-col gap-4">
      {results.map((r, i) => {
        const pct    = r.percentage ?? Math.round((r.marksObtained/r.totalMarks)*100)
        const gColor = gradeColor(pct)
        const gBg    = gradeBg(pct)
        const open   = expanded === i

        return (
          <motion.div key={r.id||i}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*.06 }}
            className="card">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-base text-gray-800">{r.subject}</span>
                  {r.scholarshipEligible && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background:'#E1F5EE', color:'#0F6E56' }}>🎓 Scholarship Eligible</span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  Graded by {r.teacherEmail} · {r.fileName}
                </div>
                {/* Mini bar */}
                <div className="h-2 rounded-full overflow-hidden w-full max-w-xs" style={{ background:'#F1EFE8' }}>
                  <motion.div className="h-full rounded-full"
                    style={{ background:gColor }}
                    initial={{ width:0 }} animate={{ width:`${pct}%` }}
                    transition={{ duration:0.9, delay:i*.06+.2 }} />
                </div>
              </div>
              <div className="flex flex-col items-center px-4 py-3 rounded-2xl flex-shrink-0"
                style={{ background:gBg }}>
                <div className="text-3xl font-bold leading-none"
                  style={{ color:gColor, fontFamily:"'DM Serif Display',serif" }}>
                  {calcGrade(pct)}
                </div>
                <div className="text-xs mt-1" style={{ color:gColor }}>
                  {r.marksObtained}/{r.totalMarks}
                </div>
              </div>
            </div>

            {/* AI feedback snippet */}
            {r.overallFeedback && (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                {r.overallFeedback}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mt-3">
              <button onClick={() => setExpanded(open ? null : i)}
                className="btn-secondary text-xs px-3 py-1.5">
                {open ? '▲ Hide Details' : '▼ View Details'}
              </button>
              {r.scholarshipEligible && (
                <button onClick={() => onCheckSchol(r)}
                  className="btn-primary text-xs px-3 py-1.5">
                  🎓 Find Scholarships
                </button>
              )}
            </div>

            {/* Expandable detail */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                  exit={{ opacity:0, height:0 }} className="overflow-hidden">
                  <div className="mt-4 pt-4" style={{ borderTop:'0.5px solid #E0DED6' }}>
                    {r.breakdown?.length > 0 && (
                      <>
                        <div className="text-xs font-semibold text-gray-600 mb-2.5">Question Breakdown</div>
                        <div className="flex flex-col gap-2 mb-4">
                          {r.breakdown.map((q, j) => (
                            <div key={j} className="flex items-start gap-2.5 rounded-xl p-3"
                              style={{ background:q.correct?'#E1F5EE':'#FFF8F0' }}>
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                style={{ background:q.correct?'#1D9E75':'#BA7517', color:'#fff' }}>
                                {q.qNo}
                              </div>
                              <div className="flex-1 text-xs text-gray-600 leading-relaxed">
                                <span className="font-medium">{q.topic}</span> — {q.feedback}
                              </div>
                              <div className="text-xs font-bold flex-shrink-0"
                                style={{ color:q.correct?'#0F6E56':'#BA7517' }}>
                                {q.marksAwarded}/{q.maxMarks}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {r.strengths && (
                        <div className="rounded-xl p-3" style={{ background:'#E1F5EE' }}>
                          <div className="text-xs font-semibold mb-1" style={{ color:'#085041' }}>💪 Strengths</div>
                          <p className="text-xs" style={{ color:'#0F6E56' }}>{r.strengths}</p>
                        </div>
                      )}
                      {r.improvements && (
                        <div className="rounded-xl p-3" style={{ background:'#FAEEDA' }}>
                          <div className="text-xs font-semibold mb-1" style={{ color:'#633806' }}>📈 Improve</div>
                          <p className="text-xs" style={{ color:'#854F0B' }}>{r.improvements}</p>
                        </div>
                      )}
                    </div>
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

/* ── Scholarship page ──────────────────────────────── */
function ScholarshipPage({ results, prefill, onClearPrefill }) {
  const eligible = results.filter(r => r.scholarshipEligible)
  const [selected,    setSelected]    = useState(null)
  const [schols,      setSchols]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')

  // Auto-trigger if navigated from "Find Scholarships" button
  useEffect(() => {
    if (prefill) {
      setSelected(prefill)
      setSchols(null)
      onClearPrefill?.()
    }
  }, [prefill])

  useEffect(() => {
    if (selected) fetchSchols(selected)
  }, [selected])

  const fetchSchols = async (r) => {
    const pct = r.percentage ?? Math.round((r.marksObtained/r.totalMarks)*100)
    if (pct < 60) { setError('Scholarship search requires at least 60% marks.'); return }
    setLoading(true); setSchols(null); setError('')
    try {
      const data = await recommendScholarships({
        percentage:    pct,
        subject:       r.subject,
        marksObtained: r.marksObtained,
        totalMarks:    r.totalMarks,
      })
      setSchols(data)
    } catch (e) {
      setError('Could not load scholarships: ' + e.message)
    } finally { setLoading(false) }
  }

  if (eligible.length === 0) return (
    <div className="card text-center py-16">
      <div style={{ fontSize:44 }} className="mb-3">🎓</div>
      <div className="font-semibold text-gray-600 mb-2">No scholarship-eligible results yet</div>
      <div className="text-sm text-gray-400 leading-relaxed">
        Score 60% or above on any subject to unlock scholarship recommendations.
      </div>
    </div>
  )

  return (
    <div className="fade-in flex flex-col gap-5">
      {/* Select exam */}
      <div className="card flex flex-col gap-3">
        <div className="font-semibold text-sm">Select an exam result to find scholarships for:</div>
        <div className="flex flex-col gap-2">
          {eligible.map((r, i) => {
            const pct    = r.percentage ?? Math.round((r.marksObtained/r.totalMarks)*100)
            const active = selected?.id === r.id || selected === r
            return (
              <button key={i} onClick={() => setSelected(r)}
                className="flex items-center justify-between rounded-xl p-3.5 text-left w-full cursor-pointer border-none transition-all"
                style={{
                  background: active ? '#E1F5EE' : '#F8F7F3',
                  border: `1.5px solid ${active ? '#1D9E75' : '#E0DED6'}`,
                }}>
                <div>
                  <div className="font-semibold text-sm">{r.subject}</div>
                  <div className="text-xs text-gray-400">{r.marksObtained}/{r.totalMarks} marks · {pct}%</div>
                </div>
                {active && <span style={{ color:'#0F6E56', fontWeight:'bold' }}>✓ Selected</span>}
              </button>
            )
          })}
        </div>
      </div>

      {loading && <LoadingCard title="Finding scholarship matches…"
        description="Analysing your marks and subject to find the best-fit opportunities"
        tags={['Academic Match','Merit Check','Subject Fit','Eligibility','Results']} />}

      {error && <div className="card text-sm" style={{ background:'#FCEBEB', color:'#A32D2D' }}>{error}</div>}

      <AnimatePresence>
        {schols && !loading && (
          <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            className="flex flex-col gap-4">
            <div className="card" style={{ background:'#04342C', border:'none' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs mb-1" style={{ color:'rgba(255,255,255,0.45)' }}>
                    Based on your {selected?.subject} result
                  </div>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:'#fff' }}>
                    🎓 Your Scholarship Matches
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs" style={{ color:'rgba(255,255,255,0.4)' }}>Merit-only evaluation</div>
                  <div className="text-sm font-medium" style={{ color:'#5DCAA5' }}>No bias. No background.</div>
                </div>
              </div>
            </div>

            {schols.scholarships?.map((s, i) => {
              const scoreColor = s.matchScore>=80?'#0F6E56':s.matchScore>=60?'#BA7517':'#888780'
              const scoreBg    = s.matchScore>=80?'#E1F5EE':s.matchScore>=60?'#FAEEDA':'#F1EFE8'
              return (
                <motion.div key={i}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:i*.08 }}
                  className="card">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="font-semibold text-base text-gray-800 mb-0.5">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.provider}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className="font-bold text-base" style={{ color:'#0F6E56' }}>{s.amount}</div>
                      <div className="text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background:scoreBg, color:scoreColor }}>
                        {s.matchScore}% match
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{s.reason}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">{s.eligibility}</div>
                    {s.applyLink && (
                      <a href={s.applyLink} target="_blank" rel="noopener noreferrer"
                        className="btn-primary text-xs px-3 py-1.5 no-underline"
                        style={{ textDecoration:'none' }}>
                        Apply →
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {schols.fairnessNote && (
              <div className="rounded-xl p-3 text-xs" style={{ background:'#E1F5EE', color:'#0F6E56' }}>
                ⚖️ {schols.fairnessNote}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Student profile ───────────────────────────────── */
function StudentProfile({ user, results, best, eligibleCount }) {
  const avgPct = results.length
    ? Math.round(results.reduce((a,r) => a+(r.percentage??Math.round((r.marksObtained/r.totalMarks)*100)),0)/results.length)
    : null

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="card flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{ background:'#185FA5', color:'#fff' }}>
          {(user?.displayName||user?.email||'S')[0].toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-lg">{user?.displayName || 'Student'}</div>
          <div className="text-sm text-gray-400 mb-2">{user?.email}</div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background:'#E6F1FB', color:'#185FA5' }}>🎒 Student</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Papers Evaluated', val: results.length,                      bg:'#E1F5EE', c:'#085041' },
          { label:'Average Score',    val: avgPct!=null?`${avgPct}%`:'—',        bg:'#E6F1FB', c:'#0C447C' },
          { label:'Scholarship Ready',val: eligibleCount,                        bg:'#FAEEDA', c:'#633806' },
        ].map(s => (
          <div key={s.label} className="card text-center" style={{ background:s.bg }}>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-3xl font-bold" style={{ color:s.c, fontFamily:"'DM Serif Display',serif" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {best && (
        <div className="card" style={{ background:'#04342C', border:'none' }}>
          <div className="text-xs mb-1" style={{ color:'rgba(255,255,255,0.4)' }}>Your best result</div>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:'#fff' }}>
            {best.subject} — {best.marksObtained}/{best.totalMarks} marks
          </div>
          <div className="text-sm mt-1" style={{ color:'#5DCAA5' }}>
            {best.percentage ?? Math.round((best.marksObtained/best.totalMarks)*100)}% · Grade {calcGrade(best.percentage ?? Math.round((best.marksObtained/best.totalMarks)*100))}
          </div>
        </div>
      )}

      <div className="card text-xs text-gray-500 flex gap-3 items-start">
        <span className="text-lg flex-shrink-0">🌍</span>
        <div>
          <span className="font-medium text-gray-700">UN SDG 10 — Reducing Inequalities. </span>
          EduEquity AI evaluates every student fairly, regardless of handwriting, language, or background.
          Scholarship recommendations are based purely on academic merit.
        </div>
      </div>
    </div>
  )
}
