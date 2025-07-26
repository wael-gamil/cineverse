import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/api';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json(
      { message: 'Missing OAuth token' },
      { status: 400 }
    );
  }
  console.log('OAuth token received:', token);
  try {
    const { username, email } = await getUserProfile(token);

    if (!token || !username || !email) {
      return NextResponse.json(
        { message: 'Missing token or user info' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      user: { username, email },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2,
      path: '/',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'OAuth failed' },
      { status: 500 }
    );
  }
}
