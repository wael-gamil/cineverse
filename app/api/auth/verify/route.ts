import { NextRequest, NextResponse } from 'next/server';
import { verifyEmail } from '@/lib/api';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ message: 'Token is missing' }, { status: 400 });
  }

  try {
    const result = await verifyEmail(token);
    return NextResponse.json({
      message: result.message || 'Email verified successfully',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
