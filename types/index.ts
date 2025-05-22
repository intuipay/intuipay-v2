export type Currency = {
  country: string;
  code: string;
  symbol: string;
  anotherSymbol: string;
}

export type APIResponse<T> = {
  code: number;
  message: string;
  data: T;
  meta: {
    changes?: number;
  };
}
