---
slug: types-packages
title: "@types Packages and DefinitelyTyped"
topic: modules-and-config
kind: tool
summary: "Install community-maintained type definitions from the @types namespace on npm for JavaScript libraries."
tags: [definitely-typed, types-packages, npm]
related: [declaration-files, ambient-declarations, module-resolution]
---
> **In one line:** Install @types packages from DefinitelyTyped to add type definitions to plain JavaScript libraries.

## The idea

Many popular npm packages (such as `lodash`, `express`, or `react`) were originally written in JavaScript or publish untyped JavaScript to npm. When you install an untyped library, TypeScript reports: `Could not find a declaration file for module 'lodash'`.

To provide types for the JavaScript ecosystem, the TypeScript community maintains DefinitelyTyped, a massive open-source repository containing type definitions for thousands of JavaScript libraries.

These types are published under the `@types` scope on npm. When you install `npm install -D @types/lodash`, TypeScript automatically detects the declaration files in `node_modules/@types` and provides instant autocompletion and type checking for the library.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```bash
# Installing a JavaScript library:
npm install lodash

# Installing its community type definitions as a devDependency:
npm install -D @types/lodash
```

```typescript
// In your application code:
import _ from 'lodash';

// Full autocomplete and type checking now active:
const chunked = _.chunk([1, 2, 3, 4], 2);
console.log(chunked); // Inferred as number[][]
```

> **Tip:** Modern libraries increasingly ship built-in types (via `index.d.ts`); check if a library includes types before installing an `@types` package.

## Go deeper

Comparing built-in types vs DefinitelyTyped (@types):

| Feature | Built-in Library Types | Community `@types` Package |
|---|---|---|
| Where types live | Packaged with library in npm | Separate `@types/lib` package |
| Version Sync | Guaranteed 100% in sync | Maintained independently by community |
| Author | Library Maintainer | Open source community |
| Installation | Single `npm i library` | Two installs (`npm i lib` + `npm i -D @types/lib`) |

## Watch out

- Always install @types packages as devDependencies; they are not needed in production runtime containers.
- Ensure the major version of the @types package matches the major version of the underlying library.

## Remember

- Install @types packages from DefinitelyTyped to type untyped JavaScript libraries.
- TypeScript automatically discovers declaration files located in node_modules/@types.
- Save @types packages under devDependencies since types are erased at runtime.
