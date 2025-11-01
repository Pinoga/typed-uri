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
import { Ok } from "./utils";

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

Ok satisfies HierarchicalPart<"">; // Rootless
Ok satisfies HierarchicalPart<"abc">; // Rootless
Ok satisfies HierarchicalPart<"abc/def">; // Rootless
Ok satisfies HierarchicalPart<"/">; // Root
Ok satisfies HierarchicalPart<"/abc">; // Root
Ok satisfies HierarchicalPart<"/abc/def">; // Root
Ok satisfies HierarchicalPart<"/abc/def/">; // Root
Ok satisfies HierarchicalPart<"//abc/def">; // Authority + path
Ok satisfies HierarchicalPart<"//abc/def/">; // Authority + path
Ok satisfies HierarchicalPart<"//abc.com.br/def">; // Authority + path
Ok satisfies HierarchicalPart<"//abc.com.br/def/">; // Authority + path
Ok satisfies HierarchicalPart<"//abc.com.br/def/ghi">; // Authority + path
Ok satisfies HierarchicalPart<"//abc.com.br">; // Authority only
Ok satisfies HierarchicalPart<"//abc">; // Authority only
Ok satisfies HierarchicalPart<"//127.0.0.1/def">; // Authority + path
Ok satisfies HierarchicalPart<"//127.0.0.1">; // Authority without path
Ok satisfies HierarchicalPart<"//127.0.0.1/">; // Authority without path
Ok satisfies HierarchicalPart<"//[::127.0.0.1]/def/ghi">; // Authority + path
Ok satisfies HierarchicalPart<"//[::127.0.0.1]/def/ghi/">; // Authority + path
Ok satisfies HierarchicalPart<"//[::127.0.0.1]">; // Authority + path
Ok satisfies HierarchicalPart<"//[0000::0000:0000:127.0.0.1]">; // Authority only
Ok satisfies HierarchicalPart<"//[0000::0000:0000:127.0.0.1]/abc">; // Authority only
Ok satisfies HierarchicalPart<"//[0000::0000:0000:127.0.0.1]/">; // Authority only
Ok satisfies HierarchicalPart<"//[v30a.:9]">; // Authority only
Ok satisfies HierarchicalPart<"//[v30a.:9]/">; // Authority only
Ok satisfies HierarchicalPart<"//[v30a.:9]/abc/">; // Authority only
Ok satisfies HierarchicalPart<"//abc">; // Authority only

export type URI<T extends string> =
  T extends `${Scheme<infer _MaybeScheme>}${Colon}${infer MaybeURINoScheme}`
    ? MaybeURINoScheme extends `${infer MaybeURINoSchemeNoFragment}${NumberSign}${Fragment<infer _MaybeFragment>}`
      ? MaybeURINoSchemeNoFragment extends `${infer MaybeURINoSchemeNoQueryNoFragment}${QuestionMark}${infer MaybeQuery}`
        ? MaybeQuery extends Query<MaybeQuery>
          ? MaybeURINoSchemeNoQueryNoFragment extends HierarchicalPart<MaybeURINoSchemeNoQueryNoFragment>
            ? T
            : never // +fragment +query ~hier
          : never // +fragment ~query
        : MaybeURINoSchemeNoFragment extends HierarchicalPart<MaybeURINoSchemeNoFragment>
          ? T
          : never // +fragment, -query ~hier
      : MaybeURINoScheme extends `${infer MaybeURINoSchemeNoQueryNoFragment}${QuestionMark}${infer MaybeQuery}`
        ? MaybeQuery extends Query<MaybeQuery>
          ? MaybeURINoSchemeNoQueryNoFragment extends HierarchicalPart<MaybeURINoSchemeNoQueryNoFragment>
            ? T
            : never // -fragment +query ~hier
          : never // -fragment, ~query
        : MaybeURINoScheme extends HierarchicalPart<MaybeURINoScheme>
          ? T
          : never // -fragment -query ~hier
    : never; // No colon -> no scheme;

type A = URI<"http://www.google.com">;
type B = URI<"http://www.google.com?query=1#fragment">;
type C = URI<"http//www.google.com">;
type D = URI<"http://www.google.com?a=b&c=d#abc-asdkfjqoi">;
type E =
  URI<"file:///Users/fbizzotto/Desktop/CleanShot%202025-10-31%20at%2010.25.11.gif">;
