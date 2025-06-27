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
      // 继续处理，但不验证项目钱包地址
    }

    // 执行交易验证
    const validationResult = await validateDonationTransaction(network, tx_hash, {
      amount: amount,
      currency: currency,
      wallet_address: wallet_address,
      project_wallet: project_wallet,
    });

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
