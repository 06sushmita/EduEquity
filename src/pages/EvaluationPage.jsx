import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { detectBias } from '../services/gemini'
import { saveResult } from '../services/firebase'
import { ScoreBar, Tag, StatCard, LoadingCard } from '../components/ui'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const SAMPLES = [
  {
    label: 'Student A — Formal',
    text: `The mitochondria, often referred to as the powerhouse of the cell, is an organelle responsible for generating adenosine triphosphate (ATP) through oxidative phosphorylation. This double-membraned structure houses its own circular DNA and ribosomes, suggesting an endosymbiotic evolutionary origin. The electron transport chain situated along the inner mitochondrial membrane facilitates electron transfer from NADH and FADH2 to molecular oxygen, establishing a proton gradient that drives ATP synthase. This metabolic pathway is central to aerobic cellular respiration.`,
  },
  {
    label: 'Student B — Informal',
    text: `ok so mitochondria is basically where the cell makes its energy right? like it takes in the stuff from food and turns it into ATP which the cell can actually use. its got two layers and its own DNA which is kinda wild. the energy making happens through this electron chain thing where electrons get passed around and that creates power basically. without it aerobic respiration wouldnt work at all.`,
  },
  {
    label: 'Student C — ESL learner',
    text: `The mitochondria is important organelle in cell. It make energy for cell to use, called ATP. Inside mitochondria have special membrane where electron transport happen. This process make lot of ATP for cell to do work. The mitochondria have its own DNA, is different from other organelle. For cell to live and work properly, mitochondria must function well.`,
  },
]

const BIAS_COLORS = { Low: '#0F6E56', Moderate: '#BA7517', High: '#A32D2D' }
const BIAS_BG     = { Low: '#E1F5EE', Moderate: '#FAEEDA', High: '#FCEBEB' }

