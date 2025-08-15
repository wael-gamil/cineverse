# Contributing to CineVerse

Thanks for your interest. This document only covers how to report issues and the preferred branching & commit message conventions.

## Reporting issues

When opening an issue, provide the following to help maintainers reproduce and triage quickly:

- Title: short and descriptive
- Steps to reproduce: numbered steps
- Expected vs actual behavior
- Environment: Node version, OS, browser (if relevant)
- Logs, stack traces, or screenshots
- If applicable, a minimal code sample or the API request/response

Do not include secrets, tokens, or personal data in issues. If the report contains sensitive information, contact a maintainer privately.

## Branching & commit messages

- Create a short-lived feature branch off the repository default branch (e.g. `main`):

  ```bash
  git checkout -b feature/short-description
  ```

- Keep commits small and focused. Use clear commit messages in this format:

  - `<Type>: <short description>`

  Common types:

  - `Feat:` - new feature
  - `Fix:` - bug fix
  - `Docs:` - documentation only changes
  - `Refactor:` - code changes that neither fix a bug nor add a feature
  - `chore:` - maintenance tasks

  Examples:

  - `Fix: correct poster image fallback`
  - `Feat: add per-filter totalElements cache (#456)`
  - `Docs: update contributing guide`

- To automatically close an issue when the PR/commit is merged, include `Fixes #<issue-number>` or `Closes #<issue-number>` in the PR description or commit message.

---

If you need more guidance, open an issue and a maintainer will assist.
