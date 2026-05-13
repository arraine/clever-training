import { useState, useEffect } from 'react'
import { scenarios } from './data/scenarios'
import DecisionTree from './components/DecisionTree'
import StepPanel from './components/StepPanel'
import ScenarioComplete from './components/ScenarioComplete'
import { saveProgress, loadProgress, clearProgress } from './utils/progress'
import styles from './App.module.css'

function getInitialState() {
  const saved = loadProgress()
  if (saved) return saved
  return {
    activeScenario: 0,
    currentStep: 0,
    completedSteps: [],
    scenariosDone: [],
    view: 'intro',
  }
}

export default function App() {
  const initial = getInitialState()
  const [activeScenario, setActiveScenario] = useState(initial.activeScenario)
  const [currentStep, setCurrentStep] = useState(initial.currentStep)
  const [completedSteps, setCompletedSteps] = useState(initial.completedSteps)
  const [scenariosDone, setScenariosDone] = useState(initial.scenariosDone)
  const [view, setView] = useState(initial.view === 'review' ? 'step' : initial.view)
  const [reviewStep, setReviewStep] = useState(0)
  const [showResumed, setShowResumed] = useState(!!loadProgress())

  const scenario = scenarios[activeScenario]
  const isScenario2Unlocked = scenariosDone.includes(0)
  const isScenario3Unlocked = scenariosDone.includes(1)
  const isScenario4Unlocked = scenariosDone.includes(2)

  function isLocked(index) {
    if (index === 0) return false
    if (index === 1) return !isScenario2Unlocked
    if (index === 2) return !isScenario3Unlocked
    if (index === 3) return !isScenario4Unlocked
    return true
  }

  // Save progress whenever key state changes
  useEffect(() => {
    saveProgress({ activeScenario, currentStep, completedSteps, scenariosDone, view })
  }, [activeScenario, currentStep, completedSteps, scenariosDone, view])

  // Dismiss resume banner after 4 seconds
  useEffect(() => {
    if (showResumed) {
      const t = setTimeout(() => setShowResumed(false), 4000)
      return () => clearTimeout(t)
    }
  }, [showResumed])

  function handleStart() { setView('step') }

  function handleCorrect() {
    const next = currentStep + 1
    setCompletedSteps(prev => [...prev, currentStep])
    if (next >= scenario.steps.length) {
      setView('complete')
      setScenariosDone(prev => prev.includes(activeScenario) ? prev : [...prev, activeScenario])
    } else {
      setCurrentStep(next)
    }
  }

  function handleNodeClick(index) {
    if (view === 'complete') { setReviewStep(index); setView('review'); return }
    if (index < currentStep) { setReviewStep(index); setView('review') }
  }

  function handleBackToStep() { setView('step') }

  function handleUnlockNext() {
    setActiveScenario(activeScenario + 1); setCurrentStep(0); setCompletedSteps([]); setView('intro')
  }

  function switchScenario(index) {
    if (isLocked(index)) return
    setActiveScenario(index); setCurrentStep(0); setCompletedSteps([])
    setView(scenariosDone.includes(index) ? 'complete' : 'intro')
  }

  function handleReset() {
    clearProgress()
    setActiveScenario(0); setCurrentStep(0); setCompletedSteps([])
    setScenariosDone([]); setView('intro'); setShowResumed(false)
  }

  const displayStep = view === 'review' ? reviewStep : currentStep

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoMark}>clever</span>
            <span className={styles.logoSep}>/</span>
            <span className={styles.logoText}>SIS Troubleshooting Training</span>
          </div>
          <button className={styles.resetBtn} onClick={handleReset} title="Reset all progress">
            Reset progress
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {showResumed && (
          <div className={styles.resumeBanner}>
            ↩ Resumed where you left off
          </div>
        )}
          <div className={styles.sidebar}>
            <div className={styles.scenarioTabs}>
              {scenarios.map((s, i) => {
                const locked = isLocked(i)
                const done = scenariosDone.includes(i)
                return (
                  <button
                    key={s.id}
                    className={`${styles.tab} ${activeScenario === i ? styles.tabActive : ''} ${locked ? styles.tabLocked : ''}`}
                    onClick={() => switchScenario(i)}
                    disabled={locked}
                    title={locked ? 'Complete Scenario 1 to unlock' : ''}
                  >
                    <span className={styles.tabNum}>0{i + 1}</span>
                    <span className={styles.tabLabel}>{s.title}</span>
                    {done && <span className={styles.tabDone}>✓</span>}
                    {locked && <span className={styles.tabLock}>🔒</span>}
                  </button>
                )
              })}
            </div>
            {view !== 'intro' && (
              <DecisionTree
                scenario={scenario}
                currentStep={currentStep}
                completedSteps={completedSteps}
                onNodeClick={handleNodeClick}
                view={view}
              />
            )}
          </div>

          <div className={styles.content}>
            {view === 'intro' && (
              <div className={styles.card}>
                <IntroPanel scenario={scenario} onStart={handleStart} />
              </div>
            )}
            {view === 'review' && (
              <div className={styles.reviewBar}>
                <span className={styles.reviewNote}>Reviewing completed step</span>
                <button className={styles.backBtn} onClick={handleBackToStep}>← Back to current step</button>
              </div>
            )}
            {(view === 'step' || view === 'review') && (
              <div className={styles.card}>
                <StepPanel
                  key={`${activeScenario}-${displayStep}-${view}`}
                  step={scenario.steps[displayStep]}
                  stepIndex={displayStep}
                  totalSteps={scenario.steps.length}
                  onCorrect={handleCorrect}
                  isReview={view === 'review'}
                />
              </div>
            )}
            {view === 'complete' && (
              <div className={styles.card}>
                <ScenarioComplete
                  scenario={scenario}
                  hasNext={activeScenario < scenarios.length - 1}
                  onNext={handleUnlockNext}
                  onReview={() => { setReviewStep(0); setView('review') }}
                />
              </div>
            )}
          </div>
        </main>
    </div>
  )
}

function IntroPanel({ scenario, onStart }) {
  return (
    <div className={styles.intro}>
      <div className={styles.introBadge}>{scenario.subtitle}</div>
      <h1 className={styles.introTitle}>{scenario.title}</h1>
      <p className={styles.introSummary}>{scenario.summary}</p>

      <div className={styles.guruCallout}>
        <div className={styles.guruIcon} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 8v5M9 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className={styles.guruText}>
          <strong>Before you start:</strong> Open the{' '}
          <a href="https://app.getguru.com/card/TMaMynXc/T1-SIS-Troubleshooting-Data-MissingIncorrect" target="_blank" rel="noopener noreferrer">
            T1 SIS Troubleshooting: Data Missing/Incorrect
          </a>{' '}
          Guru card and use it as your reference as you work through this scenario.
        </div>
      </div>

      <div className={styles.introMeta}>
        <div className={styles.introMetaItem}>
          <span className={styles.introMetaLabel}>District in Hall Monitor</span>
          <a href={scenario.districtUrl} target="_blank" rel="noopener noreferrer" className={styles.districtLink}>
            Open district
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </a>
          <span className={styles.splitViewTip}>
            💡 Tip: Right-click the link and use Chrome's <strong>Open in split screen</strong> to keep Hall Monitor visible alongside this page.
          </span>
        </div>
        <div className={styles.introMetaItem}>
          <span className={styles.introMetaLabel}>Decision points</span>
          <span className={styles.introMetaValue}>{scenario.steps.length} steps</span>
        </div>
      </div>

      <button className={styles.startBtn} onClick={onStart}>
        Start Scenario →
      </button>
    </div>
  )
}
