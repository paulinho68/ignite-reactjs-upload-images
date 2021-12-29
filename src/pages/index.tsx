import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {

  const fetchPage = async (pageParam: number = null) => {
    try {
      const response = await api.get('/api/images');
      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      console.log(err);
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
    ({ pageParam = 1 }) => fetchPage(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        // console.log(lastPage, allPages)
        if (!lastPage.after) {
          return undefined;
        } else {
          return allPages.slice(0, 8)
        }
      }
      // getPreviousPageParam: (firstPage, allPages) => undefined,
    }
  );

  const formattedData = useMemo(() => {
    return data?.pages[0]?.data;
  }, [data]);


  if (!isLoading) {
    <Loading />
  }

  if (isError) {
    <Error />
  }


  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage ? (
          <Button
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}</Button>
        ) : null}
      </Box>
    </>
  );
}
