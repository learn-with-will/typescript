---
id: lesson-02
slug: setting-up-typescript
title: "Setting Up TypeScript"
level: beginner
order: 2
duration: 20
tags:
  - setup
  - tsc
  - tsconfig
  - playground
  - tooling
---

# Learning Objectives

By the end of this lesson you will be able to:

- Install TypeScript into a project and run the compiler.
- Compile a `.ts` file to JavaScript with `tsc`.
- Try TypeScript instantly in the online Playground.
- Create a `tsconfig.json` and explain what it controls.
- Say what turning on `strict` does and why it's recommended.

# Why It Matters

Before you can learn the language, you need a way to run it and see the compiler's feedback. The good news: setup is small. You can experiment with zero installation in the Playground, and a real project needs only one package and one config file. Getting this right once means every later lesson "just works" when you try the examples.

# Concept Explanation

### The fastest start: the Playground

The **TypeScript Playground** (<https://www.typescriptlang.org/play>) is an online editor that type-checks as you type and shows the emitted JavaScript beside your code. Nothing to install. It is the best place to try the small snippets in this course and to *hover over values and see their types* — a habit worth building early.

### Installing TypeScript in a project

For a real project you install the `typescript` package with a package manager. It is a **development dependency** — a build-time tool, not something your shipped app imports.

```bash
npm install --save-dev typescript
```

That gives you the compiler command, `tsc`. Run it through `npx` so you use the project's exact version:

```bash
npx tsc --version
```

In TypeScript 7 the `tsc` you run is the new native compiler described in the previous lesson — same command, much faster.

### Compiling a file

Create `hello.ts`:

```typescript
const who: string = 'world';
console.log(`Hello, ${who}`);
```

Compile it:

```bash
npx tsc hello.ts
```

You now have a `hello.js` next to it, which you can run with Node.js:

```bash
node hello.js
```

While learning, `--watch` recompiles automatically every time you save:

```bash
npx tsc --watch hello.ts
```

### tsconfig.json — the project's settings

Most projects don't list files on the command line. Instead they keep a **`tsconfig.json`** at the project root. Its presence marks the folder as a TypeScript project, and it holds the compiler options. Generate a well-commented starter with:

```bash
npx tsc --init
```

Then running `npx tsc` (no filenames) compiles the whole project using those settings. A minimal, modern config looks like this:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- **`target`** — the JavaScript version to emit (here, ES2022).
- **`module`** — the module system for the output.
- **`strict`** — turns on the full set of strict type-checking options (see below).
- **`outDir`** — where the compiled `.js` files go.
- **`include`** — which folders to compile.

We devote a whole later lesson to the options that matter; this is enough to start.

### What `strict` does

`"strict": true` is a single switch that enables a family of stricter checks — most importantly **`strictNullChecks`**, which stops `null` and `undefined` from sneaking into values that aren't supposed to hold them. Strict mode catches far more real bugs, and every example in this course assumes it is on. New projects created with `tsc --init` enable it by default. **Leave it on.**

# Key Terminology

- **`tsc`** — the TypeScript compiler command.
- **`npx`** — runs a package's command using the version installed in your project.
- **Development dependency** — a tool needed to build the project, not to run the shipped code.
- **`tsconfig.json`** — the file that configures a TypeScript project.
- **`compilerOptions`** — the settings block inside `tsconfig.json`.
- **`strict`** — an umbrella option that enables TypeScript's strict type-checking family.
- **Playground** — the online TypeScript editor for quick experiments.

# Syntax and Options

| Command / setting | What it does |
| ----------------- | ------------ |
| `npm install -D typescript` | Adds the compiler to your project |
| `npx tsc` | Compiles the project per `tsconfig.json` |
| `npx tsc file.ts` | Compiles a single file |
| `npx tsc --watch` | Recompiles on every save |
| `npx tsc --init` | Creates a starter `tsconfig.json` |
| `"strict": true` | Enables the strict type-checking family |
| `"noEmit": true` | Type-check only, don't write `.js` |

# Hands-On Walkthrough

Set up a tiny project from scratch:

```bash
mkdir ts-intro && cd ts-intro
npm init -y
npm install --save-dev typescript
npx tsc --init
```

Create `src/index.ts`:

```typescript
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(2, 3));
```

Point the config at `src` and compile. With the minimal config shown earlier (`"include": ["src"]`, `"outDir": "dist"`), run:

```bash
npx tsc
node dist/index.js
```

You should see `5`. Now break it on purpose — change the call to `add(2, '3')` and run `npx tsc` again:

```text
src/index.ts:5:24 - error TS2345: Argument of type 'string' is not
assignable to parameter of type 'number'.
```

The compiler reports the error and does not produce broken output logic. Fix it and recompile.

# Real World Analogy

`tsconfig.json` is like the **settings file for a camera**. The camera (compiler) can shoot in many modes; the settings decide the output format, the quality, and how strict the autofocus is. Once you've dialed in your settings, you just press the shutter (`npx tsc`) and get consistent results every time — no need to re-specify everything per shot.

# Examples

## Example 1 — Basic: type-check without emitting

```bash
npx tsc --noEmit
```

**Why this works:** `--noEmit` runs the full type check but writes no `.js`. It's how continuous-integration pipelines and many bundler-based projects use `tsc` — as a *checker*, while a separate tool produces the JavaScript.

## Example 2 — Real-world: a project config for an app bundled by Vite/webpack

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

**Why this works:** when a bundler compiles your code, TypeScript's job is purely type-checking, so `noEmit` is on. `moduleResolution: "bundler"` matches how bundlers resolve imports, and `skipLibCheck` speeds things up by trusting library `.d.ts` files.

## Example 3 — Best practice / edge case: pin the version with `npx`

```bash
npx tsc --version   # uses the project's TypeScript, not a global one
```

**Why this works:** teams should compile with the *same* compiler version. Installing `typescript` as a dev dependency and running it via `npx` guarantees everyone (and CI) uses the version in `package.json`, avoiding "works on my machine" differences.

# Common Mistakes

- **Installing TypeScript globally only.** A global `tsc` drifts from the project's version. Prefer a dev dependency plus `npx`.
- **Turning off `strict` to silence errors.** Those errors are usually real. Keep `strict` on and fix the code.
- **Editing the emitted `.js`.** Never edit generated output; change the `.ts` source and recompile.
- **Forgetting `include`/`outDir`.** Without them the compiler may scan the wrong files or scatter output next to sources.

# Best Practices

- Use the **Playground** for quick experiments and to inspect inferred types.
- Keep a single **`tsconfig.json`** per project and commit it.
- Start every project with **`strict: true`**.
- In bundler-based apps, run `tsc` with **`--noEmit`** as a type-check step in CI.

# Summary

- Try TypeScript instantly at the **Playground**; no install needed.
- Install the compiler with **`npm install -D typescript`** and run it with **`npx tsc`**.
- **`tsc`** compiles `.ts` to `.js`; `--watch` recompiles on save; `--noEmit` checks only.
- **`tsconfig.json`** configures the project; generate one with `tsc --init`.
- **`strict: true`** enables the strict checks this course relies on — keep it on.

# Flash Cards

Q: Which command installs TypeScript as a project build tool?
A: `npm install --save-dev typescript` (then run it with `npx tsc`).

Q: What file configures a TypeScript project, and how do you generate a starter?
A: `tsconfig.json`; generate one with `npx tsc --init`.

Q: What does the `strict` compiler option do?
A: It turns on TypeScript's family of strict type-checking options (including `strictNullChecks`).

Q: How do you type-check a project without producing any JavaScript?
A: Run `tsc` with `--noEmit` (or set `"noEmit": true` in tsconfig).

Q: Where can you experiment with TypeScript without installing anything?
A: The online TypeScript Playground at typescriptlang.org/play.

Q: Why run `tsc` through `npx` instead of a global install?
A: `npx` uses the project's pinned TypeScript version, so everyone and CI compile with the same compiler.

# Exercises

### Easy
Open the Playground, paste `const n: number = 'oops';`, and read the error message. Then fix it so it compiles.

### Medium
Create a new folder, initialize npm, install TypeScript, run `tsc --init`, and compile a one-function file into a `dist` folder. Run the output with Node.

### Challenging
Write a `tsconfig.json` for a bundler-based app that type-checks `src` with `strict` on but emits no JavaScript. Explain each option you chose in a sentence.

# Further Reading

- [Download / install TypeScript](https://www.typescriptlang.org/download/)
- [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [tsc, the TypeScript compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [The TypeScript Playground](https://www.typescriptlang.org/play)
