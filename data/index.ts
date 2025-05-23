import {Currency, PaymentMethod} from "@/types";

export const CurrencyList: Currency[] = [
  {
    country: 'China',
    code: 'CNY',
    symbol: '¥',
    anotherSymbol: 'RMB'
  },
  {
    country: 'Hong Kong',
    code: 'HKD',
    symbol: '$',
    anotherSymbol: 'HKD'
  },
  {
    country: 'India',
    code: 'INR',
    symbol: '₹',
    anotherSymbol: 'INR'
  },
  {
    country: 'Nigeria',
    code: 'NGN',
    symbol: '₦',
    anotherSymbol: 'NGN'
  },
  {
    country: 'United States',
    code: 'USD',
    symbol: '$',
    anotherSymbol: 'USD'
  },
  {
    country: 'United Kingdom',
    code: 'GBP',
    symbol: '£',
    anotherSymbol: 'GBP'
  },
  {
    country: 'France',
    code: 'EUR',
    symbol: '€',
    anotherSymbol: 'EUR'
  },
  {
    country: 'Singapore',
    code: 'SGD',
    symbol: '$',
    anotherSymbol: 'SGD'
  },
  {
    country: 'Canada',
    code: 'CAD',
    symbol: '$',
    anotherSymbol: 'CAD'
  },
  {
    country: 'Australia',
    code: 'AUD',
    symbol: '$',
    anotherSymbol: 'AUD'
  },
  {
    country: 'Malaysia',
    code: 'MYR',
    symbol: 'RM',
    anotherSymbol: 'MYR'
  },
  // Switzerland
  {
    country: 'Switzerland',
    code: 'CHF',
    symbol: '₣',
    anotherSymbol: 'CHF'
  },
  //United Arab Emirates
  {
    country: 'United Arab Emirates',
    code: 'AED',
    symbol: 'د.إ',
    anotherSymbol: 'AED'
  },
  //Philippines
  {
    country: 'Philippines',
    code: 'PHP',
    symbol: '₱',
    anotherSymbol: 'PHP'
  }
]

