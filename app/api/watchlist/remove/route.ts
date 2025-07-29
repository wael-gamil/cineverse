import { removeFromWatchlistByContentId } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function DELETE(req: NextRequest) {
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
    }

    await removeFromWatchlistByContentId(token, Number(contentId));

    // Revalidate watchlist pages to ensure fresh data on next SSR
    revalidatePath('/profile');

    return NextResponse.json({
      message: 'Removed from watchlist successfully',
    });
  } catch (error: any) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove from watchlist' },
      { status: 500 }
    );
  }
}
