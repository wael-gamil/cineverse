import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { updateWatchlistStatus, removeFromWatchlist } from '@/lib/api';

export async function PUT(request: NextRequest) {
  const token = (await cookies()).get('token')?.value;
  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { watchlistId, status } = await request.json();
  if (!watchlistId || !status)
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });

  try {
    const result = await updateWatchlistStatus(token, watchlistId, status);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const token = (await cookies()).get('token')?.value;
  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

  try {
    await removeFromWatchlist(token, id);
    return NextResponse.json({
      message: 'Watchlist item deleted successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
