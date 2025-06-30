export type MapTuple<T extends readonly [...any[]], M> = T extends readonly []
  ? []
  : T extends readonly [infer H, ...infer Rest extends [...any[]]]
  ? [H extends keyof M ? M[H] : never, ...MapTuple<Rest, M>]
  : never;

export type ConvertTuple<T extends readonly [...any[]], R> = MapTuple<
  T,
  Record<any, R>
>;

export type KeyOfTuple<T extends readonly any[]> = Exclude<
  Extract<keyof T, `${number}`>,
  keyof any[]
> extends `${infer N extends number}`
  ? N
  : never;
