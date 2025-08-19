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

export type ShipInfo = {
  name: string;
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  email: string;
  phone: string;
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
  tx_hash: string;

  // 奖励相关字段
  selected_reward?: Reward | null;
  has_selected_reward?: boolean;
  pledge_without_reward?: boolean;
  reward_id?: number;

  // 收货地址相关字段
  same_as_contact?: boolean;
  ship_info?: ShipInfo; // 收货地址信息对象
  index?: number;

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
  rewards?: string; // JSON string containing reward data

  created_at: string;
  deleted_at?: string;
  updated_at: string;

  campaign_id?: number; // 区块链上的活动id，每个项目不同
  networks?: string;
  tokens?: string;
  wallets: string;
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
  amountUSD?: string;
  timeAgo?: string;
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

export type ShippingOption = { destination: string; shippingCost: number };

export type RewardDraft = {
  id?: number;
  title: string;
  description: string;
  amount: number;
  image: string;
  availability?: string;
  number: number;
  month: string | number;
  year: string | number;
  ship_method: string | number;
  destinations: ShippingOption[];
  address?: string;
  count?: number;
}

export type Reward = {
  id: string;
  name: string;
  description: string;
  amount: number; // in USD
  image?: string;
  shipping_method?: string;
  estimated_delivery?: string;
  availability?: string;
  quantity_limit?: number;
}

export type Rewards = Reward[];

export interface Profile {
  id?: string;
  location: string;
  timezone: string;
  bio: string;
  social_links: string; // JSON stringified object
  number: string;
  first_name: string;
  last_name: string;
  display_image: string;
}

// 用户支持的项目类型，包含项目信息和用户的退款状态
export type BackedProject = ProjectInfo & {
  refund_at: string;           // 退款时间，如果有值说明用户退款过，如果为空字符串说明用户未退款过
};

// 用户退款信息
export type UserRefund = {
  amount: number;
  count: number;
  dollar: number;
}
