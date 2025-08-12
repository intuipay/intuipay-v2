import { NextRequest, NextResponse } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');
  const source = searchParams.get('source');
  if (!target || !source) {
    return NextResponse.json({ error: 'target and source are required' }, { status: 400 });
  }

  const { env } = getRequestContext();
  const kv = (env as NodeJS.ProcessEnv).KV;
  const cachedData = await kv.get(`exchange-rate:${source}-${target}`);
  if (cachedData) {
    return NextResponse.json(JSON.parse(cachedData), { status: 200 });
  }

  const params = new URLSearchParams();
  params.set('access_key', process.env.API_LAYER_ACCESS_KEY!);
  params.set('currencies', `USD,${target}`);
  params.set('source', source);
  const response = await fetch(`https://apilayer.net/api/live?${params.toString()}`, {
    next: {
      revalidate: 60 * 60 * 24,
    },
  });
  const data = await response.json();
  await kv.put(`exchange-rate:${source}-${target}`, JSON.stringify(data), {
    expirationTtl: 60 * 60 * 24, // Cache for 24 hours
  });
  return NextResponse.json(data);
}
