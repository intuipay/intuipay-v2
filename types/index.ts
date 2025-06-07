import {DonationProjectStatus} from "@/constants/donation";

export type DropdownItemProps = {
  icon: string;
  label?: string;
  value?: string;
}
export type Currency = DropdownItemProps & {
  code: string;
  country?: string;
  symbol: string;
  anotherSymbol: string;
}

export type University = DropdownItemProps & {
  country?: string;
  countryIcon: string;
  name: string;
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

export type DonationInfo = {
  address1: string;
  address2?: string;
  amount: number | '';
  city: string;
  company_name?: string;
  country: string;
  currency: string;
  email: string;
  first_name?: string;
  has_tax_invoice?: boolean;
  id: number;
  is_anonymous?: boolean;
  last_name?: string;
  network: string;
  note?: string;
  project_id: number;
  state: string;
  wallet: string;
  zip: string;

  created_at?: string;
  updated_at?: string;
}
