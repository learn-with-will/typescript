---
slug: migrating-js-with-check-js
title: "Migrating with checkJs and JSDoc"
topic: advanced-patterns
kind: technique
summary: "Enable type-checking on plain JavaScript files without renaming to .ts using checkJs and JSDoc comments."
tags: [migration, checkJs, jsdoc]
related: [migrating-js-to-ts-workflow, compiler-target-and-lib, strict-mode]
---
> **In one line:** Use // @ts-check and JSDoc comments to type-check plain JavaScript files incrementally.

## The idea

Migrating an established JavaScript repository with hundreds of thousands of lines of code into TypeScript can be daunting. Renaming all `.js` files to `.ts` all at once generates thousands of compiler errors simultaneously, grinding feature development to a halt.

TypeScript provides an incremental migration path that works directly on existing `.js` files.

By adding `"checkJs": true` in `tsconfig.json` (or placing `// @ts-check` at the top of individual JavaScript files), the TypeScript compiler type-checks your plain JavaScript files! You can annotate types using standard JSDoc comments like `/** @type {string} */` and `/** @param {number} x */`. The compiler enforces types without altering build tooling.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```javascript
// File: legacy-math.js
// @ts-check

/**
 * Calculates compound interest on an investment.
 * @param {number} principal - Starting amount
 * @param {number} rate - Annual interest rate (e.g. 0.05)
 * @param {number} years - Duration in years
 * @returns {number} Final total
 */
function calculateInterest(principal, rate, years) {
  return principal * Math.pow(1 + rate, years);
}

calculateInterest(1000, 0.05, 5); // OK
// calculateInterest('1000', 0.05, 5); // Compiler error in plain JS file!
```

> **Tip:** You can import TypeScript interfaces into JSDoc comments using `/** @type {import('./types').User} */`.

## Go deeper

Comparing migration strategies for existing JavaScript codebases:

| Migration Strategy | File Extension | Effort Level | Type-Checking Rigor |
|---|---|---|---|
| JSDoc with `// @ts-check` | Keep as `.js` | Low (no build tool change) | Moderate (JSDoc annotations) |
| Renaming to `.ts` with `allowJs` | Mixed `.js` and `.ts` | Moderate (file by file) | High (native TypeScript syntax) |
| Big-bang rename all | All `.ts` | High (blocks team work) | High |

## Watch out

- JSDoc type annotations are verbose compared to native TypeScript syntax.
- checkJs in tsconfig applies to all JavaScript files unless excluded in your config.

## Remember

- Add // @ts-check to individual JavaScript files for instant type checking.
- Use JSDoc comments (@type, @param, @returns) to type JavaScript variables.
- Enables migrating codebases incrementally without breaking existing build pipelines.
