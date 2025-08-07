import { getRequestContext } from '@cloudflare/next-on-pages';

import { D1Dialect } from 'kysely-d1';
import { Kysely } from 'kysely';
import { D1Database } from '@cloudflare/workers-types';

function initDbConnectionDev() {
  const { env } = getRequestContext();
  return new D1Dialect({
    database: (env as { DB: D1Database }).DB,
  });
}

function initDbConnection() {
  return new D1Dialect({
    database: process.env.DB,
  });
}

export const db = new Kysely({
  dialect:
    process.env.NODE_ENV === 'production'
      ? initDbConnection()
      : initDbConnectionDev(),
});
