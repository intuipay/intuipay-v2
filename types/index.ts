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

export type TransferRate = {
  value: number;
  usd: number;
  rate: number;
  usdRate: number;
  usdTargetRate: number;
}

export type PaymentMethod = {
  amount?: number;
  symbol?: string;
  name: string;
  action?: string;
  icon: string;
  description: string;
  processingFee?: number;
  fxMarkupRate?: number;
  additionalFee?: number;
  fee: number;
  extra_fee?: number;
  title?: string;
  background?: string;
  note?: string;
  important_info?: string;
}
