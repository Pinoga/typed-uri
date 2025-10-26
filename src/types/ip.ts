/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DecOctet, Hex16Bits } from "./aliases";
import type { Decrement, Increment } from "./utils";

export type IPv4<T extends string> =
  T extends `${infer Octet1}.${infer Octet2}.${infer Octet3}.${infer Octet4}`
    ? Octet1 extends DecOctet
      ? Octet2 extends DecOctet
        ? Octet3 extends DecOctet
          ? Octet4 extends DecOctet
            ? T
            : never
          : never
        : never
      : never
    : never;

type Hex32<T extends string> =
  T extends `${Hex16Bits<infer H16_1>}:${Hex16Bits<infer H16_2>}`
    ? T
    : T extends IPv4<T>
      ? T
      : never;

type Hex16AndColon<T extends string> = `${Hex16Bits<T>}:`;

type NToMHex16<
  T extends string,
  N extends number,
  M extends number,
  Acc extends number = 0,
  Start = true,
> = M extends never
  ? never
  : T extends ""
    ? Start extends true
      ? N extends 0
        ? T
        : never
      : Acc extends N
        ? T
        : never
    : T extends `${Hex16Bits<infer _S>}:${infer Rest}`
      ? Rest extends NToMHex16<
          Rest,
          N,
          Decrement[M],
          Acc extends N ? Acc : Increment[Acc],
          false
        >
        ? T
        : never
      : never;

type _ = NToMHex16<"", 0, 1>;
type _ = NToMHex16<"", 0, 2>;
type _ = NToMHex16<"", 1, 1>;
type _ = NToMHex16<"0000:", 0, 1>;
type _ = NToMHex16<"0000:", 1, 1>;
type _ = NToMHex16<"0000:", 1, 2>;
type _ = NToMHex16<"0000:0000:", 1, 1>;
type _ = NToMHex16<"0000:0000:", 1, 2>;
type _ = NToMHex16<"0000:0000:", 2, 2>;
type _ = NToMHex16<"0000:0000:0000", 2, 2>;
type _ = NToMHex16<"0000:0000:0000", 2, 3>;
type _ = NToMHex16<"0000:0000:0000:", 0, 3>;
type _ = NToMHex16<"0000:0000:0000:", 1, 3>;
type _ = NToMHex16<"0000:0000:0000:", 2, 3>;

type NHex16<T extends string, N extends number> = N extends 0
  ? never
  : N extends 1
    ? T extends `${Hex16Bits<infer _S>}`
      ? T
      : never
    : T extends `${Hex16Bits<infer _S>}:${infer Rest}`
      ? Rest extends NHex16<Rest, Decrement[N]>
        ? T
        : never
      : never;

export type IPv6<T extends string> = T extends `${infer Left}::${infer Right}`
  ? Left extends ""
    ? ExtractAfterLast<Right, ":"> extends IPv4<infer _>
      ? ExtractUntilLast<Right, ":"> extends NToMHex16<infer _, 1, 6>
        ? T
        : never
      : `${Right}:` extends NToMHex16<infer _, 1, 8>
        ? T
        : never
    : 1
  : T extends `${infer H16_1}:${infer H16_2}:${infer H16_3}:${infer H16_4}:${infer H16_5}:${infer H16_6}:${infer H32}`
    ? Hex32<H32> extends never
      ? never
      : H16_1 extends Hex16Bits<H16_1>
        ? H16_2 extends Hex16Bits<H16_2>
          ? H16_3 extends Hex16Bits<H16_3>
            ? H16_4 extends Hex16Bits<H16_4>
              ? H16_5 extends Hex16Bits<H16_5>
                ? H16_6 extends Hex16Bits<H16_6>
                  ? T
                  : never
                : never
              : never
            : never
          : never
        : never
    : never;

type RR =
  "0000:0000:0000:0000:0000:0000:127.0.0.1" extends `${string}${IPv4<infer V4>}`
    ? V4
    : never;

type ExtractUntilLast<
  T extends string,
  C extends string,
  Start = true,
> = T extends `${infer Prefix}${C}${infer Suffix}`
  ? `${Prefix}${C}${ExtractUntilLast<Suffix, C, false>}`
  : Start extends true
    ? never
    : "";

type ExtractAfterLast<
  T extends string,
  C extends string,
  Start = true,
> = T extends `${infer _}${C}${infer Suffix}`
  ? ExtractAfterLast<Suffix, C, false>
  : Start extends true
    ? never
    : T;

type _ = ExtractUntilLast<"::0000:0000:0000:0000:0000:0000:127.0.0.1", ":">;
type _ = ExtractUntilLast<"0000", ":">;
type _ = ExtractAfterLast<"::0000:0000:0000:0000:0000:0000:127.0.0.1", ":">;
type _ = ExtractAfterLast<"0000", ":">;

type _ = IPv6<"::0000:0000:0000:0000:0000:0000:127.0.0.1">;
type _ = "0000:0000" extends `${infer H16}${infer Rest}` ? Rest : never;

type _ = "0:0000" extends `${H<infer Rest>}${Hex16Bits<infer _>}`
  ? true
  : false;

type _ = "0000:0000" extends `${infer U}${Hex16Bits<infer _>}` ? true : false;

type _ =
  "0000:0000" extends `${NToMHex16<infer H16, 7>}${Hex16Bits<infer H16_Final>}`
    ? true
    : false;
type _ = "0000" extends `${Hex16Bits<infer H16>}` ? true : false;
type _ = "0000:" extends NToMHex16<infer H16, 7> ? true : false;
