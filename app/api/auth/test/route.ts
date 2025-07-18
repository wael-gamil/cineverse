import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ message: 'Missing code' }, { status: 400 });
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!backendUrl) {
      return NextResponse.json(
        { message: 'Missing backend URL' },
        { status: 500 }
      );
    }

    const backendRes = await fetch(
      `${backendUrl}/oauth2/code/google?code=${code}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const text = await backendRes.text();
    let result;
    try {
      result = text ? JSON.parse(text) : {};
    } catch (err) {
      return NextResponse.json(
        { message: 'Invalid JSON from backend', raw: text },
        { status: 500 }
      );
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          message: result.message || 'Backend error',
          status: backendRes.status,
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({ message: 'Success', result });
  } catch (err: any) {
    return NextResponse.json(
      { message: 'Error', error: err.message },
      { status: 500 }
    );
  }
}
