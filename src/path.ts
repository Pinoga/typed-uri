import type {
  AtSign,
  Colon,
  DoubleSlash,
  Empty,
  PercentEncoded,
  Slash,
  SubDelimiter,
  Unreserved,
} from "./aliases";
import type { ZeroOrMore } from "./utils";

export type PathChar =
  | Unreserved
  | PercentEncoded
  | SubDelimiter
  | Colon
  | AtSign;

export type PathCharNoColon = Exclude<PathChar, Colon>;

export type PathEmpty = Empty;

export type PathSegment<T extends string> = ZeroOrMore<T, PathChar>;

export type PathAbsolute<T extends string> = T extends PathEmpty
  ? T
  : T extends `${Slash}${PathSegment<infer _S>}`
    ? T
    : T extends `${Slash}${infer Segment}${Slash}${infer Rest}`
      ? Segment extends PathSegment<Segment>
        ? PathAbsolute<`${Slash}${Rest}`> extends never
          ? never
          : T
        : never
      : never;

export type PathAbsoluteAtLeastOneSegment<T extends string> =
  T extends PathEmpty
    ? never
    : T extends `${DoubleSlash}${infer _R}`
      ? never
      : PathAbsolute<T>;

export type PathRelativeNoScheme<T extends string> =
  T extends `${PathCharNoColon}${infer Rest}` ? PathAbsolute<Rest> : never;

export type PathRelativeRootless<T extends string> =
  T extends `${PathChar}${infer Rest}` ? PathAbsolute<Rest> : never;
