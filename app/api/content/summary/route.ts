import { getContentSummary } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get('id'));
  const contentType = url.searchParams.get('type');

  if (!id || !contentType) {
    return NextResponse.json(
      { error: 'Missing ID or content type' },
      { status: 400 }
    );
  }

  try {
    const summary = await getContentSummary(id, contentType as any);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content summary' },
      { status: 500 }
    );
  }
}
