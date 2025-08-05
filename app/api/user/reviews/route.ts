import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserReviews } from '@/lib/api';

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get('username') ?? '';
    const page = Number(searchParams.get('page')) || 0;
    const size = Number(searchParams.get('size')) || 10;

    const user = await getUserReviews(token, username, page, size);
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
