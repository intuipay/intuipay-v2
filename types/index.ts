import {DonationProjectStatus} from "@/constants/donation";

export type DropdownItemProps = {
  country: string;
  icon: string;
}
export type Currency = DropdownItemProps & {
  code: string;
  symbol: string;
  anotherSymbol: string;
}

export type University = DropdownItemProps & {
  name: string;
  countryIcon: string;
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
  amountRange?: number[];
  diffAmountRange?: number[];
  symbol?: string;
  name: string;
  action?: string;
  icon: string;
  isChina?: boolean;
  description: string;
  processingFee?: [number, number, boolean?];
  fxMarkupRate?: [number, number, boolean?];
  additionalFee?: [number, number, boolean?];
  extra_fee?: number;
  title?: string;
  background?: string;
  note?: string;
  important_info?: string;
  currency?: string[];
}

export type DonationProject = {
  id: number;
  banner: string;
  created_at: string;
  deleted_at?: string;
  description: string;
  org_id: number;
  project_name: string;
  project_slug: string;
  qrcode: string;
  status: DonationProjectStatus;
  updated_at: string;
  vault_account_id: string;
  wallet_address: string;
}

export type TiDBDataServiceResponse<T> = {
  data: {
    columns: string[];
    rows: T[];
  }
}