export function EvaluationPage({ user, studentEmail, onSave }) {
  const [text, setText]       = useState('')
  const [sample, setSample]   = useState(-1)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)
  const [error, setError]     = useState('')

  const loadSample = (i) => {
    setSample(i)
    setText(SAMPLES[i].text)
    setResult(null)
    setError('')
  }

  const analyze = async () => {
    if (!text.trim()) return
    setLoading(true); setResult(null); setError('')
    try {
      const data = await detectBias(text)
      setResult(data)
      const entry = {
        teacherId:     user?.uid ?? '',
        teacherName:   user?.displayName || user?.email || '',
        teacherEmail:  user?.email || '',
        studentEmail:  (studentEmail ?? '').toLowerCase().trim(),
        type:          'evaluation',
        excerpt:       text.substring(0, 80) + '\u2026',
        originalScore: data.originalScore,
        adjustedScore: data.adjustedScore,
        biasLevel:     data.biasLevel,
        savedAt:       new Date().toISOString(),
      }
      await saveResult(entry)
      await onSave(entry)
    } catch (e) {
      setError('Analysis failed: ' + (e.message || 'Please try another answer sample.'))
    } finally {
      setLoading(false)
    }
  }

  const chartData = result ? [
    { name: 'Content Accuracy', score: result.contentAccuracy, fill: '#378ADD' },
    { name: 'Original Score',   score: result.originalScore,   fill: '#888780' },
    { name: 'Adjusted Score',   score: result.adjustedScore,   fill: '#1D9E75' },
  ] : []

  return (
    <div className="fade-in flex flex-col gap-5">
      <div>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24 }} className="mb-1">
          Unbiased Student Evaluation
        </h2>
        <p className="text-sm text-gray-400">
          Paste a student answer. The offline evaluator checks writing-style, vocabulary, tone,
          and fluency bias, then produces a fair score based only on content accuracy.
        </p>
      </div>

      {/* Input card */}
      <div className="card flex flex-col gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-2">Load a sample answer:</p>
          <div className="flex gap-2 flex-wrap">
            {SAMPLES.map((s, i) => (
              <button key={i} onClick={() => loadSample(i)}
                className={sample === i ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: 12, padding: '5px 12px' }}>
                {s.label.split('—')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="inp"
          style={{ height: 150, resize: 'vertical', lineHeight: 1.65 }}
          placeholder="Paste or type a student answer here…"
          value={text}
          onChange={e => { setText(e.target.value); setSample(-1); setResult(null) }}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{text.length} characters</span>
          <button className="btn-primary flex items-center gap-2"
            onClick={analyze} disabled={loading || !text.trim()}>
            {loading
              ? <><span className="spinner" /><span>Analyzing…</span></>
              : '🔍 Analyze Bias'}
          </button>
        </div>
      </div>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <LoadingCard
            title="Running bias analysis…"
            description="Checking writing style, vocabulary complexity, tone & fluency independently from content"
            tags={['Style', 'Vocabulary', 'Tone', 'Fluency', 'Background']}
          />
        )}
      </AnimatePresence>

      {/* Error */}
      {error && (
        <div className="card text-sm" style={{ background: '#FCEBEB', color: '#A32D2D' }}>{error}</div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4">

            {/* Score cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card text-center" style={{ background: '#FFF8F0' }}>
                <div className="text-xs text-gray-400 mb-1">Original Score</div>
                <div className="text-4xl font-bold" style={{ color: '#444441', fontFamily: "'DM Serif Display',serif" }}>
                  {result.originalScore}
                </div>
                <div className="text-xs text-gray-400">/ 100</div>
              </div>
              <div className="card text-center" style={{ background: '#E1F5EE' }}>
                <div className="text-xs mb-1" style={{ color: '#0F6E56' }}>Adjusted Score</div>
                <div className="text-4xl font-bold" style={{ color: '#085041', fontFamily: "'DM Serif Display',serif" }}>
                  {result.adjustedScore}
                </div>
                <div className="text-xs" style={{ color: '#1D9E75' }}>/ 100</div>
              </div>
              <div className="card text-center"
                style={{ background: BIAS_BG[result.biasLevel] || '#F1EFE8' }}>
                <div className="text-xs text-gray-400 mb-1">Bias Level</div>
                <div className="text-2xl font-bold"
                  style={{ color: BIAS_COLORS[result.biasLevel] || '#444441', fontFamily: "'DM Serif Display',serif" }}>
                  {result.biasLevel}
                </div>
                <div className="text-xs text-gray-400">detected</div>
              </div>
            </div>

            {/* Bar chart */}
            <div className="card">
              <div className="font-semibold text-sm mb-4">Score Comparison</div>
              <div className="mb-4">
                <ScoreBar label="Content Accuracy"   score={result.contentAccuracy} color="#378ADD" />
                <ScoreBar label="Original Score"     score={result.originalScore}   color="#888780" />
                <ScoreBar label="Bias-Adjusted Score" score={result.adjustedScore}  color="#1D9E75" />
              </div>
              <div style={{ height: 160 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1EFE8" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888780' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888780' }} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: '0.5px solid #E0DED6' }}
                      formatter={v => [`${v}/100`]} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500">Score change:</span>
                <span className="text-sm font-semibold"
                  style={{ color: result.adjustedScore > result.originalScore ? '#0F6E56' : result.adjustedScore < result.originalScore ? '#A32D2D' : '#888780' }}>
                  {result.adjustedScore > result.originalScore ? '+' : ''}{result.adjustedScore - result.originalScore} points
                </span>
              </div>
            </div>

            {/* Bias indicators */}
            {result.biasIndicators?.length > 0 && (
              <div className="card">
                <div className="font-semibold text-sm mb-3">⚠ Bias Indicators Detected</div>
                <div className="flex flex-col gap-2.5">
                  {result.biasIndicators.map((bi, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-xl p-3" style={{ background: '#FAEEDA', border: '0.5px solid #EF9F27' }}>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="italic text-xs text-gray-700 flex-1">"{bi.text}"</span>
                        <Tag variant="warn">{bi.type}</Tag>
                      </div>
                      <p className="text-xs" style={{ color: '#854F0B' }}>{bi.note}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Explanation */}
            <div className="card" style={{ background: '#F8F7F3' }}>
              <div className="font-semibold text-sm mb-2">🤖 AI Explanation</div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">{result.explanation}</p>
              <div className="rounded-xl p-3" style={{ background: '#E1F5EE' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#085041' }}>✅ Fair Evaluation</div>
                <p className="text-xs leading-relaxed" style={{ color: '#0F6E56' }}>{result.fairEvaluation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
