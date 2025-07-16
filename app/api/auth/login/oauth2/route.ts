import { NextRequest, NextResponse } from 'next/server';
import { loginWithGoogleCode } from '@/lib/api';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { message: 'Missing OAuth code' },
      { status: 400 }
    );
  }

  try {
    const { token, username, email } = await loginWithGoogleCode(code);

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
      maxAge: 60 * 60 * 24 * 7,
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
