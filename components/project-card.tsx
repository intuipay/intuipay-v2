'use client';

import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectInfo } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectStatus } from '@/data/project';
import { Button } from '@/components/ui/button';
import { RefundDialog } from '@/components/refund-dialog';
import { useState } from 'react';
import { BLOCKCHAIN_CONFIG } from "@/config/blockchain";
import { formatUnits } from 'viem';

type ProjectCardProps = {
  project: ProjectInfo;
  // 用户是否已退款（undefined表示非用户backed项目）
  isRefunded?: boolean;
}

export function ProjectCard({ project, isRefunded }: ProjectCardProps) {
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);

  const progress = project.goal_amount > 0
    ? Math.round(project.amount / project.goal_amount * 1000) / 10 : 0;
  const daysLeft = Math.ceil((new Date(project.end_at).getTime() - Date.now()) / 1000 / 60 / 60 / 24);

  // 判断项目是否失败
  const isProjectFailed = Number(project.status) === Number(ProjectStatus.Failed);

  const parseTokenId = () => {
    const tokens = project.tokens ? JSON.parse(project.tokens) : {};
    const networks = project.networks ? JSON.parse(project.networks) : [];
    const tokenId = tokens[networks[0]] ?? 'usdc';
    return tokenId;
  }

  const parseContractAddress = () => {
    const wallets = project.wallets ? JSON.parse(project.wallets) : {};
    const networks = project.networks ? JSON.parse(project.networks) : [];
    const contractAddress = wallets[networks[0]] ?? '';
    return contractAddress;
  }
  const projectTokenId = parseTokenId();
  const selectedCurrency = projectTokenId
    ? BLOCKCHAIN_CONFIG.currencies[
    projectTokenId as keyof typeof BLOCKCHAIN_CONFIG.currencies
    ]
    : undefined;

  // 货币符号
  const currencySymbol = selectedCurrency?.symbol ?? "USDC";
  const projectAmountInCrypto = formatUnits(BigInt(project.amount), selectedCurrency?.decimals ?? 6);
  const currentContractAddress = parseContractAddress();

  // 判断是否为backed状态（传入了isRefunded参数）
  const isBackedView = isRefunded !== undefined;

  return (
    <Card className="group overflow-hidden flex flex-col border-transparent hover:border-action-blue/50 transition rounded-lg h-101 drop-shadow-custom1 hover:shadow-lg duration-800">
      <Link
        href={`/project/${project.project_slug}`}
        className="block"
      >
        <div className="relative w-full h-53 group-hover:h-40 transition-all duration-800">
          <Image
            src={project.banner || '/images/placeholder.svg'}
            alt={project.project_name}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
      </Link>
      <Link
        href={`/project/${project.project_slug}`}
        className="block"
      >
        <CardHeader className="min-h-20">
          <CardTitle className="text-lg text-neutral-text">{project.project_name}</CardTitle>
          <p className="text-base text-black/70 text-neutral-darkgray mt-1 line-clamp-1 group-hover:line-clamp-2">{project.project_subtitle}</p>
        </CardHeader>
      </Link>
        <CardContent>
          <div className="flex items-center text-xs gap-2">
            <Avatar className="size-8">
              <AvatarImage src={project.org_logo} alt={project.org_name} />
              <AvatarFallback>{project?.org_name?.charAt(0) || ''}</AvatarFallback>
            </Avatar>
            <span>{project.org_name}</span>
          </div>
        </CardContent>
        <div className='w-auto h-px mx-5 bg-line-gray'></div>
        <CardFooter className="whitespace-nowrap overflow-hidden flex-grow group-hover:pb-0">
          {isProjectFailed ? (
            // 失败项目的UI
            <>
              <div className="flex justify-between items-center bg-white mb-2">
                <div className="border border-[#ff8a70] rounded px-2 py-1">
                  <span className="text-[#ff593d] text-xs font-medium">Goal Failed</span>
                </div>
                {isBackedView && (
                  isRefunded ? (
                    // 已退款状态
                    <span className="text-sm text-black/60 font-medium">
                      Refunded
                    </span>
                  ) : (
                    // 可以退款状态 - 使用钱包连接对话框
                    <>
                      <Button
                        className="bg-[#2461f2] hover:bg-[#1a4cc7] text-white text-sm px-4 py-1 h-auto"
                        onClick={() => setIsWalletDialogOpen(true)}
                      >
                        Withdraw my pledge
                      </Button>
                      <RefundDialog
                        open={isWalletDialogOpen}
                        onOpenChange={setIsWalletDialogOpen}
                        projectId={project.id}
                        campaignId={project.campaign_id}
                        contractAddress={currentContractAddress}
                      />
                    </>
                  )
                )}
              </div>
              <p className="group-hover:block absolute bottom-4 text-sm text-black mt-4 hidden opacity-0 group-hover:opacity-60 transition-opacity">Ended • {progress}% funded</p>
            </>
          ) : (
            // 正常项目的UI
            <>
              <div className="flex justify-between items-center bg-white">
                <span className="text-xs text-neutral-darkgray">Total Raised</span>
                <span className="text-base font-bold text-neutral-text text-ellipsis">
                  {projectAmountInCrypto} {currencySymbol}
                </span>
              </div>
              <p className="group-hover:block absolute bottom-4 text-sm text-black mt-4 hidden opacity-0 group-hover:opacity-60 transition-opacity">{daysLeft} days left • {progress}% founded</p>
            </>
          )}
        </CardFooter>
      </Card>
    );
  }
