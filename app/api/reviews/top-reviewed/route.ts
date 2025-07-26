import { NextResponse } from 'next/server';
import { getTopReviewedContent } from '@/lib/api';

export async function GET() {
  try {
    const topContent = await getTopReviewedContent();
    return NextResponse.json({ topContent });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch top reviewed content' },
      { status: 500 }
    );
  }
}
