import {Currency, PaymentMethod, University} from "@/types";
// 为了保持向后兼容，使用新的区块链配置系统
import { getNetworkDropdownOptions, getWalletDropdownOptions } from '@/config/blockchain';
import { RewardShipMethod } from "@intuipay/shared/constants";

export const CurrencyList: Currency[] = [
  {
    country: 'China',
    code: 'CNY',
    symbol: '¥',
    anotherSymbol: 'RMB',
    icon: 'china',
  },
  {
    country: 'Hong Kong',
    code: 'HKD',
    symbol: '$',
    anotherSymbol: 'HKD',
    icon: 'hongkong',
  },
  {
    country: 'India',
    code: 'INR',
    symbol: '₹',
    anotherSymbol: 'INR',
    icon: 'india',
  },
  {
    country: 'Nigeria',
    code: 'NGN',
    symbol: '₦',
    anotherSymbol: 'NGN',
    icon: 'nigeria',
  },
  {
    country: 'United States',
    code: 'USD',
    symbol: '$',
    anotherSymbol: 'USD',
    icon: 'usa',
  },
  {
    country: 'United Kingdom',
    code: 'GBP',
    symbol: '£',
    anotherSymbol: 'GBP',
    icon: 'uk',
  },
  {
    country: 'France',
    code: 'EUR',
    symbol: '€',
    anotherSymbol: 'EUR',
    icon: 'france',
  },
  {
    country: 'Singapore',
    code: 'SGD',
    symbol: '$',
    anotherSymbol: 'SGD',
    icon: 'singapore',
  },
  {
    country: 'Canada',
    code: 'CAD',
    symbol: '$',
    anotherSymbol: 'CAD',
    icon: 'canada',
  },
  {
    country: 'Australia',
    code: 'AUD',
    symbol: '$',
    anotherSymbol: 'AUD',
    icon: 'australia',
  },
  {
    country: 'Malaysia',
    code: 'MYR',
    symbol: 'RM',
    anotherSymbol: 'MYR',
    icon: 'malaysia',
  },
  // Switzerland
  {
    country: 'Switzerland',
    code: 'CHF',
    symbol: '₣',
    anotherSymbol: 'CHF',
    icon: 'switzerland',
  },
  //United Arab Emirates
  {
    country: 'United Arab Emirates',
    code: 'AED',
    symbol: 'د.إ',
    anotherSymbol: 'AED',
    icon: 'aed',
  },
  //Philippines
  {
    country: 'Philippines',
    code: 'PHP',
    symbol: '₱',
    anotherSymbol: 'PHP',
    icon: 'philippines',
  }
]

