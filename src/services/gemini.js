const GRADE_THRESHOLDS = [
  { min: 90, grade: 'A+' },
  { min: 80, grade: 'A' },
  { min: 70, grade: 'B' },
  { min: 60, grade: 'C' },
  { min: 50, grade: 'D' },
  { min: 0, grade: 'F' },
]

const SUBJECT_PROFILES = {
  Mathematics: {
    keywords: ['equation', 'formula', 'theorem', 'algebra', 'geometry', 'graph', 'value', 'proof', 'calculate', 'solve'],
    topics: ['Concept understanding', 'Method and setup', 'Working steps', 'Final answer'],
  },
  Physics: {
    keywords: ['force', 'motion', 'energy', 'velocity', 'acceleration', 'mass', 'current', 'voltage', 'wave', 'experiment'],
    topics: ['Core concept', 'Scientific principle', 'Application', 'Conclusion'],
  },
  Chemistry: {
    keywords: ['atom', 'molecule', 'reaction', 'bond', 'acid', 'base', 'compound', 'equation', 'electron', 'solution'],
    topics: ['Chemical concept', 'Reaction logic', 'Explanation', 'Final response'],
  },
  Biology: {
    keywords: ['cell', 'organism', 'photosynthesis', 'respiration', 'gene', 'tissue', 'ecosystem', 'enzyme', 'mitochondria', 'membrane'],
    topics: ['Biological concept', 'Process explanation', 'Key evidence', 'Summary'],
  },
  English: {
    keywords: ['theme', 'character', 'evidence', 'metaphor', 'tone', 'structure', 'author', 'analysis', 'argument', 'context'],
    topics: ['Interpretation', 'Evidence', 'Analysis', 'Written response'],
  },
  History: {
    keywords: ['cause', 'effect', 'revolution', 'empire', 'reform', 'policy', 'evidence', 'timeline', 'conflict', 'society'],
    topics: ['Historical context', 'Cause and effect', 'Evidence', 'Judgement'],
  },
  Geography: {
    keywords: ['climate', 'population', 'resource', 'erosion', 'migration', 'region', 'agriculture', 'environment', 'map', 'development'],
    topics: ['Geographic idea', 'Data or example', 'Analysis', 'Conclusion'],
  },
  Economics: {
    keywords: ['demand', 'supply', 'market', 'inflation', 'cost', 'revenue', 'policy', 'growth', 'trade', 'elasticity'],
    topics: ['Economic concept', 'Reasoning', 'Applied example', 'Conclusion'],
  },
  'Computer Science': {
    keywords: ['algorithm', 'data', 'function', 'loop', 'variable', 'memory', 'network', 'database', 'logic', 'code'],
    topics: ['Concept', 'Logic', 'Applied reasoning', 'Final answer'],
  },
  'Political Science': {
    keywords: ['democracy', 'constitution', 'rights', 'state', 'policy', 'representation', 'governance', 'law', 'citizen', 'institution'],
    topics: ['Political concept', 'Evidence', 'Analysis', 'Conclusion'],
  },
  Other: {
    keywords: ['concept', 'example', 'analysis', 'reason', 'evidence', 'explain', 'process', 'result', 'discussion', 'summary'],
    topics: ['Understanding', 'Evidence', 'Reasoning', 'Conclusion'],
  },
}

const GENERAL_ACADEMIC_TERMS = [
  'because', 'therefore', 'however', 'process', 'explain', 'example', 'evidence', 'result',
  'function', 'system', 'concept', 'reason', 'effect', 'analysis', 'method', 'conclusion',
]

const INFORMAL_PATTERNS = [
  /\bok\b/gi,
  /\bbasically\b/gi,
  /\bkinda\b/gi,
  /\blike\b/gi,
  /\bstuff\b/gi,
  /\bthing\b/gi,
  /\bgonna\b/gi,
  /\bgotta\b/gi,
  /\bright\?\b/gi,
]

