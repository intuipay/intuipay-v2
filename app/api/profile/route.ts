import { fetchTidb } from '@/services/fetch-tidb';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  try {
    const res = await fetchTidb(`/dash/my_profile?user_id=${userId}`, 'GET');
    return NextResponse.json({ code: 0, data: res });
  } catch (e) {
    return NextResponse.json({
      code: 1,
      message: 'Failed to get profile'
    });
  }
}

export async function POST(req: Request) {
  const headersList = await headers();
  const userId = headersList.get('x-user-id') ?? '';

  const params = await req.json() as Record<string, any>;
  const { location, timezone, bio, social_links, number, first_name, last_name, display_image, privacy_level } = params;

  console.log('Updating profile for user:', userId, location, timezone, bio, social_links, number, first_name, last_name, display_image);
  try {
    const res = await fetchTidb('/dash/my_profile', 'POST', {
      user_id: userId,
      location,
      timezone,
      bio,
      social_links,
      number,
      first_name,
      last_name,
      display_image,
      privacy_level,
    });
    return NextResponse.json({ code: 0, data: res });
  } catch (e) {
    return NextResponse.json({
      code: 1,
      message: 'Failed to submit profile',
    });
  }
}
