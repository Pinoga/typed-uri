import type {
  AtSign,
  Colon,
  PercentEncoded,
  SubDelimiter,
  Unreserved,
} from "./aliases";
import type { IPLiteral, IPv4 } from "./ip";
import type { Port } from "./port";
import {
  Fail,
  Ok,
  type ExtractAfterLast,
  type ExtractUntilLast,
  type RepetitionOf,
} from "./utils";

type HostName<T extends string> = T extends ""
  ? T
  : T extends RepetitionOf<infer _, Unreserved | PercentEncoded | SubDelimiter>
    ? T
    : never;

export type Host<T extends string> =
  T extends IPLiteral<T>
    ? T
    : T extends IPv4<T>
      ? T
      : T extends HostName<T>
        ? T
        : never;

Ok satisfies Host<"">;
Ok satisfies Host<"127.0.0.1">;
Ok satisfies Host<"[::127.0.0.1]">;
Ok satisfies Host<"[0000:0000::0000:0000:0000:127.0.0.1]">;
Ok satisfies Host<"[v1Fa9.:9]">;
Ok satisfies Host<"[v1.:]">;
Ok satisfies Host<"[v1.:]">;
Ok satisfies Host<"[v1.:9]">;
Ok satisfies Host<"[v1F.:9]">;
Fail satisfies Host<"v1Fa9.:9">;
Fail satisfies Host<"[v1Fa9.:@9]">;

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
      ? ExtractAfterLast<Rest, Colon> extends Port<infer _>
        ? ExtractUntilLast<Rest, Colon> extends `${Host<infer _>}:`
          ? T
          : never
        : Rest extends Host<infer _> // There's no non-empty port
          ? T
          : Rest extends `${Host<infer _>}:` // There's an empty port
            ? T
            : never
      : never // If there's a @ then there has to be a user info
    : ExtractAfterLast<T, Colon> extends Port<infer _>
      ? ExtractUntilLast<T, Colon> extends `${Host<infer _>}:`
        ? T
        : never
      : T extends Host<infer _> // There's no non-empty port
        ? T
        : T extends `${Host<infer _>}:` // There's an empty port
          ? T
          : never;

Ok satisfies Authority<"user@127.0.0.1:3000">; // user info with ipv4 and port
Ok satisfies Authority<"127.0.0.1:">; // host with ipv4
Ok satisfies Authority<"">; // empty reg-name
Ok satisfies Authority<"%De">; // reg-name with percent-encoded
Ok satisfies Authority<"%De%0F%f0">; // reg-name with multiple percent-encoded
Ok satisfies Authority<"1%De0-%0F-(%f0">; // reg-name with multiple percent-encoded, unreserved, sub-delimiters
Ok satisfies Authority<"1000">; // reg-name with multiple unreserved
Ok satisfies Authority<")(!">; // reg-name with multiple sub delimiter
Ok satisfies Authority<"[v1Fa9.:9]">; // host with ip literal (ipvfuture) FIXME
Ok satisfies Authority<"[::127.0.0.1]">; // host with ip literal (ipv6)
Ok satisfies Authority<"[0000:0000::0000:0000:0000:127.0.0.1]">; // host with ip literal (ipv6)
