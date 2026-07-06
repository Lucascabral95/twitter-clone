import { useEffect } from 'react';
import useStore from '@/zustand';

export const useFeed = () => {
  const limit = useStore((s) => s.limit);
  const posteos = useStore((s) => s.posteos);
  const getAllTweets = useStore((s) => s.getAllTweets);
  const hasMoreTweets = useStore((s) => s.hasMoreTweets);
  const loadMoreTweets = useStore((s) => s.loadMoreTweets);

  useEffect(() => {
    getAllTweets();
  }, [getAllTweets, limit]);

  return { posteos, hasMore: hasMoreTweets, loadMore: loadMoreTweets };
};
