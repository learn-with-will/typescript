---
slug: exhaustive-checks-with-never
title: "Exhaustive Checks with never"
topic: unions-and-narrowing
kind: pattern
summary: "Leverage the never type in a default switch case to guarantee compile-time exhaustiveness when handling union variants."
tags: [never, exhaustive-checking, switch]
related: [the-never-type, discriminated-unions, union-types]
---
> **In one line:** Assign unhandled cases to a never variable in default blocks to catch missing union cases at compile time.

## The idea

When working with discriminated unions, you frequently write `switch` statements to handle each variant. As business requirements change, team members will add new variants to the union (for example, adding a `"refunded"` status to an existing `PaymentStatus` union).

If someone forgets to update a `switch` statement handling that union, the missing variant falls through silently, often causing production bugs.

You can use the `never` type to turn this into an immediate compile-time error. In the `default` case of your switch statement, assign the variable to a temporary `never` variable: `const _exhaustiveCheck: never = state`. If any unhandled variant reaches the default case, the compiler will refuse to build, reporting that the unhandled variant is not assignable to `never`.

## See it

```typescript
type NotificationType = 'email' | 'sms' | 'push';

function dispatchNotification(type: NotificationType): void {
  switch (type) {
    case 'email':
      console.log('Sending email...');
      break;
    case 'sms':
      console.log('Sending SMS message...');
      break;
    case 'push':
      console.log('Dispatching push notification...');
      break;
    default: {
      // If a new type like 'slack' is added to NotificationType without a case,
      // TypeScript produces a compile error on this line:
      const _unhandled: never = type;
      throw new Error(`Unhandled notification type: ${_unhandled}`);
    }
  }
}
```

> **Tip:** This pattern is called "exhaustiveness checking" and is standard practice across production TypeScript systems.

## Go deeper

How the exhaustiveness check detects unhandled variants at compile time:

| Action | Result on Union | Compile Status |
|---|---|---|
| All variants handled in `case` statements | Remaining type in `default` is `never` | Compiles cleanly (`never` assigns to `never`) |
| Variant `'slack'` added to union, no case | Remaining type in `default` is `'slack'` | Compile error (`'slack'` not assignable to `never`) |
| Developer adds `case 'slack':` | Exhaustive coverage restored | Compiles cleanly again |

## Watch out

- Always throw an error in the default block at runtime in case unvalidated data slips past.
- Omitting the break or return statement in preceding cases can cause fallthrough and false errors.

## Remember

- Assigning unhandled union values to never ensures all cases are handled at compile time.
- Adding a new variant to a union immediately flags every incomplete switch across the codebase.
- Exhaustiveness checking prevents silent fallthrough bugs during refactoring.
