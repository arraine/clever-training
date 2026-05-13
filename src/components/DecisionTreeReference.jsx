import { useState } from 'react'
import styles from './DecisionTreeReference.module.css'

const steps = [
  {
    id: 'start',
    label: 'Start',
    description: 'Identify the sync type',
    detail: 'Before anything else, log into Hall Monitor and open the Info tab for the district. Find the SYNC TYPE field — it will say either "sftp" or "api". This determines every subsequent step.',
    children: ['check-clever'],
    phase: 'start',
  },
  {
    id: 'check-clever',
    label: 'Is the record in Clever?',
    description: 'Search Clever for the missing/incorrect record.',
    detail: 'Look up the student, teacher, section, or other record directly in Clever. Is it present and correct?\n\n• If yes → go to Step 2a (why aren\'t we ingesting it?)\n• If no → check the incoming raw data first.',
    children: ['yes-in-clever', 'check-raw-data'],
    childLabels: ['Yes', 'No'],
    phase: 'step1',
  },
  {
    id: 'yes-in-clever',
    label: 'Record is in Clever',
    description: 'The data is already correct.',
    detail: 'The record is present and correct in Clever — great news! Share the good news with the district.',
    children: [],
    phase: 'resolved',
  },
  {
    id: 'check-raw-data',
    label: 'Check incoming data',
    description: 'API: Hall Monitor → Timeline → latest sync → powerschool-api-plugin-normalizer\nSFTP: Hall Monitor → SFTP Files',
    detail: 'How you check depends on sync type:\n\n• API sync: Hall Monitor > Timeline > click the latest sync > find powerschool-api-plugin-normalizer\n• SFTP sync: Hall Monitor > SFTP Files — download the relevant CSV\n\nIs the record present and correct in the raw data?',
    children: ['raw-yes', 'raw-no'],
    childLabels: ['Yes — data is correct in raw', 'No — data is missing/wrong in raw'],
    phase: 'step1',
  },
  {
    id: 'raw-yes',
    label: 'Data correct in raw → Step 2a',
    description: 'The SIS is sending it correctly. Why isn\'t Clever ingesting it?',
    detail: 'The data is correct at the source. Now investigate why Clever isn\'t picking it up.',
    children: ['check-custom', 'check-hold'],
    phase: 'step2a',
  },
  {
    id: 'raw-no',
    label: 'Data missing/wrong in raw → Step 2b',
    description: 'The SIS isn\'t sending it correctly.',
    detail: 'The data is already wrong before it reaches Clever. The fix has to happen at the source.',
    children: ['api-criteria', 'sftp-district-fix'],
    childLabels: ['API sync', 'SFTP sync'],
    phase: 'step2b',
  },
  {
    id: 'check-custom',
    label: 'Custom or SIS-synced?',
    description: 'Check the Data Source column in the Data Browser.',
    detail: 'In the Clever Data Browser, look at the Data Source column for the record in question.\n\n• If custom: is it manually added or via file upload? → Troubleshoot using Custom Data: Overview\n• If SIS-synced: continue to check for holds/pauses.',
    children: ['check-hold'],
    phase: 'step2a',
  },
  {
    id: 'check-hold',
    label: 'Sync on hold or paused?',
    description: 'Check Hall Monitor Holds tab and Sync page.',
    detail: 'Check two things:\n\n1. Sync Hold (Holds tab): Both SIS-synced and custom data will NOT sync if on hold.\n2. Sync Pause (Sync page): SIS-synced data will NOT sync if paused. Custom data WILL sync even if paused.\n\nIf either applies, that\'s your answer. If neither, continue.',
    children: ['api-branch', 'sftp-branch'],
    childLabels: ['API sync', 'SFTP sync'],
    phase: 'step2a',
  },
  {
    id: 'api-branch',
    label: 'IF API: check integrations & errors',
    description: 'Guru integrations list → Sync page errors → field mappings',
    detail: '1. Check Guru: Secure Sync Integrations List for known quirks with this sync type.\n2. Check the Sync page for errors. If errors exist, have the district correct them in the SIS.\n   • Exception: PowerSchool Plugin school_id=0 errors can be ignored or value-mapped (escalate to T2 for mapping).\n3. If incorrect field data, check the SFTP Spec to confirm the values are supported.\n4. For PowerSchool Plugin: confirm they\'re on the latest plugin version (compare Hall Monitor Timeline vs SFTP Files).\n5. Check for filters, field mappings, or value mappings in Hall Monitor.\n6. Advanced: check the workers (Data Pipeline Overview).\n7. Still unexplained? Reach out in #solutions-ama or Knowledge Specialist Office Hours.',
    children: [],
    phase: 'step2a',
  },
  {
    id: 'sftp-branch',
    label: 'IF SFTP: check files',
    description: 'Errors → file timing → duplicates → CSV Analyst → Sublime',
    detail: '1. Check Sync page for errors. Have the district correct their files if any found.\n2. Confirm all 5 required files (schools.csv, students.csv, teachers.csv, sections.csv, enrollments.csv) were uploaded to /home/[district username]/ at the same time.\n3. Confirm custom/extension data was uploaded at least 15–30 minutes before or after the core 5 files.\n4. Check for duplicate files (e.g. both "Students.csv" and "students.csv") — district must remove both and re-upload just one.\n5. Run CSV Analyst on the relevant file to check for formatting errors.\n6. Open the file in Sublime for deeper formatting inspection.\n7. Still unexplained? Reach out in #solutions-ama or Knowledge Specialist Office Hours.',
    children: [],
    phase: 'step2a',
  },
  {
    id: 'api-criteria',
    label: 'IF API: check sync criteria',
    description: 'Does the record meet the criteria to sync?',
    detail: '1. Check the Help Center article for this sync (Secure Sync: Integrations List) — does the record meet the sync criteria?\n   • If not: have the admin correct it in the SIS.\n   • If yes: check which field the missing data is pulled from (Auto Sync Default Fields) and confirm the data is correct in that field.\n2. Check for filters, field mappings, or value mappings.\n3. If criteria are met and values are correct, use Postman to check if the data is being sent via the API.\n   • Note: Postman is NOT available for PowerSchool Plugin — triple-check the sync criteria and SIS field instead.\n4. Still unexplained? Reach out in #solutions-ama.',
    children: [],
    phase: 'step2b',
  },
  {
    id: 'sftp-district-fix',
    label: 'IF SFTP: district must fix their files',
    description: 'The fix is on the district side.',
    detail: 'For SFTP syncs, if the data is missing or wrong in the raw files, the district needs to correct their upload.\n\nBe sure to share the SFTP Spec with them so they know what format and values are expected.',
    children: [],
    phase: 'step2b',
  },
]

