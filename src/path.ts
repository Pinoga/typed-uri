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
import { Fail, Ok, type OneOrMore, type ZeroOrMore } from "./utils";

export type PathChar =
  | Unreserved
  | PercentEncoded
  | SubDelimiter
  | Colon
  | AtSign;

export type PathCharNoColon = Exclude<PathChar, Colon>;

export type PathEmpty = Empty;

export type PathSegment<T extends string> = ZeroOrMore<T, PathChar>;

export type PathWithRoot<T extends string> = T extends PathEmpty
  ? T
  : T extends `${Slash}${PathSegment<infer _S>}`
    ? T
    : T extends `${Slash}${infer Segment}${Slash}${infer Rest}`
      ? Segment extends PathSegment<Segment>
        ? PathWithRoot<`${Slash}${Rest}`> extends never
          ? never
          : T
        : never
      : never;

Ok satisfies PathWithRoot<"">;
Ok satisfies PathWithRoot<"/">;
Ok satisfies PathWithRoot<"//">;
Ok satisfies PathWithRoot<"/abc">;
Ok satisfies PathWithRoot<"/abc/def">;
Ok satisfies PathWithRoot<"//abc/def/ghi">;
Ok satisfies PathWithRoot<"//abc/def/ghi">;
Ok satisfies PathWithRoot<"/abc/def/ghi">;
Ok satisfies PathWithRoot<"/abc/def/ghi">;
// @ts-expect-error
Fail satisfies PathWithRoot<"abc">;
// @ts-expect-error
Fail satisfies PathWithRoot<"abc/def">;

export type PathNoAuthority<T extends string> = T extends PathEmpty
  ? never
  : T extends `${DoubleSlash}${infer _R}`
    ? never
    : PathWithRoot<T>;

Ok satisfies PathNoAuthority<"/">;
Ok satisfies PathNoAuthority<"/abc">;
Ok satisfies PathNoAuthority<"/abc/def">;
Ok satisfies PathNoAuthority<"/abc/def/ghi">;
Ok satisfies PathNoAuthority<"/abc/def/ghi">;
// @ts-expect-error
Fail satisfies PathNoAuthority<"//">;
// @ts-expect-error
Fail satisfies PathNoAuthority<"abc">;
// @ts-expect-error
Fail satisfies PathNoAuthority<"abc/def">;
// @ts-expect-error
Fail satisfies PathNoAuthority<"//abc">;
// @ts-expect-error
Fail satisfies PathNoAuthority<"//abc/def/ghi">;
// @ts-expect-error
Fail satisfies PathNoAuthority<"//abc/def/ghi">;

export type PathRelativeNoScheme<T extends string> =
  T extends `${PathCharNoColon}${infer Rest}` ? PathWithRoot<Rest> : never;

export type PathRootless<T extends string> =
  T extends `${infer MaybeSegment}${Slash}${infer MaybeRest}`
    ? MaybeSegment extends OneOrMore<MaybeSegment, PathChar>
      ? `${Slash}${MaybeRest}` extends PathWithRoot<`${Slash}${MaybeRest}`>
        ? T
        : never
      : never // Invalid initial segment
    : T extends OneOrMore<T, PathChar>
      ? T
      : never; // invalid (only) segment;

Ok satisfies PathRootless<"abc">;
Ok satisfies PathRootless<"abc/def">;
// @ts-expect-error
Fail satisfies PathRootless<"/abc">;
