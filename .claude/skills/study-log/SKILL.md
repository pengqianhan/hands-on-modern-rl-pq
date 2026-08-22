---
name: study-log
description: Append today's study session to study_log.md at the repo root. Use when the user says the day's study is finished, or asks to record what was learned into the log.
---

# Write today's study-log entry

`study_log.md` at the repo root is a chronological log, earliest at the top. Its own
「写新条目的约定」 section holds the entry format — read it before writing, and follow it.

## Step 1 — Gather what actually happened

Three sources, all three consulted:

- **This conversation** — the concepts explained, the numbers printed by code that was run, the design decisions and their reasons.
- `git log --date=short --pretty='%ad %h %s'` filtered to today's date — the commits landed.
- `git status --short` — work finished but not yet committed.

Completion criterion: every file created, renamed, or deleted today appears in your draft, and every concept the user asked about has its explanation captured.

## Step 2 — Write the entry

Get the date from `date +%F`. Insert the entry after the last dated section and before `## 附：同步 main 的方法`, so the dates stay ascending and the two trailing sections stay at the bottom.

Write in Chinese, matching the surrounding entries' voice.

What earns a line: the **reason** behind a choice, the **measured numbers** a run produced, the **gotcha** that cost time. What the repo already records — file structure, commit messages, code the reader can open — stays out unless the entry needs it to make a point. An entry that only lists filenames restates `git log` and earns nothing.

Concepts learned carry their concrete evidence: the formula, and the numbers the notebook actually printed. A concept without its numbers is a definition the user could have read anywhere.

Absolute dates only — a later reader has no "today".

## Step 3 — Verify placement

```bash
grep -n '^## ' study_log.md
```

Completion criterion: dated headings ascend, the new one is last among them, and `附：同步 main 的方法` / `写新条目的约定` still close the file.

Report the entry's heading and its sub-sections, and leave the commit to the user.
