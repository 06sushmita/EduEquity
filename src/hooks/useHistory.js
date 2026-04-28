import { useCallback, useEffect, useState } from 'react'
import {
  getUserEvaluations,
  getUserScholarships,
  saveEvaluation,
  saveScholarship,
} from '../services/firebase'

/**
 * Manages a user's evaluation and scholarship history.
 * Falls back to local state when Firebase is not configured.
 */
export function useHistory(userId) {
  const [evals,   setEvals]   = useState([])
  const [schols,  setSchols]  = useState([])
  const [loading, setLoading] = useState(false)

  const fetchHistory = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const [e, s] = await Promise.all([
        getUserEvaluations(userId),
        getUserScholarships(userId),
      ])
      setEvals(e)
      setSchols(s)
    } catch {
      // Firebase not configured – silent fallback to local state
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const addEval = useCallback(async (data) => {
    const entry = { ...data, createdAt: new Date() }
    setEvals(prev => [entry, ...prev])
    if (userId) {
      try { await saveEvaluation(userId, data) } catch { /* offline */ }
    }
  }, [userId])

  const addSchol = useCallback(async (data) => {
    const entry = { ...data, createdAt: new Date() }
    setSchols(prev => [entry, ...prev])
    if (userId) {
      try { await saveScholarship(userId, data) } catch { /* offline */ }
    }
  }, [userId])

  return { evals, schols, loading, addEval, addSchol, refresh: fetchHistory }
}
