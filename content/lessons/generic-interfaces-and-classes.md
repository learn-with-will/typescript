---
slug: generic-interfaces-and-classes
title: "Generic Interfaces and Classes"
topic: generics
kind: technique
summary: "Parameterize interfaces and classes with type parameters to create reusable data structures and response wrappers."
tags: [generics, interfaces, classes]
related: [generic-functions, generic-constraints, default-type-parameters]
---
> **In one line:** Parameterize interfaces and classes to build reusable containers, collections, and API wrappers.

## The idea

Just as functions can accept type parameters to operate on different types, interfaces and classes can also be parameterized with generics.

This pattern is ubiquitous in modern application architecture. For instance, an API response envelope almost always has the same outer structure (`success`, `timestamp`, `statusCode`), but the inner `data` payload changes from endpoint to endpoint.

By declaring a generic interface `ApiResponse<T>`, you create a reusable container where `T` represents the specific payload returned by a given query. Classes can similarly parameterize internal storage structures, caches, or state managers.

## See it

```typescript
// Generic API response envelope:
interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

interface UserProfile {
  id: string;
  email: string;
}

interface ProductItem {
  sku: string;
  price: number;
}

function handleUserResponse(res: ApiResponse<UserProfile>): void {
  console.log(`User email: ${res.data.email}`);
}

function handleProductResponse(res: ApiResponse<ProductItem>): void {
  console.log(`Product price: $${res.data.price}`);
}
```

> **Tip:** You can declare multiple type parameters in an interface: `interface KeyValuePair<K, V> { key: K; value: V; }`.

## Go deeper

Generic class implementing an in-memory cache:

```typescript
class MemoryStore<T> {
  private items: Map<string, T> = new Map();

  set(key: string, value: T): void {
    this.items.set(key, value);
  }

  get(key: string): T | undefined {
    return this.items.get(key);
  }
}

const userStore = new MemoryStore<UserProfile>();
userStore.set('usr_1', { id: 'usr_1', email: 'alice@example.com' });
```

## Watch out

- Static members on a generic class cannot reference the class type parameter T.
- Instantiating a generic class without type arguments or constructor inference may default T to unknown.

## Remember

- Use interface Box<T> to define reusable wrapper types and data structures.
- Generic classes parameterize instance properties and methods across their lifecycle.
- API envelopes and repository stores are ideal use cases for generic interfaces.
