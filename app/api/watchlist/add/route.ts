import { cookies } from 'next/headers';
import { addToWatchlist } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const { contentId } = await req.json();
  if (!contentId)
    return NextResponse.json({ message: 'Missing contentId' }, { status: 400 });

  try {
    const result = await addToWatchlist(token, contentId);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
