import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserProfile } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json(
      { message: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const userProfile = await getPublicUserProfile(username);
    return NextResponse.json({ user: userProfile });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch user profile' },
      { status: 404 }
    );
  }
}
