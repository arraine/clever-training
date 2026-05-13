import { useState } from 'react'
import { scenarios } from './data/scenarios'
import DecisionTree from './components/DecisionTree'
import StepPanel from './components/StepPanel'
import ScenarioComplete from './components/ScenarioComplete'
import styles from './App.module.css'

export default function App() {
  const [activeScenario, setActiveScenario] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [scenariosDone, setScenariosDone] = useState([])
  const [view, setView] = useState('step') // 'step' | 'complete' | 'review'
  const [reviewStep, setReviewStep] = useState(0)

  const scenario = scenarios[activeScenario]
  const isScenario2Unlocked = scenariosDone.includes(0)

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
    if (view === 'complete') {
      setReviewStep(index)
      setView('review')
      return
    }
    if (index < currentStep) {
      setReviewStep(index)
      setView('review')
    }
  }

  function handleStartReview() {
    setReviewStep(0)
    setView('review')
  }

  function handleBackToStep() {
    setView('step')
  }

  function handleUnlockScenario2() {
    setActiveScenario(1)
    setCurrentStep(0)
    setCompletedSteps([])
    setView('step')
  }

  function switchScenario(index) {
    if (index === 1 && !isScenario2Unlocked) return
    setActiveScenario(index)
    setCurrentStep(0)
    setCompletedSteps([])
    setView(scenariosDone.includes(index) ? 'complete' : 'step')
  }

  const displayStep = view === 'review' ? reviewStep : currentStep

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.logo}>
            <span className={styles.logoAccent}>clever</span>
            <span className={styles.logoSep}>/</span>
            <span className={styles.logoText}>sis troubleshooting</span>
          </div>
          <div className={styles.scenarioTabs}>
            {scenarios.map((s, i) => {
              const locked = i === 1 && !isScenario2Unlocked
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
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.sidebar}>
          <div className={styles.scenarioInfo}>
            <div className={styles.scenarioBadge}>{scenario.subtitle}</div>
            <h1 className={styles.scenarioTitle}>{scenario.title}</h1>
            <p className={styles.scenarioBrief}>{scenario.summary}</p>
            <a
              href={scenario.districtUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.districtLink}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              open in hall monitor
            </a>
          </div>
          <DecisionTree
            scenario={scenario}
            currentStep={currentStep}
            completedSteps={completedSteps}
            onNodeClick={handleNodeClick}
          />
        </div>

        <div className={styles.content}>
          {view === 'review' && (
            <div className={styles.reviewBar}>
              <span className={styles.reviewNote}>reviewing completed step</span>
              <button className={styles.backBtn} onClick={handleBackToStep}>
                ← back to current step
              </button>
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
                hasNext={activeScenario === 0}
                onNext={handleUnlockScenario2}
                onReview={handleStartReview}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
