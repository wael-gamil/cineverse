import { Review } from '@/constants/types/movie';
import { getContentReviewsClient } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return new Response('Missing id', { status: 400 });

  try {
    // Extract token from cookies for authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // Use Client function with optional token for userReaction field
    const data: Review[] = await getContentReviewsClient(Number(id), token);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content reviews' },
      { status: 500 }
    );
  }
}
