import { loginUser } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  try {
    const result = await loginUser(username, password);
    const { token, ...userData } = result.data;

    if (!token) {
      return NextResponse.json(
        { message: 'No token returned' },
        { status: 500 }
      );
    }

    // 🍪 Set JWT as HTTP-only cookie
    const res = NextResponse.json({
      message: 'Login successful',
      user: {
        username: userData.username,
        email: userData.email,
      },
    });

    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      path: '/',
    });

    return res;
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 401 });
  }
}
