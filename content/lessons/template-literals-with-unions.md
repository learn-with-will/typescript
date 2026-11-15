---
slug: template-literals-with-unions
title: "Template Literals with Unions"
topic: type-transformations
kind: technique
summary: "Interpolate union types into template literals to automatically generate cross-product string combinations."
tags: [template-literals, unions, cross-product]
related: [template-literal-type-basics, intrinsic-string-manipulation, key-remapping-with-templates]
---
> **In one line:** Interpolating unions into template literals calculates the cartesian cross-product of all combinations.

## The idea

One of the most remarkable capabilities of template literal types is how they interact with union types.

When you interpolate a union into a template literal type, TypeScript automatically computes the cross-product (cartesian product) of all possible combinations.

For example, if you have a union of sizes (`'small' | 'large'`) and a union of colors (`'red' | 'blue'`), interpolating both into `` `${Size}-${Color}` `` automatically generates a union of four distinct literal types: `"small-red" | "small-blue" | "large-red" | "large-blue"`. This eliminates repetitive manual declarations when building UI design systems.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
type Direction = 'top' | 'bottom' | 'left' | 'right';
type Spacing = 'sm' | 'md' | 'lg';

// Computes 4 x 3 = 12 distinct utility class names:
type MarginUtility = `margin-${Direction}-${Spacing}`;
// "margin-top-sm" | "margin-top-md" | "margin-top-lg" | ...

type HttpMethod = 'GET' | 'POST';
type Resource = 'users' | 'orders';

// Computes 2 x 2 = 4 API endpoint action types:
type ApiAction = `${HttpMethod} /api/${Resource}`;
// "GET /api/users" | "GET /api/orders" | "POST /api/users" | "POST /api/orders"

function callApi(endpoint: ApiAction): void {
  console.log(`Dispatching ${endpoint}`);
}

callApi('GET /api/users');
```

> **Tip:** You can combine three or more unions together to generate comprehensive event or design tokens.

## Go deeper

Visualizing the cross-product generation:

| Union 1 (`Vertical`) | Union 2 (`Horizontal`) | Resulting Union (`` `${Vertical}-${Horizontal}` ``) |
|---|---|---|
| `'top' | 'bottom'` | `'left' | 'right'` | `"top-left" | "top-right" | "bottom-left" | "bottom-right"` |

## Watch out

- Multiplying large unions can cause an exponential explosion of types (e.g. 10 x 10 x 10 = 1000 types).
- TypeScript imposes a limit on union sizes to protect compiler memory and performance.

## Remember

- Interpolating unions into template literals produces all possible combinations.
- Use union cross-products to model design tokens, utility classes, and route tables.
- Keep input union sizes modest to avoid compiler performance slowdowns.
