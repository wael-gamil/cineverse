// app/api/reviews/all/route.ts
import { getAllReviewsClient } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 0;
  const size = Number(searchParams.get('size')) || 10;
  const sortBy = searchParams.get('sortBy') || 'recent';

  try {
    // Extract token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // Use Client function with optional token for userReaction field
    const result = await getAllReviewsClient(page, size, sortBy, token);

    // Return the transformed data structure that the frontend expects
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch all reviews' },
      { status: 500 }
    );
  }
}
