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
  id: number;
  project_slug: string;
  accepts: string;
  amount: string;
  banner: string;
  banners: string;
  campaign: string;
  category: ProjectCategories;
  description: string;
  email: string;
  end_at: string;
  github: string;
  goal_amount: string;
  location: string;
  org_contact: string;
  org_description: string;
  org_location: string;
  org_logo: string;
  org_name: string;
  org_slug: string;
  org_type: string;
  org_website: string;
  project_name: string;
  qrcode: string;
  social_links: string | Record<string, string>;
  status: string;
  tags: string;
  type: ProjectTypes;
  wallet_address: string;
  website: string;
}

export type ProjectFilter = {
  category?: ProjectCategories;
  progress?: number;
  location?: string;
  donationMethods?: ProjectDonationMethods;
  projectType?: ProjectTypes;
  excludes?: number;
}

export type Donation = {
  amount: string;
  country: string;
  currency: string;
  first_name: string;
  last_name: string;
  method: string;
}

export type Donations = Donation[]

export type Update = {
  id: number;
  projectId: number;
  title: string;
  content: string;
  thumbnail: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: number | null;
}

export type Updates = Update[];
