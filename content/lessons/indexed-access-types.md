---
slug: indexed-access-types
title: "Indexed Access Types"
topic: utility-and-lookup-types
kind: technique
summary: "Look up specific property types on an object type using index notation Type[Key] to avoid duplicate type definitions."
tags: [indexed-access, lookup, types]
related: [keyof-type-operator, typeof-type-query, combining-keyof-and-indexed-access]
---
> **In one line:** Use Type[Key] to look up and reuse the type of a specific property.

## The idea

When building applications, you often need to reference the type of a property nested inside another interface. For example, if a `User` interface defines an `address` property with street and zip code, how do you type a helper function that takes just that address object?

You could define an `Address` interface separately. However, when working with complex types or external third-party libraries that do not export nested interfaces, TypeScript provides indexed access types: `Type[Key]`.

Just as you access object properties at runtime using square brackets (`user["address"]`), you can look up property types at compile time using `User["address"]`. The lookup type is guaranteed to stay synchronized if the parent interface changes.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface Order {
  id: string;
  total: number;
  delivery: {
    recipient: string;
    street: string;
    city: string;
  };
  items: string[];
}

// Look up a nested property type:
type DeliveryInfo = Order['delivery'];

// Look up array element types using [number]:
type OrderItem = Order['items'][number]; // Inferred as string

function printDelivery(delivery: DeliveryInfo): void {
  console.log(`Deliver to: ${delivery.recipient}, ${delivery.city}`);
}
```

> **Tip:** You can look up array element types using `MyArrayType[number]`.

## Go deeper

Indexed access capabilities across different data structures:

| Target Structure | Index Expression | Inferred Result Type |
|---|---|---|
| Single Property | `Order['total']` | `number` |
| Union of Properties | `Order['id' | 'total']` | `string | number` |
| Array Elements | `string[][number]` | `string` |
| Tuple Element by Index | `[string, number][0]` | `string` |

## Watch out

- You must use bracket notation (Type["prop"]); dot notation (Type.prop) is a syntax error in type positions.
- The index key must be a valid type; passing a runtime string variable fails compilation.

## Remember

- Use Type[Key] to look up property types from an existing interface.
- Use ArrayType[number] to extract the element type of an array.
- Indexed access ensures types stay synchronized when parent interfaces change.
