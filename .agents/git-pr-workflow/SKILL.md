---
name: git-pr-workflow
description: >-
  Interactive and guidance-oriented git workflow for identifying, reproducing,
  fixing, verifying, and contributing bug fixes to open-source repositories via PR.
  Explains each step and requests user confirmation before executing commands.
---

# Git PR Contribution Workflow (Interactive & Guidance-Oriented)

## Overview
This skill provides an interactive step-by-step guideline for the agent to follow when assisting a user with a bug fix and PR contribution. The agent must explain the rationale of each step, present the exact commands to be run, and wait for user approval before modifying Git state or starting dev servers.

## Dependencies
None.

## Interactive Protocol (Crucial)
1. **Explain First**: Before executing any command that changes Git branches, modifies code, runs commands, or deletes branches, explain the concept and purpose of the action in detail.
2. **Present Commands**: Show the exact command lines to the user.
3. **Ask for Approval**: Explicitly ask the user for permission to execute the action (e.g., "Should I proceed with running this command?"). Do not execute modifying commands silently.
4. **Learn-by-Doing**: Guide the user through the process so they can understand and learn the Git contribution workflow.

## Workflow

### 1. Bug Analysis & Local Reproduction (Mandatory)
Before making any changes, guide the user to reproduce the bug to verify its existence:
1. Discuss the bug description and analyze which files are likely responsible.
2. Inspect the project files (e.g., `package.json` or project scripts) to find the correct local run/dev/test command.
3. Explain the reproduction setup to the user.
4. **[User Approval Required]** Ask for permission to launch the dev/test server to reproduce the bug.
5. Once verified, ask the user for permission to stop/kill the server before proceeding.

### 2. Synchronization and Clean Branching
To prepare a clean branch based on the latest upstream codebase:
1. Explain the purpose of syncing with the official (`upstream`) repository.
2. **[User Approval Required]** Ask for permission to checkout the `main` branch: `git checkout main`.
3. **[User Approval Required]** Ask for permission to sync `main` with upstream: `git pull upstream main`.
4. **[User Approval Required]** Ask for permission to update the user's fork: `git push origin main`.
5. Explain branch naming conventions (e.g., `fix/kebab-case-description`).
6. **[User Approval Required]** Ask for permission to create and switch to the new branch: `git checkout -b fix/<bug-description>`.

### 3. Implement the Fix
1. Apply the minimum changes required.
2. Explain the code edits to the user and ensure they are aligned on the fix.

### 4. Local Verification
1. Explain how the fix will be verified.
2. **[User Approval Required]** Ask for permission to run the verification server or test suite.
3. Verify that the bug is resolved.
4. **[User Approval Required]** Ask for permission to stop/kill the verification server.

### 5. Conventional Commit
1. Verify `git status` to ensure only the intended files are modified.
2. Explain the [Conventional Commits](https://www.conventionalcommits.org/) format.
3. **[User Approval Required]** Present the commit message and ask for permission to stage and commit:
   ```bash
   git add <files>
   git commit -m "fix: <short summary>

   <longer description of problem and fix>

   Fixes #<issue-number>"
   ```

### 6. Push and Create Pull Request
1. Explain that the branch needs to be pushed to their personal Fork (`origin`).
2. **[User Approval Required]** Ask for permission to push: `git push origin fix/<bug-description>`.
3. Provide the user with the fork URL and guide them through the GitHub PR creation UI.
4. Give the user pre-formatted PR titles and descriptions to copy-paste.

### 7. Post-Merge Cleanup
Once the PR is merged into the upstream repository:
1. Explain the cleanup process to delete temporary branches and sync local workspace.
2. **[User Approval Required]** Switch to `main` and pull from upstream: `git checkout main && git pull upstream main`.
3. **[User Approval Required]** Push updated `main` to Fork: `git push origin main`.
4. **[User Approval Required]** Delete the local fix branch: `git branch -d fix/<bug-description>` (or `-D` if squash merged).
5. **[User Approval Required]** Delete the remote branch on the Fork: `git push origin --delete fix/<bug-description>`.

## Error Handling
Stop immediately and ask the user for manual guidance if:
- Git merge/pull conflicts occur.
- Pushes to remote fail.
- Dev server or build verification throws errors.

## Common Mistakes
- **No branch synchronization**: Syncing with `upstream` is critical to avoid merge conflicts.
- **Committing to main/study branches**: PRs should always originate from clean feature branches.
- **Skipping pre-fix reproduction**: Skipping reproduction makes it hard to prove the fix actually resolved the issue.
