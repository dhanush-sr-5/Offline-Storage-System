# Office Learning Day 1 — Complete Study Guide

**Project:** Offline Storage System  
**Topics:** Git, GitHub, project architecture, HTTP/REST, Express.js, MongoDB  
**Use:** Offline self-study during available office downtime.

> Follow workplace IT and acceptable-use policies. Use only approved devices, environments, networks, and non-confidential material. Do not install software or experiment on production systems without permission. Never put passwords, API keys, tokens, or company-confidential information in GitHub.

## How to study

Use one block per 25–40 minute session. For each topic: understand the concept, explain it in your own words, connect it to our project, then answer the interview questions.

## Block 1 — Git fundamentals

Git is a distributed version-control system. It tracks file changes, preserves history, supports branches, and helps developers collaborate. Git works locally; GitHub hosts repositories and adds collaboration features.

Key terms:
- **Repository:** project folder tracked by Git, including its history.
- **Working tree:** current files on your computer.
- **Staging area:** changes selected for the next commit.
- **Commit:** saved snapshot of staged changes.
- **Remote:** another copy of the repository, commonly on GitHub.
- **Branch:** a movable name pointing to a line of commits.

### The three commands

```bash
git add path/to/file
git commit -m "Add upload validation"
git push
```

- `git add` stages changes. It does not upload them.
- `git commit` records staged changes locally. It does not upload them.
- `git push` sends local commits to the configured remote branch.

Useful inspection commands:

```bash
git status
git diff
git diff --staged
git log --oneline -5
git remote -v
```

Safe workflow:

```bash
git status
# edit files
git diff
git add path/to/file
git diff --staged
git commit -m "Describe the change"
git push
```

Prefer staging specific files rather than blindly staging everything in projects containing uploads, logs, generated data, or environment files.

## Block 2 — GitHub workflow

### main and feature branches

The `main` branch is commonly the primary stable line of work. A feature branch isolates a change for review.

```bash
git switch main
git pull
git switch -c feature/add-file-validation
```

After editing and testing:

```bash
git add path/to/file
git commit -m "Add file validation"
git push -u origin feature/add-file-validation
```

### Pull requests and reviews

A pull request proposes merging one branch into another. Reviewers inspect the change, ask questions, and request improvements. Automated checks may run tests before merging.

### Merge conflicts

A conflict occurs when Git cannot automatically combine overlapping changes. Read the conflict markers, decide the correct combined content, remove markers, run tests, then stage and commit the resolution. Never choose one side without understanding what would be lost.

Good commit message: `Add pagination to record listing`. Weak: `changes`, `final`, or `fixed stuff`.

## Block 3 — Offline Storage System architecture

The project stores original uploaded inputs and related processed outputs, with metadata used to find and retrieve records. The recent development checkpoint includes tested upload, output storage/retrieval, record listing, search/filter/date range/sorting/pagination, input download, and deletion of a record together with its uploaded original file.

Conceptual request flow:

```text
Browser / client
      | HTTP request
      v
Node.js + Express API
      | validate request and file
      | apply business rules
      +--------------------+
      |                    |
      v                    v
MongoDB              File storage
(metadata)           (original uploads)
      |                    |
      +---------+----------+
                v
          HTTP response
```

This is conceptual. Check the actual repository for route names, middleware, storage paths, schema, and folder structure before assuming implementation details.

### Why separate metadata and file bytes?

MongoDB is useful for structured fields such as record ID, original filename, upload date, processing type, output format, and storage reference. The original file can live on disk or in a dedicated file store. This makes metadata searchable while large files are handled separately.

Illustrative record (field names are examples, not a claim about the exact schema):

```json
{
  "_id": "generated-record-id",
  "originalName": "invoice.pdf",
  "storedFileName": "unique-safe-name.pdf",
  "createdAt": "2026-11-05T09:00:00Z",
  "outputFormat": "json",
  "output": { "total": 1250 }
}
```

