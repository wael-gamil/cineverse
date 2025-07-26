// /app/api/watchlist/route.ts
import { getUserWatchlist } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const username = url.searchParams.get('username');
  const status = url.searchParams.get('status') as 'TO_WATCH' | 'WATCHED';
  const page = Number(url.searchParams.get('page') || 0);
  const size = Number(url.searchParams.get('size') || 10);

  if (!username || !status) {
    return NextResponse.json(
      { message: 'Missing username or status' },
      { status: 400 }
    );
  }

  try {
    const data = await getUserWatchlist(username, status, page, size);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch watchlist' },
      { status: 500 }
    );
  }
}
