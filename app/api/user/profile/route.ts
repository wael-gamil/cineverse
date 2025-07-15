import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/api';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await getUserProfile(token);
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
