import { registerUser } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, username } = body;

  if (!email || !password || !username) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  try {
    const result = await registerUser(email, password, username);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
