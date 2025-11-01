/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  Colon,
  DecOctet,
  Hex16Bits,
  HexDigit,
  LeftSquareBracket,
  RightSquareBracket,
  SubDelimiter,
  Unreserved,
} from "./aliases";
import {
  Fail,
  Ok,
  type Decrement,
  type ExtractAfterLast,
  type ExtractUntilLast,
  type Increment,
  type OneOrMore,
} from "./utils";

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
    : T extends `${Hex16Bits<infer _S>}${Colon}${infer Rest}`
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

Ok satisfies NToMHex16<"", 0, 1>;
Ok satisfies NToMHex16<"", 0, 2>;
Ok satisfies NToMHex16<"0000:", 0, 1>;
Ok satisfies NToMHex16<"0000:", 1, 1>;
Ok satisfies NToMHex16<"0000:", 1, 2>;
Ok satisfies NToMHex16<"0000:0000:", 1, 2>;
Ok satisfies NToMHex16<"0000:0000:", 2, 2>;
Ok satisfies NToMHex16<"0000:0000:0000:", 0, 3>;
Ok satisfies NToMHex16<"0000:0000:0000:", 1, 3>;
Ok satisfies NToMHex16<"0000:0000:0000:", 2, 3>;

// @ts-expect-error
Fail satisfies NToMHex16<"", 1, 1>;
// @ts-expect-error
Fail satisfies NToMHex16<"0000:0000:0000", 2, 3>;
// @ts-expect-error
Fail satisfies NToMHex16<"0000:0000:0000", 2, 2>;
// @ts-expect-error
Fail satisfies NToMHex16<"0000:0000:", 1, 1>;

/**
 * https://datatracker.ietf.org/doc/html/rfc3986#appendix-A
 *
 * IPv6address
 */
export type IPv6<T extends string> =
  ExtractAfterLast<T, Colon> extends IPv4<infer _>
    ? ExtractUntilLast<T, Colon> extends infer WithoutIPv4
      ? WithoutIPv4 extends `${infer Left}${Colon}${Colon}${infer Right}`
        ? Right extends ""
          ? Left extends NToMHex16<infer _, 0, 5>
            ? T
            : never
          : Left extends ""
            ? Right extends NToMHex16<infer _, 1, 5>
              ? T
              : never
            : Left extends Hex16Bits<infer _>
              ? Right extends NToMHex16<infer _, 1, 4>
                ? T
                : never
              : `${Left}${Colon}` extends NToMHex16<infer _, 2, 2>
                ? Right extends NToMHex16<infer _, 1, 3>
                  ? T
                  : never
                : `${Left}${Colon}` extends NToMHex16<infer _, 3, 3>
                  ? Right extends NToMHex16<infer _, 1, 2>
                    ? T
                    : never
                  : `${Left}${Colon}` extends NToMHex16<infer _, 4, 4>
                    ? Right extends NToMHex16<infer _, 1, 1>
                      ? T
                      : never
                    : never // No possibilities "left" for Left
        : WithoutIPv4 extends NToMHex16<infer _, 6, 6>
          ? T
          : never
      : never // This should never happen
    : // There's no IPv4
      T extends `${infer Left}${Colon}${Colon}${infer Right}`
      ? Right extends ""
        ? Left extends NToMHex16<infer _, 0, 7>
          ? T
          : never
        : Left extends ""
          ? `${Right}${Colon}` extends NToMHex16<infer _, 1, 7>
            ? T // "::" *7( h16 ":" )
            : never
          : Left extends Hex16Bits<infer _>
            ? `${Right}${Colon}` extends NToMHex16<infer _, 1, 6>
              ? T
              : never
            : `${Left}${Colon}` extends NToMHex16<infer _, 2, 2>
              ? `${Right}${Colon}` extends NToMHex16<infer _, 1, 5>
                ? T
                : never
              : `${Left}${Colon}` extends NToMHex16<infer _, 3, 3>
                ? `${Right}${Colon}` extends NToMHex16<infer _, 1, 4>
                  ? T
                  : never
                : `${Left}${Colon}` extends NToMHex16<infer _, 4, 4>
                  ? `${Right}${Colon}` extends NToMHex16<infer _, 1, 3>
                    ? T
                    : never
                  : `${Left}${Colon}` extends NToMHex16<infer _, 5, 5>
                    ? `${Right}${Colon}` extends NToMHex16<infer _, 1, 2>
                      ? T
                      : never
                    : `${Left}${Colon}` extends NToMHex16<infer _, 6, 6>
                      ? Right extends Hex16Bits<infer _>
                        ? T
                        : never
                      : never // No possibilities "left" for Left
      : `${T}${Colon}` extends NToMHex16<infer _, 8, 8>
        ? T
        : never;

