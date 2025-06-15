import { ProjectCategories, ProjectTypes, ProjectDonationMethods } from "@/data";

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

export type TiDBDataServiceResponse<T> = {
  data: {
    columns: string[];
    rows: T[];
  }
}

export type ProjectInfo = {
  id: string;
  project_name: string;
  project_slug: string;
  description: string;
  banner: string;
  amount: number;
  goal_amount: number;
  end_at: string;
  org_name: string;
  org_slug: string;
  org_logo: string;
}

export type ProjectFilter = {
  category: ProjectCategories;
  progress: number;
  location: string;
  donationMethods: ProjectDonationMethods;
  projectType: ProjectTypes;
}
