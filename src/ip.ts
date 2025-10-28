/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  Colon,
  DecOctet,
  Hex16Bits,
  HexDigit,
  SubDelimiter,
  Unreserved,
} from "./aliases";
import type {
  _,
  Decrement,
  ExtractAfterLast,
  ExtractUntilLast,
  Fail,
  Increment,
  Ok,
  RepetitionOf,
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

"" as Ok<_<RepetitionOf<"", "P">>>;
"" as Ok<_<RepetitionOf<"P", "P">>>;
"" as Ok<_<RepetitionOf<"PPP", "P">>>;
"" as Fail<_<RepetitionOf<"PPPG", "P">>>;
"" as Fail<_<RepetitionOf<"PPPGP", "P">>>;

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

"" as Ok<_<NToMHex16<"", 0, 1>>>;
"" as Ok<_<NToMHex16<"", 0, 2>>>;
"" as Ok<_<NToMHex16<"", 1, 1>>>;
"" as Ok<_<NToMHex16<"0000:", 0, 1>>>;
"" as Ok<_<NToMHex16<"0000:", 1, 1>>>;
"" as Ok<_<NToMHex16<"0000:", 1, 2>>>;
"" as Ok<_<NToMHex16<"0000:0000:", 1, 1>>>;
"" as Ok<_<NToMHex16<"0000:0000:", 1, 2>>>;
"" as Ok<_<NToMHex16<"0000:0000:", 2, 2>>>;
"" as Ok<_<NToMHex16<"0000:0000:0000", 2, 2>>>;
"" as Ok<_<NToMHex16<"0000:0000:0000", 2, 3>>>;
"" as Ok<_<NToMHex16<"0000:0000:0000:", 0, 3>>>;
"" as Ok<_<NToMHex16<"0000:0000:0000:", 1, 3>>>;
"" as Ok<_<NToMHex16<"0000:0000:0000:", 2, 3>>>;

/**
 * https://datatracker.ietf.org/doc/html/rfc3986#appendix-A
 *
 * IPv6address
 */
export type IPv6<T extends string> =
  ExtractAfterLast<T, ":"> extends IPv4<infer _>
    ? ExtractUntilLast<T, ":"> extends infer WithoutIPv4
      ? WithoutIPv4 extends `${infer Left}::${infer Right}`
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
              : `${Left}:` extends NToMHex16<infer _, 2, 2>
                ? Right extends NToMHex16<infer _, 1, 3>
                  ? T
                  : never
                : `${Left}:` extends NToMHex16<infer _, 3, 3>
                  ? Right extends NToMHex16<infer _, 1, 2>
                    ? T
                    : never
                  : `${Left}:` extends NToMHex16<infer _, 4, 4>
                    ? Right extends NToMHex16<infer _, 1, 1>
                      ? T
                      : never
                    : never // No possibilities "left" for Left
        : WithoutIPv4 extends NToMHex16<infer _, 6, 6>
          ? T
          : never
      : never // This should never happen
    : // There's no IPv4
      T extends `${infer Left}::${infer Right}`
      ? Right extends ""
        ? Left extends NToMHex16<infer _, 0, 7>
          ? T
          : never
        : Left extends ""
          ? `${Right}:` extends NToMHex16<infer _, 1, 7>
            ? T // "::" *7( h16 ":" )
            : never
          : Left extends Hex16Bits<infer _>
            ? `${Right}:` extends NToMHex16<infer _, 1, 6>
              ? T
              : never
            : `${Left}:` extends NToMHex16<infer _, 2, 2>
              ? `${Right}:` extends NToMHex16<infer _, 1, 5>
                ? T
                : never
              : `${Left}:` extends NToMHex16<infer _, 3, 3>
                ? `${Right}:` extends NToMHex16<infer _, 1, 4>
                  ? T
                  : never
                : `${Left}:` extends NToMHex16<infer _, 4, 4>
                  ? `${Right}:` extends NToMHex16<infer _, 1, 3>
                    ? T
                    : never
                  : `${Left}:` extends NToMHex16<infer _, 5, 5>
                    ? `${Right}:` extends NToMHex16<infer _, 1, 2>
                      ? T
                      : never
                    : `${Left}:` extends NToMHex16<infer _, 6, 6>
                      ? Right extends Hex16Bits<infer _>
                        ? T
                        : never
                      : never // No possibilities "left" for Left
      : `${T}:` extends NToMHex16<infer _, 8, 8>
        ? T
        : never;

// IPv6 Tests -----------------------------------------------------------------------
// OK
"" as Ok<_<IPv6<"0000:0000:0000:0000:0000:0000:127.0.0.1">>>; // 6( h16 ":" ) ls32
"" as Ok<_<IPv6<"0000:0000:0000:0000:0000:0000:0000:0000">>>; // 6( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:0000:0000:127.0.0.1">>>; // 5( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:0000:0000:0000:0000">>>; // 5( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:0000:127.0.0.1">>>; // 4( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:0000:0000:0000">>>; // 4( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:127.0.0.1">>>; // 3( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:0000:0000">>>; // 3( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:127.0.0.1">>>; // 2( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:0000">>>; // 2( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000">>>; // h16 ":" ls32
"" as Ok<_<IPv6<"::0000:127.0.0.1">>>; // h16 ":" ls32
"" as Ok<_<IPv6<"::0000:0000">>>; // ls32
"" as Ok<_<IPv6<"::127.0.0.1">>>; // ls32
"" as Ok<_<IPv6<"::">>>; //
"" as Ok<_<IPv6<"0000::0000:0000:0000:0000:127.0.0.1">>>; // h16 "::" 4( h16 ":" ) ls32
"" as Ok<_<IPv6<"0000::0000:0000:0000:0000:0000:0000">>>; // h16 "::" 4( h16 ":" ) ls32
"" as Ok<_<IPv6<"0000::0000:0000:0000:127.0.0.1">>>; // h16 "::" 3( h16 ":" ) ls32
"" as Ok<_<IPv6<"0000::0000:0000:0000:0000:0000">>>; // h16 "::" 3( h16 ":" ) ls32
"" as Ok<_<IPv6<"0000:0000::0000:0000:0000:127.0.0.1">>>; // 1( h16 ":") h16 "::" 3( h16 ":" ) ls32
"" as Ok<_<IPv6<"0000:0000::0000:0000:0000:0000:0000">>>; // 1( h16 ":") h16 "::" 3( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:127.0.0.1">>>; // 3( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:0000:0000">>>; // 3( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:127.0.0.1">>>; // 2( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000:0000">>>; // 2( h16 ":" ) ls32
"" as Ok<_<IPv6<"::0000:0000:0000">>>; // h16 ":" ls32
"" as Ok<_<IPv6<"::0000:127.0.0.1">>>; // h16 ":" ls32
"" as Ok<_<IPv6<"::0000:0000">>>; // ls32
"" as Ok<_<IPv6<"::127.0.0.1">>>; // ls32
"" as Ok<_<IPv6<"::">>>; //
// FAIL
"" as Fail<_<IPv6<":">>>;
"" as Fail<_<IPv6<":::">>>;
"" as Fail<_<IPv6<"">>>;
"" as Fail<_<IPv6<"127.0.0.1">>>; // should not accept IPv4
"" as Fail<_<IPv6<"::0000:0000:0000:0000:0000:">>>; // should not end with ":"
"" as Fail<_<IPv6<"::0000:0000:0000:0000:0000127.0.0.1">>>; // ":" should separate IPv6 from IPv4
"" as Fail<_<IPv6<"::0000:0000:0000:0000:0000:0000:0000:127.0.0.1">>>; // should not allow 7 Hex16 if it has IPv4
"" as Fail<_<IPv6<"::0000:0000:0000:0000:0000:0000:0000:0000:0000:0000">>>; // should not allow 9 Hex16
// End IPv6 Tests -------------------------------------------------------------------

export type IPvFuture<T extends string> =
  T extends `v${RepetitionOf<infer _, HexDigit>}.${RepetitionOf<infer _, Unreserved | SubDelimiter | Colon>}`
    ? T
    : never;

"" as Ok<_<IPvFuture<"v1.:">>>;
"" as Ok<_<IPvFuture<"v1.:@">>>;
"" as Ok<_<IPvFuture<"v1.:@9">>>;
"" as Ok<_<IPvFuture<"v1F.:@9">>>;
"" as Ok<_<IPvFuture<"v1Fa9.:@9">>>;
"" as Fail<_<IPvFuture<"">>>;
"" as Fail<_<IPvFuture<"v1G.:@9">>>;
"" as Fail<_<IPvFuture<"v1Fa9:@9">>>;

export type IPLiteral<T extends string> = T extends `[${infer IP}]`
  ? IP extends IPv6<IP>
    ? T
    : IP extends IPvFuture<IP>
      ? T
      : never
  : never;

"" as Ok<_<IPLiteral<"[::127.0.0.1]">>>;
"" as Ok<_<IPLiteral<"[0000:0000::0000:0000:0000:127.0.0.1]">>>; //FIXME
"" as Ok<_<IPLiteral<"[v1Fa9.:@9]">>>;
"" as Fail<_<IPLiteral<"::127.0.0.1">>>;
"" as Fail<_<IPLiteral<"[]">>>;
"" as Fail<_<IPLiteral<"[127.0.0.1]">>>;
"" as Fail<_<IPLiteral<"[v1Fa9:@9]">>>;
