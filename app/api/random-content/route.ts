import { Content } from '@/constants/types/movie';
import { getContents } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const type = Math.random() < 0.5 ? 'MOVIE' : 'SERIES';

    const firstPage = await getContents(type, {}, 0, 24);

    if (
      !firstPage ||
      firstPage.totalPages === 0 ||
      firstPage.content.length === 0
    ) {
      return NextResponse.json({ error: 'No content found' }, { status: 404 });
    }

    const randomPage = Math.floor(
      Math.random() * Math.min(firstPage.totalPages, 50)
    ); 

    const randomPageData =
      randomPage === 0
        ? firstPage
        : await getContents(type, {}, randomPage, 24);

    if (randomPageData.content.length === 0) {
      return NextResponse.json({ error: 'Empty random page' }, { status: 404 });
    }

    const randomIndex = Math.floor(
      Math.random() * randomPageData.content.length
    );
    const randomContent: Content = randomPageData.content[randomIndex];

    return NextResponse.json(randomContent);
  } catch (error) {
    console.error('Random content API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
