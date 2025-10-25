type Dec = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export type NthTimes<
  T extends string | number,
  Times extends number,
> = Dec[Times] extends never ? "" : `${T}${NthTimes<T, Dec[Times]>}`;
