import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { env } = getRequestContext();
  const d1 = (env as NodeJS.ProcessEnv).DB;

  const { email, name, refer } = await req.json();
  const sql = `INSERT INTO waitlist
(email, fullname, refer)
VALUES (?, ?, ?)`;
  const { success, meta } = await d1.prepare(sql)
    .bind(email, name, refer)
    .run();
  if (success) {
    return new Response(
      JSON.stringify({
        code: 0,
        data: meta.last_row_id,
        meta,
      }),
      { status: 201 }
    );
  } else {
    return new Response(
      JSON.stringify({
        code: 1,
        message: 'Failed to add item',
        data: { meta },
      }),
      { status: 500 }
    );
  }
}
