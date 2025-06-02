import { fetchTidb } from '@/services/fetch-tidb';

export async function POST(req: Request) {
  const json = await req.json();
  try {
    const data = await fetchTidb<{ id: number }>('/donation', 'POST', json);
    return new Response(
      JSON.stringify({
        code: 0,
        data: data[ 0 ].id,
      }),
      { status: 201 },
    );
  } catch (e) {
    const errorMessage = (e as Error).message || String(e);
    return new Response(
      JSON.stringify({
        code: 1,
        message: `Failed to create donation: ${errorMessage}`,
      }),
      { status: 400 },
    );
  }
}
