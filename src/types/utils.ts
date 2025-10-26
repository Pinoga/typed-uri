export type Decrement = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
export type Increment = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, never];
export type ExtractUntilLast<
  T extends string,
  C extends string,
  Start = true,
> = T extends `${infer Prefix}${C}${infer Suffix}`
  ? `${Prefix}${C}${ExtractUntilLast<Suffix, C, false>}`
  : Start extends true
    ? never
    : "";

type _ = ExtractUntilLast<"::0000:0000:0000:0000:0000:0000:127.0.0.1", ":">;
type _ = ExtractUntilLast<"0000", ":">;

export type ExtractAfterLast<
  T extends string,
  C extends string,
  Start = true,
> = T extends `${infer _}${C}${infer Suffix}`
  ? ExtractAfterLast<Suffix, C, false>
  : Start extends true
    ? never
    : T;

type _ = ExtractAfterLast<"::0000:0000:0000:0000:0000:0000:127.0.0.1", ":">;
type _ = ExtractAfterLast<"0000", ":">;
