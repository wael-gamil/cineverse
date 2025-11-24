import { getContentDetails } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { error: 'Missing slug parameter' },
      { status: 400 }
    );
  }

  try {
    const contentDetails = await getContentDetails(slug);

    if (!contentDetails) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(contentDetails);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content details' },
      { status: 500 }
    );
  }
}
