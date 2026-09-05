# CodeArena — Frontend Project File

This file is the single source of truth for the frontend build. It contains
the tech stack, project structure, and a ready-to-use build prompt for
every page/feature. Hand this whole file to Person 1, or feed each section
into an AI coding tool one at a time.

---

## 1. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18 + TypeScript** | Type safety, large ecosystem, matches Monaco's official React bindings |
| Build Tool | **Vite** | Fast dev server, instant HMR |
| Styling | **Tailwind CSS** | Rapid, consistent styling, easy dark mode |
| Code Editor | **@monaco-editor/react** | Official React wrapper around Monaco (same editor as VS Code) |
| Routing | **React Router v6** | SPA routing across auth, problem list, problem page, dashboard |
| Data Fetching | **TanStack Query (React Query)** | Caching, refetch, loading/error states |
| Global State | **Zustand** | Auth/session, active language, editor state |
| Forms | **React Hook Form + Zod** | Schema-validated forms (auth, etc.) |
| HTTP Client | **Axios** | Interceptors for JWT attach/refresh |
| Icons | **lucide-react** | Consistent icon set |
| Components | **shadcn/ui (Radix-based)** | Accessible, themeable with Tailwind |
| Notifications | **sonner** | Toasts for results, auto-save, errors |

Constraint that applies to the entire frontend: **no Discussion tab, no
comment/community UI anywhere.**

---

## 2. Project Structure

```
src/
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── ProblemListPage.tsx
│   ├── ProblemSolvingPage.tsx
│   ├── SubmissionHistoryPage.tsx
│   └── DashboardPage.tsx
├── components/
│   ├── editor/         (Monaco wrapper, language selector, output panel)
│   ├── problems/       (problem card, difficulty badge, filters)
│   ├── layout/         (navbar, protected route wrapper, shell)
│   └── ui/             (shadcn components)
├── hooks/               (React Query hooks: useProblems, useBoilerplate,
│                         useDraft, useSubmit, useProgress, useStreak)
├── store/               (Zustand: useAuthStore, useEditorStore)
├── lib/                 (Axios instance, utils, zod schemas)
└── types/               (Problem, Submission, Draft, Progress, Streak, User)
```

Assumed backend contract: REST API (FastAPI) exposing auth
(login/signup/me), problems (list/detail), boilerplate (by problem +
language), drafts (save/load), submissions (run/submit/history), and
progress/streak endpoints.

---

## 3. Page-by-Page Build Prompts

### 3.1 Login Page

```
Build the Login page for "CodeArena" using React 18 + TypeScript +
Tailwind CSS + shadcn/ui + React Hook Form + Zod + Axios + Zustand.

Requirements:

1. LAYOUT
   - Centered card on a full-height page, dark-mode friendly
   - CodeArena logo/name at the top
   - Fields: Email (or Username), Password
   - "Login" primary button (full width)
   - Link below: "Don't have an account? Sign up" → navigates to /signup
   - Optional "Forgot password?" link (placeholder route for now)

2. FORM HANDLING
   - Use React Hook Form for form state
   - Validate with Zod: Email required + valid format; Password required,
     minimum 6 characters
   - Inline field-level error messages on blur/submit
   - Disable submit button while in-flight; show loading spinner

3. API INTEGRATION
   - On submit, call POST /auth/login with { email, password }
   - On success: store JWT + user info via useAuthStore, redirect to
     dashboard/problem list
   - On failure: toast with API error message; clear password field only

4. STATE MANAGEMENT
   - useAuthStore: { user, token, isAuthenticated, login(), logout() }
   - isAuthenticated flips true on success so ProtectedRoute allows access

5. UX DETAILS
   - Password show/hide toggle
   - Autofocus email field
   - Enter key submits
   - Fully accessible: label associations, aria-invalid on errors

Output a single LoginPage component plus the Zod schema and the
useAuthStore slice if not already assumed to exist.
```

### 3.2 Signup Page

```
Build the Signup page for "CodeArena" using React 18 + TypeScript +
Tailwind CSS + shadcn/ui + React Hook Form + Zod + Axios.

Requirements:

1. LAYOUT
   - Same visual shell as Login (centered card, dark-mode friendly)
   - Fields: Name, Email, Password, Confirm Password
   - "Sign Up" primary button (full width)
   - Link below: "Already have an account? Login" → navigates to /login

2. FORM HANDLING
   - Zod schema: Name required; Email required + valid format; Password
     required, min 6 chars; Confirm Password must match Password
   - Inline field-level errors, disable button + spinner while submitting

3. API INTEGRATION
   - On submit, call POST /auth/signup with { name, email, password }
   - On success: either auto-login (store JWT via useAuthStore and
     redirect to dashboard) or redirect to /login with a success toast —
     implement auto-login as the default behavior
   - On failure (e.g. email already exists): toast with API error message

4. UX DETAILS
   - Password + Confirm Password both have show/hide toggles
   - Autofocus Name field
   - Fully accessible, same standard as Login page

Output a single SignupPage component plus its Zod schema.
```

### 3.3 Problem List Page

