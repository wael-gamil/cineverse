import { resetPassword } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { token, newPassword } = body;

  if (!token || !newPassword) {
    return NextResponse.json(
      { message: 'Token and new password are required' },
      { status: 400 }
    );
  }

  try {
    const result = await resetPassword(token, newPassword);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
