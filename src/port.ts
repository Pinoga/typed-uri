import type { Digit } from "./aliases";
import { type OneOrMore, Fail, Ok } from "./utils";

export type Port<T extends string> = T extends OneOrMore<T, Digit> ? T : never;

Ok satisfies Port<"8080">;
Ok satisfies Port<"88">;
Fail satisfies Port<"127.0.0.1]">;
