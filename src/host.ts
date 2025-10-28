import type {
  AtSign,
  Colon,
  PercentEncoded,
  Port,
  SubDelimiter,
  Unreserved,
} from "./aliases";
import type { IPLiteral, IPv4 } from "./ip";
import { Fail, Ok, type RepetitionOf } from "./utils";

type HostName<T extends string> = T extends ""
  ? T
  : T extends RepetitionOf<infer _, Unreserved | PercentEncoded | SubDelimiter>
    ? T
    : never;

export type Host<T extends string> = T extends
  | IPLiteral<T>
  | IPv4<T>
  | HostName<T>
  ? T
  : never;

Ok satisfies Host<"127.0.0.1">;
Fail satisfies Host<"v1Fa9.:@9">;

export type UserInfo<T extends string> = T extends ""
  ? T
  : T extends RepetitionOf<
        infer _,
        Unreserved | PercentEncoded | SubDelimiter | Colon
      >
    ? T
    : never;

export type Authority<T extends string> =
  T extends `${infer MaybeUserInfo}${AtSign}${infer Rest}`
    ? MaybeUserInfo extends UserInfo<MaybeUserInfo>
      ? Rest extends `${infer MaybeHost}${Colon}${infer MaybePort}`
        ? MaybePort extends Port<MaybePort>
          ? MaybeHost extends Host<MaybeHost>
            ? T
            : never
          : never // If there's a colon there has to be a port
        : Rest extends Host<Rest>
          ? T
          : never
      : T extends `${infer MaybeHost}${Colon}${infer MaybePort}`
        ? MaybePort extends Port<MaybePort>
          ? MaybeHost extends Host<MaybeHost>
            ? T
            : never
          : never // If there's a colon there has to be a port
        : T extends Host<T>
          ? T
          : never
    : T extends `${infer MaybeHost}${Colon}${infer MaybePort}`
      ? MaybePort extends Port<MaybePort>
        ? MaybeHost extends Host<MaybeHost>
          ? T
          : never
        : never // If there's a colon there has to be a port
      : T extends Host<T>
        ? T
        : never;

Ok satisfies Authority<"">; // empty reg-name
Ok satisfies Authority<"%De">; // reg-name with percent-encoded
Ok satisfies Authority<"%De%0F%f0">; // reg-name with multiple percent-encoded
Ok satisfies Authority<"1%De0-%0F-(%f0">; // reg-name with multiple percent-encoded, unreserved, sub-delimiters
Ok satisfies Authority<"1000">; // reg-name with multiple unreserved
Ok satisfies Authority<"@)@(@!">; // reg-name with multiple sub delimiter
Ok satisfies Authority<"127.0.0.1">; // host with ipv4
Ok satisfies Authority<"[v1Fa9.:@9]">; // host with ip literal (ipvfuture) FIXME
Ok satisfies Authority<"[::127.0.0.1]">; // host with ip literal (ipv6)
Ok satisfies Authority<"[0000:0000::0000:0000:0000:127.0.0.1]">; // host with ip literal (ipv6)
