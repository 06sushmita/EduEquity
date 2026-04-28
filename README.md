# EduEquity AI

EduEquity AI is a fairness-focused education platform built with React, Vite, Tailwind CSS, and Firebase. It helps teachers evaluate student answer sheets, gives students transparent feedback, and recommends scholarships using merit- and need-based signals instead of identity or prestige cues.

## What the project does

- Teachers upload a student's answer-sheet PDF, choose the subject, and enter total marks.
- The app runs a local offline evaluator to estimate performance from extractable PDF text.
- The result includes marks, percentage, grade, topic-wise breakdown, feedback, confidence, fairness checks, and next-step recommendations.
- Students log in with their own account to see their results, growth guidance, and scholarship opportunities.

## How evaluation is made

The main evaluation logic lives in [src/services/gemini.js](/C:/Users/mishr/Downloads/EduEquity-main/EduEquity-main/src/services/gemini.js:1).

### 1. PDF text extraction

When a teacher uploads a PDF:

- The file is converted to Base64 in the browser.
- The evaluator decodes that Base64 string.
- It removes non-printable characters and extracts readable text chunks.
- The extracted text is normalized into a cleaner plain-text string.

This is a lightweight offline heuristic approach. It does not use OCR or a paid external AI API.

### 2. Subject-aware scoring

Each subject has its own keyword profile and topic structure, for example:

- Mathematics looks for terms like `equation`, `formula`, `proof`, `solve`
- Biology looks for terms like `cell`, `gene`, `enzyme`, `membrane`
- English looks for terms like `theme`, `analysis`, `argument`, `evidence`

The evaluator computes a score using:

- Subject keyword matches
- General academic terms like `because`, `therefore`, `analysis`, `conclusion`
- Response length
- Basic structure signals such as question markers, reasoning words, and sentence quality

If very little readable text is found, the system falls back to a conservative estimate instead of pretending it has full understanding.

### 3. Marks, percentage, and grade

After the text score is calculated:

- The score is converted into a percentage
- Percentage is mapped to marks obtained using the selected total marks
- Grade is assigned using fixed thresholds:

| Percentage | Grade |
| --- | --- |
| 90+ | A+ |
| 80-89 | A |
| 70-79 | B |
| 60-69 | C |
| 50-59 | D |
| Below 50 | F |

### 4. Topic-wise breakdown

The evaluator creates a question or topic breakdown by:

- Looking up a subject-specific list of evaluation topics
- Splitting total marks across those topics
- Distributing marks according to the overall performance ratio
- Generating short feedback for each topic

This gives the UI a more transparent result instead of only showing one final score.

### 5. Feedback generation

The result includes:

- `strengths`
- `improvements`
- `overallFeedback`
- `nextSteps`
- `impactSummary`

These are generated from the final performance band and help make the evaluation actionable for both teacher and student.

### 6. Confidence and text metrics

The evaluator also returns:

- `confidence`: `low`, `medium`, or `high`
- `extractableWordCount`
- `keywordHits`
- `textAvailable`

This helps explain how much readable evidence was actually available inside the uploaded PDF.

## How fairness is handled

EduEquity AI tries to reduce bias in two ways.

### A. Fairness checks during answer-sheet evaluation

The evaluator scans extracted text for patterns that could unfairly influence grading, such as:

- Informal wording like `basically`, `kinda`, `ok`
- Background cues like `my family`, `mother tongue`, `first-generation`
- Fluency or grammar signals that should not overpower conceptual correctness

It then returns:

- `fairnessSignals`
- `fairnessChecks`

These make the evaluation more explainable and remind the reviewer that style and background should not be treated as content quality.

### B. Separate bias-analysis mode

The app also includes a `detectBias()` flow for pasted student answers.

That mode compares:

- content accuracy
- original score
- bias-adjusted score

This is used to demonstrate how tone, fluency, or background cues can distort evaluation if not handled carefully.

## How scholarship recommendation works

The scholarship logic is also local and rule-based.

It uses:

- GPA or GPA derived from percentage
- income
- subject
- skills
- achievements

It does not use:

- ethnicity
- language background
- city
- school prestige
- identity signals

Each scholarship is scored using:

- GPA fit
- need-based fit
- subject fit
- skill tag matches
- achievement tag matches

The app returns:

- top scholarship matches
- match scores
- match reasons
- criteria tags
- a roadmap for applying

## Main features

### Teacher side

- Upload and evaluate student answer-sheet PDFs
- Save results to Firestore
- View submitted history
- See classroom insights in the Impact Lab
- Identify learners who may need support

### Student side

- View evaluated results
- Read strengths and improvement suggestions
- Track growth trends
- Explore scholarship opportunities
- Follow a simple academic roadmap

## Tech stack

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- Firebase Auth
- Firebase Firestore
- Recharts

## Project structure

```text
src/
  components/        reusable UI pieces
  context/           auth and theme context
  hooks/             custom hooks
  pages/             landing, auth, teacher, student views
  services/          Firebase and evaluation logic
  utils/             shared insight helpers
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Use `.env.example` as a reference and create your own `.env` file:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 3. Firestore indexes

Create these indexes in Firebase Console:

- Collection: `results` | Fields: `studentEmail ASC`, `createdAt DESC`
- Collection: `results` | Fields: `teacherId ASC`, `createdAt DESC`

### 4. Run locally

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

## Important limitation

The evaluator is heuristic and offline. It is useful for demos, explainability, and fairness-oriented workflows, but it is not equivalent to a full OCR-plus-LLM academic assessment pipeline.

## Current implementation note

The project currently uses local evaluation logic even though the file is named `gemini.js`. It does not require a Gemini API key for the present evaluation flow.
