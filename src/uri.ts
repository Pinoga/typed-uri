import type {
  Digit,
  Dot,
  DoubleSlash,
  Empty,
  Hyphen,
  Letter,
  PathChar,
  PathCharNoColon,
  Plus,
  Slash,
} from "./aliases";

export type SchemeRest<T extends string> = T extends
  | Letter
  | Digit
  | Plus
  | Hyphen
  | Dot
  ? T
  : T extends
        | `${Letter}${infer Rest}`
        | `${Digit}${infer Rest}`
        | `${Plus}${infer Rest}`
        | `${Hyphen}${infer Rest}`
        | `${Dot}${infer Rest}`
    ? SchemeRest<Rest> extends never
      ? never
      : T
    : never;

export type Scheme<T extends string> = T extends `${Letter}${infer Rest}`
  ? SchemeRest<Rest> extends never
    ? never
    : T
  : never;

const scheme1: Scheme<"G----ttp..+"> = "G----ttp..+";
// @ts-expect-error empty schemes are not allowed
const scheme2: Scheme<""> = "";
// @ts-expect-error schemes must start with a letter
const scheme3: Scheme<"9"> = "9";
// @ts-expect-error schemes must start with a letter
const scheme4: Scheme<"A"> = "A";

export type PathEmpty = Empty;

export type PathSegment<T extends string> = T extends PathEmpty
  ? T
  : T extends PathChar
    ? T
    : T extends `${PathChar}${infer Rest}`
      ? PathSegment<Rest> extends never
        ? never
        : T
      : never;

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

export type QueryLike = `?${string}`;
export type PortLike = `${string}`;
export type PathLike = `${string}`;
export type DomainLike = `${string}`;
export type URLLike = `${string}://${string}`;
export type InvalidURLError = "URLs should contain protocol and domain";

export type URL<T extends string> = T extends InvalidURLError
  ? never
  : T extends URLLike
    ? URLLike
    : never;
