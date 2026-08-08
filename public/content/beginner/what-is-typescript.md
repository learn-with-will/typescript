---
id: lesson-01
slug: what-is-typescript
title: "What Is TypeScript?"
level: beginner
order: 1
duration: 18
tags:
  - fundamentals
  - type-checking
  - compiler
  - structural-typing
  - erasure
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what TypeScript is and how it relates to JavaScript.
- Describe what the TypeScript compiler checks — and what it deliberately does not check at runtime.
- Explain what it means that TypeScript's types are **erased**.
- Describe **structural typing** in one sentence.
- Say what changed in TypeScript 7 and what did not.

# Why It Matters

JavaScript runs almost everywhere, but it only tells you about a mistake *when the code runs* — often in front of a user. If you call `user.nmae` instead of `user.name`, JavaScript happily gives you `undefined` and moves on. The bug surfaces later, somewhere else, harder to trace.

TypeScript catches that class of mistake **before you run the program**. It reads your code, works out the type of every value, and flags the places where the types don't line up — a misspelled property, a number used where a string was expected, a function called with the wrong arguments. You get the feedback in your editor, as you type, instead of from a bug report.

# Concept Explanation

### A typed superset of JavaScript

TypeScript is a programming language that **adds a type layer on top of JavaScript**. It is a *superset*: every valid JavaScript program is also a valid TypeScript program. You can rename a `.js` file to `.ts` and start from there, adding types gradually.

The extra syntax TypeScript adds is mostly **type annotations** — small notes that say what kind of value something is:

```typescript
let title: string = 'Intro to TypeScript';
let lessons: number = 24;
```

### The compiler checks, then erases

TypeScript ships a program called the **compiler** (`tsc`). It does two jobs:

1. **Type-checks** your code — reports the mismatches described above.
2. **Emits** plain JavaScript — it removes the type annotations and writes out normal `.js` files that run in any browser or in Node.js.

That second point is the one to hold on to: **types are erased**. They exist only while you are writing and compiling. The JavaScript that actually runs has no annotations, no interfaces, and does **no type checking of its own**. A type says "I expect a `string` here" to the compiler; it does not stand guard at runtime.

```typescript
function greet(name: string) {
  return 'Hello, ' + name;
}
```

compiles to roughly:

```javascript
function greet(name) {
  return 'Hello, ' + name;
}
```

The `: string` is gone. This is why TypeScript is sometimes described as "JavaScript that scales" rather than a different runtime — the running program *is* JavaScript.

### Structural typing

TypeScript decides whether two types are compatible by looking at their **shape**, not their name. If a value has all the properties a type requires, it is accepted — even if it was never declared to be that type. This is called **structural typing** (informally, "if it walks like a duck…"). You'll see exactly how this plays out when we reach objects and interfaces.

### What TypeScript 7 changed

For years the TypeScript compiler was itself written in TypeScript. **TypeScript 7.0** is a **native port of the compiler written in Go**. It is dramatically faster — commonly around ten times faster on large projects — because native code and multithreading make better use of your hardware.

Crucially, TypeScript 7 is a *port*, not a redesign of the language. **The types you write, and the rules the compiler enforces, are the same** as in the recent 5.x and 6.0 releases. Everything in this course is about that language, and it applies whether your compiler is the classic one or the new native one.

# Key Terminology

- **JavaScript** — the language that actually runs in browsers and Node.js.
- **TypeScript** — JavaScript plus a compile-time type system.
- **Superset** — a language that contains another entirely; all JavaScript is valid TypeScript.
- **Type annotation** — syntax like `: string` that tells the compiler a value's type.
- **Compiler (`tsc`)** — the tool that type-checks your code and emits JavaScript.
- **Type erasure** — the removal of all type information when TypeScript is compiled to JavaScript.
- **Static type checking** — checking types before the program runs (as opposed to *at* runtime).
- **Structural typing** — type compatibility judged by an object's shape, not its declared name.

# Syntax and Options

| Term | Meaning | Runtime effect |
| ---- | ------- | -------------- |
| `.ts` file | A TypeScript source file | Compiled to `.js` |
| Type annotation (`: string`) | A note for the compiler | **Erased** — none |
| `tsc` | The compiler CLI | Produces `.js` |
| Static check | Happens at compile time | Catches bugs early |
| Structural check | Compatibility by shape | Governs what's assignable |

# Hands-On Walkthrough

Here is a tiny program that a plain-JavaScript project would let ship with a bug.

```typescript
interface User {
  name: string;
  age: number;
}

function describe(user: User): string {
  return `${user.name} is ${user.age}`;
}

const u = { name: 'Ada', age: 36 };
console.log(describe(u)); // "Ada is 36"
```

Now introduce a typo. Change the call to read a misspelled property:

```typescript
console.log(describe({ name: 'Ada', aeg: 36 }));
//                                   ~~~ 
// Error: Object literal may only specify known properties,
// and 'aeg' does not exist in type 'User'.
```

