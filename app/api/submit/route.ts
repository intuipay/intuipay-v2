import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { env } = getRequestContext();
  const d1 = (env as NodeJS.ProcessEnv).DB;

  const { email, name, refer } = (await req.json()) as {
    email: string;
    name: string;
    refer?: string;
  };

  // check if email already exist; if exist, return success
  const checkSql = `SELECT id FROM waitlist WHERE email = ? LIMIT 1`;
  const existing = await d1.prepare(checkSql).bind(email).all();
  if (existing.results && existing.results.length > 0) {
    return new Response(
      JSON.stringify({
        code: 0,
        message: 'Email already exists',
        data: existing.results[0].id,
      }),
      { status: 200 },
    );
  }

  const sql = `INSERT INTO waitlist
(email, fullname, created, refer)
VALUES (?, ?, ?, ?)`;
  const { success, meta } = await d1.prepare(sql)
    .bind(email, name, Date.now(), refer)
    .run();
  if (!success) {
    return new Response(
      JSON.stringify({
        code: 1,
        message: 'Failed to add item',
        data: { meta },
      }),
      { status: 400 },
    );
  }

  return new Response(
    JSON.stringify({
      code: 0,
      data: meta.last_row_id,
      meta,
    }),
    { status: 201 }
  );
}
