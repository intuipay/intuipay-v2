import { betterAuth } from 'better-auth';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';

async function initDb() {
  const context = await getCloudflareContext({ async: true });

  return new Kysely({
    dialect: new D1Dialect({
      database: context.env.DB,
    }),
  });
}

const db = await initDb();

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
    'https://intuipay.xyz',
    'https://dash.intuipay.xyz',
    'https://dev.intuipay.xyz',
    'https://dash.dev.intuipay.xyz',
    'https://crowdfunding.dev.intuipay.xyz',
    'https://staging.intuipay.xyz',
    'https://dash.staging.intuipay.xyz',
    'http://localhost:3000',
  ],
});