export const UniversityList = [
  {
    name: 'New York University',
    icon: "nyu",
    logo: "nyuLogo",
    countryIcon: "usa",
    country: 'United States',
  },
  //Columbia University
  {
    name: 'Columbia University',
    icon: "columbia",
    logo: "columbiaLogo",
    countryIcon: "usa",
    country: 'United States',
  },
  //University of Southern California
  {
    name: 'University of Southern California',
    icon: "usc",
    logo: "uscLogo",
    countryIcon: "usa",
    country: 'United States',
  },
  //University of Illinois Urbana-Champaign
  {
    name: 'University of Illinois Urbana-Champaign',
    icon: "illinois",
    logo: "illinoisLogo",
    countryIcon: "usa",
    country: 'United States',
  },
  //Emory University
  {
    name: 'Emory University',
    icon: "emory",
    logo: "emoryLogo",
    countryIcon: "usa",
    country: 'United States',
  },
  //Geogia Institute of Technology
  {
    name: 'Geogia Institute of Technology',
    icon: "gatech",
    logo: "gatechLogo",
    countryIcon: "usa",
    country: 'United States',
  },
  //University College London
  {
    name: 'University College London',
    icon: "ucl",
    logo: "uclLogo",
    countryIcon: "uk",
    country: 'United Kingdom',
  },
  // King's College London
  {
    name: `King's College London`,
    icon: "kings",
    logo: "kingsLogo",
    countryIcon: "uk",
    country: 'United Kingdom',
  },
  // University of Manchester
  {
    name: 'University of Manchester',
    icon: "manchester",
    logo: "manchesterLogo",
    countryIcon: "uk",
    country: 'United Kingdom',
  },
  //ETH Zürich
  {
    name: 'ETH Zürich',
    icon: "eth",
    logo: "ethLogo",
    countryIcon: "switzerland",
    country: 'Switzerland',
  },
  //University of Zurich
  {
    name: 'University of Zurich',
    icon: "zurich",
    logo: "zurichLogo",
    countryIcon: "switzerland",
    country: 'Switzerland',
  },
  //University of Basel
  {
    name: 'University of Basel',
    icon: "basel",
    logo: "baselLogo",
    countryIcon: "switzerland",
    country: 'Switzerland',
  },
  //Khalifa University
  {
    name: 'Khalifa University',
    icon: "khalifa",
    logo: "khalifaLogo",
    countryIcon: "uae",
    country: 'United Arab Emirates',
  },
  //Zayed University
  {
    name: 'Zayed University',
    icon: "zayed",
    logo: "zayedLogo",
    countryIcon: "uae",
    country: 'United Arab Emirates',
  },
  //University of Sharjah
  {
    name: 'University of Sharjah',
    icon: "sharjah",
    logo: "sharjahLogo",
    countryIcon: "uae",
    country: 'United Arab Emirates',
  },
  //University of British Columbia
  {
    name: 'University of British Columbia',
    icon: "ubc",
    logo: "ubcLogo",
    countryIcon: "ca",
    country: 'Canada',
  },
  //McGill University
  {
    name: 'McGill University',
    icon: "mcgill",
    logo: "mcgillLogo",
    countryIcon: "ca",
    country: 'Canada',
  },
  //University of Waterloo
  {
    name: 'University of Waterloo',
    icon: "waterloo",
    logo: "waterlooLogo",
    countryIcon: "ca",
    country: 'Canada',
  },
  //National University of Singapore
  {
    name: 'National University of Singapore',
    icon: "nus",
    logo: "nusLogo",
    countryIcon: "sg",
    country: 'Singapore',
  },
  //Nanyang Technological University
  {
    name: 'Nanyang Technological University',
    icon: "ntus",
    logo: "ntusLogo",
    countryIcon: "sg",
    country: 'Singapore',
  },
  //Singapore Management University
  {
    name: 'Singapore Management University',
    icon: "smu",
    logo: "smuLogo",
    countryIcon: "sg",
    country: 'Singapore',
  },
  //Hong Kong University
  {
    name: 'Hong Kong University',
    icon: "hku",
    logo: "hkuLogo",
    countryIcon: "hk",
    country: 'Hong Kong',
  },
  //City University of Hong Kong
  {
    name: 'City University of Hong Kong',
    icon: "cku",
    logo: "ckuLogo",
    countryIcon: "hk",
    country: 'Hong Kong',
  },
  //Hong Kong University of Science and Technology
  {
    name: 'Hong Kong University of Science and Technology',
    icon: "hkust",
    logo: "hkustLogo",
    countryIcon: "hk",
    country: 'Hong Kong',
  },
  //Universiti Teknologi Malaysia
  {
    name: 'Universiti Teknologi Malaysia',
    icon: "utm",
    logo: "utmLogo",
    countryIcon: "ma",
    country: 'Malaysia',
  },
  //Universiti Sains Malaysia
  {
    name: 'Universiti Sains Malaysia',
    icon: "usm",
    logo: "usmLogo",
    countryIcon: "ma",
    country: 'Malaysia',
  },
  //Sunway University
  {
    name: 'Sunway University',
    icon: "sunway",
    logo: "sunwayLogo",
    countryIcon: "ma",
    country: 'Malaysia',
  },
  //University of Sydney
  {
    name: 'University of Sydney',
    icon: "sydney",
    logo: "sydneyLogo",
    countryIcon: "au",
    country: 'Australia',
  },
  //Monash University
  {
    name: 'Monash University',
    icon: "monash",
    logo: "monashLogo",
    countryIcon: "au",
    country: 'Australia',
  },
  //University of Melbourne
  {
    name: 'University of Melbourne',
    icon: "melbourne",
    logo: "melbourneLogo",
    countryIcon: "au",
    country: 'Australia',
  },
  //University of the Philippines
  {
    name: 'University of the Philippines',
    icon: "up",
    logo: "upLogo",
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
    processingFee: 0,
    fxMarkupRate: 0,
    additionalFee: 0,
    fee: 0,
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
    processingFee: 0,
    fxMarkupRate: 0.01,
    additionalFee: 0,
    fee: 0.01,
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
    name: 'Alipay in Chinese Yuan (CNY) ',
    icon: 'alipay',
    description: 'Select payment method will take <span>1-2 DAYS</span>',
    fee: 0.04,
    note: `
      <p>You will be required to upload the tuition invoice provided by your institution and other documents that may be required according to relevant laws and regulations.</p>
      <p>Student & Payer must be a Mainland China citizen to be eligible to make a payment successfully.</p>
      <p>The recommended amount is not more than 300,000 CNY.</p>
      <p>After you complete your payment, your documents still need to be verified. Once the document verification passes, Intuipay will update the payment status and will then convert and deliver funds to your institution.</p>
    `,
  },
  {
    name: 'RMB transfer in Chinese Yuan (CNY)-A Payment notice / bill / invoice from institution is required',
    icon: 'rmb',
    description: 'Select payment method will take <span>3-7 Days</span>',
    fee: 0.04,
    extra_fee: 80,
    note: `
      <p>You will be required to upload the tuition invoice provided by your institution. Please make sure the document is ready for upload. *</p>
      <p>Student & Payer must be a Mainland China citizen to be eligible to make a payment successfully.</p>
      <p>Payment invoice and payer information will be validated once the funds are received by Intuipay’s authorized partner in China.</p>
      <p>Please transfer CNY (RMB) to the beneficiary bank account (large payments are accepted) according to the instruction given at the end of the booking process. Intuipay will deliver your funds securely within 1 business day after regulatory check is completed and funds received by Intuipay.</p>
    `
  },
  {
    name: 'UnionPay debit card in Chinese Yuan (CNY)',
    icon: 'unionpay',
    description: 'Select payment method will take <span>1-3 Days</span>',
    fee: 0.04,
    note: `
      <p>Enjoy the fastest payment experience with no documents required and instant issuance of receipt upon payment.</p>
      <p>Please ready your China UnionPay debit card and the cardholder’s phone to receive payment verification message before starting the payment.</p>
      <p>Please note:</p>
      <p>If you are paying with a China Construction Bank Debit card, please enable the overseas transaction feature through “Account Inquiry-Management-Account Security” of Mobile Banking.</p>
      <p><span>If you are paying with a Bank of China Debit card, please pre-adjust the online payment limit in the mobile banking app or online banking, please refer to <a href="https://www.unionpayintl.com/ZT/EducationExpends/" target="_blank">this link</a>.</span></p>
    `
  },
  {
    name: 'Visa Debit / Credit in Chinese Yuan (CNY)',
    icon: 'visa',
    description: 'Select payment method will take <span>1-3 Days</span>',
    fee: 0.057,
    important_info: 'Important info',
  },
  {
    name: 'Mastercard Debit / Credit in Chinese Yuan (CNY)',
    icon: 'mastercard',
    description: 'Select payment method will take <span>1-3 Days</span>',
    fee: 0.057,
    important_info: 'Important info',
  },
  {
    name: 'American Express in Chinese Yuan (CNY)',
    icon: 'american',
    description: 'Select payment method will take <span>1-3 Days</span>',
    fee: 0.078,
    important_info: 'Important info',
  },
  {
    name: 'PayPal in Chinese Yuan (CNY)',
    icon: 'paypal',
    description: 'Select payment method will take <span>1-2 Days</span>',
    fee: 0.084,
    extra_fee: 0.3,
    note: `
      <p>You will be required to upload the tuition invoice provided by your institution and other documents that may be required according to relevant laws and regulations.</p>
      <p>Student & Payer must have a PayPal account linked to a Chinese bank account or payment method to use this option.</p>
      <p>After you complete your payment via PayPal, your documents still need to be verified. Once the document verification passes, Intuipay will update the payment status and will then convert and deliver funds to your institution. Please allow 1-2 business days for the entire process to complete.</p>
    `
  }
];
