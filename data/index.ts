import {Currency, PaymentMethod, University} from "@/types";

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
    name: 'Solana in USD Coin (USDC)',
    action: 'Pay USD Coin (USDC) on Solana',
    icon: 'usdc',
    description: 'Select payment method will take <span>10 MINUTES</span>',
    processingFee: [0, 1],
    title: 'FASTEST & CHEAPEST, IF YOU ALREADY OWN ENOUGH USDC',
    background: '#16A34A',
    note: `
      <p>Enjoy the fastest payment experience with funds arriving at your institution in 20-60 minutes and instant confirmation upon completion.</p>
      <p>You will be promoted to transfer the specified USDC amount to the beneficiary wallet address given at the end of the booking process. Intuipay will deliver your funds securely to your institution's bank account within minutes after confirmation on the blockchain.</p>
      <p>Student information will be required during the payment process to ensure proper routing.</p>
      <div class="mt-6">Please note:</div>
      <p>USDC is a stablecoin issued by Circle, an official partner of Intuipay, that maintains a 1:1 value with the US Dollar, ensuring your payment amount remains stable during transfer.</p>
      <p>In some cases, we may require additional documentation to comply with relevant regulations.</p>
      <p>You must have sufficient USDC in a compatible wallet to use this payment method.</p>
    `,
  },
  {
    name: 'Solana in Chinese Yuan (CNY)',
    action: 'Pay Chinese Yuan (CNY) on Solana',
    icon: 'solana',
    processingFee: [0, 1],
    fxMarkupRate: [0, 1],
    description: 'Select payment method will take <span>~20-60 MINUTES</span>',
    title: 'FAST & MOST POPULAR',
    background: 'linear-gradient(180deg, #0037C2 0%, #217BE0 100%)',
    note: `<p>Enjoy the fastest payment experience with funds arriving at your institution in 20-60 minutes and instant confirmation upon completion.</p><p>Your payment in CNY will be converted to USDC (a digital US dollar) and securely transferred via EDU Chain, our high-speed blockchain network.</p><p>Please have your payment method and institution invoice ready before starting the payment.</p>
    <div class="mt-6">Please note:</div>
    <p>USDC is a stablecoin issued by Circle, an official partner of Intuipay, that maintains a 1:1 value with the US Dollar, ensuring your payment amount remains stable during transfer.</p>
    <p>In some cases, we may require additional documentation to comply with relevant regulations.</p>`,
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
    icon: 'wuc',
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
  },
  {
    name: 'Bank Wire Transfer',
    icon: 'bwt',
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
    icon: 'american',
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
  },
  {
    name: 'WeChat pay',
    icon: 'wechat',
    description: '',
    processingFee: [1, 2],
    fxMarkupRate: [1, 2],
  },
];
