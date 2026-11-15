---
slug: class-member-visibility
title: "Class Member Visibility"
topic: classes-and-enums
kind: technique
summary: "Control access to class fields and methods using public, protected, and private visibility modifiers."
tags: [classes, visibility, encapsulation]
related: [parameter-properties, class-inheritance-and-implements, readonly-and-getters-setters]
---
> **In one line:** Use public, protected, and private to enforce encapsulation boundaries on class members.

## The idea

JavaScript classes introduced standard object-oriented syntax in ES2015, but all properties and methods were public by default. Internal implementation details could be accessed or mutated from any code outside the class.

TypeScript provides compile-time visibility modifiers to enforce encapsulation:
- **`public` (default):** Members can be accessed from anywhere: inside the class, subclasses, and external call sites.
- **`protected`:** Members can only be accessed from within the declaring class and any classes that inherit from it. External consumers cannot access protected members.
- **`private`:** Members can strictly only be accessed from within the declaring class itself. Even subclasses cannot access private members.

These visibility modifiers are enforced purely at compile time by TypeScript. Note that JavaScript also features native private fields prefixed with `#` (like `#apiKey`), which provide true runtime privacy.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
class BankAccount {
  public readonly accountNumber: string;
  protected accountType: string = 'checking';
  private balance: number = 0;

  constructor(accNum: string, initialDeposit: number) {
    this.accountNumber = accNum;
    this.balance = initialDeposit;
  }

  public getBalance(): number {
    return this.balance; // Allowed inside declaring class
  }
}

const account = new BankAccount('AC-1002', 500);
console.log(account.accountNumber); // OK: public
console.log(account.getBalance());   // OK: public method
// console.log(account.balance);     // Error: Property 'balance' is private
```

> **Tip:** Use TypeScript `private` for API design clarity, or ECMAScript `#private` if you need strict runtime privacy.

## Go deeper

Comparing visibility modifiers and ECMAScript native private fields:

| Modifier | Accessible from Subclass? | Accessible from Outside? | Runtime Guarantee |
|---|---|---|---|
| `public` | Yes | Yes | Publicly accessible |
| `protected` | Yes | No (compile error) | Public at runtime (erased) |
| `private` | No (compile error) | No (compile error) | Public at runtime (erased) |
| `#private` (ES) | No (syntax error) | No (syntax error) | True hard runtime privacy |

## Watch out

- TypeScript private is a compile-time check; compiled JavaScript leaves the property accessible at runtime.
- Protected members cannot be accessed on instances from outside class methods.

## Remember

- Use public (default), protected, and private to control access to class members.
- protected permits subclass access while blocking external consumers.
- Compile-time modifiers are erased; use #private for hard runtime privacy.
