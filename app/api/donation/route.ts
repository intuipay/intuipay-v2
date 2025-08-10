import { fetchTidb } from '@/services/fetch-tidb';
import { validateDonationTransaction } from '@/services/transaction-validator';
import { BLOCKCHAIN_CONFIG } from '@/config/blockchain';
import { getProjectDetail } from '@/lib/data';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const runtime = 'edge';

export async function POST(req: Request) {
  const json = await req.json();

  try {
    // 验证必要的字段
    if (!json.tx_hash || !json.network || !json.currency || !json.amount || !json.project_slug) {
      return new Response(
        JSON.stringify({
          code: 1,
          message: 'Missing required fields: tx_hash, network, currency, amount, or project_slug',
        }),
        { status: 400 },
      );
    }

    // 验证交易哈希
    const { tx_hash, network, currency, amount, wallet_address, project_slug } = json;

    // 获取项目钱包地址 或 众筹合约地址
    let project_wallet: string | undefined;
    let project_type: number | undefined;

    try {
      // 使用已有的函数通过 project_slug 获取项目信息
      const project = await getProjectDetail(project_slug);
      if (project && project.wallets) {
        project_wallet = project.wallets[network];
        project_type = project.type;
      }
    } catch (e) {
      console.warn('Failed to fetch project wallet for validation:', e);
      return new Response(
        JSON.stringify({
          code: 1,
          message: 'Failed to fetch project wallet configuration',
        }),
        { status: 400 },
      );
    }

    // 检查是否成功获取到项目钱包地址
    if (!project_wallet) {
      return new Response(
        JSON.stringify({
          code: 1,
          message: `Project wallet address not configured for network: ${network}`,
        }),
        { status: 400 },
      );
    }

    // 获取货币配置
    const currencyConfig = BLOCKCHAIN_CONFIG.currencies[ currency as keyof typeof BLOCKCHAIN_CONFIG.currencies ];
    if (!currencyConfig) {
      return new Response(
        JSON.stringify({
          code: 1,
          message: `Unsupported currency: ${currency}`,
        }),
        { status: 400 },
      );
    }

    // 非众筹项目才要验证交易
    if (project_type != 101) {
      // 执行交易验证（amount 已经在前端转换为最小单位）
      const validationResult = await validateDonationTransaction(
        network,
        tx_hash,
        project_wallet, // expectedTo - 项目钱包地址
        BigInt(amount), // 前端已经转换为最小单位，直接转换为 BigInt
        wallet_address, // expectedFrom - 捐赠者钱包地址
        currencyConfig
      );

      // 如果交易验证失败，返回错误
      if (!validationResult.isValid) {
        return new Response(
          JSON.stringify({
            code: 1,
            message: `Transaction validation failed: ${validationResult.error}`,
          }),
          { status: 400 },
        );
      }
    }

    // 验证通过，保存到数据库
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    let user_id = null;
    if (session?.user?.id) {
      user_id = session.user.id;
    }
    json.user_id = user_id;
    const data = await fetchTidb<{ id: number }>('/donation', 'POST', json);
    console.log('save result', data);
    return new Response(
      JSON.stringify({
        code: 0,
        data: data[ 0 ].id,
        validation: {
          verified: true,
        },
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
