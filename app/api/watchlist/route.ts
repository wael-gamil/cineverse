// /app/api/watchlist/route.ts
import { getUserWatchlist, getUserWatchlistSSR } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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

export async function POST(req: NextRequest) {
  try {
    const cookie = await cookies();
    const token = cookie.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { status, page = 0, size = 20 } = await req.json();

    if (!status || !['TO_WATCH', 'WATCHED'].includes(status)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const result = await getUserWatchlistSSR(token, status, page, size);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
