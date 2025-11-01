export declare const Ok: any;
export declare const Fail: any;

export type Decrement = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export type Increment = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, never];
export type ExtractUntilLast<
  T extends string,
  C extends string,
> = T extends `${infer Prefix}${C}${infer Suffix}`
  ? `${Prefix}${C}${ExtractUntilLast<Suffix, C>}`
  : "";

let test = "::0000:0000:0000:0000:0000:0000:127.0.0.1" as const;
let t1: ExtractUntilLast<typeof test, ":"> = "::0000:0000:0000:0000:0000:0000:";
let t2: ExtractUntilLast<typeof test, "/"> = "";

export type ExtractAfterLast<
  T extends string,
  C extends string,
  Start = true,
> = T extends `${infer _}${C}${infer Suffix}`
  ? ExtractAfterLast<Suffix, C, false>
  : Start extends true
    ? ""
    : T;

let t3: ExtractAfterLast<typeof test, ":"> = "127.0.0.1";
let t4: ExtractAfterLast<typeof test, "/"> = "";

export type OneOrMore<
  T extends string,
  Char extends string,
> = T extends `${Char}${infer Suffix}`
  ? Suffix extends ""
    ? T
    : OneOrMore<Suffix, Char> extends never
      ? never
      : T
  : never;

export type ZeroOrMore<T extends string, Char extends string> = T extends ""
  ? T
  : OneOrMore<T, Char>;

Ok satisfies OneOrMore<"PPP", "P">;
// @ts-expect-error
Fail satisfies OneOrMore<"8080", "0">;
// @ts-expect-error
Fail satisfies OneOrMore<"PPPG", "P">;
// @ts-expect-error
Fail satisfies OneOrMore<"PPPGP", "P">;
// @ts-expect-error
Fail satisfies OneOrMore<"", "P">;
// @ts-expect-error
Fail satisfies OneOrMore<"127.0.0.1]", "0">;
