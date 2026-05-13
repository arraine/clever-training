export const scenarios = [
  {
    id: 1,
    title: "Student account missing from Clever",
    subtitle: "Scenario 1",
    summary: "Student Diane Schmeler just transferred into the district and has been entered into the SIS, but her account isn't populating in Clever.",
    districtUrl: "https://hall-monitor.int.clever.com/districts/66317ccabcdefaf99b8af113/info",
    steps: [
      {
        id: "s1-1",
        question: "Log into Hall Monitor and check the district info page. What is the sync type for this district?",
        hint: "Look at the Info tab in Hall Monitor — find the SYNC TYPE field.",
        type: "choice",
        options: [
          { label: "API", correct: false, feedback: "Not quite — look more carefully at the SYNC TYPE field on the Info tab. This district transfers data via CSV files, not a direct API connection." },
          { label: "SFTP", correct: true, feedback: "Correct! This district uses SFTP, which means data is transferred via CSV files dropped into an SFTP directory." },
        ],
      },
      {
        id: "s1-2",
        question: "Check Clever for Diane Schmeler's account. Is her record present in Clever?",
        hint: "Search for the student directly in the Clever interface.",
        type: "choice",
        options: [
          { label: "Yes — she's in Clever", correct: false, feedback: "She's not in Clever yet — that's exactly why we're troubleshooting! The district says her account isn't populating." },
          { label: "No — she's not in Clever", correct: true, feedback: "Correct. The record is missing from Clever, so we need to trace why it isn't coming through." },
        ],
      },
      {
        id: "s1-3",
        question: "Since the sync type is SFTP, where should you check to inspect the incoming (raw) data?",
        hint: "For SFTP syncs, raw data arrives as files — not via an API normalizer.",
        type: "choice",
        options: [
          { label: "Hall Monitor → Normalizer Input", correct: false, feedback: "Normalizer Input is for API syncs. Since this district uses SFTP, the raw data comes in as files — check the SFTP Files tab instead." },
          { label: "Hall Monitor → SFTP Files", correct: true, feedback: "Exactly right. For SFTP syncs, you download and inspect the source CSV files from the SFTP Files tab in Hall Monitor." },
          { label: "The Clever Data Browser", correct: false, feedback: "The Data Browser shows what's already in Clever — it won't help you see what's being sent to Clever. Check the incoming files in Hall Monitor → SFTP Files." },
          { label: "CSV Analyst directly", correct: false, feedback: "CSV Analyst is a useful tool, but you should first download and locate the raw file in Hall Monitor → SFTP Files before running it through CSV Analyst." },
        ],
      },
      {
        id: "s1-4",
        question: "After reviewing the SFTP files, is Diane Schmeler's record present in the incoming data?",
        hint: "Download the students.csv from SFTP Files and search for her name or ID.",
        type: "choice",
        options: [
          { label: "Yes — she's in the file", correct: true, feedback: "Good find! She is present in the source data, which means the issue is on Clever's ingestion side, not with the data being sent." },
          { label: "No — she's missing from the file", correct: false, feedback: "She is actually present in the incoming file. The issue isn't that the district forgot to include her — it's something about how the file is formatted." },
        ],
      },
      {
        id: "s1-5",
        question: "Check Hall Monitor — is the sync currently on hold?",
        hint: "Look at the Holds tab in Hall Monitor for this district.",
        type: "choice",
        options: [
          { label: "Yes — sync is on hold", correct: false, feedback: "There's no hold on this sync. A hold would prevent all data from syncing, not just one student. Keep investigating." },
          { label: "No — no hold present", correct: true, feedback: "Correct, no hold. A sync hold would block everything, not just one student's record. Keep going." },
        ],
      },
      {
        id: "s1-6",
        question: "Is the sync currently paused?",
        hint: "Check the Sync page in Hall Monitor for a paused status.",
        type: "choice",
        options: [
          { label: "Yes — sync is paused", correct: false, feedback: "The sync is not paused. A pause would affect all SIS-synced data. The problem is more specific than that." },
          { label: "No — sync is not paused", correct: true, feedback: "Correct. The sync isn't paused, so we need to keep digging for a file-level issue." },
        ],
      },
      {
        id: "s1-7",
        question: "Check the Sync page for this district. Are there any errors listed that could explain the discrepancy?",
        hint: "Go to the Sync page (schools.clever.com/sync) for this district and review the most recent sync run.",
        type: "choice",
        options: [
          { label: "Yes — there are errors that explain it", correct: false, feedback: "There are actually no errors on the Sync page for this district. Move on to checking the files more carefully." },
          { label: "No — no relevant errors", correct: true, feedback: "Right. No errors on the Sync page, so the problem isn't being flagged directly. We need to look more carefully at the file structure itself." },
        ],
      },
      {
        id: "s1-8",
        question: "Check the SFTP Files tab. Were all five required files (schools.csv, students.csv, teachers.csv, sections.csv, enrollments.csv) uploaded at approximately the same time?",
        hint: "Compare the upload timestamps of each required file in Hall Monitor → SFTP Files.",
        type: "choice",
        options: [
          { label: "Yes — all uploaded together", correct: true, feedback: "Correct. All five required files were uploaded at roughly the same time, so the issue isn't a timing mismatch between files." },
          { label: "No — uploaded at different times", correct: false, feedback: "They were actually uploaded together. The five required files being uploaded at the same time is correct behavior — the issue lies elsewhere." },
        ],
      },
      {
        id: "s1-9",
        question: "Was any custom data or extension data uploaded at least 15–30 minutes before or after the main files?",
        hint: "Check if any non-standard files (like custom fields or extension CSVs) were uploaded separately from the five core files.",
        type: "choice",
        options: [
          { label: "Yes — custom data uploaded separately", correct: true, feedback: "Good catch. Custom/extension data should be uploaded at least 15–30 minutes apart from the five core files to avoid sync conflicts. This is the expected behavior here." },
          { label: "No — everything uploaded at once", correct: false, feedback: "There is actually custom data that was uploaded separately. Uploading extension data at a different time from the core files is correct procedure — it avoids sync issues." },
        ],
      },
      {
        id: "s1-10",
        question: "Are there any duplicate files in the SFTP directory (e.g., both 'Students.csv' and 'students.csv')?",
        hint: "Check the SFTP Files tab carefully for any files with the same name but different capitalization.",
        type: "choice",
        options: [
          { label: "Yes — duplicate files found", correct: false, feedback: "No duplicates here. Duplicate files (especially with different capitalization) are a common issue, but that's not what's happening in this case." },
          { label: "No — no duplicates", correct: true, feedback: "Correct. No duplicate files. The problem is something more subtle in the file content itself." },
        ],
      },
      {
        id: "s1-11",
        question: "Run CSV Analyst on the students.csv file. Does it give any clues?",
        hint: "CSV Analyst can detect formatting issues like extra commas, missing headers, or encoding problems.",
        type: "choice",
        options: [
          { label: "Yes — CSV Analyst found something", correct: true, feedback: "Bingo! CSV Analyst flagged an issue. Read the message carefully to determine what needs to be fixed." },
          { label: "No — CSV Analyst shows no issues", correct: false, feedback: "Actually, CSV Analyst does find something here. Run it on the students.csv file and read the output carefully." },
        ],
      },
      {
        id: "s1-12",
        question: "CSV Analyst returns this message: \"The following file includes extra commas: [students.csv] [line 2]\"\n\nWhat is the best next step?",
        hint: "An extra comma in a CSV file will break how that row is parsed — Clever won't be able to read that record correctly.",
        type: "choice",
        options: [
          { label: "Advise the district to remove the extra comma on line 2 of students.csv, then re-upload all five required files", correct: true, feedback: "Perfect! The extra comma on line 2 is corrupting Diane's record. The district needs to open students.csv, remove the extra comma, then re-upload all five required files (schools.csv, students.csv, teachers.csv, sections.csv, enrollments.csv) together so Clever picks up the fix on the next sync." },
          { label: "Escalate to Tier 2 to investigate the CSV parsing issue", correct: false, feedback: "This is a Tier 1 fix — no escalation needed. The CSV Analyst message tells us exactly what's wrong. The district just needs to remove the extra comma on line 2 of students.csv and re-upload all five required files." },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Student's old schedule still in system",
    subtitle: "Scenario 2",
    summary: "The schedule for Corby Adams includes his sections for the upcoming school year (term: S1), and we're not ready for students to see that!",
    districtUrl: "https://hall-monitor.int.clever.com/districts/6a04bf3a8e44b006a59ae3a4/info",
    steps: [
      {
        id: "s2-1",
        question: "Log into Hall Monitor and check the district info page. What is the sync type for this district?",
        hint: "Look at the Info tab in Hall Monitor — find the SYNC TYPE field.",
        type: "choice",
        options: [
          { label: "SFTP", correct: false, feedback: "Not this time — check the SYNC TYPE field again on the Info tab. This district uses a direct connection method, not file transfers." },
          { label: "API", correct: true, feedback: "Correct! This district uses an API sync (PowerSchool Plugin), which means data is pulled directly from the SIS via API rather than CSV files." },
        ],
      },
      {
        id: "s2-2",
        question: "Check Clever for Corby Adams' schedule. Is the extra schedule data present in Clever?",
        hint: "Look up the student in Clever and check their section/enrollment data.",
        type: "choice",
        options: [
          { label: "Yes — the extra sections are in Clever", correct: true, feedback: "Confirmed. The upcoming S1 sections are visible in Clever. Since the data is already there, the question becomes: why is Clever showing it?" },
          { label: "No — the data isn't there", correct: false, feedback: "The extra schedule data is actually present in Clever — that's what the district reported. We're investigating why it's showing up." },
        ],
      },
      {
        id: "s2-3",
        question: "Check the Data Browser for Corby Adams' section data. Is it custom data or SIS-synced?",
        hint: "In the Data Browser, look at the 'Data Source' column for the section records in question.",
        type: "choice",
        options: [
          { label: "Custom data", correct: false, feedback: "It's not custom data. Custom data would have been manually entered or uploaded separately. This data is coming from the SIS sync." },
          { label: "SIS-synced", correct: true, feedback: "Correct. The data is SIS-synced, meaning it's coming directly from PowerSchool. This tells us the problem is upstream — in how Clever ingests from the SIS." },
        ],
      },
      {
        id: "s2-4",
        question: "Since this is an API sync, where should you check to inspect the incoming (raw) data?",
        hint: "For API syncs, raw data comes through the normalizer. Navigate to Hall Monitor > Timeline > latest sync > powerschool-api-plugin-normalizer.",
        type: "choice",
        options: [
          { label: "Hall Monitor → SFTP Files", correct: false, feedback: "SFTP Files is for SFTP syncs. This district uses API (PowerSchool Plugin), so check the normalizer input instead: Hall Monitor > Timeline > latest sync > powerschool-api-plugin-normalizer." },
          { label: "Hall Monitor → Timeline → latest sync → powerschool-api-plugin-normalizer", correct: true, feedback: "Exactly right. For PowerSchool Plugin API syncs, you inspect the raw incoming data by going to Hall Monitor > Timeline, clicking into the latest sync, and finding the powerschool-api-plugin-normalizer step." },
        ],
      },
      {
        id: "s2-5",
        question: "After reviewing the Normalizer Input, are the extra S1 sections present in the incoming data?",
        hint: "Look for Corby's enrollment records in the normalizer input and check the term dates.",
        type: "choice",
        options: [
          { label: "Yes — the extra records are in the raw data", correct: true, feedback: "Correct. The extra sections are already present in the data coming from PowerSchool. This means the issue originates at the SIS/plugin level, not in Clever's processing." },
          { label: "No — they're not in the raw data", correct: false, feedback: "They are actually in the raw data. Since they're showing up in Clever AND in the normalizer input, the problem starts at the source — how PowerSchool Plugin sends data." },
        ],
      },
      {
        id: "s2-6",
        question: "Is the sync currently on hold?",
        hint: "Check the Holds tab in Hall Monitor.",
        type: "choice",
        options: [
          { label: "Yes — sync is on hold", correct: false, feedback: "The sync isn't on hold. A hold would prevent data from updating — but here the problem is data appearing that shouldn't be there yet." },
          { label: "No — no hold", correct: true, feedback: "Correct. No hold. The issue isn't about data being blocked — it's about extra data appearing that shouldn't show up yet." },
        ],
      },
      {
        id: "s2-7",
        question: "Is the sync currently paused?",
        hint: "Check the Sync page in Hall Monitor.",
        type: "choice",
        options: [
          { label: "Yes — sync is paused", correct: false, feedback: "The sync isn't paused. A pause affects SIS-synced data, but that's not the cause here." },
          { label: "No — not paused", correct: true, feedback: "Correct. Not paused. The extra sections are actively syncing in — so we need to understand why PowerSchool Plugin is sending them." },
        ],
      },
      {
        id: "s2-8",
        question: "This is a PowerSchool Plugin sync. Which Guru resource should you consult for known quirks about this integration?",
        hint: "Start at the Secure Sync Integrations List, then find the PowerSchool Plugin-specific card about missing or incorrect data.",
        type: "choice",
        options: [
          { label: "Clever Help Center: Sync Reports Error Messages", correct: false, feedback: "That article covers sync errors generally, but the answer here isn't an error — it's a known behavior of the PowerSchool Plugin. Look in Guru for the PowerSchool-specific card." },
          { label: "Guru: PowerSchool Plugin — Data Missing/Incorrect", correct: true, feedback: "That's the right card. The PowerSchool Plugin has known behaviors around how it handles term dates and section syncing — this card documents them." },
          { label: "Guru: PowerSchool Plugin — Coteachers", correct: false, feedback: "That card covers coteacher-specific issues. The problem here is about extra sections appearing — check the Data Missing/Incorrect card instead." },
          { label: "Guru: PowerSchool Plugin — Sync Errors", correct: false, feedback: "Sync errors would appear on the Sync page. Since there are no errors, the issue is a known behavior. Check the PowerSchool Plugin Data Missing/Incorrect card." },
        ],
      },
      {
        id: "s2-9",
        question: "Based on what you found in the Guru card, why are the upcoming S1 sections appearing in Clever?",
        hint: "The PowerSchool Plugin has a specific behavior around how it handles enrollments across school years and term dates.",
        type: "choice",
        options: [
          { label: "A sync error is incorrectly pulling future records", correct: false, feedback: "There are no sync errors here. This is expected behavior, not an error. The PowerSchool Plugin is designed this way." },
          { label: "The district accidentally uploaded future enrollment data manually", correct: false, feedback: "This data is SIS-synced, not manually uploaded. The cause is a known behavior of how the PowerSchool Plugin pulls enrollment data." },
          { label: "Clever syncs all sections for the current and future school years, regardless of term dates", correct: true, feedback: "Exactly. The PowerSchool Plugin pulls in all enrollments for the current school year and forward — it doesn't filter based on term start dates. This is a known limitation, not a bug." },
          { label: "The district's term dates are incorrectly configured in Clever", correct: false, feedback: "Term date configuration isn't the issue. The PowerSchool Plugin intentionally syncs all current and future year enrollments regardless of term dates — it's a known behavior documented in Guru." },
        ],
      },
      {
        id: "s2-10",
        question: "Now that you understand the cause, what is the correct next step?",
        hint: "This is a known PowerSchool Plugin limitation that Tier 1 cannot resolve alone. Think about what tools exist to control which data Clever exposes.",
        type: "choice",
        options: [
          { label: "Ask the district to manually delete the future sections from Clever", correct: false, feedback: "Manual deletion won't work — the sections will just re-sync on the next run. The underlying behavior needs to be addressed at the sync level." },
          { label: "Advise the district to fix the term dates in PowerSchool", correct: false, feedback: "Fixing term dates in PowerSchool won't change how the Plugin exports data — it pulls all current/future enrollments regardless. This needs a filter in Clever." },
          { label: "Escalate to Tier 2 for possible filtering options", correct: true, feedback: "Correct! Since the PowerSchool Plugin can't be configured to filter by term dates at Tier 1, you should explain the situation to the district and escalate to Tier 2. T2 can implement a filter to hide future-term sections until they're needed." },
          { label: "No action needed — this is expected and the district should accept it", correct: false, feedback: "While it is expected behavior, that doesn't mean we leave the district stuck. Escalating to Tier 2 for a filter is the right resolution to actually help them." },
        ],
      },
    ],
  },
];
