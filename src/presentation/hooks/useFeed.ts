import { useEffect } from 'react';
import useStore from '@/zustand';

export const useFeed = () => {
  const { limit, posteos, getAllTweets } = useStore();

  useEffect(() => {
    getAllTweets();
  }, [getAllTweets, limit]);

  return { posteos };
};
