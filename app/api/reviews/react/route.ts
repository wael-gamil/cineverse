import { reactToReview } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { reviewId, type } = await req.json();

  if (!reviewId || !['LIKE', 'DISLIKE'].includes(type)) {
    return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
  }

  try {
    const result = await reactToReview(token, reviewId, type);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
