import type {
  AtSign,
  Colon,
  PercentEncoded,
  Port,
  SubDelimiter,
  Unreserved,
} from "./aliases";
import type { IPLiteral, IPv4 } from "./ip";
import { Test, type _, type Fail, type Ok, type RepetitionOf } from "./utils";

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

Test as Ok<_<Host<"127.0.0.1">>>;
Test as Fail<_<Host<"v1Fa9.:@9">>>;
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

"" as Ok<_<Authority<"">>>; // empty reg-name
"" as Ok<_<Authority<"%De">>>; // reg-name with percent-encoded
"" as Ok<_<Authority<"%De%0F%f0">>>; // reg-name with multiple percent-encoded
"" as Ok<_<Authority<"1%De0-%0F-(%f0">>>; // reg-name with multiple percent-encoded, unreserved, sub-delimiters
"" as Ok<_<Authority<"1000">>>; // reg-name with multiple unreserved
"" as Ok<_<Authority<"@)@(@!">>>; // reg-name with multiple sub delimiter
"" as Ok<_<Authority<"127.0.0.1">>>; // host with ipv4
"" as Ok<_<Authority<"[v1Fa9.:@9]">>>; // host with ip literal (ipvfuture) FIXME
"" as Ok<_<Authority<"[::127.0.0.1]">>>; // host with ip literal (ipv6)
"" as Ok<_<Authority<"[0000:0000::0000:0000:0000:127.0.0.1]">>>; // host with ip literal (ipv6)