const phaseColors = {
  start: { bg: '#0A1E46', text: '#FFFFFF', border: '#0A1E46' },
  step1: { bg: '#DAEBFF', text: '#0A1E46', border: '#1464FF' },
  step2a: { bg: '#E8F5EE', text: '#0A5C38', border: '#4ECC97' },
  step2b: { bg: '#FFF3E8', text: '#7A3010', border: '#F78239' },
  resolved: { bg: '#F0F4FA', text: '#4A5D7A', border: '#DDE4EF' },
}

const phaseLabels = {
  start: 'Setup',
  step1: 'Step 1: Is data received?',
  step2a: 'Step 2a: Why not ingested?',
  step2b: 'Step 2b: Why not received?',
  resolved: 'Resolved',
}

export default function DecisionTreeReference() {
  const [activeNode, setActiveNode] = useState('start')
  const node = steps.find(s => s.id === activeNode)

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Decision Tree Reference</h1>
        <p className={styles.pageSubtitle}>
          Navigate the full T1 SIS troubleshooting decision tree. Click any node to read the details, then follow the branches.
        </p>
        <a
          href="https://app.getguru.com/card/TMaMynXc/T1-SIS-Troubleshooting-Data-MissingIncorrect"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.guruLink}
        >
          Open Guru card for full reference
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 10L10 2M10 2H5M10 2v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </a>
      </div>

      <div className={styles.layout}>
        <div className={styles.treePanel}>
          <div className={styles.legend}>
            {Object.entries(phaseLabels).map(([phase, label]) => (
              <div key={phase} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: phaseColors[phase].border }} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className={styles.nodes}>
            {steps.map(step => (
              <button
                key={step.id}
                className={`${styles.node} ${activeNode === step.id ? styles.nodeActive : ''}`}
                onClick={() => setActiveNode(step.id)}
                style={{
                  borderColor: activeNode === step.id ? phaseColors[step.phase].border : undefined,
                  background: activeNode === step.id ? phaseColors[step.phase].bg : undefined,
                  color: activeNode === step.id ? phaseColors[step.phase].text : undefined,
                }}
              >
                <div className={styles.nodePhaseDot} style={{ background: phaseColors[step.phase].border }} />
                <div className={styles.nodeContent}>
                  <div className={styles.nodeLabel}>{step.label}</div>
                  <div className={styles.nodeDesc}>{step.description}</div>
                </div>
                {step.children.length > 0 && (
                  <div className={styles.nodeArrow} aria-hidden="true">›</div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.detailPanel}>
          {node && (
            <div className={styles.detail}>
              <div className={styles.detailPhase} style={{ color: phaseColors[node.phase].border }}>
                {phaseLabels[node.phase]}
              </div>
              <h2 className={styles.detailTitle}>{node.label}</h2>
              <div className={styles.detailBody}>
                {node.detail.split('\n').map((line, i) => (
                  line.trim() === '' ? <br key={i} /> : <p key={i}>{line}</p>
                ))}
              </div>

              {node.children.length > 0 && (
                <div className={styles.detailBranches}>
                  <div className={styles.branchesLabel}>Next steps</div>
                  {node.children.map((childId, i) => {
                    const child = steps.find(s => s.id === childId)
                    if (!child) return null
                    return (
                      <button
                        key={childId}
                        className={styles.branchBtn}
                        onClick={() => setActiveNode(childId)}
                        style={{ borderColor: phaseColors[child.phase].border }}
                      >
                        {node.childLabels?.[i] && (
                          <span className={styles.branchIf} style={{ color: phaseColors[child.phase].border }}>
                            {node.childLabels[i]}
                          </span>
                        )}
                        <span className={styles.branchLabel}>{child.label}</span>
                        <span className={styles.branchArrow}>→</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {node.children.length === 0 && (
                <div className={styles.terminal}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M5 8l2.5 2.5L11 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  End of this branch
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
