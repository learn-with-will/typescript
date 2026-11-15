---
slug: install-typescript
title: "Installing TypeScript"
topic: getting-started
kind: tool
summary: "Install TypeScript as a project devDependency to pin reproducible compiler versions across your development team."
tags: [setup, npm, dependencies]
related: [compile-with-tsc, tsconfig-json, strict-mode]
---
> **In one line:** Install TypeScript locally in each project using npm to ensure consistent compiler versions across team members.

## The idea

While you can install TypeScript globally on your machine using `npm install -g typescript`, installing it locally as a project development dependency is best practice for production software.

When TypeScript is installed globally, every project on your machine shares the same compiler version. If a newer TypeScript release deprecates a pattern or introduces stricter checks, older projects might fail to build unexpectedly. Conversely, team members or CI servers with different global versions might see differing diagnostics.

Installing TypeScript as a project devDependency pins the exact compiler version in your `package.json` and `package-lock.json`. Every collaborator and CI workflow runs the identical compiler version, guaranteeing consistent builds across different environments.

Local installation also allows different projects on the same machine to use different compiler versions without conflict.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```bash
# Initialize a new package if one does not exist:
npm init -y

# Install TypeScript as a development dependency:
npm install -D typescript

# Verify the local installation and version:
npx tsc --version
```

> **Tip:** Always use `npx tsc` rather than a bare `tsc` command to ensure you run the local project version instead of an outdated global binary.

## Go deeper

Evaluating installation scopes for modern TypeScript applications:

| Installation Scope | Command | Recommendation |
|---|---|---|
| Local devDependency | `npm install -D typescript` | Strongly recommended for all projects |
| Global install | `npm install -g typescript` | Acceptable for quick scratch scripts only |
| One-off runner | `npx typescript@latest tsc` | Useful for quick temporary checks |

## Watch out

- Never install TypeScript under dependencies; the compiler is only required during development and build.
- Failing to commit package-lock.json allows dependencies to drift across development machines.

## Remember

- Always install TypeScript locally as a devDependency in each repository.
- Local installation guarantees identical type-checking results across team members and CI pipelines.
- Execute the local compiler via npx tsc to avoid version discrepancies.
