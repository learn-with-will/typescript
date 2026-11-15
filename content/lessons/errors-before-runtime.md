---
slug: errors-before-runtime
title: "Errors Before Runtime"
topic: getting-started
kind: technique
summary: "The TypeScript compiler flags syntax, semantic, and type mismatches instantly as you type before running your application."
tags: [tooling, diagnostics, quality]
related: [what-typescript-adds, compile-with-tsc, structural-typing]
---
> **In one line:** TypeScript provides immediate feedback on typos, undefined properties, and invalid arguments inside your editor.

## The idea

In standard JavaScript development, bugs such as calling a nonexistent function, misspelling an object property, or passing parameters in the wrong order are only caught when that specific code path executes. If an error is inside an edge-case branch or rare error handler, the bug may slip through into production.

TypeScript eliminates this category of bugs by analyzing code statically. As soon as you write a statement in your editor, language services evaluate the types and highlight mistakes with squiggly underlines.

This fast feedback loop shortens debugging cycles. Instead of switching to the browser or running a test suite to detect a misspelled property name like `user.fristName`, your editor alerts you immediately and suggests the correct property name.

Static error detection acts as an automated reviewer checking every line of code continuously against your project's contracts.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface AccountSettings {
  notificationsEnabled: boolean;
  themePreference: 'light' | 'dark' | 'system';
}

function updatePreferences(settings: AccountSettings): void {
  // TypeScript flags typos immediately in the editor:
  // if (settings.notificationEnabled) { ... } // Error: Property does not exist
  // settings.themePreference = 'blue';        // Error: Type '"blue"' is not assignable

  if (settings.notificationsEnabled) {
    console.log(`Theme set to: ${settings.themePreference}`);
  }
}
```

> **Tip:** Hovering over any underlined error in your editor displays the diagnostic message and suggested fixes.

## Go deeper

TypeScript identifies various categories of errors before execution:

| Error Type | Example | When TypeScript Catches It |
|---|---|---|
| Property Typo | `user.adress` instead of `address` | Instantly as you type |
| Missing Argument | `formatDate()` missing required date | Before compiling |
| Type Incompatibility | Passing string where number is expected | During editing and build |
| Unhandled Union Case | Forgetting a state in a switch | When strict checks enabled |

## Watch out

- Suppressing compiler errors with @ts-ignore hides potential runtime bugs rather than resolving them.
- Type checking requires accurate type definitions; incorrect third-party types can mask real errors.

## Remember

- Static analysis catches common typos and signature mismatches before code runs.
- Language server integration provides instant diagnostics directly inside modern code editors.
- Catching errors during development dramatically reduces regression rates in production.
