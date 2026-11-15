---
slug: ambient-declarations
title: "Ambient Declarations with declare"
topic: modules-and-config
kind: technique
summary: "Use the declare keyword to describe variables, globals, or modules that exist at runtime without emitting JavaScript."
tags: [ambient, declare, globals]
related: [declaration-files, types-packages, module-resolution]
---
> **In one line:** Use the declare keyword to tell TypeScript about global variables injected by runtimes or scripts.

## The idea

Web applications often interact with globals injected by external script tags, browser extensions, or build tools. Examples include Google Analytics (`window.ga`), environment variables injected by bundlers (`__DEV__`), or third-party SDKs loaded via CDN.

Because TypeScript cannot see where these variables are defined in your source files, it flags them with `Cannot find name 'VARNAME'`.

The `declare` keyword creates an ambient declaration. It tells the compiler: "Trust me, this variable, function, or module exists in the global environment at runtime." Ambient declarations emit zero JavaScript; they simply inform the type checker of the global's existence and type.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Declaring a global variable injected by a bundler:
declare const __APP_VERSION__: string;
declare const __BUILD_TIMESTAMP__: number;

// Declaring an external CDN analytics global:
declare function trackMetric(eventName: string, data?: Record<string, unknown>): void;

function logStartup(): void {
  console.log(`Running application version ${__APP_VERSION__}`);
  trackMetric('app_boot', { timestamp: __BUILD_TIMESTAMP__ });
}

logStartup();
```

> **Tip:** You can also use `declare module "*.svg"` to allow importing assets like SVG files or images in bundler projects.

## Go deeper

Common uses of ambient declarations in frontend applications:

| Target | Example Syntax | Purpose |
|---|---|---|
| Injected Global Constant | `declare const __DEV__: boolean;` | Bundler compile-time flags |
| Global Function | `declare function gtag(...args: any[]): void;` | Third-party analytics scripts |
| Asset Import | `declare module "*.png" { const v: string; export default v; }` | Image imports in Vite/Webpack |
| CSS Modules | `declare module "*.module.css" { const c: Record<string, string>; export default c; }` | CSS module class mapping |

## Watch out

- declare does not create the variable at runtime; if the script is not loaded, code will crash.
- Ambient declarations should generally live in .d.ts files so they are not confused with runtime code.

## Remember

- declare introduces ambient variables and types to the compiler without emitting code.
- Use declare to type global constants injected by build tools or CDN script tags.
- Ambient module declarations enable importing non-TS assets like images and CSS.
