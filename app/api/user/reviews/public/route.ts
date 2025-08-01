import { NextRequest, NextResponse } from 'next/server';
import { getPublicUserReviews } from '@/lib/api';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const page = Number(searchParams.get('page') || 0);
  const size = Number(searchParams.get('size') || 10);

  if (!username) {
    return NextResponse.json(
      { message: 'Username is required' },
      { status: 400 }
    );
  }

  try {
    const reviewsData = await getPublicUserReviews(username, page, size);
    return NextResponse.json(reviewsData);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch user reviews' },
      { status: 404 }
    );
  }
}
