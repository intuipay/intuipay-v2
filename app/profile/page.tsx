import ProfilePage from '@/app/_components/profile/profile-page';
import { getProfile, getMyBacked, getMyProjects, getMyOrg } from '@/lib/data';
import { Web3Provider } from '@/components/providers/web3-provider';
import { headers } from 'next/headers';

export const runtime = 'edge';

export default async function Page() {
  // 获取当前用户会话，从 header里取，或者从session拿都可以
  const headersList = await headers();
  const userId = headersList.get('x-user-id') || '';
  console.log('Current user ID:', userId);

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
  
  // 确保数据格式正确
  const backedProjects = Array.isArray(myBacked) ? myBacked : (myBacked ? [myBacked] : []);
  const raisedProjects = Array.isArray(myProjects) ? myProjects : (myProjects ? [myProjects] : []);
  
  return (
    <Web3Provider>
      <ProfilePage profile={profile} myBacked={backedProjects} myProjects={raisedProjects} />
    </Web3Provider>
  )
}
