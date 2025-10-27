import type { Decrement } from "./utils";

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

export type Empty = "";
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

export type Hex16Bits<
  T extends string,
  Acc extends number = 3,
> = Acc extends never
  ? never
  : T extends HexDigit
    ? T
    : T extends `${HexDigit}${infer Rest}`
      ? Hex16Bits<Rest, Decrement[Acc]> extends never
        ? never
        : T
      : never;

export type DecOctet =
  | Digit
  | `${Exclude<Digit, "0">}${Digit}`
  | `1${Digit}${Digit}`
  | `2${"0" | "1" | "2" | "3" | "4"}${Digit}`
  | `25${"0" | "1" | "2" | "3" | "4" | "5"}`;