// IPv6 Tests -----------------------------------------------------------------------
// OK
Ok satisfies IPv6<"0000:0000:0000:0000:0000:0000:127.0.0.1">; // 6( h16 ":" ) ls32
Ok satisfies IPv6<"0000:0000:0000:0000:0000:0000:0000:0000">; // 6( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:0000:0000:127.0.0.1">; // 5( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:0000:0000:0000:0000">; // 5( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:0000:127.0.0.1">; // 4( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:0000:0000:0000">; // 4( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:127.0.0.1">; // 3( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:0000:0000">; // 3( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:127.0.0.1">; // 2( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:0000">; // 2( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000">; // h16 ":" ls32
Ok satisfies IPv6<"::0000:127.0.0.1">; // h16 ":" ls32
Ok satisfies IPv6<"::0000:0000">; // ls32
Ok satisfies IPv6<"::127.0.0.1">; // ls32
Ok satisfies IPv6<"::">; //
Ok satisfies IPv6<"0000::0000:0000:0000:0000:127.0.0.1">; // h16 "::" 4( h16 ":" ) ls32
Ok satisfies IPv6<"0000::0000:0000:0000:0000:0000:0000">; // h16 "::" 4( h16 ":" ) ls32
Ok satisfies IPv6<"0000::0000:0000:0000:127.0.0.1">; // h16 "::" 3( h16 ":" ) ls32
Ok satisfies IPv6<"0000::0000:0000:0000:0000:0000">; // h16 "::" 3( h16 ":" ) ls32
Ok satisfies IPv6<"0000:0000::0000:0000:0000:127.0.0.1">; // 1( h16 ":") h16 "::" 3( h16 ":" ) ls32
Ok satisfies IPv6<"0000:0000::0000:0000:0000:0000:0000">; // 1( h16 ":") h16 "::" 3( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:127.0.0.1">; // 3( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:0000:0000">; // 3( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:127.0.0.1">; // 2( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000:0000">; // 2( h16 ":" ) ls32
Ok satisfies IPv6<"::0000:0000:0000">; // h16 ":" ls32
Ok satisfies IPv6<"::0000:127.0.0.1">; // h16 ":" ls32
Ok satisfies IPv6<"::0000:0000">; // ls32
Ok satisfies IPv6<"::127.0.0.1">; // ls32
Ok satisfies IPv6<"::">; //
// @ts-expect-error
Fail satisfies IPv6<":">;
// @ts-expect-error
Fail satisfies IPv6<":::">;
// @ts-expect-error
Fail satisfies IPv6<" ">;
// @ts-expect-error
Fail satisfies IPv6<"127.0.0.1">; // should not accept IPv4
// @ts-expect-error
Fail satisfies IPv6<"::0000:0000:0000:0000:0000:">; // should not end with ":"
// @ts-expect-error
Fail satisfies IPv6<"::0000:0000:0000:0000:0000127.0.0.1">; // ":" should separate IPv6 from IPv4
// @ts-expect-error
Fail satisfies IPv6<"::0000:0000:0000:0000:0000:0000:0000:127.0.0.1">; // should not allow 7 Hex16 if it has IPv4
// @ts-expect-error
Fail satisfies IPv6<"::0000:0000:0000:0000:0000:0000:0000:0000:0000:0000">; // should not allow 9 Hex16

export type IPvFuture<T extends string> =
  T extends `v${OneOrMore<infer _, HexDigit>}.${OneOrMore<infer _, Unreserved | SubDelimiter | Colon>}`
    ? T
    : never;

Ok satisfies IPvFuture<"v1.:">;
Ok satisfies IPvFuture<"v1.:9">;
Ok satisfies IPvFuture<"v1Fa9.:9">;
// @ts-expect-error
Fail satisfies IPvFuture<"">;
// @ts-expect-error
Fail satisfies IPvFuture<"v1G.:@9">;
// @ts-expect-error
Fail satisfies IPvFuture<"v1Fa9:@9">;
// @ts-expect-error
Fail satisfies IPvFuture<"v1.:@">;
// @ts-expect-error
Fail satisfies IPvFuture<"v1F.:@9">;

export type IPLiteral<T extends string> =
  T extends `${LeftSquareBracket}${infer IP}${RightSquareBracket}`
    ? IP extends IPv6<IP>
      ? T
      : IP extends IPvFuture<IP>
        ? T
        : never
    : never;

Ok satisfies IPLiteral<"[::127.0.0.1]">;
Ok satisfies IPLiteral<"[0000:0000::0000:0000:0000:127.0.0.1]">;
Ok satisfies IPLiteral<"[v1.:]">;
// @ts-expect-error
Fail satisfies IPLiteral<"[v1.:@9]">;
// @ts-expect-error
Fail satisfies IPLiteral<"[v1F.:@9]">;
// @ts-expect-error
Fail satisfies IPLiteral<"[v1.:@]">;
// @ts-expect-error
Fail satisfies IPLiteral<"[v1Fa9.:@9]">;
// @ts-expect-error
Fail satisfies IPLiteral<"[v1Fa9.:@9]">;
// @ts-expect-error
Fail satisfies IPLiteral<"::127.0.0.1">;
// @ts-expect-error
Fail satisfies IPLiteral<"[]">;
// @ts-expect-error
Fail satisfies IPLiteral<"[127.0.0.1]">;
// @ts-expect-error
Fail satisfies IPLiteral<"[v1Fa9:@9]">;
