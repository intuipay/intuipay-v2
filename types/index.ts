import { ProjectStatus } from "@/data/project";
import { ProjectCategories, ProjectTypes, ProjectDonationMethods } from "@/data";

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

export type TiDBDataServiceResponse<T> = {
  data: {
    columns: string[];
    rows: T[];
  }
}

export type DonationInfo = {
  address1: string;
  address2?: string;
  amount: number | ''; // crypto 金额，整数，很多0
  dollar: number | null; // 调用汇率接口换算出当时的美元金额
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

export type ProjectInfo = {
  id: number;
  project_name: string;
  project_slug: string;
  project_subtitle: string;
  accepts: string;
  amount: number;
  banner: string;
  banners: string[];
  campaign: string;
  category: ProjectCategories;
  email: string;
  end_at: string;
  github: string;
  goal_amount: number;
  location: string;
  org_id: number;
  org_contact: string;
  org_description: string;
  org_location: string;
  org_logo: string;
  org_name: string;
  org_slug: string;
  org_type: string;
  org_website: string;
  social_links: string | Record<string, string>;
  status: ProjectStatus;
  tags: string;
  type: ProjectTypes;
  website: string;
  backers: number;
  project_cta: string;
  thanks_note: string;
  brand_color: string;

  created_at: string;
  deleted_at?: string;
  updated_at: string;
}

export type ProjectFilter = {
  category: ProjectCategories;
  progressMin: number;
  progressMax: number;
  location: string;
  donationMethods: ProjectDonationMethods | string;
  projectType: ProjectTypes | string;
  excludes?: string[];
}

export type Donation = {
  amount: number;
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
  created_at: string;
  updated_at: string;
  status: number | null;
}

export type Updates = Update[];
