export function percentFromResult(result) {
  if (typeof result?.percentage === 'number') return result.percentage
  const obtained = Number(result?.marksObtained ?? 0)
  const total = Number(result?.totalMarks ?? 0)
  if (!total) return 0
  return Math.round((obtained / total) * 100)
}

export function gradeFromPercentage(percentage) {
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B'
  if (percentage >= 60) return 'C'
  if (percentage >= 50) return 'D'
  return 'F'
}

export function formatShortDate(value) {
  if (!value) return 'Recent'
  const date = value?.toDate?.() ?? new Date(value)
  if (Number.isNaN(date.getTime())) return 'Recent'
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function getSupportTier(percentage) {
  if (percentage >= 80) return 'Accelerate'
  if (percentage >= 60) return 'On Track'
  return 'Needs Support'
}

export function buildTeacherImpactSummary(history) {
  const scores = history.map(percentFromResult)
  const eligible = history.filter((item) => item.scholarshipEligible).length
  const supportCount = scores.filter((score) => score < 60).length
  const studentsReached = new Set(history.map((item) => item.studentEmail).filter(Boolean)).size

  return {
    evaluations: history.length,
    studentsReached,
    eligible,
    supportCount,
    averageScore: scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0,
    fairnessCoverage: history.length ? Math.round((eligible / history.length) * 100) : 0,
  }
}

export function buildSubjectInsights(history) {
  const grouped = history.reduce((acc, item) => {
    const subject = item.subject || 'Other'
    const score = percentFromResult(item)
    if (!acc[subject]) {
      acc[subject] = { subject, count: 0, total: 0, eligible: 0 }
    }
    acc[subject].count += 1
    acc[subject].total += score
    acc[subject].eligible += item.scholarshipEligible ? 1 : 0
    return acc
  }, {})

  return Object.values(grouped)
    .map((entry) => ({
      subject: entry.subject,
      count: entry.count,
      average: Math.round(entry.total / entry.count),
      eligible: entry.eligible,
    }))
    .sort((a, b) => b.count - a.count)
}

export function buildOutcomeDistribution(history) {
  const totals = {
    Accelerate: 0,
    'On Track': 0,
    'Needs Support': 0,
  }

  history.forEach((item) => {
    totals[getSupportTier(percentFromResult(item))] += 1
  })

  return Object.entries(totals).map(([name, value]) => ({ name, value }))
}

export function buildInterventionList(history) {
  return history
    .map((item) => {
      const percentage = percentFromResult(item)
      return {
        id: item.id ?? `${item.studentEmail}-${item.subject}-${item.savedAt ?? ''}`,
        studentEmail: item.studentEmail || 'Unknown learner',
        subject: item.subject || 'Other',
        percentage,
        recommendation:
          percentage < 50
            ? 'Schedule targeted reteaching and a teacher follow-up.'
            : percentage < 60
              ? 'Provide practice prompts and feedback before the next assessment.'
              : 'Encourage enrichment work and scholarship preparation.',
      }
    })
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 5)
}

export function buildTeacherHighlights(history) {
  const summary = buildTeacherImpactSummary(history)
  return [
    `${summary.studentsReached} learners reached through low-friction digital evaluation.`,
    `${summary.eligible} results already unlocked scholarship discovery opportunities.`,
    `${summary.supportCount} learners are flagged for targeted support before they fall behind.`,
  ]
}

export function buildStudentTrendData(results) {
  return [...results]
    .slice()
    .reverse()
    .slice(-6)
    .map((result, index) => ({
      label: result.subject ? `${result.subject.split(' ')[0]} ${index + 1}` : `Exam ${index + 1}`,
      score: percentFromResult(result),
      fullLabel: result.subject || `Exam ${index + 1}`,
      date: formatShortDate(result.createdAt ?? result.savedAt),
    }))
}

export function buildStudentRoadmap(results) {
  if (!results.length) {
    return [
      { title: 'Get your first result', detail: 'Once a teacher uploads an evaluated answer sheet, your growth map will appear here.' },
      { title: 'Unlock scholarship readiness', detail: 'Scoring 60% or higher on any result opens scholarship matching.' },
      { title: 'Track upward momentum', detail: 'Keep checking strengths and improvement notes after each evaluation.' },
    ]
  }

  const scores = results.map(percentFromResult)
  const average = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  const best = Math.max(...scores)
  const eligible = results.filter((item) => item.scholarshipEligible).length

  return [
    {
      title: average >= 75 ? 'Maintain strong momentum' : 'Lift your average by one grade band',
      detail: average >= 75
        ? 'You are already performing well. Focus on turning solid answers into scholarship-level evidence and detail.'
        : 'Use teacher feedback to improve explanation depth and examples in your next submission.',
    },
    {
      title: eligible > 0 ? 'Turn eligibility into applications' : 'Reach scholarship-ready status',
      detail: eligible > 0
        ? `You already have ${eligible} scholarship-ready result${eligible > 1 ? 's' : ''}. Build skills and achievements around your strongest subject.`
        : 'Crossing 60% on your next result will unlock scholarship recommendations tailored to your academic profile.',
    },
    {
      title: best >= 85 ? 'Document your standout strengths' : 'Build a stronger evidence portfolio',
      detail: best >= 85
        ? 'Capture projects, competitions, or volunteer work that support your top-performing subjects.'
        : 'Pair academic progress with practical skills, community service, or project work to widen scholarship fit.',
    },
  ]
}
