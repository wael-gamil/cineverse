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
    const user = await getUserReviews(
      token,
      req.nextUrl.searchParams.get('username') ?? ''
    );
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
