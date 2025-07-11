import { getSearchResults } from '@/lib/api';
import SearchResult from './searchResult';

type Props = {
  query: string;
  page: number;
  type: '' | 'MOVIE' | 'SERIES';
};

export default async function SearchResultWrapper({
  query,
  page,
  type,
}: Props) {
  const { contents, totalPages, currentPage } = await getSearchResults(
    query,
    type,
    page
  );

  return (
    <SearchResult
      contents={contents}
      query={query}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
