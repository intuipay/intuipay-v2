import { fetchTidb } from '@/services/fetch-tidb';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = await params;
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
  query.set('project_id', id);

  try {
    const data = await fetchTidb<{ total: number }>(`/project_updates_count?${query.toString()}`, 'GET');
    return new Response(
      JSON.stringify({
        code: 0,
        data: data[ 0 ].total,
      }),
      { status: 200 },
    );
  } catch (e) {
    const errorMessage = (e as Error).message || String(e);
    return new Response(
      JSON.stringify({
        code: 2,
        message: `Failed to fetch update count: ${errorMessage}`,
      }),
      { status: 400 },
    );
  }
}
