import { fetchTidb } from '@/services/fetch-tidb';
import { validateDonationTransaction } from '@/services/transaction-validator';
import { getProjectWalletAddress, BLOCKCHAIN_CONFIG } from '@/config/blockchain';
import { getDonationProjectById } from '@/lib/data';

export const runtime = 'edge';

export async function POST(req: Request) {
  const json = await req.json();

  try {
    // 验证必要的字段
    if (!json.tx_hash || !json.network || !json.currency || !json.amount || !json.project_id) {
      return new Response(
        JSON.stringify({
          code: 1,
          message: 'Missing required fields: tx_hash, network, currency, amount, or project_id',
        }),
        { status: 400 },
      );
    }

    // 验证交易哈希
    const { tx_hash, network, currency, amount, wallet_address, project_id } = json;

    // 获取项目钱包地址
    let project_wallet: string | undefined;

    try {
      // 使用已有的函数通过 project_id 获取项目信息
      const project = await getDonationProjectById(project_id);
      if (project && project.wallets) {
        project_wallet = project.wallets[network];
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
    const currencyConfig = BLOCKCHAIN_CONFIG.currencies[currency as keyof typeof BLOCKCHAIN_CONFIG.currencies];
    if (!currencyConfig) {
      return new Response(
        JSON.stringify({
          code: 1,
          message: `Unsupported currency: ${currency}`,
        }),
        { status: 400 },
      );
    }

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

    // 验证通过，保存到数据库
    const data = await fetchTidb<{ id: number }>('/donation', 'POST', json);
    return new Response(
      JSON.stringify({
        code: 0,
        data: data[0].id,
        validation: {
          verified: true,
          tx_details: validationResult.txDetails,
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