Think about:
- What if the file is saved but the MongoDB insert fails?
- What if the database record is deleted but file deletion fails?
- Are uploaded filenames safe and unique?
- Are file size and allowed file types restricted?
- Are filters validated and common queries indexed?
- Are backup and restore procedures documented and tested?

## Block 4 — HTTP, REST APIs, and Express.js

HTTP is a request/response protocol. A request has a method, path, headers, and sometimes a body. A response has a status code, headers, and usually a body.

### Common methods

| Method | Purpose | Project example |
|---|---|---|
| GET | Read data | List records or download an input |
| POST | Submit/create | Upload a document or audio job |
| PUT | Replace resource | Replace a complete record representation |
| PATCH | Partial update | Change selected metadata |
| DELETE | Remove resource | Delete a record and its stored original |

### Common status codes

| Code | Meaning | Typical use |
|---|---|---|
| 200 | OK | Successful read/action |
| 201 | Created | New record created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Authentication missing/invalid |
| 403 | Forbidden | User lacks permission |
| 404 | Not Found | Record/file does not exist |
| 409 | Conflict | Request conflicts with resource state |
| 500 | Internal Server Error | Unexpected server failure |

REST in simple terms:
- URLs identify resources, e.g. `/api/records`.
- HTTP methods express the action.
- Requests and responses use predictable formats such as JSON or multipart form data.
- Stateless requests carry the information needed to process them, unless the API explicitly uses sessions.

### Express.js

Express is a Node.js web framework for defining routes, using middleware, reading request data, and sending responses.

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(3000);
```

This is a learning example, not a complete production server.

Request parts:
- **Route parameter:** `/api/records/:id` — ID is part of the URL path.
- **Query parameter:** `/api/records?page=2&limit=10` — useful for filtering/pagination.
- **Request body:** JSON or form fields.
- **Headers:** metadata such as Content-Type and Authorization.
- **Multipart form data:** often used when a request contains a file and other fields.

Middleware runs in the request pipeline. It can inspect or modify a request, validate input, authenticate a user, log activity, or pass control onward. It must finish the response or call `next()`; otherwise a request can hang.

```javascript
app.use((req, res, next) => {
  console.log(req.method, req.path);
  next();
});
```

Validate input near the API boundary. Handle unexpected failures centrally. Do not expose stack traces, internal paths, database details, or secrets to clients.

## Block 5 — MongoDB fundamentals

- **Database:** container for collections.
- **Collection:** group of related documents.
- **Document:** BSON record made of field/value pairs.
- **ObjectId:** common MongoDB identifier type.

Illustrative document:

```json
{
  "_id": "ObjectId(...)",
  "originalName": "meeting-audio.wav",
  "type": "audio",
  "createdAt": "2026-11-05T09:00:00Z",
  "status": "completed"
}
```

### Filtering, sorting, pagination

Filtering narrows matching records. Sorting controls order. Pagination returns a manageable slice.

```javascript
db.records.find({ type: 'audio' })
  .sort({ createdAt: -1 })
  .skip(20)
  .limit(10)
