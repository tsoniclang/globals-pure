/**
 * @tsonic/globals-pure
 *
 * Global type definitions for Tsonic with CLR naming conventions.
 *
 * This package provides:
 * 1. Synthesized Array<T> combining System.Array with generic collection interfaces
 * 2. BCL primitive methods on String, Number, Boolean (from @tsonic/dotnet-pure)
 * 3. TypeScript compiler intrinsics (utility types, iterators, Promise, Symbol)
 */

// BCL types from @tsonic/dotnet-pure
import {
  Array$instance, __Array$views,
  String$instance, __String$views,
  Double$instance, __Double$views,
  Boolean$instance, __Boolean$views,
  Object$instance
} from "@tsonic/dotnet-pure/System/internal/index.js";
import type { IEnumerator } from "@tsonic/dotnet-pure/System.Collections/internal/index.js";
import { IEnumerable_1, IEnumerator_1 } from "@tsonic/dotnet-pure/System.Collections.Generic/internal/index.js";

declare global {
  // Minimal Error surface (noLib mode).
  // Compiler maps this to CLR System.Exception via builtin bindings.
  class Error {
    name: string;
    message: string;
    stack?: string;
    constructor(message?: string);
  }

  /**
   * Array<T> - C# array type (T[])
   *
   * C# arrays are fixed-size and do NOT have IList<T>/ICollection<T> instance methods.
   * They only support:
   * - System.Array instance methods (Length, Rank, Clone, CopyTo, etc.)
   * - IEnumerable<T> for iteration (foreach)
   * - Indexer access
   *
   * For mutable collection operations (Add, Remove, etc.), use List<T> instead.
   * For LINQ operations (Select, Where, etc.), use Enumerable methods.
   */
  interface Array<T> extends Array$instance, __Array$views, IEnumerable_1<T> {
    [n: number]: T;
    [Symbol.iterator](): IterableIterator<T>;
    GetEnumerator(): IEnumerator_1<T>;
    GetEnumerator(): IEnumerator;
  }

  interface ReadonlyArray<T> extends Array$instance, __Array$views, IEnumerable_1<T> {
    readonly [n: number]: T;
    [Symbol.iterator](): IterableIterator<T>;
    GetEnumerator(): IEnumerator_1<T>;
    GetEnumerator(): IEnumerator;
  }

  /**
   * ArrayConstructor - allows new Array<T>(size) syntax
   * In dotnet mode: emits as new T[size]
   */
  interface ArrayConstructor {
    new <T>(size?: number): T[];
  }

  const Array: ArrayConstructor;

  /**
   * String - augmented with BCL methods from System.String
   * Uses CLR PascalCase naming: Contains(), IndexOf(), StartsWith(), etc.
   */
  interface String extends String$instance, __String$views {}

  /**
   * Number - augmented with BCL methods from System.Double
   * Uses CLR PascalCase naming: ToString(), GetHashCode(), etc.
   */
  interface Number extends Double$instance, __Double$views {}

  /**
   * Boolean - augmented with BCL methods from System.Boolean
   * Uses CLR PascalCase naming: ToString(), GetHashCode(), etc.
   */
  interface Boolean extends Boolean$instance, __Boolean$views {}

  /**
   * Object - augmented with BCL methods from System.Object
   */
  interface Object extends Object$instance {
    constructor: Function;
  }

  /**
   * Function - minimal base definition
   */
  interface Function {
    prototype: any;
  }

  /**
   * Required TypeScript compiler internals
   */
  interface CallableFunction extends Function {}
  interface NewableFunction extends Function {}
  interface IArguments {}

  /**
   * RegExp - minimal base definition
   */
  interface RegExp {}

  /**
   * Symbol
   */
  interface SymbolConstructor {
    readonly iterator: symbol;
    readonly asyncIterator: symbol;
    readonly hasInstance: symbol;
    readonly isConcatSpreadable: symbol;
    readonly species: symbol;
    readonly toPrimitive: symbol;
    readonly toStringTag: symbol;
  }

  const Symbol: SymbolConstructor;

  /**
   * PropertyKey - required for index signatures
   */
  type PropertyKey = string | number | symbol;

  /**
   * Utility types
   */
  type Partial<T> = { [P in keyof T]?: T[P] };
  type Required<T> = { [P in keyof T]-?: T[P] };
  type Readonly<T> = { readonly [P in keyof T]: T[P] };
  type Pick<T, K extends keyof T> = { [P in K]: T[P] };
  type Record<K extends keyof any, T> = { [P in K]: T };
  type Exclude<T, U> = T extends U ? never : T;
  type Extract<T, U> = T extends U ? T : never;
  type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
  type NonNullable<T> = T extends null | undefined ? never : T;
  type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
  type ConstructorParameters<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;
  type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
  type InstanceType<T extends new (...args: any) => any> = T extends new (...args: any) => infer R ? R : any;
  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

  /**
   * Promise types
   */
  interface Promise<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): Promise<TResult1 | TResult2>;
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
    ): Promise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }

  interface PromiseLike<T> {
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
    ): PromiseLike<TResult1 | TResult2>;
  }

  interface PromiseConstructor {
    new <T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): Promise<T>;
    resolve(): Promise<void>;
    resolve<T>(value: T | PromiseLike<T>): Promise<T>;
    reject<T = never>(reason?: any): Promise<T>;
    all<T>(values: readonly (T | PromiseLike<T>)[]): Promise<T[]>;
    race<T>(values: readonly (T | PromiseLike<T>)[]): Promise<T>;
  }

  const Promise: PromiseConstructor;

  /**
   * Iterator types
   */
  interface Iterator<T, TReturn = any, TNext = undefined> {
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return?(value?: TReturn): IteratorResult<T, TReturn>;
    throw?(e?: any): IteratorResult<T, TReturn>;
  }

  interface IteratorResult<T, TReturn = any> {
    done: boolean;
    value: T | TReturn;
  }

  interface IteratorYieldResult<T> {
    done: false;
    value: T;
  }

  interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
  }

  interface Iterable<T, TReturn = any, TNext = undefined> {
    [Symbol.iterator](): Iterator<T, TReturn, TNext>;
  }

  interface IterableIterator<T, TReturn = any, TNext = undefined> extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IterableIterator<T, TReturn, TNext>;
  }

  /**
   * Async Iterator types
   */
  interface AsyncIterator<T, TReturn = any, TNext = undefined> {
    next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
    return?(value?: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
    throw?(e?: any): Promise<IteratorResult<T, TReturn>>;
  }

  interface AsyncIterable<T, TReturn = any, TNext = undefined> {
    [Symbol.asyncIterator](): AsyncIterator<T, TReturn, TNext>;
  }

  interface AsyncIterableIterator<T, TReturn = any, TNext = undefined> extends AsyncIterator<T, TReturn, TNext> {
    [Symbol.asyncIterator](): AsyncIterableIterator<T, TReturn, TNext>;
  }

  /**
   * Generator types
   */
  interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
    return(value: TReturn): IteratorResult<T, TReturn>;
    throw(e: any): IteratorResult<T, TReturn>;
    [Symbol.iterator](): Generator<T, TReturn, TNext>;
  }

  interface AsyncGenerator<T = unknown, TReturn = any, TNext = unknown> extends AsyncIterator<T, TReturn, TNext> {
    next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
    return(value: TReturn | PromiseLike<TReturn>): Promise<IteratorResult<T, TReturn>>;
    throw(e: any): Promise<IteratorResult<T, TReturn>>;
    [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
  }

  /**
   * Template literal type utilities
   */
  type Uppercase<S extends string> = intrinsic;
  type Lowercase<S extends string> = intrinsic;
  type Capitalize<S extends string> = intrinsic;
  type Uncapitalize<S extends string> = intrinsic;
}

// This export is required to make this file a module
export {};
