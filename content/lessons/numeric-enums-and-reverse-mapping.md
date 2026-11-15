---
slug: numeric-enums-and-reverse-mapping
title: "Numeric Enums & Reverse Mapping"
topic: classes-and-enums
kind: concept
summary: "Numeric enums assign incrementing numbers to named constants and generate a runtime reverse mapping from value to name."
tags: [enums, runtime, reverse-mapping]
related: [string-enums, const-enums-and-isolated-modules, enums-versus-union-of-literals]
---
> **In one line:** Numeric enums auto-increment from 0 and emit runtime objects with two-way reverse mappings.

## The idea

Unlike interfaces and type aliases which are erased during compilation, enums are one of the few TypeScript constructs that emit real runtime JavaScript code.

By default, an `enum` in TypeScript is numeric. If you do not assign initial values, the members auto-increment starting from `0`. You can also specify an initial starting number, and subsequent members will auto-increment from there.

A unique feature of numeric enums is reverse mapping: TypeScript emits a lookup object that maps not only member names to values (`Direction.Up -> 0`), but also values back to their member names (`Direction[0] -> "Up"`). This is helpful when logging human-readable names for numeric codes.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
enum HttpStatus {
  Ok = 200,
  Created,      // 201
  BadRequest = 400,
  Unauthorized  // 401
}

// Forward lookup (name -> value):
const code: HttpStatus = HttpStatus.Ok;
console.log(code); // 200

// Reverse lookup (value -> name):
const statusName: string = HttpStatus[200];
console.log(statusName); // "Ok"
```

> **Note:** Reverse mapping only exists for numeric enums; string enums do NOT generate reverse mappings.

## Go deeper

The JavaScript emitted for numeric enums creates the two-way mapping:

```javascript
// Emitted JavaScript code:
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["Ok"] = 200] = "Ok";
    HttpStatus[HttpStatus["Created"] = 201] = "Created";
})(HttpStatus || (HttpStatus = {}));
```

| Lookup Operation | Code | Result |
|---|---|---|
| Forward (Name -> Value) | `HttpStatus.Created` | `201` |
| Reverse (Value -> Name) | `HttpStatus[201]` | `"Created"` |

## Watch out

- Numeric enums permit arbitrary numbers in older TS versions; be careful with unchecked assignments.
- Enums add runtime code to your output bundle unlike type aliases.

## Remember

- Numeric enums auto-increment integer values starting from 0 by default.
- TypeScript generates a reverse mapping from numeric values to member names.
- Enums emit runtime JavaScript objects and are not erased during compilation.
