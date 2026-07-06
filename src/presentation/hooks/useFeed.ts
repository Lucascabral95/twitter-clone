import { useEffect } from 'react';
import useStore from '@/zustand';

export const useFeed = () => {
  const limit = useStore((s) => s.limit);
  const posteos = useStore((s) => s.posteos);
  const getAllTweets = useStore((s) => s.getAllTweets);
  const hasMoreTweets = useStore((s) => s.hasMoreTweets);
  const loadMoreTweets = useStore((s) => s.loadMoreTweets);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);

  useEffect(() => {
    getAllTweets();
  }, [getAllTweets, limit]);

  return { posteos, hasMore: hasMoreTweets, loadMore: loadMoreTweets, loading, error, retry: getAllTweets };
};