export const UniversityList: University[] = [
  {
    name: 'New York University',
    icon: "nyu",
    countryIcon: "usa",
    country: 'United States',
  },
  //Columbia University
  {
    name: 'Columbia University',
    icon: "columbia",
    countryIcon: "usa",
    country: 'United States',
  },
  //University of Southern California
  {
    name: 'University of Southern California',
    icon: "usc",
    countryIcon: "usa",
    country: 'United States',
  },
  //University of Illinois Urbana-Champaign
  {
    name: 'University of Illinois Urbana-Champaign',
    icon: "illinois",
    countryIcon: "usa",
    country: 'United States',
  },
  //Emory University
  {
    name: 'Emory University',
    icon: "emory",
    countryIcon: "usa",
    country: 'United States',
  },
  //Geogia Institute of Technology
  {
    name: 'Geogia Institute of Technology',
    icon: "gatech",
    countryIcon: "usa",
    country: 'United States',
  },
  //University College London
  {
    name: 'University College London',
    icon: "ucl",
    countryIcon: "uk",
    country: 'United Kingdom',
  },
  // King's College London
  {
    name: `King's College London`,
    icon: "kings",
    countryIcon: "uk",
    country: 'United Kingdom',
  },
  // University of Manchester
  {
    name: 'University of Manchester',
    icon: "manchester",
    countryIcon: "uk",
    country: 'United Kingdom',
  },
  //ETH Zürich
  {
    name: 'ETH Zürich',
    icon: "eth",
    countryIcon: "switzerland",
    country: 'Switzerland',
  },
  //University of Zurich
  {
    name: 'University of Zurich',
    icon: "zurich",
    countryIcon: "switzerland",
    country: 'Switzerland',
  },
  //University of Basel
  {
    name: 'University of Basel',
    icon: "basel",
    countryIcon: "switzerland",
    country: 'Switzerland',
  },
  //Khalifa University
  {
    name: 'Khalifa University',
    icon: "khalifa",
    countryIcon: "uae",
    country: 'United Arab Emirates',
  },
  //Zayed University
  {
    name: 'Zayed University',
    icon: "zayed",
    countryIcon: "uae",
    country: 'United Arab Emirates',
  },
  //University of Sharjah
  {
    name: 'University of Sharjah',
    icon: "sharjah",
    countryIcon: "uae",
    country: 'United Arab Emirates',
  },
  //University of British Columbia
  {
    name: 'University of British Columbia',
    icon: "ubc",
    countryIcon: "ca",
    country: 'Canada',
  },
  //McGill University
  {
    name: 'McGill University',
    icon: "mcgill",
    countryIcon: "ca",
    country: 'Canada',
  },
  //University of Waterloo
  {
    name: 'University of Waterloo',
    icon: "waterloo",
    countryIcon: "ca",
    country: 'Canada',
  },
  //National University of Singapore
  {
    name: 'National University of Singapore',
    icon: "nus",
    countryIcon: "sg",
    country: 'Singapore',
  },
  //Nanyang Technological University
  {
    name: 'Nanyang Technological University',
    icon: "ntus",
    countryIcon: "sg",
    country: 'Singapore',
  },
  //Singapore Management University
  {
    name: 'Singapore Management University',
    icon: "smu",
    countryIcon: "sg",
    country: 'Singapore',
  },
  //Hong Kong University
  {
    name: 'Hong Kong University',
    icon: "hku",
    countryIcon: "hk",
    country: 'Hong Kong',
  },
  //City University of Hong Kong
  {
    name: 'City University of Hong Kong',
    icon: "cku",
    countryIcon: "hk",
    country: 'Hong Kong',
  },
  //Hong Kong University of Science and Technology
  {
    name: 'Hong Kong University of Science and Technology',
    icon: "hkust",
    countryIcon: "hk",
    country: 'Hong Kong',
  },
  //Universiti Teknologi Malaysia
  {
    name: 'Universiti Teknologi Malaysia',
    icon: "utm",
    countryIcon: "ma",
    country: 'Malaysia',
  },
  //Universiti Sains Malaysia
  {
    name: 'Universiti Sains Malaysia',
    icon: "usm",
    countryIcon: "ma",
    country: 'Malaysia',
  },
  //Sunway University
  {
    name: 'Sunway University',
    icon: "sunway",
    countryIcon: "ma",
    country: 'Malaysia',
  },
  //University of Sydney
  {
    name: 'University of Sydney',
    icon: "sydney",
    countryIcon: "au",
    country: 'Australia',
  },
  //Monash University
  {
    name: 'Monash University',
    icon: "monash",
    countryIcon: "au",
    country: 'Australia',
  },
  //University of Melbourne
  {
    name: 'University of Melbourne',
    icon: "melbourne",
    countryIcon: "au",
    country: 'Australia',
  },
  //University of the Philippines
  {
    name: 'University of the Philippines',
    icon: "up",
    countryIcon: "ph",
    country: 'Philippines',
  },
]

export const PaymentMethods: PaymentMethod[] = [
  {
    name: 'EDU Chain in USD Coin (USDC)',
    icon: 'usdc',
    description: 'Will take <span>10 MINUTES</span>',
    processingFee: [0, 1],
    title: 'FASTEST & CHEAPEST, IF YOU ALREADY OWN ENOUGH USDC',
    background: '#16A34A',
  },
  {
    name: 'EDU Chain in Chinese Yuan',
    icon: 'edu',
    processingFee: [0, 1],
    fxMarkupRate: [0, 1],
    description: 'Will take <span>~20-60 MINUTES</span>',
    title: 'FAST & MOST POPULAR',
    background: 'linear-gradient(180deg, #0037C2 0%, #217BE0 100%)',
  },
];

