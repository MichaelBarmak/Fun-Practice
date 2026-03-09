# Probability Interview Questions

A clean, mobile-friendly web app for sharing probability interview questions with full solutions. Built with Next.js and Tailwind CSS.

---

## Running locally

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel (free, single shareable link)

1. Push this folder to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repo — Vercel auto-detects Next.js, no config needed.
4. Click **Deploy**.

Your app gets a permanent URL like `https://your-project.vercel.app`.

**To update questions after deploying:** edit `data/questions.json`, commit, and push. Vercel redeploys automatically — same URL.

---

## How to add a new question

Open `data/questions.json` and add a new object to the array. Here are templates for both question types:

### Numeric question (user types an answer)

```json
{
  "id": 11,
  "title": "Your Question Title",
  "category": "Expectations",
  "difficulty": "Medium",
  "isNew": true,
  "preview": "One sentence that teases the question.",
  "question": "Full question text shown when the card is expanded.\n\nCan span multiple paragraphs using \\n.",
  "answerType": "numeric",
  "correctAnswer": 0.5,
  "tolerance": 0.01,
  "solution": "Full step-by-step solution.\n\nUse \\n for line breaks.\nMath notation is plain text."
}
```

### Theory question (no answer input, just a solution reveal)

```json
{
  "id": 12,
  "title": "Your Theory Question",
  "category": "Classical",
  "difficulty": "Hard",
  "isNew": false,
  "preview": "One sentence that teases the question.",
  "question": "Full question text.",
  "answerType": "theory",
  "solution": "Full explanation of the answer."
}
```

### Field reference

| Field | Required | Description |
|---|---|---|
| `id` | Yes | Unique integer. Increment from the last one. |
| `title` | Yes | Short display name. |
| `category` | Yes | Groups questions in the filter. Use an existing category or create a new one. |
| `difficulty` | Yes | `"Easy"`, `"Medium"`, or `"Hard"` |
| `isNew` | Yes | `true` shows an orange "New" badge. Set to `false` after a while. |
| `preview` | Yes | One sentence shown on the collapsed card. |
| `question` | Yes | Full question text (shown when expanded). |
| `answerType` | Yes | `"numeric"` or `"theory"` |
| `correctAnswer` | Numeric only | The exact correct numeric value. |
| `tolerance` | Numeric only | Accepted margin of error (e.g. `0.005`). Use `0` for exact. |
| `solution` | Yes | Full solution text revealed when the user clicks "Show Solution". |

---

## Project structure

```
probability-quiz/
├── data/
│   └── questions.json          ← Edit this to add/update questions
├── src/
│   ├── app/
│   │   ├── layout.js           ← Page metadata (title, description)
│   │   ├── page.js             ← Home page (loads questions, renders header)
│   │   └── globals.css         ← Tailwind + global styles
│   ├── components/
│   │   ├── QuestionList.jsx    ← Search, filter, and question grid
│   │   └── QuestionCard.jsx    ← Individual card with expand/answer/solution
│   ├── hooks/
│   │   └── useSolvedQuestions.js  ← localStorage persistence
│   └── utils/
│       └── answerChecker.js    ← Answer comparison logic
```
