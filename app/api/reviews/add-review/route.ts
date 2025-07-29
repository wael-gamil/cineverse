import { postUserReview } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const result = await postUserReview(token, body);

    // Revalidate the reviews page to show the new review
    revalidatePath('/reviews');

    // Also revalidate content pages that might contain this review
    // This covers movie, series, and other content detail pages
    revalidatePath('/[slug]', 'page');

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
