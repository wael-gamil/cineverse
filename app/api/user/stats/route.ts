import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserStats } from '@/lib/api';

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
    const stats = await getPublicUserStats(username);
    return NextResponse.json({ stats });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch user stats' },
      { status: 404 }
    );
  }
}