export const PaymentMethodsOther: PaymentMethod[] = [
  {
    name: 'Flywire',
    icon: 'flywire',
    description: '',
    processingFee: [1, 2],
    fxMarkupRate: [1, 1.5],
    additionalFee: [0, 30, true],
  },
  {
    name: 'Western Union / Convera',
    icon: 'convera',
    description: '',
    processingFee: [1, 3],
    fxMarkupRate: [2, 3.5],
    additionalFee: [0, 20, true],
  },
  {
    name: 'EasyTransfer',
    icon: 'wuc',
    description: '',
    processingFee: [1, 2],
    fxMarkupRate: [0.5, 1.5],
    currency: ['CNY', 'NGN', 'INR'],
  },
  {
    name: 'Bank Wire Transfer',
    icon: 'rmb',
    description: '',
    processingFee: [20, 50, true],
    fxMarkupRate: [1, 4],
    additionalFee: [10, 30, true],
  },
  {
    name: 'Visa',
    icon: 'visa',
    description: '',
    processingFee: [1.5, 2.5],
    fxMarkupRate: [1, 2],
    additionalFee: [0.8, 1.2],
  },
  {
    name: 'Mastercard',
    icon: 'mastercard',
    description: '',
    processingFee: [1.5, 2.5],
    fxMarkupRate: [1, 2],
    additionalFee: [0.8, 1.2],
  },
  {
    name: 'American Express',
    icon: 'american',
    description: '',
    processingFee: [2.5, 3.5],
    fxMarkupRate: [1, 3],
    additionalFee: [0.9, 1.3],
  },
  {
    name: 'UnionPay',
    icon: 'unionpay',
    description: '',
    processingFee: [1, 2],
    fxMarkupRate: [1, 2],
    currency: ['CNY'],
  },
  {
    name: 'PayPal',
    icon: 'paypal',
    description: '',
    processingFee: [2.9, 4.4],
    fxMarkupRate: [2.5, 4],
    additionalFee: [0.3, 0.3, true],
  },
  {
    name: 'Alipay',
    icon: 'alipay',
    description: '',
    processingFee: [1, 2],
    fxMarkupRate: [1, 2],
    currency: ['CNY'],
  },
  {
    name: 'WeChat pay',
    icon: 'wechat',
    description: '',
    processingFee: [1, 2],
    fxMarkupRate: [1, 2],
    currency: ['CNY'],
  },
];


export const Networks = getNetworkDropdownOptions();
export const Wallets = getWalletDropdownOptions();

export enum ProjectCategories {
  All = 0,
  'Addiction Recovery' = 1,
  Animals = 2,
  'Arts & Culture' = 3,
  'Children & Youth' = 4,
  'Community Foundations' = 5,
  'Community Service' = 6,
  'Developmental Disabilities' = 7,
  'Disaster Response' = 8,
  'Education & Training' = 9,
  Environment = 10,
  'First Responders & Veterans' = 11,
  'Health & Medical' = 12,
  'Higher Education' = 13,
  'Homelessness' = 14,
  'Human Rights' = 15,
  'Hunger' = 16,
  'Immigration & Refugees' = 17,
  'International Development' = 18,
  'Legal Support' = 19,
  'LGBTQ' = 20,
  'Media' = 21,
  'Racial Justice' = 21,
  'Religion and Faith Based' = 22,
  'Technology' = 23,
  'Water & Hygiene' = 24,
  'Women & Girls' = 25,
  'Agriculture' = 26,
}

export enum ProjectDonationMethods {
  All = 0,
  Crypto = 1,
  Cash = 2,
  'Crypto & Cash' = 3,
}

export enum ProjectTypes {
  All = 0,
  'Non-Profit / Academic Research' = 1,
  'For-Profit Research' = 2,
  'Government-Funded Research' = 3,
  'Philanthropic Research' = 4,
  'Crowdsourced / Open Science' = 5,
  'Student Organization' = 6,
}

export enum Availabilities {
  Unlimited = 0,
  Limited = 1,
}

export const REWARD_SHIP_METHOD_LABELS: Record<keyof typeof RewardShipMethod, string> = {
  ByMyself: "Ships by myself",
  LocalPickup: "Local pickup, event, or service",
  Digital: "Digital method",
};