```

This is page 3 if page numbering starts at 1 and page size is 10. Validate page and limit values and set a sensible maximum.

### Indexes

An index can help MongoDB find matching documents without scanning the entire collection. Indexes speed up some queries and sorts, but use storage and add work to writes. Choose indexes based on actual query patterns.

### Database vs file storage

A database suits structured metadata and relationships. A file store suits documents, audio, images, and other binary content. If a record stores a file path or storage key, keep the reference valid and prevent abuse that could access arbitrary files.

### Backups

A backup is useful only if it can be restored. Back up both database metadata and associated uploaded files, protect backup media, define retention, and test restoration. A database-only backup may not recover files stored elsewhere.

## Practical exercises

Use a personal practice repository or an authorized development copy. Do not experiment against production data without permission.

1. **Git inspection:** Run `git status`, `git log --oneline -5`, make a harmless edit in a practice file, inspect `git diff`, stage only that file, and inspect `git diff --staged`.
2. **API design:** On paper, design endpoints for listing records, uploading input, retrieving a record, downloading its original, retrieving output, and deleting a record. For each, note method, path, input, success status, and two possible errors.
3. **Data model:** Sketch a MongoDB record with ID, original filename, file storage reference, creation date, processing type, and output reference/value. Mark required and potentially indexed fields.
4. **Failure scenarios:** Consider file save success/database failure; database record with missing file; unknown ID; oversized file; and two users trying to update/delete the same record. Write the expected response and recovery approach.

## Interview questions with model answers

1. **What is Git?** A distributed version-control system used to track source changes, inspect history, and collaborate using branches.
2. **Git vs GitHub?** Git is the version-control tool. GitHub hosts repositories and provides collaboration features such as pull requests and reviews.
3. **What does git add do?** Stages selected changes for the next commit; it does not commit or upload them.
4. **What is a commit?** A recorded snapshot of staged changes in the local repository, with a unique ID and message.
5. **What does git push do?** Sends local commits to a remote repository branch.
6. **Why use feature branches?** They isolate work, reduce risk to main, and make review/testing easier.
7. **What is a pull request?** A proposal to merge one branch into another, usually with review and automated checks.
8. **What is a REST API?** An API style exposing resources through URLs and using HTTP methods/status codes to perform and describe operations.
9. **GET vs POST?** GET retrieves a representation; POST submits data, often creating a resource or triggering processing.
10. **What is Express middleware?** A function in the request pipeline that can inspect/change request or response, end the response, or pass control onward.
11. **req.params vs req.query?** params contains named path segments such as an ID; query contains URL query-string values such as page or limit.
12. **What does HTTP 404 mean?** The requested resource was not found.
13. **What is MongoDB?** A document-oriented NoSQL database that stores BSON documents in collections.
14. **What is an index?** A data structure that can speed up queries and sorts, at the cost of storage and extra write overhead.
15. **Why separate file bytes and metadata?** Metadata is easy to query in a database; large binary files can be stored separately and referenced by a key/path.
16. **Why paginate API results?** To limit response size and database work, improving performance and usability.
17. **What is input validation?** Checking incoming values against expected types, formats, ranges, and business rules before processing.
18. **Authentication vs authorization?** Authentication verifies identity; authorization decides what that identity may do.
19. **Why not commit secrets?** Repository history can retain exposed secrets even after deletion. Store secrets outside source control and rotate exposed credentials.
20. **Why test backups by restoring them?** A backup may be incomplete or corrupt. A restore test verifies that recovery works.

## Quick revision

- Git: add = stage; commit = save snapshot locally; push = send commits to remote.
- GitHub: branch isolates work; PR proposes a merge; review checks quality.
- HTTP: method describes action; URL identifies resource; status code reports outcome.
- Express: routes match requests; middleware runs in the request pipeline.
- MongoDB: database → collection → document; indexes can accelerate common queries.
- Offline deployment: office clients communicate with the server over the LAN; normal operation need not require public internet.
- Security: validate inputs, restrict file access, protect secrets, use least privilege, and test backups.

## Self-assessment

Try these without looking back. Give yourself one point for each clear answer:
1. Explain add vs commit vs push.
2. Describe a feature branch and pull request.
3. Draw the upload request flow through the backend.
4. Choose a method and status code for a missing record.
5. Explain route parameters vs query parameters.
6. Explain what Express middleware does.
7. Describe a MongoDB collection and document.
8. Explain why indexes have a cost.
9. Describe how metadata links to an uploaded file.
10. Name two safeguards for an offline office API.

**Score:** 9–10 = strong first pass; 7–8 = revise weak areas; 5–6 = reread and retry; below 5 = slow down and practise examples.

## Next session

Next, study backend quality: input validation, safe file handling, consistent API responses, centralized error handling, safe logging, and reliability. Before changing the project, inspect the current implementation and existing tests.

*Examples are illustrative and may not match the repository's exact routes or schema. Verify against the current code before applying them.*
