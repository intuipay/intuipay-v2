import ProfilePage from '@/app/_components/profile/profile-page';
import { getProfile, getMyBacked, getMyProjects, getMyOrg } from '@/lib/data';

export default async function Page() {
  const profile = await getProfile('jXqDtVMvNv1vf81izMoLabAkoOlQX5P1');
  console.log('my profile', profile);

  const myBacked = await getMyBacked('0x7e727520B29773e7F23a8665649197aAf064CeF1');
  console.log('my backed projects', myBacked);

  const myOrg = await getMyOrg('jXqDtVMvNv1vf81izMoLabAkoOlQX5P1');
  console.log('my organization', myOrg);

  const projectsParams = new URLSearchParams();
  projectsParams.set("is_widget", "1");
  projectsParams.set("start", "0");
  projectsParams.set("pagesize", "100");
  projectsParams.set("user_id", 'jXqDtVMvNv1vf81izMoLabAkoOlQX5P1');
  projectsParams.set("status", '10');
  if (myOrg?.id) {
    projectsParams.set("org_id", myOrg.id.toString());
  }
  const myProjects = await getMyProjects(projectsParams);
  console.log('my projects', myProjects);
  
  // 确保数据格式正确
  const backedProjects = Array.isArray(myBacked) ? myBacked : (myBacked ? [myBacked] : []);
  const raisedProjects = Array.isArray(myProjects) ? myProjects : (myProjects ? [myProjects] : []);
  
  return <ProfilePage profile={profile} myBacked={backedProjects} myProjects={raisedProjects} />;
}
