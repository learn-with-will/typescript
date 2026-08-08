# TypeScript Study Pathway
### A Comprehensive, Phase-by-Phase Curriculum

> **Based on:** the official TypeScript Handbook and documentation
> (https://www.typescriptlang.org/docs/), the TypeScript release notes for version
> attribution, and TC39/MDN for the JavaScript runtime semantics TypeScript builds on.
> **Target:** TypeScript 7.0. Every example type-checks under `strict`.
> **Approach:** each lesson builds on the ones before it. The order is intentional —
> you cannot narrow a union you cannot write, cannot reuse code without generics, and
> cannot read a mapped or conditional type without first understanding `keyof` and
> unions.

---

## Phase 1 — Beginner: The Type System's Foundations

**Goal:** Understand what TypeScript adds to JavaScript and become comfortable
annotating and inferring everyday types — values, functions, objects, and the
unions you narrow.
**Exit criteria:** You can set up a project, annotate variables and functions,
describe object shapes with interfaces, model choices with unions and literals, and
safely narrow a value to the right type.

1. **What Is TypeScript?** — a typed superset of JavaScript; compile-time types that
   are **erased** to plain JavaScript; structural typing; what the compiler checks
   (and what it does not, at runtime); the TypeScript 7 native compiler.
2. **Setting Up TypeScript** — installing `typescript`; running `tsc`; the
   TypeScript Playground; editor tooling; your first `tsconfig.json` and what
   `strict` turns on.
3. **Basic Types** — `string`, `number`, `boolean`, arrays, `null`/`undefined`;
   `any` vs `unknown`; type annotations vs inference.
4. **Functions and Inference** — parameter and return types; optional, default, and
   rest parameters; `void`; contextual typing; function type expressions.
5. **Objects and Interfaces** — object types; `interface`; optional and `readonly`
   properties; index signatures; excess-property checks.
6. **Union and Literal Types** — union types; string/number/boolean literal types;
   literal widening; a first look at narrowing with `typeof`.
7. **Type Aliases, Arrays, and Tuples** — `type` vs `interface` and when to use
   each; tuples and `readonly` tuples/arrays; named tuple members.
8. **Narrowing and Type Guards** — truthiness, equality, `typeof`, `instanceof`, and
   `in`; discriminated unions; user-defined type guards (`value is Type`).

---

## Phase 2 — Intermediate: Reusable, Well-Typed Code

**Goal:** Write code that is generic, organized into modules, and typed against the
`tsconfig` options that shape a real project.
**Exit criteria:** You can write generic functions and types with constraints, model
classes and their members, choose between enums and unions, split code into modules
with declaration files, configure the compiler deliberately, and reach for the
built-in utility types.

9. **Generics** — generic functions, interfaces, and classes; type-parameter
   constraints (`extends`); default type parameters; why generics beat `any`.
10. **Classes** — fields and methods; `public`/`private`/`protected`; `readonly`;
    parameter properties; JavaScript `#private` fields; `abstract` classes;
    `implements`; `static` members.
11. **Enums and `const` Assertions** — numeric vs string enums and their runtime
    shape; the `const enum` caveat; `as const`; when a union of literals is the
    better tool.
12. **Advanced Function Types** — overload signatures; typing `this`; assertion
    functions; generic constraints applied to functions.
13. **`unknown`, `never`, and Assertions** — `unknown` as the safe top type; `never`
    and exhaustiveness checks; type assertions (`as`); the non-null assertion `!`;
    the `satisfies` operator.
14. **Modules and Declaration Files** — ES module `import`/`export`; `import type`;
    ambient declarations and `.d.ts` files; `@types`/DefinitelyTyped; module
    resolution basics.
15. **The `tsconfig` Options That Matter** — the `strict` family; `target`, `module`,
    and `moduleResolution`; `esModuleInterop`; `isolatedModules`; `noEmit`; a first
    look at project references.
16. **Utility Types** — `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`,
    `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited` — what
    each does and when to use it.

---

## Phase 3 — Advanced: The Type-Level Toolkit

**Goal:** Compute with types — read and write the type-level features that power the
utility types and library typings you rely on.
**Exit criteria:** You can query types with `keyof`/`typeof`/indexed access, branch
with conditional types and `infer`, transform shapes with mapped and template
literal types, merge and augment declarations, apply decorators, and type
asynchronous code while migrating JavaScript.

17. **`keyof`, `typeof`, and Indexed Access Types** — the `keyof` operator; the
    `typeof` type query; `T[K]` lookup types.
18. **Conditional Types** — `T extends U ? X : Y`; distributive conditional types;
    extracting types with `infer`.
19. **Mapped Types** — `{ [K in keyof T]: … }`; key remapping with `as`; adding and
    removing `readonly` and `?` modifiers; building your own utility types.
20. **Template Literal Types** — string literal templates; combining unions in a
    template; the intrinsic `Uppercase`/`Lowercase`/`Capitalize`/`Uncapitalize`
    string types.
21. **Generics in Depth** — an intuition for variance; higher-order type inference;
    `const` type parameters; patterns for constraints and defaults.
22. **Declaration Merging and Module Augmentation** — interface merging; `declare
    global`; augmenting third-party modules; where namespaces still apply.
23. **Decorators** — the standard ECMAScript (TypeScript 5.0) decorators for classes,
    methods, accessors, and fields; a note on the legacy `--experimentalDecorators`.
24. **Typing Async Code and Migrating JavaScript** — typing Promises and
    `async`/`await`; a typed `fetch`; `unknown` in `catch`; gradually migrating a
    JavaScript codebase (`allowJs`, `checkJs`, JSDoc types); where to go next.

---

## How to use this pathway

- **Don't skip.** Phase 2 assumes you can read unions and narrow them from Phase 1;
  Phase 3 assumes you are comfortable with generics and `keyof`. Conditional and
  mapped types build directly on unions, `keyof`, and generics.
- **Type the code.** Every lesson has a hands-on walkthrough and Easy/Medium/
  Challenging exercises — paste them into the TypeScript Playground and hover the
  types. You learn the type system by watching what the compiler infers, not by
  reading about it.
- **Take the quizzes.** Every lesson has a quiz; a passing score means the ideas
  landed.
- **Verify against the Handbook.** When unsure about a type, operator, utility type,
  or compiler option, check https://www.typescriptlang.org/docs/ — accuracy over
  assumption.
