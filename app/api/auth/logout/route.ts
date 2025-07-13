import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { logoutUser } from '@/lib/api';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'No token found' }, { status: 401 });
  }

  try {
    await logoutUser(token);

    const res = NextResponse.json({ message: 'Logout successful' });

    res.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
      path: '/',
    });

    return res;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
