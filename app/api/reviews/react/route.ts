import { reactToReview } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function PUT(req: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { reviewId, type } = await req.json();

  if (!reviewId || !['LIKE', 'DISLIKE', 'UNDO'].includes(type)) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  try {
    const result = await reactToReview(token, reviewId, type);

    // Revalidate the reviews page to ensure fresh data on next SSR
    revalidatePath('/reviews');

    // Also revalidate content pages that might contain this review
    // This covers movie, series, and other content detail pages
    revalidatePath('/[slug]', 'page');

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
