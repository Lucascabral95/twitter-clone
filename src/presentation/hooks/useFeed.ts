import { useEffect } from 'react';
import useStore from '@/zustand';

export const useFeed = () => {
  const { limit, posteos, getAllTweets, hasMoreTweets, loadMoreTweets } = useStore();

  useEffect(() => {
    getAllTweets();
  }, [getAllTweets, limit]);

  return { posteos, hasMore: hasMoreTweets, loadMore: loadMoreTweets };
};
