---
slug: abstract-classes
title: "Abstract Classes"
topic: classes-and-enums
kind: technique
summary: "Define template base classes with abstract methods that must be implemented by concrete subclasses."
tags: [classes, abstract, oop]
related: [class-inheritance-and-implements, class-member-visibility, parameter-properties]
---
> **In one line:** Use abstract classes as base templates that cannot be directly instantiated.

## The idea

An abstract class is a base class that cannot be instantiated directly with `new`. Its purpose is to serve as a shared foundation for derived subclasses, combining concrete shared logic with abstract method definitions that subclasses must implement.

In TypeScript, you declare an abstract class using the `abstract` keyword. Inside, you can mark specific methods or properties as `abstract`. An abstract method has no implementation body; it merely defines the required signature.

Concrete subclasses extending the abstract class are required by the compiler to implement all inherited abstract methods. This pattern is ideal for implementing Template Method patterns, rendering pipelines, or database drivers.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
abstract class DataImporter {
  public import(): void {
    const rawData = this.fetchSource();
    this.process(rawData);
    console.log('Import cycle completed.');
  }

  protected abstract fetchSource(): string[];
  protected abstract process(data: string[]): void;
}

class CsvImporter extends DataImporter {
  protected fetchSource(): string[] {
    return ['row1,data', 'row2,data'];
  }

  protected process(data: string[]): void {
    console.log(`Parsed ${data.length} CSV rows.`);
  }
}

const importer = new CsvImporter();
importer.import();
```

> **Tip:** Use an interface if you only need a shape contract; use an abstract class when you need to share concrete code alongside contracts.

## Go deeper

Comparing interfaces vs abstract classes for architecture:

| Feature | Interface | Abstract Class |
|---|---|---|
| Emits runtime JavaScript code | No (erased completely) | Yes (emits ES class) |
| Can contain implemented methods | No | Yes |
| Can contain constructors | No | Yes |
| Subclasses per class | Multiple | Only one base class |
| Can use `instanceof` check | No | Yes (`x instanceof BaseClass`) |

## Watch out

- Attempting to instantiate an abstract class directly (new AbstractClass()) fails compilation.
- Subclasses that do not implement all abstract methods must themselves be declared abstract.

## Remember

- Abstract classes cannot be instantiated and serve as base templates.
- Subclasses must provide implementations for all abstract methods.
- Choose abstract classes over interfaces when sharing concrete method implementations.
