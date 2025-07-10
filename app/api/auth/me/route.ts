import { getCurrentUser } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookie = await cookies();
  const token = cookie.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await getCurrentUser(token);
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
