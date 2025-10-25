export type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y";

export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
export type Plus = "+";
export type Hyphen = "-";
export type Dot = ".";

export type URISchemeRest<T extends string> = T extends
  | `${Letter}${infer Rest}`
  | `${Digit}${infer Rest}`
  | `${Plus}${infer Rest}`
  | `${Hyphen}${infer Rest}`
  | `${Dot}${infer Rest}`
  ? URISchemeRest<Rest>
  : never;

export type URIScheme<T extends string> = T extends `${Letter}${infer Rest}`
  ? URISchemeRest<Rest>
  : never;

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
