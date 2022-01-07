import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

interface Image {
  url: string;
  title: string;
  description: string;
  ts: number;
  id: string;
}
interface GetImagesResponse {
  after: string;
  data: Image[];
}

export default function Home(): JSX.Element {

  const fetchPage = async ({ pageParam = null }): Promise<GetImagesResponse> => {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam
      }
    });
    if (response.status === 200) {
      return response.data;
    }
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    fetchPage,
    {
      getNextPageParam: (lastPage, allPages) => lastPage?.after || null,
    }
  );

  const formattedData = useMemo(() => {
    const formatted = data?.pages.flatMap(imageData => {
      return imageData?.data.flat();
    })
    return formatted;
  }, [data]);



  if (isLoading && !isError) {
    return <Loading />
  }

  if (!isLoading && isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage ? (
          <Button
            marginTop="40px"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}</Button>
        ) : null}
      </Box>
    </>
  );
}
