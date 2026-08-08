# TypeScript Learning Portal

A **frontend-only** TypeScript course: read Markdown lessons, take quizzes, and
track your progress — all in the browser, no backend required. The course takes
you from the type system's foundations and everyday annotations to generics,
conditional and mapped types, template literal types, declaration files, and
typing asynchronous code.

The portal shell is built with React 19, Vite, TypeScript, React Router,
Tailwind CSS v4, marked, and PrismJS. The **content** it renders is a complete
24-lesson curriculum targeting **TypeScript 7.0** — the current stable release,
whose headline change is a native (Go) port of the compiler that is roughly an
order of magnitude faster while keeping the language semantics unchanged. Every
type rule, compiler option, `lib` type, and version claim is verified against
authoritative sources (see [Accuracy](#accuracy)), and written in plain language
meant to be readable by newcomers and experienced developers alike.

## Features

- **Roadmap** of lessons grouped by level (beginner / intermediate / advanced).
- **Lesson reader** with Markdown rendering, Prism syntax highlighting, a table of
  contents, previous/next navigation, mark-complete, and bookmarking.
- **Quizzes** supporting five question types: single-choice, multiple-choice,
  fill-blank, ordering, and match-pair — with grading, review mode, and explanations.
- **Dashboard** with completion stats, per-level progress, and quiz history.
- **Search** and **bookmarks** pages.
- **Dark mode** with persistence, and a responsive layout.
- All progress persists to `localStorage` (under course-unique keys).

## Run it

```bash
npm install
npm run dev        # dev server (Vite) at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Project structure

```text
src/
├── core/
│   ├── models/        # Lesson, Quiz, Progress types + constants
│   ├── services/      # lesson/quiz loading, search, grading, asset URLs
│   ├── context/       # Course, Progress, Theme providers (React state)
│   └── hooks/         # useDocumentTitle, prism setup
├── shared/components/ # Navbar, Sidebar, Footer, LessonCard, TableOfContents,
│                      # LessonNavigation, LessonContent, QuizQuestion,
│                      # QuizProgress, QuizResult, TypeScriptLogo, ScrollManager
├── features/          # home, roadmap, lesson, quiz, dashboard, search, bookmarks
├── App.tsx            # layout + lazy-loaded routes
└── main.tsx           # providers + bootstrap

public/
├── content/           # lesson Markdown + course-manifest.json
└── quizzes/           # one <lessonId>.json per quiz
```

## Curriculum

**Beginner — the type system's foundations:** what TypeScript is (and how types
are erased) · setting up TypeScript · basic types · functions & inference ·
objects & interfaces · union & literal types · type aliases, arrays & tuples ·
narrowing & type guards.

**Intermediate — reusable, well-typed code:** generics · classes · enums &
`const` assertions · advanced function types · `unknown`, `never` & assertions ·
modules & declaration files · the `tsconfig` options that matter · utility types.

**Advanced — the type-level toolkit:** `keyof`, `typeof` & indexed access ·
conditional types · mapped types · template literal types · generics in depth ·
declaration merging & module augmentation · decorators · typing async code &
migrating JavaScript to TypeScript.

## Adding content — no code changes required

### Add a lesson

1. Create a Markdown file under `public/content/<level>/`, e.g.
   `public/content/beginner/basic-types.md`. Start it with YAML front-matter:

   ```md
   ---
   id: lesson-03
   slug: basic-types
   title: "Basic Types"
   level: beginner
   order: 3
   duration: 24
   tags: [types, primitives, inference, any, unknown]
   ---

   # Learning Objectives
   ...
   ```

2. Add a matching entry to `public/content/course-manifest.json`:

   ```json
   {
     "id": "lesson-03",
     "slug": "basic-types",
     "title": "Basic Types",
     "level": "beginner",
     "order": 3,
     "duration": 24,
     "file": "beginner/basic-types.md",
     "summary": "The primitive types, arrays, null and undefined, any vs unknown, and how TypeScript infers types you don't annotate.",
     "tags": ["types", "primitives", "inference", "any", "unknown"]
   }
   ```

The lesson now appears in the roadmap, sidebar, search, and home — automatically.

> **Flash cards:** a heading titled `Flash Cards` followed by `Q: … / A: …` line
> pairs is auto-transformed into interactive flip cards.

> **Code fences** must declare one of the highlighted languages: `typescript`
> (or `ts`), `javascript` (or `js`), `bash`, `json`, or `text` (use `text` for
> terminal output, type-checker error messages, and diagrams).

### Add a quiz

Create `public/quizzes/<lessonId>.json` (e.g. `public/quizzes/lesson-03.json`):

```json
{
  "id": "quiz-lesson-03",
  "lessonId": "lesson-03",
  "title": "Basic Types",
  "passingScore": 60,
  "questions": [
    { "id": "q1", "type": "single-choice", "prompt": "…",
      "options": [{ "id": "a", "text": "…" }], "answer": "a",
      "explanation": "…" }
  ]
}
```

Supported question `type` values: `single-choice`, `multiple-choice`,
`fill-blank`, `ordering`, `match-pair`.

## Accuracy

The course is written to a **no-hallucination** standard: every type rule,
operator, compiler option, `lib` type, and code example is checked against
authoritative references before it ships. If a claim cannot be verified, it is
left out. Primary sources:

- **The official TypeScript documentation & Handbook** —
  <https://www.typescriptlang.org/docs/> (the primary anchor for the type system,
  narrowing, generics, utility types, and compiler options).
- **The TypeScript release notes** —
  <https://www.typescriptlang.org/docs/handbook/release-notes/overview.html> — for
  attributing features to the version that introduced them.
- **TC39 / MDN** for the underlying JavaScript runtime semantics that TypeScript
  describes but does not change.
- **The `microsoft/TypeScript` and `microsoft/typescript-go` repositories** for
  the TypeScript 7 native-compiler facts.

Every example is written to type-check under TypeScript 7.0 with `strict` enabled.
The per-lesson authoring contract lives in [`prompts/`](prompts/).

## Tech stack

React 19 · Vite · TypeScript · React Router · Tailwind CSS v4 · marked · PrismJS ·
localStorage. All lesson code is **TypeScript** (with JavaScript shown only where
the two are being contrasted).

## Deploying to GitHub Pages

This repo ships a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
that builds the site and publishes it to GitHub Pages on every push to `main`.

One-time setup:

1. In the repo on GitHub, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
2. Push to `main` (or run the workflow manually from the **Actions** tab).

The site is then served at `https://<user>.github.io/<repo>/`. How it works:

- The workflow builds with `BASE_PATH=/<repo>/`, which sets Vite's `base` so all
  assets and content resolve under the sub-path. `<BrowserRouter basename>` is
  aligned to the same value, so client-side routes work too.
- A `postbuild` step copies `dist/index.html` to `dist/404.html`, giving the SPA a
  fallback so deep links and refreshes (e.g. `/<repo>/lesson/…`) load correctly.

> If you deploy to a **user/organization site** (`<user>.github.io`) instead of a
> project site, the base path is `/` — set `BASE_PATH: /` in the workflow.

For other static hosts (Netlify, Vercel), the `dist/` output works as-is; just
configure an SPA fallback to `index.html`.
