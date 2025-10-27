import type {
  AtSign,
  Colon,
  PercentEncoded,
  Port,
  SubDelimiter,
  Unreserved,
} from "./aliases";
import type { IPLiteral, IPv4 } from "./ip";
import type { RepetitionOf } from "./utils";

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