const BACKGROUND_PATTERNS = [
  /\bmy family\b/gi,
  /\bmy village\b/gi,
  /\bmy background\b/gi,
  /\bmother tongue\b/gi,
  /\bfirst[- ]generation\b/gi,
  /\benglish is not\b/gi,
  /\bat home we\b/gi,
]

const SCHOLARSHIP_CATALOG = [
  {
    name: 'Merit Forward Scholarship',
    provider: 'EduEquity Foundation',
    amount: '$4,000 / year',
    type: 'Merit',
    eligibility: 'Strong academic record with consistent performance above GPA 3.4.',
    applyLink: 'https://example.org/merit-forward',
    minGpa: 3.4,
    maxIncome: null,
    skillTags: ['analysis', 'leadership', 'communication', 'mathematics'],
    achievementTags: ['finalist', 'winner', 'rank', 'award', 'published'],
    subjectTags: [],
  },
  {
    name: 'STEM Access Grant',
    provider: 'Future Labs Trust',
    amount: '$3,500 / year',
    type: 'STEM',
    eligibility: 'Open to students in math, science, engineering, or computing pathways.',
    applyLink: 'https://example.org/stem-access',
    minGpa: 3.1,
    maxIncome: 45000,
    skillTags: ['mathematics', 'robotics', 'computer science', 'physics', 'chemistry', 'biology', 'coding', 'research'],
    achievementTags: ['olympiad', 'science', 'project', 'paper', 'lab'],
    subjectTags: ['mathematics', 'physics', 'chemistry', 'biology', 'computer science'],
  },
  {
    name: 'Need-Based Success Award',
    provider: 'Open Door Scholars',
    amount: '$5,000 / year',
    type: 'Need-Based',
    eligibility: 'For high-potential students from lower-income households.',
    applyLink: 'https://example.org/need-based-success',
    minGpa: 3.0,
    maxIncome: 30000,
    skillTags: ['community', 'service', 'leadership', 'resilience'],
    achievementTags: ['volunteer', 'worker', 'responsibility', 'mentor'],
    subjectTags: [],
  },
  {
    name: 'Research Talent Bursary',
    provider: 'Young Innovators Network',
    amount: '$2,500 / year',
    type: 'Research',
    eligibility: 'Best suited to students with research, investigation, or publication experience.',
    applyLink: 'https://example.org/research-talent',
    minGpa: 3.5,
    maxIncome: null,
    skillTags: ['research', 'machine learning', 'data', 'biology', 'computer science'],
    achievementTags: ['published', 'journal', 'paper', 'investigation', 'prototype'],
    subjectTags: ['biology', 'chemistry', 'physics', 'computer science'],
  },
  {
    name: 'Community Impact Scholarship',
    provider: 'Civic Bridge Alliance',
    amount: '$2,000 / year',
    type: 'Community',
    eligibility: 'Rewards sustained volunteering, mentoring, or service to others.',
    applyLink: 'https://example.org/community-impact',
    minGpa: 2.8,
    maxIncome: null,
    skillTags: ['community', 'volunteering', 'mentoring', 'service', 'leadership'],
    achievementTags: ['volunteer', 'hours', 'campaign', 'community'],
    subjectTags: [],
  },
  {
    name: 'Skill Builder Scholarship',
    provider: 'LaunchPath Education',
    amount: '$1,800 / year',
    type: 'Skill-Based',
    eligibility: 'For students demonstrating practical skills, initiative, and growth potential.',
    applyLink: 'https://example.org/skill-builder',
    minGpa: 2.9,
    maxIncome: null,
    skillTags: ['robotics', 'coding', 'design', 'communication', 'problem solving', 'machine learning'],
    achievementTags: ['contributor', 'project', 'portfolio', 'competition'],
    subjectTags: [],
  },
]

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function round(value) {
  return Math.round(value)
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function safeDecodeBase64(base64) {
  if (!base64) return ''

  try {
    if (typeof atob === 'function') return atob(base64)
  } catch {}

  return ''
}

function normalizeText(text) {
  return (text || '')
    .replace(/\s+/g, ' ')
    .trim()
}

function printablePdfText(binary) {
  return normalizeText(
    binary
      .replace(/\\[nrbtf()]/g, ' ')
      .replace(/[^\x20-\x7E]+/g, ' ')
  )
}

function extractPdfText(pdfBase64) {
  const decoded = safeDecodeBase64(pdfBase64)
  if (!decoded) return ''

  const readableChunks = printablePdfText(decoded).match(/[A-Za-z][A-Za-z0-9,;:'"()/%\- ]{2,}/g) || []
  return normalizeText(readableChunks.join(' '))
}

function words(text) {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || [])
}

function sentences(text) {
  return text
    .split(/[.!?]+/)
    .map(part => part.trim())
    .filter(Boolean)
}

function countKeywordHits(text, keywords) {
  const lower = text.toLowerCase()
  return keywords.filter(keyword => lower.includes(keyword.toLowerCase())).length
}

function getGrade(percentage) {
  return GRADE_THRESHOLDS.find(({ min }) => percentage >= min)?.grade || 'F'
}

function getSubjectProfile(subject) {
  return SUBJECT_PROFILES[subject] || SUBJECT_PROFILES.Other
}

function splitMarks(totalMarks, parts) {
  const base = Math.floor(totalMarks / parts)
  let remainder = totalMarks % parts

  return Array.from({ length: parts }, () => {
    const value = base + (remainder > 0 ? 1 : 0)
    remainder -= remainder > 0 ? 1 : 0
    return value
  })
}

function scoreFromTextSignals(text, subject) {
  const profile = getSubjectProfile(subject)
  const wordList = words(text)
  const sentenceList = sentences(text)
  const wordCount = wordList.length
  const keywordHits = countKeywordHits(text, profile.keywords)
  const academicHits = countKeywordHits(text, GENERAL_ACADEMIC_TERMS)
  const structureHits = (text.toLowerCase().match(/\b(q\d+|question|answer|because|therefore|conclusion|finally)\b/g) || []).length
  const averageSentenceLength = sentenceList.length ? wordCount / sentenceList.length : 0

  if (wordCount < 12) {
    return {
      score: 52,
      confidence: 'low',
      keywordHits,
      wordCount,
    }
  }

  const keywordScore = profile.keywords.length ? (keywordHits / profile.keywords.length) * 45 : 18
  const academicScore = Math.min(academicHits, 6) * 4
  const lengthScore = clamp((wordCount / 180) * 18, 4, 18)
  const structureScore = clamp(structureHits * 2 + (averageSentenceLength >= 8 ? 6 : 2), 2, 14)

  return {
    score: round(clamp(28 + keywordScore + academicScore + lengthScore + structureScore, 35, 95)),
    confidence: wordCount >= 120 ? 'high' : wordCount >= 40 ? 'medium' : 'low',
    keywordHits,
    wordCount,
  }
}

function topicFeedback(ratio) {
  if (ratio >= 0.85) return 'Clear conceptual understanding with only minor room for refinement.'
  if (ratio >= 0.65) return 'The main idea is present, but the explanation could be more complete.'
  if (ratio >= 0.45) return 'Partial understanding is visible, though key supporting details are missing.'
  return 'The response needs stronger content accuracy and more direct evidence.'
}

function buildBreakdown(totalMarks, percentage, subject, keywordHits, textAvailable) {
  const topics = getSubjectProfile(subject).topics
  const maxMarksPerTopic = splitMarks(totalMarks, topics.length)
  const baseRatio = percentage / 100

  return topics.map((topic, index) => {
    const weightShift = index === 0 ? 0.06 : index === topics.length - 1 ? -0.04 : 0
    const ratio = clamp(baseRatio + weightShift + (keywordHits >= 4 ? 0.03 : 0), 0.2, 0.98)
    const maxMarks = maxMarksPerTopic[index]
    const marksAwarded = clamp(round(maxMarks * ratio), 0, maxMarks)

    return {
      qNo: index + 1,
      topic,
      marksAwarded,
      maxMarks,
      correct: marksAwarded >= Math.ceil(maxMarks * 0.6),
      feedback: textAvailable
        ? topicFeedback(marksAwarded / maxMarks)
        : 'Limited extractable PDF text was available, so this estimate is based on structure and visible keywords.',
    }
  })
}

function buildEvaluationNarrative({ percentage, subject, textAvailable, confidence }) {
  const strengths =
    percentage >= 75
      ? `The answer shows a solid grasp of ${subject} concepts and stays focused on the main topic.`
      : percentage >= 60
        ? `The response captures several core ${subject} ideas and shows developing understanding.`
        : `The response shows some awareness of ${subject}, but the explanation needs more depth and precision.`

  const improvements =
    percentage >= 75
      ? 'To improve further, add more explicit supporting detail and tighter justification for each point.'
      : percentage >= 60
        ? 'The next step is to strengthen accuracy with clearer examples, definitions, or step-by-step reasoning.'
        : 'The biggest gain would come from more direct concept coverage and fuller supporting explanation.'

  const confidenceNote = textAvailable
    ? confidence === 'medium'
      ? 'The offline evaluator found enough extractable text to score content signals with moderate confidence.'
      : 'The offline evaluator found limited extractable text, so this score leans more on visible keywords and structure.'
    : 'The PDF exposed very little readable text, so the score is a conservative offline estimate rather than a full semantic read.'

  return {
    strengths,
    improvements,
    overallFeedback: `${strengths} ${improvements} ${confidenceNote}`,
  }
}

function buildFairnessChecks(indicators, confidence, textAvailable) {
  return [
    {
      label: 'Identity-blind scoring',
      status: 'passed',
      detail: 'The evaluator ignores student identity, institution, and background fields during scoring.',
    },
    {
      label: 'Style-bias review',
      status: indicators.length > 0 ? 'reviewed' : 'clear',
      detail: indicators.length > 0
        ? `Potential style or background cues were detected and separated from concept scoring (${indicators.length} signal${indicators.length > 1 ? 's' : ''}).`
        : 'No strong bias-triggering language patterns were detected in the extracted answer text.',
    },
    {
      label: 'Evidence confidence',
      status: confidence,
      detail: textAvailable
        ? `Scoring confidence is ${confidence} based on extractable answer content and structure.`
        : 'The PDF exposed limited readable text, so the system used a conservative estimate.',
    },
  ]
}

function buildLearnerSignals({ percentage, keywordHits, wordCount, subject }) {
  return {
    masteryBand: percentage >= 80 ? 'Strong' : percentage >= 60 ? 'Developing' : 'Emerging',
    conceptCoverage: keywordHits >= 5 ? 'Broad' : keywordHits >= 3 ? 'Moderate' : 'Limited',
    responseDepth: wordCount >= 120 ? 'Detailed' : wordCount >= 45 ? 'Adequate' : 'Brief',
    subjectFocus: subject,
  }
}

function buildNextSteps({ percentage, subject, textAvailable }) {
  if (percentage >= 80) {
    return [
      `Push ${subject} answers further with sharper evidence and clearer justification.`,
      'Convert strong academic performance into projects, competitions, or leadership artifacts.',
      'Use this result as a benchmark for scholarship or recognition opportunities.',
    ]
  }

  if (percentage >= 60) {
    return [
      `Strengthen ${subject} explanations with more explicit examples or worked steps.`,
      'Revise weak topics first, then practice timed responses to improve structure.',
      'Aim for one stronger assessment to move from eligible to highly competitive.',
    ]
  }

  return [
    `Rebuild the core ${subject} concepts before the next assessment attempt.`,
    'Practice using short answer frameworks so each response includes concept, evidence, and conclusion.',
    textAvailable
      ? 'Use teacher feedback to target the lowest-scoring topics from this result first.'
      : 'Try a clearer digital PDF next time so the evaluator can read more of the answer content.',
  ]
}

function buildImpactSummary({ percentage, scholarshipEligible, subject }) {
  if (scholarshipEligible) {
    return `This ${subject} result is strong enough to open scholarship discovery while still showing targeted areas to improve.`
  }

  if (percentage >= 50) {
    return `This ${subject} result shows promising progress and is close to scholarship-ready with focused support.`
  }

  return `This ${subject} result highlights a support opportunity before the learner is ready for scholarship pathways.`
}

function buildBiasIndicators(answerText) {
  const indicators = []
  const lower = answerText.toLowerCase()
  const sentenceList = sentences(answerText)
  const wordList = words(answerText)

  for (const pattern of INFORMAL_PATTERNS) {
    const match = lower.match(pattern)
    if (match?.[0]) {
      indicators.push({
        text: match[0],
        type: 'Tone',
        note: 'An assessor could unfairly read informal phrasing as weaker understanding even when the concept is correct.',
      })
    }
  }

  for (const pattern of BACKGROUND_PATTERNS) {
    const match = lower.match(pattern)
    if (match?.[0]) {
      indicators.push({
        text: match[0],
        type: 'Background',
        note: 'Personal background cues should never influence grading when content accuracy is the real criterion.',
      })
    }
  }

  const shortSentenceCount = sentenceList.filter(sentence => words(sentence).length <= 4).length
  if (shortSentenceCount >= 2) {
    indicators.push({
      text: 'multiple short sentences',
      type: 'Fluency',
      note: 'Short sentence patterns can be mistaken for weak reasoning even when the student understands the topic.',
    })
  }

  if ((answerText.match(/\bi\b/g) || []).length >= 2 || (!/[.!?]/.test(answerText) && wordList.length > 30)) {
    indicators.push({
      text: 'surface-level grammar issues',
      type: 'Style',
      note: 'Surface grammar and punctuation should not reduce marks when the explanation still communicates the concept.',
    })
  }

  return indicators.slice(0, 5)
}

function contentAccuracyScore(answerText) {
  const wordCount = words(answerText).length
  const academicHits = countKeywordHits(answerText, GENERAL_ACADEMIC_TERMS)
  const scienceHits = countKeywordHits(answerText, SUBJECT_PROFILES.Biology.keywords)
  const logicHits = countKeywordHits(answerText, ['because', 'therefore', 'which', 'through', 'process', 'function'])
  const detailScore = clamp((wordCount / 140) * 26, 8, 26)

  return round(clamp(34 + academicHits * 4 + scienceHits * 3 + logicHits * 3 + detailScore, 35, 96))
}

function normalizeSkillTokens({ skills = '', achievements = '', subject = '' }) {
  return normalizeText(`${skills} ${achievements} ${subject}`.toLowerCase())
}

function scholarshipMatchScore(scholarship, profile) {
  const textBlob = normalizeSkillTokens(profile)
  const gpa = toNumber(profile.gpa, 0)
  const income = profile.income === null || profile.income === undefined || profile.income === ''
    ? null
    : toNumber(profile.income, null)

  const skillHits = scholarship.skillTags.filter(tag => textBlob.includes(tag)).length
  const achievementHits = scholarship.achievementTags.filter(tag => textBlob.includes(tag)).length
  const subjectHits = scholarship.subjectTags.filter(tag => textBlob.includes(tag)).length

  const gpaScore =
    gpa >= scholarship.minGpa
      ? 34
      : clamp(34 - (scholarship.minGpa - gpa) * 24, 6, 30)

  const needScore =
    scholarship.maxIncome === null
      ? 10
      : income === null
        ? 8
        : income <= scholarship.maxIncome
          ? 24
          : clamp(24 - ((income - scholarship.maxIncome) / 10000) * 6, 4, 20)

  const skillScore = Math.min(skillHits, 3) * 10
  const achievementScore = Math.min(achievementHits, 2) * 8
  const subjectScore = Math.min(subjectHits, 2) * 7

  const matchScore = round(clamp(gpaScore + needScore + skillScore + achievementScore + subjectScore, 42, 98))

  const matchedCriteria = []
  if (gpa >= scholarship.minGpa) matchedCriteria.push(`GPA ${gpa.toFixed(2)} meets merit bar`)
  if (scholarship.maxIncome !== null && income !== null && income <= scholarship.maxIncome) matchedCriteria.push('income aligns with need criteria')
  if (skillHits > 0) matchedCriteria.push('skills align with scholarship focus')
  if (achievementHits > 0) matchedCriteria.push('achievements strengthen the application')
  if (subjectHits > 0) matchedCriteria.push('subject fit is strong')

  const reason = matchedCriteria.length
    ? `${scholarship.name} fits because ${matchedCriteria.join(', ')}.`
    : `${scholarship.name} remains a reasonable option based on the student profile and current academic standing.`

  return {
    matchScore,
    criteria: matchedCriteria,
    reason,
  }
}

function profileSummary({ gpa, income, subject, skills }) {
  const parts = [`GPA ${gpa.toFixed(2)}`]
  if (income !== null) parts.push(`income profile ${income <= 30000 ? 'shows strong need-based eligibility' : 'supports mixed merit and skill-based opportunities'}`)
  if (subject) parts.push(`${subject} adds useful subject-specific context`)
  if (skills) parts.push('skills and achievements were included in the match')
  return `${parts.join(', ')}.`
}

export async function evaluateAnswerSheet({ pdfBase64, subject, totalMarks }) {
  const extractedText = extractPdfText(pdfBase64)
  const textSignals = scoreFromTextSignals(extractedText, subject)
  const textAvailable = textSignals.wordCount >= 12
  const percentage = clamp(textSignals.score, 0, 100)
  const marksObtained = clamp(round((percentage / 100) * totalMarks), 0, totalMarks)
  const fairnessSignals = buildBiasIndicators(extractedText)
  const fairnessChecks = buildFairnessChecks(fairnessSignals, textSignals.confidence, textAvailable)

  return {
    marksObtained,
    percentage,
    grade: getGrade(percentage),
    scholarshipEligible: percentage >= 60,
    breakdown: buildBreakdown(totalMarks, percentage, subject, textSignals.keywordHits, textAvailable),
    ...buildEvaluationNarrative({
      percentage,
      subject,
      textAvailable,
      confidence: textSignals.confidence,
    }),
    confidence: textSignals.confidence,
    fairnessSignals,
    fairnessChecks,
    learnerSignals: buildLearnerSignals({
      percentage,
      keywordHits: textSignals.keywordHits,
      wordCount: textSignals.wordCount,
      subject,
    }),
    nextSteps: buildNextSteps({ percentage, subject, textAvailable }),
    impactSummary: buildImpactSummary({ percentage, scholarshipEligible: percentage >= 60, subject }),
    evaluationMode: 'local-offline',
    textMetrics: {
      extractableWordCount: textSignals.wordCount,
      keywordHits: textSignals.keywordHits,
      textAvailable,
    },
    extractedTextPreview: extractedText.slice(0, 240),
  }
}

function buildScholarshipRoadmap({ gpa, income, subject, topMatch }) {
  return [
    {
      title: 'Strengthen your application story',
      detail: `${subject || 'Your academic profile'} should be backed by one strong example of initiative, leadership, or problem-solving.`,
    },
    {
      title: 'Document proof early',
      detail: 'Collect transcripts, awards, project links, recommendation contacts, and service records before deadlines arrive.',
    },
    {
      title: topMatch ? `Prepare for ${topMatch}` : 'Prepare for your top matches',
      detail: income !== null && income <= 30000
        ? `With a GPA around ${gpa.toFixed(2)}, combine academic merit with need-based evidence for the strongest fit.`
        : `With a GPA around ${gpa.toFixed(2)}, emphasize academic merit, technical skills, and measurable achievements.`,
    },
  ]
}

export async function recommendScholarships(input) {
  const percentage = input.percentage ?? null
  const derivedGpa = percentage !== null ? clamp((percentage / 100) * 4, 0, 4) : clamp(toNumber(input.gpa, 0), 0, 4)
  const income = input.income === undefined ? null : toNumber(input.income, null)
  const subject = input.subject || ''
  const marksObtained = input.marksObtained ?? null
  const totalMarks = input.totalMarks ?? null
  const skills = input.skills || (subject ? `${subject}, academic merit` : 'academic merit')
  const achievements = input.achievements || (percentage !== null ? `${percentage}% academic score` : '')

  const profile = {
    gpa: derivedGpa,
    income,
    subject,
    skills,
    achievements,
  }

  const scholarships = SCHOLARSHIP_CATALOG
    .map(scholarship => {
      const match = scholarshipMatchScore(scholarship, profile)
      return {
        name: scholarship.name,
        provider: scholarship.provider,
        amount: scholarship.amount,
        type: scholarship.type,
        eligibility: scholarship.eligibility,
        applyLink: scholarship.applyLink,
        matchScore: match.matchScore,
        reason: match.reason,
        matchReason: match.reason,
        criteria: match.criteria,
      }
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4)

  const examLead = percentage !== null && marksObtained !== null && totalMarks !== null
    ? `Based on ${marksObtained}/${totalMarks} in ${subject || 'the selected subject'}, `
    : ''

  return {
    scholarships,
    summaryNote: `${examLead}the strongest matches reward merit, skills, and documented potential.`,
    overallProfile: `${examLead}${profileSummary(profile)}`,
    fairnessNote: 'This offline matcher considers GPA, need, skills, and achievements only - never language, background, or identity.',
    roadmap: buildScholarshipRoadmap({
      gpa: derivedGpa,
      income,
      subject,
      topMatch: scholarships[0]?.name,
    }),
    fitSnapshot: {
      gpa: Number(derivedGpa.toFixed(2)),
      income,
      subject: subject || 'General',
      topMatchScore: scholarships[0]?.matchScore ?? null,
    },
    recommendationMode: 'local-offline',
  }
}

export async function detectBias(studentAnswer) {
  const text = normalizeText(studentAnswer)
  const accuracy = contentAccuracyScore(text)
  const indicators = buildBiasIndicators(text)
  const biasPenalty = clamp(indicators.length * 6, 0, 24)
  const originalScore = clamp(accuracy - biasPenalty, 0, 100)
  const adjustedScore = clamp(Math.max(accuracy, originalScore + Math.max(8, indicators.length * 4)), 0, 100)
  const gap = adjustedScore - originalScore

  const biasLevel = gap >= 18 ? 'High' : gap >= 10 ? 'Moderate' : 'Low'
  const explanation =
    indicators.length > 0
      ? 'The answer contains style or background signals that could trigger unfair grading shortcuts. The offline evaluator separates those signals from content quality and re-centers the score on conceptual accuracy.'
      : 'The answer shows limited bias-triggering language patterns, so the original and adjusted scores stay close. The offline evaluator still prioritizes concept signals over presentation.'

  const fairEvaluation =
    biasLevel === 'Low'
      ? 'The fairest reading is to grade the answer mainly on its ideas, evidence, and explanation quality.'
      : 'A fair marker should ignore tone, fluency, and background cues here and score the answer on accuracy, reasoning, and relevant detail only.'

  return {
    originalScore,
    adjustedScore,
    contentAccuracy: accuracy,
    biasLevel,
    biasIndicators: indicators,
    explanation,
    fairEvaluation,
    evaluationMode: 'local-offline',
  }
}
