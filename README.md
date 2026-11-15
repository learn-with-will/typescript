# TypeScript Learn

Bite-sized, interactive TypeScript course built for the [course-shell](https://github.com/learn-with-will/course-shell).

Covers modern TypeScript from foundations (type annotations, primitives, functions) through advanced type-level programming (generics, template literal types, conditional types, mapped types, and state machine patterns) across 123 bite-sized lessons and 148 quiz questions.

## Repository Layout

```text
course.json                    course metadata, branding, search examples, code languages
content/topics.json            11 course topics
content/lessons/*.md           123 bite-sized lessons (3-5 min each)
content/legacy.json            URL and progress mappings for legacy lesson-01..lesson-24 format
quiz/questions.json            148 quiz questions across all topics
.github/workflows/deploy.yml   thin GitHub Actions deploy workflow
```

## Developing and Validating

To preview or validate this course locally using the shared course shell:

```bash
# From the course-shell repository directory:
npm run dev -- ../typescript
npm run validate -- ../typescript --strict
npm run build -- ../typescript
```

## Deployment

Pushes to `main` automatically validate, build with the latest `course-shell`, and deploy to GitHub Pages at [https://learn-with-will.github.io/typescript/](https://learn-with-will.github.io/typescript/).
