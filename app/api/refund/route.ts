import { fetchTidb } from '@/services/fetch-tidb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const json = await req.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user_id = session?.user.id;
  if (!user_id) {
    return new Response(
      JSON.stringify({
        code: 1,
        message: 'Failed to create refund: no user id specified',
      }),
      { status: 400 },
    );
  }
  json.user_id = user_id;

  const data = await fetchTidb<{ last_insert_id: number }>('/refund', 'POST', json);
  console.log('save refund result', data);
  return new Response(
    JSON.stringify({
      code: 0,
      data: data[ 0 ].last_insert_id,
      validation: {
        verified: true,
      },
    }),
    { status: 201 },
  );
}