TypeScript refuses to compile and points at `aeg`. In plain JavaScript this would run, `user.age` would be `undefined`, and the output would read `"Ada is undefined"`. The type system turned a silent runtime bug into an obvious compile-time error.

# Real World Analogy

Think of TypeScript as **spell-check and grammar-check for your code**. As you type an essay, the editor underlines a misspelled word or a sentence whose subject and verb disagree — before you print and hand it in. It does not change how the printed page is read; the reader still just reads plain text. TypeScript underlines type "grammar" mistakes before your code runs, then hands the reader (the browser) plain JavaScript.

# Examples

## Example 1 — Basic: an annotation catches a mismatch

```typescript
let count: number = 3;
count = 'four';
// Error: Type 'string' is not assignable to type 'number'.
```

**Why this works:** `count` was declared as a `number`, so assigning a `string` is a type error. The compiler compares the type of the value on the right to the declared type on the left and rejects the mismatch.

## Example 2 — Real-world: guarding a function's inputs

```typescript
function total(price: number, quantity: number): number {
  return price * quantity;
}

total(10, 2);       // 20
total('10', 2);     // Error: Argument of type 'string' is not
                    // assignable to parameter of type 'number'.
```

**Why this works:** the parameter types document *and* enforce (at compile time) that `total` must be called with two numbers. A caller who passes a string learns immediately, at the call site, instead of getting `'10' * 2` surprises later.

## Example 3 — Best practice / edge case: types are gone at runtime

```typescript
function isString(value: string) {
  // This does NOT verify anything at runtime — `: string` is erased.
  return true;
}
```

**Why this works — and why it's a trap:** the annotation `value: string` is a *compile-time* promise, not a runtime check. If data arrives from the network as JSON, TypeScript cannot stop a number from showing up where a string was expected — the annotation was erased. To check real runtime data you write real runtime code (a comparison, a validation library). We cover this properly in later lessons.

```text
Compile time:  types checked  ──►  types erased
Runtime:       plain JavaScript, no type information
```

# Common Mistakes

- **Believing types run.** Assuming a `: string` annotation validates incoming data at runtime. It does not — types are erased. Validate real external data with real code.
- **Thinking TypeScript is a different language.** It compiles *to* JavaScript and runs *as* JavaScript; there is no separate TypeScript runtime.
- **Expecting TypeScript to change behavior.** Two programs that differ only in type annotations run identically; the annotations are removed.
- **Assuming TypeScript 7 changed the language.** It is a faster compiler for the same language.

# Best Practices

- Treat TypeScript as a tool that gives you **fast feedback in the editor** — read the red squiggles as you type.
- Add types where they clarify intent (function inputs and outputs especially); let the compiler infer the obvious rest (next lessons).
- Remember the boundary: **inside** your program, trust the types; at the **edges** (network, files, user input), still validate at runtime.

# Summary

- TypeScript is a **typed superset of JavaScript**: all JavaScript is valid TypeScript.
- The compiler `tsc` **type-checks** your code and **emits plain JavaScript**.
- **Types are erased** — they exist at compile time only and do no runtime checking.
- TypeScript uses **structural typing**: compatibility is judged by shape.
- **TypeScript 7.0** is a native (Go) port of the compiler — much faster, same language.
- The value of TypeScript is catching whole categories of bugs *before* the code runs.

# Flash Cards

Q: Is every valid JavaScript program also a valid TypeScript program?
A: Yes — TypeScript is a superset of JavaScript, so all JavaScript is valid TypeScript.

Q: What does it mean that TypeScript's types are "erased"?
A: Type annotations are removed during compilation; the emitted JavaScript contains no types and does no type checking at runtime.

Q: What two jobs does the `tsc` compiler do?
A: It type-checks your code and emits plain JavaScript.

Q: What is structural typing?
A: Type compatibility is decided by an object's shape (its properties), not by the name it was declared with.

Q: What is the headline change in TypeScript 7.0?
A: The compiler was rewritten as a native Go program — roughly ten times faster — while keeping the same language and type-checking rules.

Q: If a value comes from the network, does a `: string` annotation guarantee it's a string at runtime?
A: No. The annotation is erased; you must validate external data with real runtime code.

# Exercises

### Easy
In your own words, write one sentence explaining why `let x: number = 'hi'` is a compile-time error but running plain JavaScript `let x = 'hi'` is not.

### Medium
Take a small JavaScript snippet you've written before (5–10 lines). Rename it to `.ts` and add type annotations to any function parameters. Note whether the compiler reports anything.

### Challenging
Explain, with a two-line example, why TypeScript cannot prevent a JSON API from returning a number where your code expected a string — and describe what you'd have to add to catch it.

# Further Reading

- [The TypeScript Handbook — The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [Announcing TypeScript 7.0](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/)
