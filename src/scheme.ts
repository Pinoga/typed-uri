import type { Digit, Dot, Hyphen, Letter, Plus } from "./aliases";
import { Fail, Ok, type OneOrMore } from "./utils";

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
  ? Rest extends ""
    ? T
    : OneOrMore<Rest, Letter | Digit | Plus | Hyphen | Dot>
  : never;

Ok satisfies Scheme<"A">;
Ok satisfies Scheme<"http">;
Ok satisfies Scheme<"G----http..+">;
// @ts-expect-error
Fail satisfies Scheme<"">;
// @ts-expect-error
Fail satisfies Scheme<"9">;
