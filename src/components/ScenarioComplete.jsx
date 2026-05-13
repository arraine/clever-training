import styles from './ScenarioComplete.module.css'

export default function ScenarioComplete({ scenario, hasNext, onNext, onReview }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconRow}>
        <div className={styles.icon}>
          <svg viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 16l5 5 9-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className={styles.heading}>scenario complete</div>
      <p className={styles.scenarioTitle}>{scenario.title}</p>

      <div className={styles.summary}>
        <div className={styles.summaryLabel}>root cause</div>
        <p className={styles.summaryText}>
          {scenario.id === 1
            ? "An extra comma on line 2 of students.csv was corrupting Diane Schmeler's record. The fix: advise the district to remove it and re-upload the corrected file."
            : "The PowerSchool Plugin syncs all enrollments for the current and future school years regardless of term dates. Escalation to Tier 2 is needed to implement a filter."}
        </p>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnReview} onClick={onReview}>
          review steps
        </button>
        {hasNext && (
          <button className={styles.btnNext} onClick={onNext}>
            unlock scenario 2 →
          </button>
        )}
      </div>
    </div>
  )
}
