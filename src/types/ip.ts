/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DecOctet, Hex16Bits } from "./aliases";
import type { Decrement } from "./utils";

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

type UpToNHex16<T extends string, N extends number, Start = true> = N extends 0
  ? never
  : T extends ""
    ? Start extends true
      ? T
      : never
    : T extends `${Hex16Bits<infer _S>}:`
      ? T
      : T extends `${Hex16Bits<infer _S>}:${infer Rest}`
        ? Rest extends UpToNHex16<Rest, Decrement[N], false>
          ? T
          : never
        : never;

type NHex16<T extends string, N extends number> = N extends 0
  ? never
  : N extends 1
    ? T extends `${Hex16Bits<infer _S>}`
      ? T
      : never
    : T extends `${Hex16Bits<infer _S>}:${infer Rest}`
      ? Rest extends UpToNHex16<Rest, Decrement[N]>
        ? T
        : never
      : never;

export type IPv6<T extends string> = T extends `${infer Left}::${infer Right}`
  ? Left extends ""
    ? Right extends `${UpToNHex16<infer H16, 6>}${Hex32<infer H32>}`
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

type A = "0000:0000" extends `${UpToNHex16<infer H16, 6>}${Hex32<infer H32>}`
  ? `${H16}${H32}`
  : never;
