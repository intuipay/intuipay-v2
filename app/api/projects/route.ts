import { fetchTidb } from '@/services/fetch-tidb';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = new URL('/donation_projects');
  const order_by = searchParams.get('order_by') || 'id';
  const order_dir = searchParams.get('order_dir') || 'asc';
  const start = searchParams.get('start') || '0';
  const pagesize = searchParams.get('pagesize') || '20';
  url.searchParams.set('order_by', order_by);
  url.searchParams.set('order_dir', order_dir);
  url.searchParams.set('start', start);
  url.searchParams.set('pagesize', pagesize);

  try {
    const data = await fetchTidb<{ id: number }>(url, 'GET');
    return new Response(
      JSON.stringify({
        code: 0,
        data: data[ 0 ].id,
      }),
      { status: 200 },
    );
  } catch (e) {
    const errorMessage = (e as Error).message || String(e);
    return new Response(
      JSON.stringify({
        code: 1,
        message: `Failed to fetch donation projects: ${errorMessage}`,
      }),
      { status: 400 },
    );
  }
}
