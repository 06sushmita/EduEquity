import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { logout, saveResult, subscribeResultsByTeacher } from '../services/firebase'
import { evaluateAnswerSheet } from '../services/gemini'
import { EmptyState, LoadingCard, Tag } from '../components/ui'
import {
  buildInterventionList,
  buildOutcomeDistribution,
  buildSubjectInsights,
  buildTeacherHighlights,
  buildTeacherImpactSummary,
  formatShortDate,
  getSupportTier,
  gradeFromPercentage,
  percentFromResult,
} from '../utils/insights'

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'History', 'Geography', 'Economics',
  'Computer Science', 'Political Science', 'Other',
]

const TOTAL_MARKS_OPTIONS = [10, 20, 25, 50, 100]
const OUTCOME_COLORS = {
  Accelerate: '#1D9E75',
  'On Track': '#EF9F27',
  'Needs Support': '#C65353',
}

const NAV = [
  { id: 'upload', icon: '📤', label: 'Upload & Grade' },
  { id: 'history', icon: '📋', label: 'Submitted Results' },
  { id: 'impact', icon: '📈', label: 'Impact Lab' },
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

export function TeacherDashboard({ user }) {
  const [page, setPage] = useState('upload')
  const [history, setHistory] = useState([])
  const [histLoad, setHistLoad] = useState(false)

  useEffect(() => {
    if (!user?.uid) return
    setHistLoad(true)
    const unsub = subscribeResultsByTeacher(
      user.uid,
      (docs) => {
        setHistory(docs)
        setHistLoad(false)
      },
      (err) => {
        console.error('Firestore error:', err)
        setHistLoad(false)
      }
    )
    return unsub
  }, [user])

  const impactSummary = useMemo(() => buildTeacherImpactSummary(history), [history])

  const handleSaved = () => {
    setPage('history')
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
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: 'rgba(29,158,117,0.2)', color: '#5DCAA5' }}
          >
            🏫 Teacher Portal
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
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: '#085041', color: '#5DCAA5' }}
            >
              {(user?.displayName || user?.email || 'T')[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
                {user?.displayName || user?.email?.split('@')[0]}
              </div>
              <button
                onClick={handleLogout}
                className="text-xs border-none cursor-pointer p-0"
                style={{ background: 'none', color: 'rgba(255,255,255,0.35)' }}
              >
                Sign out
              </button>
            </div>
          </div>
          <div className="px-2 py-1.5 rounded-lg text-xs mt-2" style={{ background: 'rgba(29,158,117,0.1)' }}>
            <div style={{ color: 'rgba(255,255,255,0.3)' }}>Impact snapshot</div>
            <div className="font-medium" style={{ color: '#5DCAA5' }}>
              {impactSummary.studentsReached} learners reached
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">Teacher Dashboard · UN SDG 10</div>
              <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24 }}>
                {page === 'upload' && 'Upload & Grade Answer Sheet'}
                {page === 'history' && 'Submitted Results'}
                {page === 'impact' && 'Impact Lab'}
                {page === 'profile' && 'My Profile'}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: '#E1F5EE', color: '#0F6E56' }}
              >
                <span className="w-1.5 h-1.5 rounded-full inline-block pulse-dot" style={{ background: '#1D9E75' }} />
                {impactSummary.evaluations} graded
              </div>
              <div
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                style={{ background: '#EEF5FF', color: '#185FA5' }}
              >
                {impactSummary.eligible} scholarship-ready
              </div>
            </div>
          </div>

          {page === 'upload' && <UploadPage user={user} onSaved={handleSaved} />}
          {page === 'history' && <HistoryPage items={history} loading={histLoad} />}
          {page === 'impact' && <ImpactLab history={history} loading={histLoad} />}
          {page === 'profile' && <TeacherProfile user={user} history={history} summary={impactSummary} />}
        </div>
      </main>
    </div>
  )
}

