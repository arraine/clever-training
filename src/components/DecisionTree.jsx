import { useState } from 'react'
import styles from './DecisionTree.module.css'

function getNodeState(stepIndex, currentStep, completedSteps) {
  if (completedSteps.includes(stepIndex)) return 'complete'
  if (stepIndex === currentStep) return 'active'
  if (stepIndex < currentStep) return 'complete'
  return 'locked'
}

export default function DecisionTree({ scenario, currentStep, completedSteps, onNodeClick }) {
  const steps = scenario.steps

  return (
    <div className={styles.tree}>
      <div className={styles.treeHeader}>
        <span className={styles.treeMono}>decision tree</span>
        <span className={styles.treeCount}>{completedSteps.length}/{steps.length} steps</span>
      </div>
      <div className={styles.nodes}>
        {steps.map((step, i) => {
          const state = getNodeState(i, currentStep, completedSteps)
          const isClickable = state === 'active' || state === 'complete'
          return (
            <div key={step.id} className={styles.nodeRow}>
              <button
                className={`${styles.node} ${styles[state]}`}
                onClick={() => isClickable && onNodeClick(i)}
                disabled={state === 'locked'}
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
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotComplete}`}/> done</span>
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotActive}`}/> current</span>
        <span className={styles.legendItem}><span className={`${styles.legendDot} ${styles.dotLocked}`}/> locked</span>
      </div>
    </div>
  )
}
