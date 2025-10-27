/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DecOctet, Hex16Bits } from "./aliases";
import type {
  Decrement,
  ExtractAfterLast,
  ExtractUntilLast,
  Increment,
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

/**
 * https://datatracker.ietf.org/doc/html/rfc3986#appendix-A
 *
 * IPv6address
 */
export type IPv6<T extends string> =
  ExtractAfterLast<T, ":"> extends IPv4<infer _>
    ? ExtractUntilLast<T, ":"> extends infer WithoutIPv4
      ? WithoutIPv4 extends `${infer Left}::${infer Right}`
        ? Left extends ""
          ? Right extends ""
            ? T
            : Right extends NToMHex16<infer _, 1, 5>
              ? T
              : never
          : Left extends Hex16Bits<infer _>
            ? Right extends NToMHex16<infer _, 4, 4>
              ? T
              : never
            : Left extends NToMHex16<infer _, 1, 2>
              ? Right extends NToMHex16<infer _, 3, 3>
                ? T
                : never
              : Left extends NToMHex16<infer _, 1, 3>
                ? Right extends NToMHex16<infer _, 2, 2>
                  ? T
                  : never
                : Left extends NToMHex16<infer _, 1, 4>
                  ? Right extends NToMHex16<infer _, 1, 1>
                    ? T
                    : never
                  : Left extends NToMHex16<infer _, 1, 5>
                    ? Right extends ""
                      ? T
                      : never
                    : never // No possibilities "left" for Left
        : WithoutIPv4 extends NToMHex16<infer _, 6, 6>
          ? T
          : never
      : never // This should never happen
    : // There's no IPv4
      T extends `${infer Left}::${infer Right}`
      ? Left extends ""
        ? Right extends ""
          ? T
          : `${Right}:` extends NToMHex16<infer _, 1, 7>
            ? T // "::" *7( h16 ":" )
            : never
        : Left extends Hex16Bits<infer _>
          ? `${Right}:` extends NToMHex16<infer _, 6, 6>
            ? T
            : never
          : Left extends NToMHex16<infer _, 1, 2>
            ? `${Right}:` extends NToMHex16<infer _, 5, 5>
              ? T
              : never
            : Left extends NToMHex16<infer _, 1, 3>
              ? `${Right}:` extends NToMHex16<infer _, 4, 4>
                ? T
                : never
              : Left extends NToMHex16<infer _, 1, 4>
                ? `${Right}:` extends NToMHex16<infer _, 3, 3>
                  ? T
                  : never
                : Left extends NToMHex16<infer _, 1, 5>
                  ? `${Right}:` extends NToMHex16<infer _, 2, 2>
                    ? T
                    : never
                  : Left extends NToMHex16<infer _, 1, 6>
                    ? Right extends Hex16Bits<infer _>
                      ? T
                      : never
                    : Left extends NToMHex16<infer _, 1, 7>
                      ? Right extends ""
                        ? T
                        : never
                      : never // No possibilities "left" for Left
      : `${T}:` extends NToMHex16<infer _, 8, 8>
        ? T
        : never;

// IPv6 Tests -----------------------------------------------------------------------
// OK
type _ = IPv6<"0000:0000:0000:0000:0000:0000:127.0.0.1">; // 6( h16 ":" ) ls32
type _ = IPv6<"0000:0000:0000:0000:0000:0000:0000:0000">; // 6( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:0000:0000:127.0.0.1">; // 5( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:0000:0000:0000:0000">; // 5( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:0000:127.0.0.1">; // 4( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:0000:0000:0000">; // 4( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:127.0.0.1">; // 3( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:0000:0000">; // 3( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:127.0.0.1">; // 2( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:0000">; // 2( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000">; // h16 ":" ls32
type _ = IPv6<"::0000:127.0.0.1">; // h16 ":" ls32
type _ = IPv6<"::0000:0000">; // ls32
type _ = IPv6<"::127.0.0.1">; // ls32
type _ = IPv6<"::">; //
type _ = IPv6<"0000::0000:0000:0000:0000:127.0.0.1">; // h16 "::" 4( h16 ":" ) ls32
type _ = IPv6<"0000::0000:0000:0000:0000:0000:0000">; // h16 "::" 4( h16 ":" ) ls32
type _ = IPv6<"0000::0000:0000:0000:127.0.0.1">; // h16 "::" 3( h16 ":" ) ls32
type _ = IPv6<"0000::0000:0000:0000:0000:0000">; // h16 "::" 3( h16 ":" ) ls32
type _ = IPv6<"0000:0000::0000:0000:0000:127.0.0.1">; // 1( h16 ":") h16 "::" 3( h16 ":" ) ls32
type _ = IPv6<"0000:0000::0000:0000:0000:0000:0000">; // 1( h16 ":") h16 "::" 3( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:127.0.0.1">; // 3( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:0000:0000">; // 3( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:127.0.0.1">; // 2( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000:0000">; // 2( h16 ":" ) ls32
type _ = IPv6<"::0000:0000:0000">; // h16 ":" ls32
type _ = IPv6<"::0000:127.0.0.1">; // h16 ":" ls32
type _ = IPv6<"::0000:0000">; // ls32
type _ = IPv6<"::127.0.0.1">; // ls32
type _ = IPv6<"::">; //
// FAIL
type _ = IPv6<":">;
type _ = IPv6<":::">;
type _ = IPv6<"">;
type _ = IPv6<"127.0.0.1">; // should not accept IPv4
type _ = IPv6<"::0000:0000:0000:0000:0000:">; // should not end with ":"
type _ = IPv6<"::0000:0000:0000:0000:0000127.0.0.1">; // ":" should separate IPv6 from IPv4
type _ = IPv6<"::0000:0000:0000:0000:0000:0000:0000:127.0.0.1">; // should not allow 7 Hex16 if it has IPv4
type _ = IPv6<"::0000:0000:0000:0000:0000:0000:0000:0000:0000:0000">; // should not allow 9 Hex16
// End IPv6 Tests -------------------------------------------------------------------