function UploadPage({ user, onSaved }) {
  const [studentEmail, setStudentEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [totalMarks, setTotalMarks] = useState(100)
  const [pdfFile, setPdfFile] = useState(null)
  const [pdfB64, setPdfB64] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const onFile = (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are accepted.')
      return
    }
    if (file.size > 15 * 1024 * 1024) {
      setError('File must be under 15 MB.')
      return
    }
    setPdfFile(file)
    setError('')
    setResult(null)
    const reader = new FileReader()
    reader.onload = () => setPdfB64(reader.result.split(',')[1])
    reader.readAsDataURL(file)
  }

  const validate = () => {
    if (!studentEmail || !/\S+@\S+\.\S+/.test(studentEmail)) {
      setError('Enter a valid student email address.')
      return false
    }
    if (!subject) {
      setError('Select a subject.')
      return false
    }
    if (!pdfB64) {
      setError("Upload the student's answer sheet PDF.")
      return false
    }
    return true
  }

  const handleEvaluate = async () => {
    if (!validate()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await evaluateAnswerSheet({ pdfBase64: pdfB64, subject, totalMarks })
      setResult(data)
      const entry = {
        teacherId: user.uid,
        teacherName: user.displayName || user.email,
        teacherEmail: user.email,
        studentEmail: studentEmail.toLowerCase().trim(),
        subject,
        totalMarks,
        fileName: pdfFile.name,
        ...data,
        savedAt: new Date().toISOString(),
      }
      await saveResult(entry)
      onSaved(entry)
    } catch (err) {
      setError(`Evaluation failed: ${err.message || 'Please try a clearer PDF or adjust the subject details.'}`)
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setStudentEmail('')
    setSubject('')
    setPdfFile(null)
    setPdfB64(null)
    setResult(null)
    setError('')
  }

  if (result) {
    return (
      <ResultView
        result={result}
        totalMarks={totalMarks}
        subject={subject}
        studentEmail={studentEmail}
        fileName={pdfFile?.name}
        onReset={reset}
      />
    )
  }

  return (
    <div className="fade-in grid xl:grid-cols-[1.2fr_0.8fr] gap-5">
      <div className="card flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Student Email Address <span style={{ color: '#A32D2D' }}>*</span>
          </label>
          <input
            className="inp"
            type="email"
            placeholder="student@school.edu"
            value={studentEmail}
            onChange={(event) => {
              setStudentEmail(event.target.value)
              setError('')
            }}
          />
          <p className="text-xs text-gray-400 mt-1">
            The result will be linked to this email so the learner can review feedback and scholarships later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Subject <span style={{ color: '#A32D2D' }}>*</span>
            </label>
            <select
              className="inp"
              value={subject}
              onChange={(event) => {
                setSubject(event.target.value)
                setError('')
              }}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select subject…</option>
              {SUBJECTS.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Total Marks</label>
            <select
              className="inp"
              value={totalMarks}
              onChange={(event) => setTotalMarks(Number(event.target.value))}
              style={{ cursor: 'pointer' }}
            >
              {TOTAL_MARKS_OPTIONS.map((marks) => <option key={marks} value={marks}>{marks} marks</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Answer Sheet PDF <span style={{ color: '#A32D2D' }}>*</span>
          </label>
          <label
            className="flex flex-col items-center justify-center gap-2 w-full rounded-2xl p-8 cursor-pointer transition-all"
            style={{
              border: `2px dashed ${pdfFile ? '#1D9E75' : '#D3D1C7'}`,
              background: pdfFile ? '#E1F5EE' : '#FAFAF8',
            }}
          >
            <input type="file" accept="application/pdf" onChange={onFile} className="hidden" />
            {pdfFile ? (
              <>
                <span style={{ fontSize: 36 }}>📄</span>
                <div className="text-sm font-semibold" style={{ color: '#0F6E56' }}>{pdfFile.name}</div>
                <div className="text-xs text-gray-400">{(pdfFile.size / 1024).toFixed(0)} KB · Click to change</div>
              </>
            ) : (
              <>
                <span style={{ fontSize: 36 }}>📂</span>
                <div className="text-sm font-medium text-gray-600">Click to upload PDF</div>
                <div className="text-xs text-gray-400">Max 15 MB · PDF only</div>
              </>
            )}
          </label>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs p-3 rounded-xl"
            style={{ background: '#FCEBEB', color: '#A32D2D' }}
          >
            {error}
          </motion.p>
        )}

        <button className="btn-primary flex items-center justify-center gap-2 py-3" onClick={handleEvaluate} disabled={loading}>
          {loading ? <><span className="spinner" /><span>AI is evaluating…</span></> : '🤖 Evaluate with AI'}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="card" style={{ background: '#04342C', border: 'none' }}>
          <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>What judges will notice</div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#fff' }}>
            Explainable, offline-first, fairness-aware evaluation
          </div>
          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)' }}>
            Every grading run now exposes confidence, learner signals, intervention steps, and fairness checks so the product feels trustworthy in a school setting.
          </p>
        </div>

        <div className="card flex flex-col gap-3">
          <div className="font-semibold text-sm">Why this flow is stronger now</div>
          {[
            'Automatic scholarship-readiness detection after each evaluation',
            'Fairness checks that separate style cues from concept understanding',
            'Teacher-facing action steps instead of only a final score',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <span style={{ color: '#1D9E75' }}>●</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {loading && (
          <div className="xl:col-span-2">
            <LoadingCard
              title="Reading and grading the answer sheet…"
              description="The offline evaluator is scanning the PDF, checking answer signals, and computing a fair score"
              tags={['Reading PDF', 'Checking Answers', 'Scoring', 'Feedback', 'Scholarship Check']}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ResultView({ result, totalMarks, subject, studentEmail, fileName, onReset }) {
  const percentage = percentFromResult({ ...result, totalMarks })
  const grade = gradeFromPercentage(percentage)
  const tone = confidenceTone[result.confidence] || confidenceTone.medium

  return (
    <motion.div className="fade-in flex flex-col gap-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="rounded-2xl p-4 flex items-center gap-3" style={{ background: '#E1F5EE', border: '1px solid #9FE1CB' }}>
        <span style={{ fontSize: 22 }}>✅</span>
        <div>
          <div className="font-semibold text-sm" style={{ color: '#085041' }}>Result saved and linked to student</div>
          <div className="text-xs" style={{ color: '#0F6E56' }}>
            <strong>{studentEmail}</strong> can now view marks, feedback, and scholarship opportunities.
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-5">
        <div className="card">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
            <div>
              <div className="text-xs text-gray-400 mb-0.5">{subject} · {fileName}</div>
              <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22 }}>Evaluation Result</div>
              {result.impactSummary && (
                <p className="text-sm text-gray-500 mt-2 max-w-xl">{result.impactSummary}</p>
              )}
            </div>
            <div className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ background: gradeBg(percentage) }}>
              <div className="text-4xl font-bold" style={{ color: gradeColor(percentage), fontFamily: "'DM Serif Display',serif" }}>
                {grade}
              </div>
              <div className="text-xs mt-0.5" style={{ color: gradeColor(percentage) }}>Grade</div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Marks', val: `${result.marksObtained}/${totalMarks}`, bg: '#F1EFE8', color: '#2C2C2A' },
              { label: 'Percentage', val: `${percentage}%`, bg: gradeBg(percentage), color: gradeColor(percentage) },
              { label: 'Scholarship', val: result.scholarshipEligible ? 'Eligible' : 'Not yet', bg: result.scholarshipEligible ? '#E1F5EE' : '#F1EFE8', color: result.scholarshipEligible ? '#0F6E56' : '#888780' },
              { label: 'Confidence', val: result.confidence || 'medium', bg: tone.bg, color: tone.color },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl p-4 text-center" style={{ background: item.bg }}>
                <div className="text-xs text-gray-400 mb-1">{item.label}</div>
                <div className="font-bold text-lg leading-tight capitalize" style={{ color: item.color, fontFamily: "'DM Serif Display',serif" }}>
                  {item.val}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Score</span>
              <span>{result.marksObtained}/{totalMarks}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: '#F1EFE8' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: gradeColor(percentage) }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        </div>

        <div className="card flex flex-col gap-3" style={{ background: '#F8F7F3' }}>
          <div className="font-semibold text-sm">Fairness Audit Trail</div>
          {(result.fairnessChecks || []).map((check) => (
            <div key={check.label} className="rounded-xl p-3" style={{ background: '#fff' }}>
              <div className="flex items-center justify-between gap-3 mb-1">
                <div className="text-sm font-medium text-gray-800">{check.label}</div>
                <Tag variant={check.status === 'passed' || check.status === 'clear' ? 'ok' : check.status === 'reviewed' ? 'warn' : 'info'}>
                  {check.status}
                </Tag>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{check.detail}</p>
            </div>
          ))}
          {result.textMetrics && (
            <div className="rounded-xl p-3 text-xs leading-relaxed" style={{ background: '#fff' }}>
              <div className="font-semibold text-gray-700 mb-1">Evidence extracted</div>
              {result.textMetrics.extractableWordCount} words · {result.textMetrics.keywordHits} subject keywords detected
            </div>
          )}
        </div>
      </div>

      {result.breakdown?.length > 0 && (
        <div className="card">
          <div className="font-semibold text-sm mb-4">📋 Question-by-Question Breakdown</div>
          <div className="flex flex-col gap-2.5">
            {result.breakdown.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className="flex items-start gap-3 rounded-xl p-3.5"
                style={{
                  background: item.correct ? '#E1F5EE' : '#FFF8F0',
                  border: `0.5px solid ${item.correct ? '#9FE1CB' : '#EF9F27'}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: item.correct ? '#1D9E75' : '#BA7517', color: '#fff' }}
                >
                  Q{item.qNo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-700 mb-0.5">{item.topic}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{item.feedback}</div>
                </div>
                <div className="font-bold text-sm flex-shrink-0" style={{ color: item.correct ? '#0F6E56' : '#BA7517' }}>
                  {item.marksAwarded}/{item.maxMarks}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-2 gap-5">
        <div className="card" style={{ background: '#F8F7F3' }}>
          <div className="font-semibold text-sm mb-2">🤖 AI Feedback</div>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{result.overallFeedback}</p>
          <div className="grid md:grid-cols-2 gap-3">
            {result.strengths && (
              <div className="rounded-xl p-3" style={{ background: '#E1F5EE' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#085041' }}>Strengths</div>
                <p className="text-xs leading-relaxed" style={{ color: '#0F6E56' }}>{result.strengths}</p>
              </div>
            )}
            {result.improvements && (
              <div className="rounded-xl p-3" style={{ background: '#FAEEDA' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#633806' }}>Improve</div>
                <p className="text-xs leading-relaxed" style={{ color: '#854F0B' }}>{result.improvements}</p>
              </div>
            )}
          </div>
        </div>

        <div className="card flex flex-col gap-3">
          <div className="font-semibold text-sm">Actionable Next Steps</div>
          {(result.nextSteps || []).map((step) => (
            <div key={step} className="flex items-start gap-2 text-sm text-gray-600">
              <span style={{ color: '#1D9E75' }}>●</span>
              <span>{step}</span>
            </div>
          ))}
          {result.learnerSignals && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                ['Mastery', result.learnerSignals.masteryBand],
                ['Coverage', result.learnerSignals.conceptCoverage],
                ['Depth', result.learnerSignals.responseDepth],
                ['Focus', result.learnerSignals.subjectFocus],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl p-3" style={{ background: '#F8F7F3' }}>
                  <div className="text-xs text-gray-400 mb-1">{label}</div>
                  <div className="font-semibold text-sm text-gray-800">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {(result.fairnessSignals?.length > 0 || result.extractedTextPreview) && (
        <div className="grid xl:grid-cols-[0.9fr_1.1fr] gap-5">
          <div className="card">
            <div className="font-semibold text-sm mb-3">Fairness-sensitive language review</div>
            {result.fairnessSignals?.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {result.fairnessSignals.map((signal, index) => (
                  <div key={`${signal.text}-${index}`} className="rounded-xl p-3" style={{ background: '#FAEEDA', border: '0.5px solid #EF9F27' }}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="italic text-xs text-gray-700">"{signal.text}"</span>
                      <Tag variant="warn">{signal.type}</Tag>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: '#854F0B' }}>{signal.note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon="⚖️" title="No strong bias signals detected" description="The extracted answer text did not surface major style or background cues that needed intervention." />
            )}
          </div>
          <div className="card">
            <div className="font-semibold text-sm mb-2">Extracted text preview</div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {result.extractedTextPreview || 'Very limited text could be extracted from the PDF preview.'}
            </p>
          </div>
        </div>
      )}

      <button onClick={onReset} className="btn-secondary text-center">
        ＋ Grade Another Student
      </button>
    </motion.div>
  )
}

function HistoryPage({ items, loading }) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const subjects = useMemo(
    () => ['all', ...new Set(items.map((item) => item.subject).filter(Boolean))],
    [items]
  )
  const [subjectFilter, setSubjectFilter] = useState('all')

  const filtered = useMemo(() => (
    items.filter((item) => {
      const percentage = percentFromResult(item)
      const matchesQuery = query
        ? [item.studentEmail, item.subject, item.fileName]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query.toLowerCase()))
        : true
      const matchesStatus = status === 'all'
        ? true
        : status === 'eligible'
          ? item.scholarshipEligible
          : percentage < 60
      const matchesSubject = subjectFilter === 'all' ? true : item.subject === subjectFilter
      return matchesQuery && matchesStatus && matchesSubject
    })
  ), [items, query, status, subjectFilter])

  if (loading) {
    return <LoadingCard title="Loading submitted results…" description="Syncing classroom evaluations" tags={['Results', 'Students', 'History']} />
  }

  return (
    <div className="fade-in flex flex-col gap-4">
      <div className="card flex flex-col gap-3">
        <div className="grid lg:grid-cols-[1fr_auto_auto] gap-3">
          <input
            className="inp"
            placeholder="Search by student email, subject, or file name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {[
              ['all', 'All'],
              ['eligible', 'Scholarship ready'],
              ['support', 'Needs support'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={status === value ? 'btn-primary text-xs px-3 py-2' : 'btn-secondary text-xs px-3 py-2'}
              >
                {label}
              </button>
            ))}
          </div>
          <select className="inp max-w-full lg:w-52" value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject === 'all' ? 'All subjects' : subject}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-gray-400">
          Showing {filtered.length} of {items.length} results.
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <div style={{ fontSize: 44 }} className="mb-3">📭</div>
          <div className="font-semibold text-gray-600 mb-1">No results match these filters</div>
          <div className="text-sm text-gray-400">Try a broader subject or clear the search query.</div>
        </div>
      ) : filtered.map((item, index) => {
        const percentage = percentFromResult(item)
        const supportTier = getSupportTier(percentage)
        return (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="card flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-gray-800">{item.subject}</span>
                <Tag variant={item.scholarshipEligible ? 'ok' : percentage < 60 ? 'warn' : 'info'}>
                  {supportTier}
                </Tag>
              </div>
              <div className="text-xs text-gray-500 mb-1">→ {item.studentEmail}</div>
              <div className="text-xs text-gray-400">{item.fileName} · {formatShortDate(item.createdAt ?? item.savedAt)}</div>
            </div>
            <div className="flex items-center gap-3">
              {item.confidence && (
                <div className="rounded-xl px-3 py-2 text-center" style={{ background: (confidenceTone[item.confidence] || confidenceTone.medium).bg }}>
                  <div className="text-[11px] text-gray-400 mb-0.5">Confidence</div>
                  <div className="text-xs font-semibold capitalize" style={{ color: (confidenceTone[item.confidence] || confidenceTone.medium).color }}>
                    {item.confidence}
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center px-4 py-2 rounded-xl flex-shrink-0" style={{ background: gradeBg(percentage) }}>
                <div className="font-bold text-xl" style={{ color: gradeColor(percentage), fontFamily: "'DM Serif Display',serif" }}>
                  {item.marksObtained}/{item.totalMarks}
                </div>
                <div className="text-xs" style={{ color: gradeColor(percentage) }}>{percentage}%</div>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function ImpactLab({ history, loading }) {
  const summary = useMemo(() => buildTeacherImpactSummary(history), [history])
  const subjectInsights = useMemo(() => buildSubjectInsights(history), [history])
  const outcomeData = useMemo(() => buildOutcomeDistribution(history), [history])
  const interventionList = useMemo(() => buildInterventionList(history), [history])
  const highlights = useMemo(() => buildTeacherHighlights(history), [history])

  if (loading) {
    return <LoadingCard title="Building impact insights…" description="Summarising classroom trends and intervention opportunities" tags={['Impact', 'Subjects', 'Support']} />
  }

  if (!history.length) {
    return (
      <div className="card">
        <EmptyState
          icon="📈"
          title="Impact Lab appears after your first evaluations"
          description="Grade a few answer sheets and this view will turn them into classroom insights, support flags, and scholarship-readiness trends."
        />
      </div>
    )
  }

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Learners Reached', value: summary.studentsReached, bg: '#E1F5EE', color: '#085041' },
          { label: 'Average Score', value: `${summary.averageScore}%`, bg: '#EEF5FF', color: '#185FA5' },
          { label: 'Scholarship Ready', value: summary.eligible, bg: '#FAEEDA', color: '#854F0B' },
          { label: 'Needs Support', value: summary.supportCount, bg: '#FCEBEB', color: '#A32D2D' },
        ].map((item) => (
          <div key={item.label} className="card" style={{ background: item.bg }}>
            <div className="text-xs text-gray-500 mb-2">{item.label}</div>
            <div className="text-4xl font-bold" style={{ color: item.color, fontFamily: "'DM Serif Display',serif" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1.15fr_0.85fr] gap-5">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-sm">Subject Performance Overview</div>
              <div className="text-xs text-gray-400 mt-1">Average scores by subject and number of evaluations</div>
            </div>
          </div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectInsights.slice(0, 8)} margin={{ left: -12, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#888780' }} interval={0} angle={-14} textAnchor="end" height={52} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888780' }} />
                <Tooltip formatter={(value, name) => [name === 'average' ? `${value}%` : value, name === 'average' ? 'Average score' : 'Evaluations']} />
                <Bar dataKey="average" radius={[8, 8, 0, 0]}>
                  {subjectInsights.slice(0, 8).map((entry) => (
                    <Cell key={entry.subject} fill={OUTCOME_COLORS[getSupportTier(entry.average)] || '#1D9E75'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="font-semibold text-sm mb-4">Classroom Support Mix</div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={outcomeData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={92} paddingAngle={4}>
                  {outcomeData.map((entry) => <Cell key={entry.name} fill={OUTCOME_COLORS[entry.name]} />)}
                </Pie>
                <Tooltip formatter={(value) => [`${value} learner results`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {outcomeData.map((entry) => (
              <span key={entry.name} className="tag text-xs" style={{ background: `${OUTCOME_COLORS[entry.name]}18`, color: OUTCOME_COLORS[entry.name] }}>
                {entry.name}: {entry.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[0.95fr_1.05fr] gap-5">
        <div className="card flex flex-col gap-3">
          <div className="font-semibold text-sm">Judge-ready impact highlights</div>
          {highlights.map((item) => (
            <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
              <span style={{ color: '#1D9E75' }}>●</span>
              <span>{item}</span>
            </div>
          ))}
          <div className="rounded-2xl p-4 mt-2" style={{ background: '#04342C' }}>
            <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Fairness system promise</div>
            <div className="text-sm leading-relaxed" style={{ color: '#fff' }}>
              Scores are generated offline, scholarship matches ignore identity signals, and classroom insights help teachers act before inequality widens.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="font-semibold text-sm mb-3">Intervention priority queue</div>
          <div className="flex flex-col gap-3">
            {interventionList.map((item) => (
              <div key={item.id} className="rounded-xl p-3" style={{ background: '#F8F7F3' }}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1.5">
                  <div className="font-medium text-sm text-gray-800">{item.studentEmail}</div>
                  <Tag variant={item.percentage < 50 ? 'err' : item.percentage < 60 ? 'warn' : 'ok'}>
                    {item.subject} · {item.percentage}%
                  </Tag>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function TeacherProfile({ user, history, summary }) {
  const topSubject = useMemo(() => buildSubjectInsights(history)[0], [history])
  const scholarshipRate = summary.evaluations ? Math.round((summary.eligible / summary.evaluations) * 100) : 0

  return (
    <div className="fade-in flex flex-col gap-5">
      <div className="card flex flex-col md:flex-row md:items-center gap-4">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0" style={{ background: '#0F6E56', color: '#fff' }}>
          {(user?.displayName || user?.email || 'T')[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-lg">{user?.displayName || 'Teacher'}</div>
          <div className="text-sm text-gray-400 mb-2">{user?.email}</div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#E1F5EE', color: '#0F6E56' }}>
            🏫 Teacher
          </span>
        </div>
        <div className="rounded-2xl p-4" style={{ background: '#F8F7F3' }}>
          <div className="text-xs text-gray-400 mb-1">Scholarship-ready rate</div>
          <div className="text-3xl font-bold" style={{ color: '#0F6E56', fontFamily: "'DM Serif Display',serif" }}>
            {scholarshipRate}%
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Sheets Graded', value: summary.evaluations, bg: '#E1F5EE', color: '#085041' },
          { label: 'Students Reached', value: summary.studentsReached, bg: '#E6F1FB', color: '#0C447C' },
          { label: 'Avg Score', value: `${summary.averageScore}%`, bg: '#FAEEDA', color: '#633806' },
          { label: 'Support Alerts', value: summary.supportCount, bg: '#FCEBEB', color: '#A32D2D' },
        ].map((item) => (
          <div key={item.label} className="card text-center" style={{ background: item.bg }}>
            <div className="text-xs text-gray-500 mb-1">{item.label}</div>
            <div className="text-3xl font-bold" style={{ color: item.color, fontFamily: "'DM Serif Display',serif" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-[0.95fr_1.05fr] gap-5">
        <div className="card">
          <div className="font-semibold text-sm mb-2">Teaching footprint</div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your evaluations are producing both score outcomes and intervention signals. This makes the platform useful not only for grading, but for acting on equity gaps before they grow.
          </p>
        </div>
        <div className="card" style={{ background: '#04342C', border: 'none' }}>
          <div className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.45)' }}>Current strongest subject lane</div>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#fff' }}>
            {topSubject ? `${topSubject.subject} · ${topSubject.average}% avg` : 'Waiting for subject data'}
          </div>
          <p className="text-sm mt-2" style={{ color: '#5DCAA5' }}>
            {topSubject ? `${topSubject.count} evaluations processed in this subject.` : 'Grade a few papers to unlock subject-level trends.'}
          </p>
        </div>
      </div>
    </div>
  )
}
