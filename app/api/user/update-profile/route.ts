
import { updateUserProfile } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  const cookie = await cookies();
  const token = cookie.get('token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  try {
    const data = await updateUserProfile(token, body);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
