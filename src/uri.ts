import type { Colon, DoubleSlash, NumberSign, QuestionMark } from "./aliases";
import type { Fragment } from "./fragment";
import type { Query } from "./query";
import type { Scheme } from "./scheme";

export type HierarchicalPart<T extends string> =
  T extends `${DoubleSlash}${infer Rest}` ? (Rest extends 1 ? 1 : 1) : never;

export type URI<T extends string> =
  T extends `${infer MaybeScheme}${Colon}${infer MaybeURINoScheme}`
    ? MaybeScheme extends Scheme<MaybeScheme>
      ? MaybeURINoScheme extends `${infer MaybeURINoSchemeNoFragment}${NumberSign}${infer MaybeFragment}`
        ? MaybeFragment extends Fragment<MaybeFragment>
          ? MaybeURINoSchemeNoFragment extends `${infer MaybeURINoSchemeNoQueryNoFragment}${QuestionMark}${infer MaybeQuery}`
            ? MaybeQuery extends Query<MaybeQuery>
              ? MaybeURINoSchemeNoQueryNoFragment extends HierarchicalPart<MaybeURINoSchemeNoQueryNoFragment>
                ? T
                : never // Invalid hierarchical part
              : never // Invalid query
            : never // No query -- TODO
          : never // Invalid fragment
        : never // No fragment -- TODO
      : never // Invalid scheme
    : never; // No colon -> no scheme;
