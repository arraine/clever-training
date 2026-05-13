import { useState, useEffect } from 'react'
import styles from './StepPanel.module.css'

export default function StepPanel({ step, stepIndex, totalSteps, onCorrect, isReview }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setSelected(null)
    setSubmitted(false)
    setShake(false)
  }, [step.id])

  function handleSelect(optionIndex) {
    if (submitted && !isReview) return
    setSelected(optionIndex)
    if (isReview) setSubmitted(true)
  }

  function handleSubmit() {
    if (selected === null) return
    setSubmitted(true)
    const opt = step.options[selected]
    if (!opt.correct) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  function handleRetry() {
    setSelected(null)
    setSubmitted(false)
    setShake(false)
  }

  const selectedOpt = selected !== null ? step.options[selected] : null
  const isCorrect = submitted && selectedOpt?.correct

  return (
    <div className={styles.panel}>
      <div className={styles.stepMeta}>
        <span className={styles.stepBadge}>step {stepIndex + 1} of {totalSteps}</span>
        {isReview && <span className={styles.reviewBadge}>reviewing</span>}
      </div>

      <p className={styles.question}>{step.question}</p>

      {step.hint && (
        <div className={styles.hint}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1"/>
            <path d="M7 6v4M7 4.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {step.hint}
        </div>
      )}

      <div className={`${styles.options} ${shake ? styles.shake : ''}`}>
        {step.options.map((opt, i) => {
          let state = 'idle'
          if (submitted) {
            if (i === selected) state = opt.correct ? 'correct' : 'wrong'
            else if (opt.correct && !isReview) state = 'reveal'
          } else if (i === selected) {
            state = 'selected'
          }
          return (
            <button
              key={i}
              className={`${styles.option} ${styles[state]}`}
              onClick={() => handleSelect(i)}
              disabled={submitted && !isReview && state !== 'idle'}
            >
              <span className={styles.optionLetter}>{String.fromCharCode(65 + i)}</span>
              <span className={styles.optionText}>{opt.label}</span>
              {submitted && state === 'correct' && (
                <svg className={styles.optionIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              {submitted && state === 'wrong' && (
                <svg className={styles.optionIcon} viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>

      {submitted && selectedOpt && (
        <div className={`${styles.feedback} ${isCorrect ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          <div className={styles.feedbackLabel}>{isCorrect ? '✓ correct' : '✗ not quite'}</div>
          <p className={styles.feedbackText}>{selectedOpt.feedback}</p>
        </div>
      )}

      <div className={styles.actions}>
        {!submitted && (
          <button
            className={styles.btnPrimary}
            onClick={handleSubmit}
            disabled={selected === null}
          >
            submit answer
          </button>
        )}
        {submitted && !isCorrect && (
          <button className={styles.btnRetry} onClick={handleRetry}>
            try again
          </button>
        )}
        {submitted && isCorrect && !isReview && (
          <button className={styles.btnNext} onClick={onCorrect}>
            {stepIndex + 1 === totalSteps ? 'complete scenario →' : 'next step →'}
          </button>
        )}
      </div>
    </div>
  )
}
