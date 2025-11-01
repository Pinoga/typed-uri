import type { QuestionMark, Slash } from "./aliases";
import type { PathChar } from "./path";
import type { ZeroOrMore } from "./utils";

export type QueryChar = PathChar | Slash | QuestionMark;

export type Query<T extends string> = ZeroOrMore<T, QueryChar>;
