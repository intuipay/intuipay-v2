import { betterAuth } from 'better-auth';
import { db } from './db';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  database: {
    db,
    type: 'sqlite',
  },
  trustedOrigins: [
    "https://intuipay.xyz",
    "https://dash.intuipay.xyz",
    "https://dev.intuipay.xyz",
    "https://dash.dev.intuipay.xyz",
    "https://crowdfunding.dev.intuipay.xyz",
    "http://localhost:3000",
  ],
})