```
Build the Problem List page for "CodeArena" using React 18 + TypeScript +
Tailwind CSS + shadcn/ui + TanStack Query.

Requirements:

1. DATA
   - Fetch problems via a useProblems() TanStack Query hook hitting
     GET /problems
   - Each problem: id, title, difficulty (Easy/Medium/Hard), solved
     status for the current user

2. LAYOUT
   - Table or card-list layout: Title | Difficulty badge | Solved status
     (checkmark icon) | "Solve" action
   - Difficulty badges color-coded: green (Easy), yellow (Medium), red
     (Hard)
   - Clicking a row/card navigates to /problems/:id (Problem Solving Page)

3. FILTERING & SEARCH
   - Difficulty filter (All/Easy/Medium/Hard) as tabs or a dropdown
   - Search input filtering by problem title (client-side is fine for v1)

4. STATES
   - Loading skeleton rows while fetching
   - Empty state if no problems match filters
   - Error state with retry button if the fetch fails

No Discussion tab or discussion-related UI anywhere on this page.

Output the ProblemListPage component plus the useProblems hook and a
DifficultyBadge component.
```

### 3.4 Problem Solving Page (core screen)

```
Build the Problem Solving page for "CodeArena" using React 18 +
TypeScript + Tailwind CSS + shadcn/ui + @monaco-editor/react + TanStack
Query + Zustand + Axios.

Requirements:

1. LAYOUT
   - Split view: left panel = problem description, constraints, sample
     test cases; right panel = Monaco editor + controls
   - Resizable divider between panels if feasible, fixed split otherwise

2. LANGUAGE + BOILERPLATE
   - Language selector dropdown (Python, Java, C++, etc.)
   - On language change, call useBoilerplate(problemId, language) →
     GET /problems/:id/boilerplate?language=X and load the returned code
     into the editor. Boilerplate always comes from the backend — never
     hardcode starter code in the frontend.
   - On initial load, restore the user's last saved draft for this
     problem+language if one exists (GET /drafts/:problemId), otherwise
     load the fetched boilerplate.

3. AUTO-SAVE (DRAFTS)
   - Debounce editor changes (~2–3s of inactivity, or on blur) and call
     PUT /drafts/:problemId with { language, code }
   - Show a subtle "Saved" / "Saving..." indicator near the editor
   - Never block typing while an auto-save request is in flight

4. RUN
   - "Run" button calls POST /submissions/run with { problemId,
     language, code } — executes against SAMPLE test cases only
   - Show per-sample-test-case results (expected vs actual output) in an
     output panel below/beside the editor

5. SUBMIT
   - "Submit" button calls POST /submissions/submit with { problemId,
     language, code } — backend runs the code in an isolated Docker
     container matched to the language (e.g. Python image for Python
     code) against ALL test cases, including hidden ones
   - Show the overall verdict as a colored badge: Accepted (green),
     Wrong Answer (red), Runtime Error (orange), Compilation Error
     (purple), Time Limit Exceeded (yellow)
   - Show any stdout/stderr/compiler error trace returned by the backend
   - On Accepted, trigger a success toast and (assume backend already
     updated) refresh progress/streak query cache

6. STATES
   - Loading spinner on Run/Submit buttons while awaiting execution
     result (this can take a few seconds due to container execution)
   - Disable Run/Submit while a request is already in flight
   - Handle and display network/timeout errors distinctly from
     execution-result errors (e.g. Runtime Error)

No Discussion tab or related UI anywhere on this page.

Output the ProblemSolvingPage component, the useBoilerplate/useDraft/
useRunCode/useSubmitCode hooks, and an OutputPanel component that renders
all five verdict states distinctly.
```

### 3.5 Submission History Page

```
Build the Submission History page/panel for "CodeArena" using React 18 +
TypeScript + Tailwind CSS + shadcn/ui + TanStack Query.

Requirements:

1. DATA
   - useSubmissions(problemId?) hook hitting GET /submissions (global) or
     GET /problems/:id/submissions (per-problem context)
   - Each submission: id, problemTitle (if global view), language,
     status, timestamp

2. LAYOUT
   - List/table: Timestamp | Problem (if global) | Language | Status
     badge (same color scheme as the verdict badges on the Problem
     Solving page)
   - Sorted newest first
   - Clicking a row opens a read-only view of that submission's code
     (reuse a read-only Monaco instance) in a modal or side panel, with
     an optional "Load into editor" action when viewed from within a
     problem's context

3. STATES
   - Loading skeleton, empty state ("No submissions yet"), error state
     with retry

Output the SubmissionHistoryPage/panel component and the useSubmissions
hook.
```

### 3.6 Dashboard / Progress Page

```
Build the Dashboard page for "CodeArena" using React 18 + TypeScript +
Tailwind CSS + shadcn/ui + TanStack Query + recharts (or a simple custom
component) for any charts.

Requirements:

1. PROGRESS SUMMARY
   - useProgress() hook hitting GET /progress, returning counts of
     problems solved for Easy / Medium / Hard
   - Display as three stat cards (or a simple bar/donut chart) with
     counts and, if total problem counts per difficulty are available,
     a completion percentage

2. STREAK
   - useStreak() hook hitting GET /streak, returning currentStreak and
     longestStreak (integers, in days)
   - Display prominently: current streak with a flame/fire icon, and
     longest streak as a secondary stat
   - Optional: a calendar heatmap of solve activity if daily activity
     data is available from the API; otherwise skip this and just show
     the two numbers clearly

3. STATES
   - Loading skeletons for each card while fetching
   - Error state with retry per section (progress and streak can fail
     independently)

No Discussion tab or related content anywhere on this page.

Output the DashboardPage component plus useProgress and useStreak hooks.
```

---

## 4. Global Requirements (apply to every page above)

- Dark mode support throughout
- Loading and error states for every API-driven view
- Toast notifications for key actions (submission result, auto-save,
  auth errors)
- Responsive layout, optimized primarily for desktop/laptop
- Protected routes: Problem List, Problem Solving, Submission History,
  and Dashboard all require authentication; unauthenticated users are
  redirected to /login
