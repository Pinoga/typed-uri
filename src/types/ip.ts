import type { DecOctet, Hex16Bits } from "./aliases";

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

export type Hex32<T extends string> =
  | `${Hex16Bits<T>}:${Hex16Bits<T>}`
  | IPv4<T>;
