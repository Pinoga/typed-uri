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

export type Plus = "+";
export type Hyphen = "-";
export type Dot = ".";
export type Underscore = "_";
export type Colon = ":";
export type AtSign = "@";
export type Percent = "%";
export type Tilde = "~";
export type DoubleSlash = "//";
export type Slash = "/";
export type QuestionMark = "?";
export type NumberSign = "#";
export type ExclamationMark = "!";
export type DollarSign = "$";
export type Ampersand = "&";
export type SingleQuote = "'";
export type LeftParenthesis = "(";
export type RightParenthesis = ")";
export type Asterisk = "*";
export type PlusSign = "+";
export type Comma = ",";
export type SemiColon = ";";
export type EqualSign = "=";
export type LeftSquareBracket = "[";
export type RightSquareBracket = "]";

export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

export type HexDigit =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | Digit;

export type GenericDelimiter =
  | Colon
  | Slash
  | QuestionMark
  | NumberSign
  | LeftSquareBracket
  | RightSquareBracket
  | AtSign;

export type SubDelimiter =
  | ExclamationMark
  | DollarSign
  | AtSign
  | SingleQuote
  | LeftParenthesis
  | RightParenthesis
  | Asterisk
  | PlusSign
  | Comma
  | SemiColon
  | EqualSign;

export type URIUnreserved = Letter | Digit | Hyphen | Dot | Underscore | Tilde;
export type URIReserved = GenericDelimiter | SubDelimiter;

export type PercentEncoded = `${Percent}${HexDigit}${HexDigit}`;

export type PChar = URIUnreserved | PercentEncoded | Colon | AtSign;

export type URISchemeRest<T extends string> = T extends
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
    ? URISchemeRest<Rest> extends never
      ? never
      : T
    : never;

export type URIScheme<T extends string> = T extends `${Letter}${infer Rest}`
  ? URISchemeRest<Rest> extends never
    ? never
    : T
  : never;

const scheme1: URIScheme<"G----ttp..+"> = "G----ttp..+";
// @ts-expect-error empty schemes are not allowed
const scheme2: URIScheme<""> = "";
// @ts-expect-error schemes must start with a letter
const scheme3: URIScheme<"9"> = "9";
// @ts-expect-error schemes must start with a letter
const scheme4: URIScheme<"A"> = "A";

export type PathComponent = "";

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
