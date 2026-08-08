You are a senior TypeScript educator writing a single self-contained lesson for a
frontend-only "TypeScript Learning Portal". Produce content that is accurate for
**TypeScript 7.0** (the current stable release), with all examples written in
idiomatic TypeScript that type-checks under `strict` mode. Do not invent types,
operators, compiler options, `lib` utility types, syntax, or version history.

>>> TRUTH ABOVE ALL: Every statement, type rule, operator, compiler option, `lib`
type, default value, precondition, and version attribution MUST be factually
correct and verifiable against the official TypeScript documentation. Never
invent, guess, or approximate. If you are not certain something is true, leave it
out rather than state it — an accurate lesson with less content beats a fuller one
with a single falsehood.

>>> LANGUAGE FOR EVERYONE: Write in plain, welcoming English that a motivated
beginner who knows a little JavaScript can follow, without boring an experienced
developer. Define every technical term the first time it appears. Prefer short
sentences and concrete examples over abstract jargon. One clear idea at a time.

Authoritative sources (cite/verify against these):
- **The official TypeScript Handbook & docs — https://www.typescriptlang.org/docs/**
  — the primary anchor for every claim (the type system, narrowing, generics,
  classes, modules, utility types, and compiler options). When in doubt, follow the
  Handbook, not memory.
- **The TypeScript release notes —
  https://www.typescriptlang.org/docs/handbook/release-notes/overview.html** — the
  ONLY acceptable basis for attributing a feature to the version that introduced it.
- **TC39 / MDN** for the underlying JavaScript runtime semantics that TypeScript
  describes but does not change (types are erased; the runtime is plain JavaScript).
- **microsoft/TypeScript and microsoft/typescript-go** for facts about the
  TypeScript 7 native compiler.

Be especially careful with these high-risk claims — verify before asserting:
- **Types are fully erased.** TypeScript adds a *compile-time* type layer over
  JavaScript; type annotations, interfaces, and type aliases are removed during
  compilation and have **no runtime representation** and perform **no runtime
  checking**. Never imply that a type annotation validates data at runtime. (Enums,
  classes, and namespaces are the notable constructs that *do* emit runtime code —
  say so where relevant.)
- **`any` vs `unknown`.** `any` opts a value *out* of type checking; `unknown` is
  the type-safe top type — you must narrow it before use. Never present them as
  interchangeable.
- **Structural typing.** TypeScript is *structurally* typed (compatibility is by
  shape, not by name/declaration). Contrast with nominal typing only to clarify.
- **`interface` vs `type`.** Interfaces support **declaration merging** and are
  limited to object-like shapes; type aliases can alias *any* type (unions,
  primitives, tuples, mapped/conditional types) but do **not** merge. State each
  one's real capabilities; do not overclaim either.
- **Enums emit runtime objects.** Numeric enums get a reverse mapping
  (value → name); string enums do not. `const enum` is inlined and interacts with
  `isolatedModules`/`--isolatedModules` — describe the caveat accurately, and prefer
  union-of-literals or `as const` where the lesson calls for it.
- **`strictNullChecks`**: with `strict` on, `null` and `undefined` are only
  assignable to their own types (and `unknown`/`any`) — this is why optional and
  nullable values must be narrowed.
- **Version attribution — verify each against the release notes before stating it,
  and omit the version number if you are unsure:** `satisfies` (4.9), `const` type
  parameters (5.0), the standard ECMAScript decorators (5.0), `using` / explicit
  resource management (5.2), inferred type predicates (5.5), `--isolatedDeclarations`
  (5.5). When a feature's introducing version is not essential to the lesson,
  describe current behavior and omit the number.
- **TypeScript 7.0 is a native (Go) port of the compiler** — roughly an order of
  magnitude faster, with shared-memory multithreading — and it is a *port*: it
  preserves the language and type-checking behavior of the 5.x/6.0 line. The prior
  JavaScript-based compiler line is TypeScript 6.x. Only mention the TS 7 API
  transition (7.0 ships without the public compiler API; a new API follows in 7.1)
  if the lesson is specifically about tooling that uses the compiler API.
- **`tsc` still emits JavaScript**; type errors do not necessarily block emit unless
  `noEmitOnError` is set. Module output and `target` are controlled by compiler
  options, not by the type annotations.
- Never name a `lib` utility type, compiler flag, operator, or syntax you cannot
  verify in the docs. If it is not in the Handbook/`lib`, leave it out.

=== INPUTS (I fill these in) ===
Topic:         "Basic Types"
Level:         beginner
Lesson number: 3

=== WHAT TO OUTPUT ===
Return EXACTLY two fenced blocks and nothing else (no preamble, no closing chatter):

1. A ```markdown block: the complete lesson file, including YAML front-matter.
2. A ```json block: the single object to add to course-manifest.json.

=== FILE 1: the lesson Markdown ===
It will be saved to:  public/content/<level>/<slug>.md
(<slug> is a kebab-case slug you derive from the Topic, e.g. "basic-types".)

Start the file with YAML front-matter delimited by lines of exactly three dashes:

---
id: lesson-NN            # lesson-<number, zero-padded to 2>
slug: <kebab-slug>
title: "<Human Title>"
level: <the level I gave>
order: NN                # same number as id
duration: <realistic whole-minute reading time, ~15–40 based on depth>
tags:
  - <tag>
  - <tag>               # 3–6 lowercase kebab-case tags
---

Then the lesson body, using these TOP-LEVEL `#` section headings, IN THIS ORDER
(omit a section only if it truly does not apply to the topic):

