import { useState } from 'react'
import styles from './DecisionTree.module.css'

function getNodeState(stepIndex, currentStep, completedSteps, view) {
  if (completedSteps.includes(stepIndex) || stepIndex < currentStep) return 'complete'
  if (stepIndex === currentStep && view !== 'complete') return 'active'
  if (view === 'complete') return 'complete'
  return 'locked'
}

export default function DecisionTree({ scenario, currentStep, completedSteps, onNodeClick, view }) {
  const steps = scenario.steps
  const doneCount = view === 'complete' ? steps.length : completedSteps.length

  return (
    <div className={styles.tree}>
      <div className={styles.treeHeader}>
        <span className={styles.treeLabel}>Progress</span>
        <span className={styles.treeCount}>{doneCount}/{steps.length}</span>
      </div>
      <div className={styles.nodes}>
        {steps.map((step, i) => {
          const state = getNodeState(i, currentStep, completedSteps, view)
          const isClickable = state === 'complete'
          return (
            <div key={step.id} className={styles.nodeRow}>
              <button
                className={`${styles.node} ${styles[state]}`}
                onClick={() => isClickable && onNodeClick(i)}
                disabled={!isClickable}
                aria-label={`Step ${i + 1}: ${state}`}
              >
                <div className={styles.nodeIndex}>{i + 1}</div>
                {state === 'complete' && (
                  <svg className={styles.checkIcon} viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {state === 'active' && <div className={styles.activePulse} />}
              </button>
              {i < steps.length - 1 && (
                <div className={`${styles.connector} ${state === 'complete' ? styles.connectorDone : ''}`} />
              )}
            </div>
          )
        })}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotComplete}`}/> Done</span>
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotActive}`}/> Current</span>
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotLocked}`}/> Locked</span>
      </div>
    </div>
  )
}
