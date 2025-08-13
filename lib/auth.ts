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
})
