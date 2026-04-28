# EduEquity AI — Teacher & Student Dashboard

An AI-powered fair evaluation and scholarship platform built with React + Vite + Firebase and a built-in local offline evaluator.

---

## ✨ What's New

### Role-Based Authentication
- On **Sign Up / Sign In**, users are first asked to choose their role: **Teacher** or **Student**
- Role is persisted per-user in `localStorage` so it survives page reloads

### Teacher Portal
- **Upload & Grade**: Upload a student's answer-sheet PDF + enter the student's email, subject, and total marks
- A built-in offline evaluator reads extractable PDF text and returns: marks obtained, grade, question-by-question breakdown, strengths, improvements, and scholarship eligibility flag
- Result is saved to Firestore under `results` collection, keyed to the student's email
- **Submitted Results**: View all previously graded sheets at a glance
- **Profile**: Stats — total sheets graded, students reached, average score

### Student Portal
- **My Results**: Students log in and see every result their teacher has uploaded for them (matched by email)
  - Expandable cards show question breakdown, strengths, and improvement tips
- **Scholarships**: For any result where the score is ≥ 60%, the student can click "Find Scholarships" to get 4 AI-recommended scholarships personalised to their academic performance
- **Profile**: Personal stats — papers evaluated, average score, best result, scholarship-eligible count

---

## 🛠 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in your keys:
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

No paid AI API key is required for the current app flow.

### 3. Firebase Firestore rules
Add these indexes in Firebase Console → Firestore → Indexes:
- Collection: `results` | Fields: `studentEmail ASC`, `createdAt DESC`
- Collection: `results` | Fields: `teacherId ASC`, `createdAt DESC`

### 4. Run locally
```bash
npm run dev
```

---

## 🏗 Tech Stack
- **React 18** + **Vite**
- **Tailwind CSS** + **Framer Motion**
- **Firebase** (Auth + Firestore)
- **Local offline evaluator** (bias analysis, PDF scoring heuristics, scholarship matching)
