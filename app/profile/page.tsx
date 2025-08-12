import ProfilePage from '@/app/_components/profile/profile-page';
import { getProfile, getMyBacked, getMyProjects, getMyOrg } from '@/lib/data';
import { Web3Provider } from '@/components/providers/web3-provider';
import { headers } from 'next/headers';
import { auth } from "@/lib/auth";

export const runtime = 'edge';

export default async function Page() {
  // 获取当前用户会话，从 header里取，或者从session拿都可以
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });
  // const userId = session?.user?.id ?? '';
  const userId = 'jXqDtVMvNv1vf81izMoLabAkoOlQX5P1';
  // console.log("session in profile page", session);

  const profile = await getProfile(userId);
  console.log('my profile', profile);

  const myBacked = await getMyBacked(userId);
  console.log('my backed projects', myBacked);

  const myOrg = await getMyOrg(userId);
  console.log('my organization', myOrg);

  const projectsParams = new URLSearchParams();
  projectsParams.set("is_widget", "1");
  projectsParams.set("start", "0");
  projectsParams.set("pagesize", "100");
  projectsParams.set("user_id", userId);
  projectsParams.set("status", '10');
  if (myOrg?.id) {
    projectsParams.set("org_id", myOrg.id.toString());
  }
  const myProjects = await getMyProjects(projectsParams);
  console.log('my projects', myProjects);
  
  return (
    <Web3Provider>
      <ProfilePage profile={profile} myBacked={myBacked} myProjects={myProjects} />
    </Web3Provider>
  )
}
