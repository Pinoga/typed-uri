import type {
  Colon,
  DoubleSlash,
  NumberSign,
  QuestionMark,
  Slash,
} from "./aliases";
import type { Fragment } from "./fragment";
import type { Authority } from "./host";
import type { PathRootless, PathWithRoot } from "./path";
import type { Query } from "./query";
import type { Scheme } from "./scheme";

export type HierarchicalPart<T extends string> =
  T extends `${DoubleSlash}${infer MaybeAuthorityWithMaybePath}`
    ? MaybeAuthorityWithMaybePath extends `${infer MaybeAuthority}${Slash}${infer MaybePath}`
      ? MaybeAuthority extends Authority<MaybeAuthority>
        ? `${Slash}${MaybePath}` extends PathWithRoot<`${Slash}${MaybePath}`>
          ? T
          : never // Invalid path
        : MaybeAuthorityWithMaybePath extends Authority<MaybeAuthorityWithMaybePath>
          ? T
          : never // Invalid authority
      : MaybeAuthorityWithMaybePath extends Authority<infer _>
        ? T
        : never // no path and invalid authority
    : T extends PathWithRoot<T>
      ? T
      : T extends PathRootless<T>
        ? T
        : never;

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
