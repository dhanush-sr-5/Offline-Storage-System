# Office Free-Time Learning Plan

**Project:** Offline Storage System  
**Repository:** `dhanush-sr-5/Offline-Storage-System`  
**Branch:** `main`  
**Purpose:** Use short, focused study blocks during available office downtime. Follow office IT and device-use policies; do not install tools, access restricted systems, or move company data without permission.

## Learning order

1. Git and GitHub fundamentals
2. Understand the existing Offline Storage System
3. Backend/API engineering with Node.js and Express
4. MongoDB and data modelling
5. Testing, security, and reliability
6. Offline LAN deployment and operations

## Tomorrow's study checklist

Work through these in order. Each block is designed for approximately 25–40 minutes. If you have less time, finish the current block and continue next time.

### Block 1 — Git fundamentals (25–30 min)

- [ ] Understand repository, working tree, staging area, commit, branch, and remote.
- [ ] Learn what `git status`, `git add`, `git commit`, `git log --oneline`, and `git diff` do.
- [ ] Understand `git pull` versus `git push`.
- [ ] Learn why we check `git status` before committing.
- [ ] Write a short explanation of the normal edit → review → stage → commit → push workflow.

**Practice (only in a personal/local practice repository):**
```bash
git status
git log --oneline -5
git diff
```

### Block 2 — GitHub workflow (25–30 min)

- [ ] Understand `main` and why feature branches are useful.
- [ ] Learn how to create and switch branches: `git switch -c feature/name`.
- [ ] Understand pull requests, reviews, merge conflicts, and resolving conflicts.
- [ ] Learn how to write clear commit messages.
- [ ] Identify the difference between pushing code and opening a pull request.

### Block 3 — Understand our current project (30–40 min)

- [ ] Review the project README and folder structure.
- [ ] Draw the request flow: client → Express route → middleware/controller → MongoDB and file storage → response.
- [ ] Explain how an uploaded original file and its processed output are associated with one record.
- [ ] Review the existing API capabilities: upload, list, search/filter, pagination, download, output retrieval, and deletion.
- [ ] Write down anything whose purpose is unclear. Do not change working code just to experiment.

### Block 4 — REST API and Express revision (25–35 min)

- [ ] Understand HTTP methods: GET, POST, PATCH/PUT, DELETE.
- [ ] Understand status codes: 200, 201, 400, 401, 403, 404, 409, and 500.
- [ ] Learn route parameters, query parameters, request body, and multipart file upload.
- [ ] Understand middleware and centralized error handling.
- [ ] Practise explaining one existing endpoint from request to response.

### Block 5 — MongoDB fundamentals (25–35 min)

- [ ] Understand database, collection, document, and ObjectId.
- [ ] Review how a project record stores metadata and file locations.
- [ ] Learn filtering, sorting, pagination, and indexes.
- [ ] Understand why file bytes and record metadata may be stored separately.
- [ ] Learn what a database backup is and why restore testing matters.

## Follow-on learning plan

Complete these in later office free-time sessions, in order.

### Session 2 — Backend quality

- [ ] Input validation and safe file handling.
- [ ] Consistent API response structure.
- [ ] Centralized error handling and useful error messages.
- [ ] Logging without exposing passwords, tokens, or sensitive file contents.
- [ ] File size/type limits and safe filenames.

### Session 3 — Testing and reliability

- [ ] Unit tests versus integration tests.
- [ ] Test successful uploads and invalid uploads.
- [ ] Test missing IDs, missing files, and database failures.
- [ ] Test deletion carefully using disposable test records.
- [ ] Learn retry behaviour, timeouts, and idempotency for integrations.

### Session 4 — Security basics

- [ ] Authentication versus authorization.
- [ ] Role-based access control.
- [ ] Secure handling of secrets with environment variables.
- [ ] Principle of least privilege.
- [ ] Protect upload/download endpoints and validate file paths.
- [ ] Understand audit logs and retention policies.

### Session 5 — Offline deployment and networking

- [ ] Understand localhost, private IP addresses, subnet masks, gateway, and DNS.
- [ ] Understand LAN access versus internet access.
- [ ] Learn how a client reaches an API on an internal server.
- [ ] Understand firewall rules and listening ports.
- [ ] Learn how Node.js applications run as Windows/Linux services.
- [ ] Review offline dependency transfer and version pinning.
- [ ] Understand backup location, restore procedure, and monitoring.

### Session 6 — Deployment readiness

Use the existing `documentation/OFFLINE_DEPLOYMENT_QUESTIONNAIRE.md` to collect approved, non-secret infrastructure details.

- [ ] Confirm server hardware and operating system with the responsible IT team.
- [ ] Confirm whether Node.js and MongoDB are approved.
- [ ] Confirm static internal IP/hostname and permitted ports.
- [ ] Confirm expected users, file sizes, retention, and backup requirements.
- [ ] Confirm how the document and audio-processing applications will call the internal API.
- [ ] Never put credentials, passwords, API keys, or confidential company information in GitHub.

## How to study each topic

For every topic:

1. Read/watch one short explanation.
2. Write the concept in your own words.
3. Draw a small diagram or write one example.
4. Explain how it applies to our Offline Storage System.
5. Bring doubts or notes back to our next session.

## Progress tracker

| Session | Focus | Status |
|---|---|---|
| Tomorrow — Block 1 | Git fundamentals | Not started |
| Tomorrow — Block 2 | GitHub workflow | Not started |
| Tomorrow — Block 3 | Project architecture | Not started |
| Tomorrow — Block 4 | REST API and Express | Not started |
| Tomorrow — Block 5 | MongoDB fundamentals | Not started |
| Session 2 | Backend quality | Not started |
| Session 3 | Testing and reliability | Not started |
| Session 4 | Security basics | Not started |
| Session 5 | Offline deployment and networking | Not started |
| Session 6 | Deployment readiness | Not started |

## Current project checkpoint

The recent development checkpoint includes tested upload, output storage/retrieval, record listing, search/filter/date range/sorting/pagination, input download, and deletion of a record together with its uploaded original file. Continue from the next planned development step after revising the foundations above; verify the current code and tests before making changes.

**Rule:** Learning and note-taking can happen during short downtime. Make code changes and run deployments only in an authorized personal development environment or with explicit workplace permission.
