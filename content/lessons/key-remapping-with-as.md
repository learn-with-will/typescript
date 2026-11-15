---
slug: key-remapping-with-as
title: "Key Remapping with as"
topic: type-transformations
kind: technique
summary: "Transform, rename, or filter property keys during mapping using the as clause in mapped types."
tags: [mapped-types, key-remapping, as-clause]
related: [mapped-type-syntax, filtering-keys-with-never, template-literal-type-basics]
---
> **In one line:** Use [K in keyof T as NewKey] to rename or filter property names while mapping.

## The idea

Before TypeScript 4.1, mapped types could only transform property values; they could not alter the property names themselves. Every key in the output type was forced to match the exact key from the input type.

TypeScript 4.1 introduced key remapping via the `as` clause in mapped types:
`[K in keyof T as NewKeyExpression]: ValueType`.

The `as` clause allows you to compute entirely new key names during iteration. You can prefix property names (e.g. creating getter methods like `getName()`), capitalize keys, or remap keys into template literal string patterns.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface UserData {
  name: string;
  age: number;
}

// Remap keys to create getter method names:
// 'name' -> 'getName', 'age' -> 'getAge'
type CreateGetters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = CreateGetters<UserData>;
// Inferred as:
// {
//   getName: () => string;
//   getAge: () => number;
// }

const getters: UserGetters = {
  getName: () => 'Alice',
  getAge: () => 28
};
```

> **Tip:** You can combine key remapping with template literal types to build typed event emitter interfaces.

## Go deeper

Common key remapping patterns:

| Desired Transformation | Remapping Expression | Example Output Key |
|---|---|---|
| Prefix property | `as `data_${string & K}`` | `name` -> `data_name` |
| Getter method | `as `get${Capitalize<string & K>}`` | `title` -> `getTitle` |
| Suffix property | `as `${string & K}Changed`` | `user` -> `userChanged` |
| Filter out key | `as K extends 'id' ? never : K` | Removes `id` key |

## Watch out

- You must intersect K with string (string & K) because keyof T can include symbols and numbers.
- Remapping multiple keys to the exact same string merges their value types into a union.

## Remember

- Use the as clause in mapped types to rename property keys dynamically.
- Combine with Capitalize and template literal types to generate method names.
- string & K ensures the key can be formatted inside template literal strings.
