import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { logout, saveResult, subscribeResultsByTeacher } from '../services/firebase'
import { evaluateAnswerSheet } from '../services/gemini'
import { LoadingCard } from '../components/ui'

const SUBJECTS = [
  'Mathematics','Physics','Chemistry','Biology',
  'English','History','Geography','Economics',
  'Computer Science','Political Science','Other',
]
const TOTAL_MARKS_OPTIONS = [10,20,25,50,100]

/* ── Sidebar nav items ─────────────────────────── */
const NAV = [
  { id:'upload',   icon:'📤', label:'Upload & Grade'   },
  { id:'history',  icon:'📋', label:'Submitted Results'},
  { id:'profile',  icon:'👤', label:'Profile'          },
]

/* ── Grade helpers ─────────────────────────────── */
const calcGrade  = p => p>=90?'A+':p>=80?'A':p>=70?'B':p>=60?'C':p>=50?'D':'F'
const gradeColor = p => p>=60?'#0F6E56':p>=50?'#BA7517':'#A32D2D'
const gradeBg    = p => p>=60?'#E1F5EE':p>=50?'#FAEEDA':'#FCEBEB'

/* ═══════════════════════════════════════════════ */
export function TeacherDashboard({ user }) {
  const [page,     setPage]     = useState('upload')
  const [history,  setHistory]  = useState([])
  const [histLoad, setHistLoad] = useState(false)

  // Real-time listener: auto-updates history whenever Firestore changes.
  // This means results appear immediately after save and survive page refresh.
  useEffect(() => {
    if (!user?.uid) return
    setHistLoad(true)
    const unsub = subscribeResultsByTeacher(
      user.uid,
      (docs) => { setHistory(docs); setHistLoad(false) },
      (err)  => { console.error('Firestore error:', err); setHistLoad(false) }
    )
    return unsub  // unsubscribe on unmount / user change
  }, [user])

  const handleSaved = () => {
    // Firestore listener updates history automatically — just navigate
    setPage('history')
  }

  const handleLogout = async () => {
    try { await logout() } catch {}
    window.location.reload()
  }

  /* ── Layout ────────────────────────────────── */
  return (
    <div className="flex h-screen overflow-hidden" style={{ background:'#F8F7F3' }}>

      {/* Sidebar */}
      <aside className="w-56 flex flex-col flex-shrink-0" style={{ background:'#04342C' }}>
        {/* Logo */}
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
            🏫 Teacher Portal
          </span>
        </div>

        {/* Nav */}
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

        {/* User */}
        <div className="p-3" style={{ borderTop:'0.5px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-2 p-2 rounded-xl"
            style={{ background:'rgba(255,255,255,0.05)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background:'#085041', color:'#5DCAA5' }}>
              {(user?.displayName||user?.email||'T')[0].toUpperCase()}
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
          <div className="px-2 py-1.5 rounded-lg text-xs mt-2" style={{ background:'rgba(29,158,117,0.1)' }}>
            <div style={{ color:'rgba(255,255,255,0.3)' }}>Evaluation engine</div>
            <div className="font-medium" style={{ color:'#5DCAA5' }}>Local Offline Evaluator</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-8 py-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Teacher Dashboard · UN SDG 10</div>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24 }}>
                {page==='upload' && 'Upload & Grade Answer Sheet'}
                {page==='history' && 'Submitted Results'}
                {page==='profile' && 'My Profile'}
              </h1>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background:'#E1F5EE', color:'#0F6E56' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block pulse-dot" style={{ background:'#1D9E75' }}/>
              {history.length} graded
            </div>
          </div>

          {page==='upload'  && <UploadPage user={user} onSaved={handleSaved} />}
          {page==='history' && <HistoryPage items={history} loading={histLoad} />}
          {page==='profile' && <TeacherProfile user={user} history={history} />}
        </div>
      </main>
    </div>
  )
}

/* ── Upload & Grade page ─────────────────────────────── */
function UploadPage({ user, onSaved }) {
  const [studentEmail, setStudentEmail] = useState('')
  const [subject,      setSubject]      = useState('')
  const [totalMarks,   setTotalMarks]   = useState(100)
  const [pdfFile,      setPdfFile]      = useState(null)
  const [pdfB64,       setPdfB64]       = useState(null)
  const [loading,      setLoading]      = useState(false)
  const [result,       setResult]       = useState(null)
  const [error,        setError]        = useState('')

  const onFile = (e) => {
    const f = e.target.files[0]
    if (!f) return
    if (f.type !== 'application/pdf') { setError('Only PDF files are accepted.'); return }
    if (f.size > 15*1024*1024)        { setError('File must be under 15 MB.'); return }
    setPdfFile(f); setError(''); setResult(null)
    const r = new FileReader()
    r.onload = () => setPdfB64(r.result.split(',')[1])
    r.readAsDataURL(f)
  }

  const validate = () => {
    if (!studentEmail || !/\S+@\S+\.\S+/.test(studentEmail)) { setError('Enter a valid student email address.'); return false }
    if (!subject)  { setError('Select a subject.'); return false }
    if (!pdfB64)   { setError('Upload the student\'s answer sheet PDF.'); return false }
    return true
  }

  const handleEvaluate = async () => {
    if (!validate()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await evaluateAnswerSheet({ pdfBase64:pdfB64, subject, totalMarks })
      setResult(data)
      const entry = {
        teacherId:    user.uid,
        teacherName:  user.displayName || user.email,
        teacherEmail: user.email,
        studentEmail: studentEmail.toLowerCase().trim(),
        subject, totalMarks, fileName: pdfFile.name,
        ...data,
        savedAt: new Date().toISOString(),
      }
      await saveResult(entry)
      onSaved(entry)
    } catch (e) {
      setError('Evaluation failed: ' + (e.message || 'Please try a clearer PDF or adjust the subject details.'))
    } finally { setLoading(false) }
  }

  const reset = () => {
    setStudentEmail(''); setSubject(''); setPdfFile(null); setPdfB64(null); setResult(null); setError('')
  }

  /* render */
  if (result) return <ResultView result={result} totalMarks={totalMarks} subject={subject}
    studentEmail={studentEmail} fileName={pdfFile?.name} onReset={reset} />

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="card flex flex-col gap-4">

        {/* Student email */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Student Email Address <span style={{ color:'#A32D2D' }}>*</span>
          </label>
          <input className="inp" type="email" placeholder="student@school.edu"
            value={studentEmail} onChange={e => { setStudentEmail(e.target.value); setError('') }} />
          <p className="text-xs text-gray-400 mt-1">
            The result will be linked to this email — the student will see it when they log in.
          </p>
        </div>

        {/* Subject + Marks */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Subject <span style={{ color:'#A32D2D' }}>*</span>
            </label>
            <select className="inp" value={subject}
              onChange={e => { setSubject(e.target.value); setError('') }}
              style={{ cursor:'pointer' }}>
              <option value="">Select subject…</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Total Marks</label>
            <select className="inp" value={totalMarks}
              onChange={e => setTotalMarks(Number(e.target.value))}
              style={{ cursor:'pointer' }}>
              {TOTAL_MARKS_OPTIONS.map(m => <option key={m} value={m}>{m} marks</option>)}
            </select>
          </div>
        </div>

        {/* PDF upload */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Answer Sheet PDF <span style={{ color:'#A32D2D' }}>*</span>
          </label>
          <label
            className="flex flex-col items-center justify-center gap-2 w-full rounded-2xl p-8 cursor-pointer transition-all"
            style={{
              border: `2px dashed ${pdfFile ? '#1D9E75' : '#D3D1C7'}`,
              background: pdfFile ? '#E1F5EE' : '#FAFAF8',
            }}>
            <input type="file" accept="application/pdf" onChange={onFile} className="hidden" />
            {pdfFile ? (
              <>
                <span style={{ fontSize:36 }}>📄</span>
                <div className="text-sm font-semibold" style={{ color:'#0F6E56' }}>{pdfFile.name}</div>
                <div className="text-xs text-gray-400">{(pdfFile.size/1024).toFixed(0)} KB · Click to change</div>
              </>
            ) : (
              <>
                <span style={{ fontSize:36 }}>📂</span>
                <div className="text-sm font-medium text-gray-600">Click to upload PDF</div>
                <div className="text-xs text-gray-400">Max 15 MB · PDF only</div>
              </>
            )}
          </label>
        </div>

        {error && (
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="text-xs p-3 rounded-xl" style={{ background:'#FCEBEB', color:'#A32D2D' }}>
            {error}
          </motion.p>
        )}

        <button className="btn-primary flex items-center justify-center gap-2 py-3"
          onClick={handleEvaluate} disabled={loading}>
          {loading
            ? <><span className="spinner"/><span>AI is evaluating…</span></>
            : '🤖 Evaluate with AI'}
        </button>
      </div>

      <AnimatePresence>
        {loading && (
          <LoadingCard
            title="Reading & grading the answer sheet…"
            description="The offline evaluator is scanning the PDF, checking answer signals, and computing a fair score"
            tags={['Reading PDF','Checking Answers','Scoring','Feedback','Scholarship Check']}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Result view ─────────────────────────────────────── */
function ResultView({ result, totalMarks, subject, studentEmail, fileName, onReset }) {
  const pct    = result.percentage ?? Math.round((result.marksObtained/totalMarks)*100)
  const grade  = calcGrade(pct)
  const gColor = gradeColor(pct)
  const gBg    = gradeBg(pct)

  return (
    <motion.div className="fade-in flex flex-col gap-5"
      initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}>

      {/* Success banner */}
      <div className="rounded-2xl p-4 flex items-center gap-3"
        style={{ background:'#E1F5EE', border:'1px solid #9FE1CB' }}>
        <span style={{ fontSize:22 }}>✅</span>
        <div>
          <div className="font-semibold text-sm" style={{ color:'#085041' }}>
            Result saved and linked to student
          </div>
          <div className="text-xs" style={{ color:'#0F6E56' }}>
            <strong>{studentEmail}</strong> can now view their marks and check scholarship eligibility.
          </div>
        </div>
      </div>

      {/* Score card */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-xs text-gray-400 mb-0.5">{subject} · {fileName}</div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22 }}>Evaluation Result</div>
          </div>
          <div className="flex flex-col items-center px-5 py-3 rounded-2xl"
            style={{ background:gBg }}>
            <div className="text-4xl font-bold" style={{ color:gColor, fontFamily:"'DM Serif Display',serif" }}>
              {grade}
            </div>
            <div className="text-xs mt-0.5" style={{ color:gColor }}>Grade</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label:'Marks Obtained', val:`${result.marksObtained}/${totalMarks}`, bg:'#F1EFE8', c:'#2C2C2A' },
            { label:'Percentage',     val:`${pct}%`,           bg:gBg, c:gColor },
            { label:'Scholarship',    val: result.scholarshipEligible ? '✅ Eligible' : '❌ Not yet', bg: result.scholarshipEligible?'#E1F5EE':'#F1EFE8', c: result.scholarshipEligible?'#0F6E56':'#888780' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background:s.bg }}>
              <div className="text-xs text-gray-400 mb-1">{s.label}</div>
              <div className="font-bold text-lg leading-tight" style={{ color:s.c, fontFamily:"'DM Serif Display',serif" }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mb-1">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Score</span><span>{result.marksObtained}/{totalMarks}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background:'#F1EFE8' }}>
            <motion.div className="h-full rounded-full"
              style={{ background:gColor }}
              initial={{ width:0 }} animate={{ width:`${pct}%` }}
              transition={{ duration:1, ease:[.4,0,.2,1] }} />
          </div>
        </div>
      </div>

      {/* Q-wise breakdown */}
      {result.breakdown?.length > 0 && (
        <div className="card">
          <div className="font-semibold text-sm mb-4">📋 Question-by-Question Breakdown</div>
          <div className="flex flex-col gap-2.5">
            {result.breakdown.map((q, i) => (
              <motion.div key={i}
                initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:i*.06 }}
                className="flex items-start gap-3 rounded-xl p-3.5"
                style={{ background:q.correct?'#E1F5EE':'#FFF8F0', border:`0.5px solid ${q.correct?'#9FE1CB':'#EF9F27'}` }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background:q.correct?'#1D9E75':'#BA7517', color:'#fff' }}>
                  Q{q.qNo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-700 mb-0.5">{q.topic}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{q.feedback}</div>
                </div>
                <div className="font-bold text-sm flex-shrink-0"
                  style={{ color:q.correct?'#0F6E56':'#BA7517' }}>
                  {q.marksAwarded}/{q.maxMarks}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Feedback */}
      <div className="card" style={{ background:'#F8F7F3' }}>
        <div className="font-semibold text-sm mb-2">🤖 AI Feedback</div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{result.overallFeedback}</p>
        <div className="grid grid-cols-2 gap-3">
          {result.strengths && (
            <div className="rounded-xl p-3" style={{ background:'#E1F5EE' }}>
              <div className="text-xs font-semibold mb-1" style={{ color:'#085041' }}>💪 Strengths</div>
              <p className="text-xs leading-relaxed" style={{ color:'#0F6E56' }}>{result.strengths}</p>
            </div>
          )}
          {result.improvements && (
            <div className="rounded-xl p-3" style={{ background:'#FAEEDA' }}>
              <div className="text-xs font-semibold mb-1" style={{ color:'#633806' }}>📈 Improve</div>
              <p className="text-xs leading-relaxed" style={{ color:'#854F0B' }}>{result.improvements}</p>
            </div>
          )}
        </div>
      </div>

      <button onClick={onReset} className="btn-secondary text-center">
        ＋ Grade Another Student
      </button>
    </motion.div>
  )
}

/* ── History page ────────────────────────────────────── */
function HistoryPage({ items, loading }) {
  if (loading) return <LoadingCard title="Loading submitted results…" description="" tags={[]} />

  return (
    <div className="fade-in flex flex-col gap-4">
      {items.length === 0 ? (
        <div className="card text-center py-16">
          <div style={{ fontSize:44 }} className="mb-3">📭</div>
          <div className="font-semibold text-gray-600 mb-1">No results submitted yet</div>
          <div className="text-sm text-gray-400">
            Use "Upload & Grade" to evaluate your first student.
          </div>
        </div>
      ) : items.map((it, i) => {
        const pct    = it.percentage ?? Math.round((it.marksObtained/it.totalMarks)*100)
        const gColor = gradeColor(pct)
        const gBg    = gradeBg(pct)
        return (
          <motion.div key={it.id||i}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:i*.05 }}
            className="card flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-800">{it.subject}</span>
                {it.scholarshipEligible && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background:'#E1F5EE', color:'#0F6E56' }}>🎓 Scholarship Eligible</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mb-1">→ {it.studentEmail}</div>
              <div className="text-xs text-gray-400">{it.fileName}</div>
            </div>
            <div className="flex flex-col items-center px-4 py-2 rounded-xl flex-shrink-0"
              style={{ background:gBg }}>
              <div className="font-bold text-xl" style={{ color:gColor, fontFamily:"'DM Serif Display',serif" }}>
                {it.marksObtained}/{it.totalMarks}
              </div>
              <div className="text-xs" style={{ color:gColor }}>{pct}%</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ── Teacher profile ─────────────────────────────────── */
function TeacherProfile({ user, history }) {
  const totalStudents = new Set(history.map(h => h.studentEmail)).size
  const avgPct = history.length
    ? Math.round(history.reduce((a,h) => a + (h.percentage ?? Math.round((h.marksObtained/h.totalMarks)*100)), 0) / history.length)
    : null

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="card flex items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
          style={{ background:'#0F6E56', color:'#fff' }}>
          {(user?.displayName||user?.email||'T')[0].toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-lg">{user?.displayName || 'Teacher'}</div>
          <div className="text-sm text-gray-400 mb-2">{user?.email}</div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background:'#E1F5EE', color:'#0F6E56' }}>🏫 Teacher</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label:'Sheets Graded',   val: history.length,        bg:'#E1F5EE', c:'#085041' },
          { label:'Students Reached', val: totalStudents,         bg:'#E6F1FB', c:'#0C447C' },
          { label:'Avg Score',        val: avgPct!=null?`${avgPct}%`:'—', bg:'#FAEEDA', c:'#633806' },
        ].map(s => (
          <div key={s.label} className="card text-center" style={{ background:s.bg }}>
            <div className="text-xs text-gray-500 mb-1">{s.label}</div>
            <div className="text-3xl font-bold" style={{ color:s.c, fontFamily:"'DM Serif Display',serif" }}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
