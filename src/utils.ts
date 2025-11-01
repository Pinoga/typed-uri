export declare const Ok: any;
export declare const Fail: never;

export type Decrement = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export type Increment = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, never];
export type ExtractUntilLast<
  T extends string,
  C extends string,
  Start = true,
> = T extends `${infer Prefix}${C}${infer Suffix}`
  ? `${Prefix}${C}${ExtractUntilLast<Suffix, C, false>}`
  : "";

Ok satisfies ExtractUntilLast<"::0000:0000:0000:0000:0000:0000:127.0.0.1", ":">;
Fail satisfies ExtractUntilLast<"0000", ":">;

export type ExtractAfterLast<
  T extends string,
  C extends string,
  Start = true,
> = T extends `${infer _}${C}${infer Suffix}`
  ? ExtractAfterLast<Suffix, C, false>
  : Start extends true
    ? ""
    : T;

Ok satisfies ExtractAfterLast<"::0000:0000:0000:0000:0000:0000:127.0.0.1", ":">;
Fail satisfies ExtractAfterLast<"0000", ":">;

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

Ok satisfies OneOrMore<"P", "P">;
Ok satisfies OneOrMore<"PPP", "P">;
Fail satisfies OneOrMore<"8080", "0">;
Fail satisfies OneOrMore<"PPPG", "P">;
Fail satisfies OneOrMore<"PPPGP", "P">;
Fail satisfies OneOrMore<"", "P">;
Fail satisfies OneOrMore<"127.0.0.1]", "0">;
