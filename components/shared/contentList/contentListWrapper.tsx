import ContentList from './contentList';
import { getContents } from '@/lib/api';
type Filters = {
  genres: string[];
  year: string;
  rate: string;
  lang: string;
  sortBy?: string;
  order?: string;
};

type Props = {
  filters: Filters;
  page: number;
  type: 'MOVIE' | 'SERIES';
};

export default async function ContentListWrapper({
  filters,
  page,
  type,
}: Props) {
  const { content, totalPages, currentPage } = await getContents(
    type,
    filters,
    page
  );

  return (
    <ContentList
      content={content}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
