import type { QueryChar } from "./query";
import type { ZeroOrMore } from "./utils";

export type FragmentChar = QueryChar;

export type Fragment<T extends string> = ZeroOrMore<T, FragmentChar>;
