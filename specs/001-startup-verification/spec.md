# Feature specification: API local startup verification

## Context and scope

A maintainer needs a repeatable way to tell whether the existing `apps/api` service has actually started and can answer an HTTP request. A successful TypeScript build or an in-process test alone does not establish that the standalone server is listening.

This feature specifies documentation and verification expectations for the existing API only. It does not change application behavior. The verification target is a locally started API process and its `GET /health` response. Both the development script and the compiled `start` script are in scope. Docker Compose, `apps/web`, Terraform, Python harnesses, deployments, and new health or business functionality are out of scope.

The repository currently defines `npm run dev`, `npm run build`, `npm start`, and `npm test` in `apps/api/package.json`. `src/config.ts` defaults to host `0.0.0.0` and port `4000`; `src/app.ts` implements `GET /health` with `{ "status": "ok" }`; `tests/products.test.ts` exercises that route with Fastify `app.inject()`, which does not establish that the standalone server bound a port. The package manifest does not declare a local Node.js version. The API Dockerfile uses Node 22, but Docker is not part of this feature's verification scope.

The API README refers to copying `apps/api/.env.example`, but that file is not present in the current checkout. Startup instructions MUST state environment defaults based on `src/config.ts` and MUST NOT depend on copying a file that is absent. A non-empty `PORT` is parsed as an integer and the parsed value must be from 1 through 65535; an empty `PORT` is treated as unset and uses the default 4000. `HOST` can override the listen interface. No local runtime-version pin is declared in `package.json`.

### In scope

- Document the prerequisites and exact existing commands to install API dependencies, build, run API tests, start in development mode, and start the compiled server.
- Define a live startup check using an HTTP request to `/health`, with the expected HTTP status and JSON body.
- Distinguish process/listener/HTTP verification from build and in-process test results.
- Describe relevant configuration defaults, shutdown, and common startup failures without promising behavior not present in the code.
- State that evidence is limited to `apps/api` and does not validate the web app, Docker, infrastructure, or Python harnesses.

### Out of scope

- Any application code, endpoint, data, API contract, or runtime behavior change.
- Docker Compose startup or container health-check validation.
- Web, infrastructure, security-audit, Python harness, deployment, or production verification.
- Selecting or adding a Node.js version policy, dependency, health endpoint, or observability feature.

### Assumptions

- The operator has Node.js and npm installed at versions compatible with the existing API package and lockfile; the package does not itself pin a local Node.js version.
- Dependency installation has completed before starting the process.
- Unless overridden, the process listens on port `4000` and host `0.0.0.0`; the local HTTP check can target `127.0.0.1:4000`.
- The verification procedure is documentation and acceptance criteria, not evidence that the commands have already been run.

### Command contract (run from the repository root)

- Install API dependencies: `npm ci --prefix apps/api --ignore-scripts --no-audit --no-fund`.
- Build the API: `npm run build --prefix apps/api`.
- Run API tests: `npm test --prefix apps/api`.
- Start development mode: `npm run dev --prefix apps/api`.
- Start the compiled server after building: `npm start --prefix apps/api`.
- Check the live local endpoint while either server process is running: `curl --fail --show-error --include http://127.0.0.1:4000/health`.

The live check succeeds only when the response status is 200 and its JSON body is `{ "status": "ok" }`. The build and tests are supporting API-scoped checks, not substitutes for this request. Stop the foreground server with its normal interrupt signal after checking it.

## User scenarios

### US1 — Start the API in development mode (P1)

A maintainer wants to start the API locally and establish that the process is responding over HTTP, rather than infer readiness from a successful build or test run.

- Given API dependencies are installed and the default port is available, when the maintainer runs `npm run dev --prefix apps/api` and requests `GET http://127.0.0.1:4000/health`, then the response MUST be HTTP 200 with JSON body `{ "status": "ok" }`.
- Given the API is responding to the health request, when the maintainer stops the development process with its normal interrupt signal, then the documented procedure MUST describe that the process is stopped and how to interpret its shutdown message without requiring a code change.

### US2 — Start the compiled API locally (P2)

A maintainer wants to verify the server entry point used after compilation.

