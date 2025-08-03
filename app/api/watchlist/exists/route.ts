import { checkWatchlistExists } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const contentId = searchParams.get('contentId');

  if (!contentId) {
    return NextResponse.json(
      { error: 'Content ID is required' },
      { status: 400 }
    );
  }

  try {
    // Extract token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }    const watchlistId = await checkWatchlistExists(token, Number(contentId));

    return NextResponse.json({ watchlistId });
  } catch (error: any) {
    console.error('Error checking watchlist existence:', error);
    return NextResponse.json(
      { error: 'Failed to check watchlist existence' },
      { status: 500 }
    );
  }
}
