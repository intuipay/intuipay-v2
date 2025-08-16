import { fetchTidb } from '@/services/fetch-tidb';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getRefundProps, sendRefundEmail } from '@/lib/send-email';
import { getProjectDetail, getUserRefund } from '@/lib/data';

export const runtime = 'edge';

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

  const project = await getProjectDetail(json.project_id);
  if (!project) {
    return new Response(
      JSON.stringify({
        code: 1,
        message: `Failed to fetch project ${json.project_id}`,
      }),
      { status: 400 },
    );
  }


  const data = await fetchTidb<{ last_insert_id: number }>('/refund', 'POST', json);
  console.log('save refund result', data);

  // send refund email
  let finalEmail = '';
  if (session?.user.email) {
    finalEmail = session.user.email;
  }
  // 如果邮箱不为空，发送捐款成功邮件
  if (finalEmail && finalEmail.trim()) {
    try {
      // 取退款金额
      const userRefundInfo = await getUserRefund(session.user.id, project.id);
      // 构建发送邮件所需的参数
      const emailParams = getRefundProps(project, {
        amount: userRefundInfo.amount,
        to: finalEmail,
        tx_hash: json.tx_hash,
        wallet_address: json.wallet_address,
      });
      await sendRefundEmail(emailParams);
      console.log('Refund email sent successfully to:', finalEmail);
    } catch (emailError) {
      // 邮件发送失败不影响捐款流程，只记录错误
      console.error('Failed to send donation email:', emailError);
    }
  }

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
