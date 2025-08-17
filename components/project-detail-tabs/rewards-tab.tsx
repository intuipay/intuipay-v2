import { ProjectInfo, RewardDraft } from "@/types";
import Reward from "@/components/reward";

interface RewardsTabProps {
  project: ProjectInfo;
  rewards: RewardDraft[];
}

export function RewardsTab({ project, rewards }: RewardsTabProps) {
  return (
    <div className="space-y-8">
      {rewards && rewards.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold text-gray-900">
            Available rewards
          </h2>
          <div className="flex flex-col gap-4">
            {rewards.map((reward) => (
              <div key={reward.id} id={`reward-${reward.id}`}>
                <Reward
                  projectName={project.project_name}
                  {...reward}
                />
              </div>
            ))}
          </div>
        </>
      ) : (
        <h3 className="text-center text-gray-500 py-4">No Rewards Available</h3>
      )}
    </div>
  );
}
