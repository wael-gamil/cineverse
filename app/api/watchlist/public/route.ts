import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserWatchlist } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const status = searchParams.get('status') as 'TO_WATCH' | 'WATCHED';
  const page = Number(searchParams.get('page') || 0);
  const size = Number(searchParams.get('size') || 10);

  if (!username || !status) {
    return NextResponse.json(
      { message: 'Username and status are required' },
      { status: 400 }
    );
  }

  try {
    const watchlistData = await getPublicUserWatchlist(
      username,
      status,
      page,
      size
    );
    return NextResponse.json(watchlistData);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch user watchlist' },
      { status: 404 }
    );
  }
}
