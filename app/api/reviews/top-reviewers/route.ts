
import { getTopReviewers } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const reviewers = await getTopReviewers();
    return NextResponse.json({ reviewers });
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch top reviewers' },
      { status: 500 }
    );
  }
}
