import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { env } = getRequestContext();
  const d1 = (env as NodeJS.ProcessEnv).DB;
  if (!d1) {
    return new Response(JSON.stringify({ error: 'D1 database binding not found' }), {
      status: 500,
    });
  }

  console.log('D1 database binding found:', d1);
  const { results } = await d1.prepare('SELECT * FROM waitlist').all();
  return new Response(JSON.stringify(results));
}
