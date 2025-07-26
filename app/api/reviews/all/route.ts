// app/api/reviews/all/route.ts
import { getAllReviews } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page')) || 0;
  const size = Number(searchParams.get('size')) || 10;

  try {
    const result = await getAllReviews(page, size);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch all reviews' },
      { status: 500 }
    );
  }
}
