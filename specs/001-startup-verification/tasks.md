# Tasks: API local startup verification

## Setup
- [x] T001 [US1] Obtain human approval for revising `specs/001-startup-verification/spec.md` so `PORT=""` matches the existing fallback to port 4000; keep this approval gate ahead of implementation and do not change API behavior.

## Foundations
- [x] T002 [US1] Update `apps/api/README.md` with compatible Node.js/npm prerequisites, `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund`, current `HOST=0.0.0.0` and `PORT=4000` defaults, valid environment overrides, loopback reachability caveats, and no dependency on the absent `.env.example`; document the empty-`PORT` fallback only after T001 approves matching spec wording; depends on: T001

## User story 1 — Development startup
- [x] T003 [US1] Document and verify development startup in `apps/api/README.md` using `npm run dev --prefix apps/api` and `curl --fail --show-error --include http://127.0.0.1:4000/health`; require HTTP 200 with JSON `{ "status": "ok" }`, and describe Ctrl+C shutdown and the meaning of the `shutting down` message; depends on: T002

## User story 2 — Compiled startup
- [x] T004 [US2] Document and verify compiled startup in `apps/api/README.md` using `npm run build --prefix apps/api`, `npm start --prefix apps/api`, and `curl --fail --show-error --include http://127.0.0.1:4000/health`; record build and HTTP outcomes separately, require HTTP 200 with JSON `{ "status": "ok" }`, and describe occupied/invalid-port and bind failures as startup failures, not successful readiness; depends on: T003

## User story 3 — Interpret validation results
- [x] T005 [US3] Document in `apps/api/README.md` that `npm run build --prefix apps/api` and `npm test --prefix apps/api` are API-scoped checks distinct from live listener verification; explicitly state that API-only results do not validate `apps/web`, Docker Compose, Terraform, or Python harnesses; depends on: T004

## Integration and polish
- [x] T006 [US3] Run `npm test --prefix apps/api` and record its observed result separately from both live startup checks; retain the exact API-only scope in `apps/api/README.md`; depends on: T005
- [ ] T007 [US1] Review the final change with `git diff --check` and `git diff --name-only`; confirm `apps/api/README.md` is the only feature file changed and no application code, tests, dependencies, runtime settings, or infrastructure were modified; depends on: T006

## Execution notes

- Tasks are intentionally serial: the documentation edits share `apps/api/README.md`, and the two startup checks use the default port and must not run concurrently.
- T001 is a human approval gate. Do not edit the approved specification or begin implementation until that gate is satisfied.
- Run the configured build command in T004; its expected emitted artifact is `apps/api/dist/`. The configured API validation commands are `npm run build --prefix apps/api` and `npm test --prefix apps/api`.
- Record command output and live HTTP status/body as evidence. A successful build or `app.inject()` test is not evidence that the standalone server is listening.
- Validation is limited to `apps/api`; do not claim that the web app, Docker Compose, Terraform, or Python harnesses were validated.