- Given the API build completed successfully and the default port is available, when the maintainer runs `npm start --prefix apps/api` and requests `GET http://127.0.0.1:4000/health`, then the response MUST be HTTP 200 with JSON body `{ "status": "ok" }`.
- Given the configured port is invalid or already occupied, when the maintainer attempts startup, then the instructions MUST identify the failed process startup as a failure and MUST NOT describe a successful build or an in-process test as proof that the listener is available.

### US3 — Interpret API validation results accurately (P1)

A maintainer wants to run the configured API build and tests without overgeneralizing their result.

- Given the maintainer runs the configured API build and test commands, when reporting their outcome, then the report MUST identify the exact API-scoped command and MUST distinguish those results from the live HTTP startup check.
- Given the maintainer has only run API-scoped commands, when describing validation coverage, then the documentation MUST NOT claim that `apps/web`, Docker Compose, Terraform, or Python harnesses were validated.

## Functional requirements

- **FR-001:** The startup instructions MUST use commands that exist in `apps/api/package.json` and identify `apps/api` as their scope; the dependency-install command MUST match the repository's configured install command.
- **FR-002:** The instructions MUST provide a live HTTP readiness check for `GET /health` and specify the required HTTP 200 status and JSON body `{ "status": "ok" }`.
- **FR-003:** The instructions MUST distinguish the live listener/HTTP check from `npm run build` and `npm test`; these commands alone MUST NOT be presented as proof of a standalone server startup.
- **FR-004:** The instructions MUST state the current defaults (`HOST=0.0.0.0`, `PORT=4000`), explain that `HOST` and a valid `PORT` may be overridden, and MUST NOT direct users to copy the absent `.env.example` file.
- **FR-005:** The instructions MUST identify the API process as failed when it cannot bind/listen, including invalid or unavailable ports, and MUST describe normal local process termination without changing shutdown behavior.
- **FR-006:** Validation statements MUST be limited to the commands and behavior actually checked for `apps/api`; they MUST explicitly leave web, Docker, Terraform, and Python validation unclaimed.
- **FR-007:** This feature MUST NOT modify API application functionality or add an endpoint, dependency, runtime setting, or infrastructure behavior.

## Edge cases

- Port `4000` is already occupied: startup cannot be treated as successful; an alternate valid `PORT` may be used for a local check.
- An empty `PORT` is treated as unset and uses the default 4000. A non-empty `PORT` whose parsed integer is outside 1–65535 or is not a number fails configuration/startup.
- `HOST` differs from the default: the request must target an address reachable through that configured interface; a loopback URL is not guaranteed to work for every host setting.
- Build or tests pass but the server process is not running: readiness remains unverified until the live HTTP request succeeds.
- The API README references `.env.example`, but the file is absent in this checkout: do not make that copy step a prerequisite.
- Node.js/npm is missing or incompatible: record this as an environment prerequisite/blocker; do not infer a supported local version from the Dockerfile.
- A request to `/health` receives a connection error, non-200 status, or unexpected body: startup verification fails, even if the process printed a startup message.

## Success criteria

- **SC-001:** For both documented local modes (development and compiled), an operator can perform a request to `/health` and determine success unambiguously from HTTP 200 and the exact JSON body `{ "status": "ok" }`.
- **SC-002:** Every documented install, build, test, and start command matches a script or configured command present in the API package/repository, and identifies its API-only scope.
- **SC-003:** The instructions make it impossible to confuse a successful build or `app.inject()` test with a live server/listener check.
- **SC-004:** The documented validation boundary explicitly excludes web, Docker Compose, Terraform, and Python harnesses; no result for those layers is implied.
- **SC-005:** No API functionality, endpoint, dependency, or runtime behavior is changed to satisfy this feature.

## Clarifications

### Session 2026-11-01

- Question: How should the specification describe `PORT=""` given the existing configuration parser?
- Human answer: Revise the spec to reflect the existing fallback to port 4000; do not change API behavior.
- Resolution: An empty `PORT` is treated as unset and uses 4000. Only non-empty invalid port values fail validation.
- Question: Which environment should the `apps/api` startup verification cover?
- Human answer: Only local API startup and an HTTP check of `/health`; Docker Compose is excluded.
- Resolution: The scope and scenarios cover the local development and compiled API start scripts only, with `GET /health` as the readiness check. No Docker Compose acceptance scenario is included.
