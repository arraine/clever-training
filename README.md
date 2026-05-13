# Clever SIS Troubleshooting Training

An interactive training app for Clever support trainees to practice troubleshooting missing or incorrect SIS data. Trainees work through a real decision tree, one step at a time, with immediate feedback on wrong answers and the ability to review completed steps.

## Scenarios

- **Scenario 1** — Student account missing from Clever (SFTP sync, extra comma in CSV)
- **Scenario 2** — Student's old schedule still in system (API/PowerSchool Plugin, future term behavior) — unlocks after completing Scenario 1

## Tech stack

- React 18 + Vite
- CSS Modules
- No external dependencies

## Local development

```bash
npm install
npm run dev
```

## Deploy to Vercel

### Option A: Via GitHub (recommended)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Leave all settings as default (Vercel auto-detects Vite)
5. Click Deploy

### Option B: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

## Adding more scenarios

Edit `src/data/scenarios.js`. Each scenario follows this structure:

```js
{
  id: 3,
  title: "Scenario title",
  subtitle: "Scenario 3",
  summary: "Brief description of the situation.",
  districtUrl: "https://hall-monitor.int.clever.com/...",
  steps: [
    {
      id: "s3-1",
      question: "Question text shown to trainee",
      hint: "Optional hint shown below the question",
      type: "choice",
      options: [
        { label: "Answer text", correct: false, feedback: "Explanation of why this is wrong." },
        { label: "Correct answer", correct: true, feedback: "Explanation of why this is right." },
      ],
    },
  ],
}
```

Each step needs exactly one option with `correct: true`.
