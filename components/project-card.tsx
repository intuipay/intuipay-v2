import Image from 'next/image'
import Link from 'next/link' // Import Link
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ProjectInfo } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectStatus, DonationStatus } from '@/data/project';
import { Button } from '@/components/ui/button';

type ProjectCardProps = {
  project: ProjectInfo;
  // 退款回调函数
  onWithdrawPledge?: (projectId: number) => void;
  // 用户是否已退款（undefined表示非用户backed项目）
  isRefunded?: boolean;
}

export function ProjectCard({ project, onWithdrawPledge, isRefunded }: ProjectCardProps) {
  const progress = project.goal_amount > 0
    ? Math.round(project.amount / project.goal_amount * 1000) / 10 : 0;
  const daysLeft = Math.ceil((new Date(project.end_at).getTime() - Date.now()) / 1000 / 60 / 60 / 24);

  // 判断项目是否失败
  const isProjectFailed = project.status === ProjectStatus.PaymentFailed || 
                         project.status === ProjectStatus.Cancelled ||
                         project.status === ProjectStatus.Suspended ||
                         (daysLeft <= 0 && progress < 100);

  // 判断是否为backed状态（传入了isRefunded参数）
  const isBackedView = isRefunded !== undefined;

  // 处理退款按钮点击
  const handleWithdrawClick = (e: React.MouseEvent) => {
    e.preventDefault(); // 防止Link导航
    e.stopPropagation();
    if (onWithdrawPledge) {
      onWithdrawPledge(project.id);
    }
  };

  return (
    <Link
      href={`/project/${project.project_slug}`}
      className="block hover:shadow-lg transition-shadow duration-800 rounded-lg h-101 drop-shadow-custom1"
    >
      <Card className="group overflow-hidden flex flex-col h-full border-transparent hover:border-action-blue/50 transition-colors">
        <div className="relative w-full h-53 group-hover:h-40 transition-all duration-800">
          <Image
            src={project.banner || '/images/placeholder.svg'}
            alt={project.project_name}
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
        <CardHeader className="min-h-20">
          <CardTitle className="text-lg text-neutral-text">{project.project_name}</CardTitle>
          <p className="text-base text-black/70 text-neutral-darkgray mt-1 line-clamp-1 group-hover:line-clamp-2">{project.project_subtitle}</p>
        </CardHeader>
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
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="border border-[#ff8a70] rounded px-2 py-1">
                    <span className="text-[#ff593d] text-sm font-medium">Goal Failed</span>
                  </div>
                </div>
                <div className="flex items-center">
                  {isBackedView && (
                    isRefunded ? (
                      // 已退款状态
                      <span className="text-sm text-black/60 font-medium">
                        The funds returned to my wallet
                      </span>
                    ) : (
                      // 可以退款状态
                      <Button 
                        onClick={handleWithdrawClick}
                        className="bg-[#2461f2] hover:bg-[#1a4cc7] text-white text-sm px-4 py-1 h-auto"
                      >
                        Withdraw my pledge
                      </Button>
                    )
                  )}
                </div>
              </div>
              {/* Hover状态下显示的"Ended"信息 */}
              <p className="group-hover:block hidden text-sm text-black/60 mt-4 font-medium">
                Ended • {progress}% funded
              </p>
            </div>
          ) : (
            // 正常项目的UI
            <>
              <div className="flex justify-between items-center bg-white">
                <span className="text-xs text-neutral-darkgray">Total Raised</span>
                <span className="text-base font-bold text-neutral-text text-ellipsis">
                  $ {(project.goal_amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <p className="group-hover:block absolute bottom-4 text-sm text-black mt-4 hidden opacity-0 group-hover:opacity-60 transition-opacity">{daysLeft} days left • {progress}% founded</p>
            </>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
