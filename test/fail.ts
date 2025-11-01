import type { URI } from "../src/uri";
import { Ok } from "../src/utils";

// @ts-expect-error
Ok satisfies URI<"beepbeep\x07\x07">;
// @ts-expect-error
Ok satisfies URI<"\n">;
// @ts-expect-error
Ok satisfies URI<"::">;
// @ts-expect-error
Ok satisfies URI<"http://www yahoo.com">;
// @ts-expect-error
Ok satisfies URI<"http://www.yahoo.com/hello world/">;
// @ts-expect-error
Ok satisfies URI<'http://www.yahoo.com/yelp.html#"'>;
// @ts-expect-error
Ok satisfies URI<"[2010:836B:4179::836B:4179]">;
// @ts-expect-error
Ok satisfies URI<" ">;
// @ts-expect-error
Ok satisfies URI<"%">;
// @ts-expect-error
Ok satisfies URI<"A%Z">;
// @ts-expect-error
Ok satisfies URI<"%ZZ">;
// @ts-expect-error
Ok satisfies URI<"%AZ">;
// @ts-expect-error
Ok satisfies URI<"A C">;
// @ts-expect-error
Ok satisfies URI<"A\\'C">;
// @ts-expect-error
Ok satisfies URI<"A`C">;
// @ts-expect-error
Ok satisfies URI<"A<C">;
// @ts-expect-error
Ok satisfies URI<"A>C">;
// @ts-expect-error
Ok satisfies URI<"A^C">;
// @ts-expect-error
Ok satisfies URI<"A\\\\C">;
// @ts-expect-error
Ok satisfies URI<"A{C">;
// @ts-expect-error
Ok satisfies URI<"A|C">;
// @ts-expect-error
Ok satisfies URI<"A}C">;
// @ts-expect-error
Ok satisfies URI<"A[C">;
// @ts-expect-error
Ok satisfies URI<"A]C">;
// @ts-expect-error
Ok satisfies URI<"A[**]C">;
// @ts-expect-error
Ok satisfies URI<"http://[xyz]/">;
// @ts-expect-error
Ok satisfies URI<"http://]/">;
// @ts-expect-error
Ok satisfies URI<"http://example.org/[2010:836B:4179::836B:4179]">;
// @ts-expect-error
Ok satisfies URI<"http://example.org/abc#[2010:836B:4179::836B:4179]">;
// @ts-expect-error
Ok satisfies URI<"http://example.org/xxx/[qwerty]#a[b]">;
// @ts-expect-error
Ok satisfies URI<"http://w3c.org:80path1/path2">;
