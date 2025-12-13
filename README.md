# @tsonic/globals-pure

Global type definitions for Tsonic with CLR naming conventions (PascalCase).

## Overview

This package provides base TypeScript types for Tsonic projects using CLR naming conventions:
- Base types required by TypeScript (Array, String, Object, Function, etc.)
- Utility types (Partial, Required, Readonly, Pick, Record, etc.)
- Iterator and async iterator types
- Promise types
- BCL primitive methods on String with PascalCase naming

## Usage

```typescript
// String methods are available with PascalCase naming
const str: string = "hello world";
str.Contains("hello"); // true
str.StartsWith("hello"); // true
str.IndexOf("world"); // 6
```

## Related Packages

- **@tsonic/globals** - Same functionality but with camelCase naming (TypeScript-friendly)
- **@tsonic/dotnet-pure** - Full .NET BCL type definitions with CLR naming
- **@tsonic/dotnet** - Full .NET BCL type definitions with camelCase naming

## License

MIT