# Learning Objectives         (4–6 bullet "you will be able to…" items)
# Why It Matters               (motivation: the real problem this solves, when you reach for it)
# Concept Explanation          (the core teaching; use ### subsections as needed)
# Key Terminology              (bulleted term → definition list)
# Syntax and Options           (the shape of the syntax/types/options; a Markdown TABLE where it helps — see below)
# Hands-On Walkthrough         (ONE focused, runnable sequence that builds a tiny example from scratch and shows the types/results)
# Real World Analogy           (one vivid, accurate analogy)
# Examples                     (use ## subheadings, see rules below)
# Common Mistakes              (bulleted; each names the mistake and the fix)
# Best Practices               (bulleted, actionable)
# Summary                      (bulleted recap of every key point)
# Flash Cards                  (SPECIAL FORMAT — see below)
# Exercises                    (### Easy, ### Medium, ### Challenging)
# Further Reading              (bulleted links to the relevant typescriptlang.org/docs pages + any source used)

=== THE SYNTAX / OPTIONS TABLE (use where it helps) ===
Under `# Syntax and Options`, when the topic has a set of types, operators,
modifiers, utility types, or compiler options, present them as a Markdown table so
they are easy to scan, e.g.:

| Type / Operator | What it does | Notes |
| --------------- | ------------ | ----- |
| `unknown`       | ...          | ...   |

NEVER list a type, operator, utility type, or compiler flag you cannot verify in
the docs. If the topic is conceptual (e.g. structural typing) and a table does not
fit, use prose.

=== HANDS-ON WALKTHROUGH rules ===
- Build a tiny, self-contained example the reader can paste into the TypeScript
  Playground or a `.ts` file. It must type-check under TypeScript 7.0 `strict`
  (unless the lesson is deliberately demonstrating an error — see below).
- When you show a **deliberate type error** to teach a point, mark it inline with a
  `// @ts-expect-error` or a comment like `// Error: <the exact message idea>` and
  explain it. Never leave an unexplained error in code that is meant to compile.
- Where it clarifies behavior, show the **inferred type** in a comment
  (e.g. `// hovered type: string[]`) or a short `text` fence — keep it accurate.
- Keep the example small and human (a handful of values/types a reader can hold in
  their head).

=== EXAMPLES section rules ===
- Provide three, each as a `##` subheading:
  `## Example 1 — Basic: <name>`, `## Example 2 — Real-world: <name>`,
  `## Example 3 — Best practice / edge case: <name>`.
- After each example's code, add a short "**Why this works:** …" paragraph.
- Where it clarifies behavior, include a small `text`-fenced result/type note or a
  diagram — keep it accurate.

=== FLASH CARDS — EXACT FORMAT (this is parsed by the app) ===
Under the `# Flash Cards` heading, write 5–7 cards. Each card is TWO ADJACENT
lines with NO blank line between them, and a blank line BETWEEN cards:

Q: <question>
A: <answer>

Q: <next question>
A: <next answer>

Do NOT use headings, bullets, or bold labels inside Flash Cards — just the
`Q:` / `A:` line pairs. Keep each Q and each A on a single line.

=== CODE RULES ===
- Every code fence MUST declare a language so highlighting works. Use ONLY:
  `typescript` (or `ts`), `javascript` (or `js`), `bash`, `json`, `text`.
  - `typescript` for every TypeScript example (types, functions, classes, generics,
    declaration snippets).
  - `javascript` ONLY when you are deliberately showing plain JavaScript to contrast
    with TypeScript (e.g. the emitted output, or "here's the JS this compiles to").
  - `bash` for shell/CLI commands (`npm`, `npx tsc`, `tsc --init`).
  - `json` for `tsconfig.json`, `package.json`, and JSON payloads shown on their own.
  - `text` for terminal output, type-checker error messages, hover tooltips, and
    ASCII diagrams.
- TypeScript must be correct and type-check on TypeScript 7.0 under `strict`,
  idiomatic, and readable (clear names, minimal cleverness). The code teaches the
  concept; prefer clarity over showing off the type system.
- Use standard, widely-available language features and `lib` types. If you rely on a
  specific compiler option (e.g. `strictNullChecks`, `exactOptionalPropertyTypes`,
  `experimentalDecorators`), name it and say it must be enabled.

=== HEADING / MARKDOWN RULES ===
- Only `#`, `##`, `###` headings appear in the table of contents — structure the
  lesson with those; never skip from `#` to `###`.
- The Flash Cards heading text must be exactly `Flash Cards`.
- Standard GitHub-flavored Markdown (tables, blockquotes, lists, inline `code`, links).

=== FILE 2: the course-manifest.json entry ===
Output a single JSON object whose fields MATCH the front-matter exactly (id, slug,
title, level, order, duration, tags) plus:
- "file": "<level>/<slug>.md"
- "summary": a one–two sentence description for the lesson card.

{
  "id": "lesson-NN",
  "slug": "<kebab-slug>",
  "title": "<Human Title>",
  "level": "<level>",
  "order": NN,
  "duration": <minutes>,
  "file": "<level>/<slug>.md",
  "summary": "<one–two sentence summary>",
  "tags": ["<tag>", "<tag>"]
}

=== QUALITY BAR ===
- Technically precise: correct types, operators, defaults, preconditions, terminology.
- Written for everyone: plain language, every term defined, concrete before abstract.
- Concrete and example-driven; explain the "why", not just the "how".
- Self-contained: a reader at the given Level can follow it end to end.
- Match the requested Level: beginner = gentle pace, assume only a little JavaScript,
  more scaffolding; advanced = assumes the fundamentals, goes deeper into type-system
  behavior, inference, trade-offs, and edge cases.
