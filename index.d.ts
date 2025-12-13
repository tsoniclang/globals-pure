/**
 * @tsonic/globals-pure
 *
 * Global type definitions for Tsonic with CLR naming conventions.
 *
 * This package provides:
 * 1. Base types required by TypeScript (Array, String, Object, Function, etc.)
 * 2. Shared types used by both modes (utility types, iterators, Promise, Symbol)
 * 3. BCL primitive methods on String, Number, Boolean (from @tsonic/dotnet-pure)
 *
 * For dotnet mode: Use this package alone. Primitives have BCL methods with PascalCase naming.
 * For JS mode: Use with @tsonic/js-globals which extends base types with JS methods.
 */

import { String$instance, Double$instance, Boolean$instance } from "@tsonic/dotnet-pure/System";

declare global {
  /**
   * Array type - minimal base definition
   * In dotnet mode, use List<T> methods or LINQ
   * In JS mode, @tsonic/js-globals extends this with .map, .filter, etc.
   */
  interface Array<T> {
    [n: number]: T;
    [Symbol.iterator](): IterableIterator<T>;
  }

  interface ReadonlyArray<T> {
    readonly [n: number]: T;
    [Symbol.iterator](): IterableIterator<T>;
  }

  /**
   * String - augmented with BCL methods from System.String
   * All System.String instance methods are available on string primitives.
   * Uses CLR PascalCase naming: Contains(), IndexOf(), StartsWith(), etc.
   * In JS mode, @tsonic/js-globals may override with JS-specific methods.
   */
  interface String extends String$instance {}

  /**
   * Number - augmented with BCL methods from System.Double
   * All System.Double instance methods are available on number primitives.
   * Uses CLR PascalCase naming: ToString(), GetHashCode(), etc.
   */
  interface Number extends Double$instance {}

  /**
   * Boolean - augmented with BCL methods from System.Boolean
   * All System.Boolean instance methods are available on boolean primitives.
   * Uses CLR PascalCase naming: ToString(), GetHashCode(), etc.
   */
  interface Boolean extends Boolean$instance {}

  /**
   * Object - minimal base definition
   */
  interface Object {
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
