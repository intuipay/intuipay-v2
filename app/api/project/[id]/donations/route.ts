import { fetchTidb } from '@/services/fetch-tidb';
import { Donations } from '@/types';

export const runtime = 'edge';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const order_by = searchParams.get('order_by') || 'id';
  const start = searchParams.get('start') || '0';
  if (!id) {
    return new Response(
      JSON.stringify({
        code: 1,
        message: 'Project ID is required',
      }),
      { status: 400 },
    );
  }

  const query = new URLSearchParams();
  query.set('order', order_by);
  query.set('start', start);
  query.set('pagesize', '20');
  query.set('project_id', id);

  try {
    const data = await fetchTidb<Donations[]>(`/project_donations?${query.toString()}`, 'GET');
    return new Response(
      JSON.stringify({
        code: 0,
        data,
      }),
      { status: 200 },
    );
  } catch (e) {
    const errorMessage = (e as Error).message || String(e);
    return new Response(
      JSON.stringify({
        code: 2,
        message: `Failed to fetch project donations: ${errorMessage}`,
      }),
      { status: 400 },
    );
  }
}
