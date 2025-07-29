import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteUserReview, updateUserReview } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export async function DELETE(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ message: 'Missing ID' }, { status: 400 });

  try {
    await deleteUserReview(token, id);

    // Revalidate the reviews page after deletion
    revalidatePath('/reviews');

    // Also revalidate content pages that might contain this review
    revalidatePath('/[slug]', 'page');

    return NextResponse.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token)
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  try {
    const result = await updateUserReview(token, body);

    // Revalidate the reviews page after update
    revalidatePath('/reviews');

    // Also revalidate content pages that might contain this review
    revalidatePath('/[slug]', 'page');

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update review' },
      { status: 500 }
    );
  }
}
