'use client';

import React from 'react';
import CardTweet from '@/components/EstructuraMain/CardTweet';
import PosteoFeed from '@/components/PosteoFeed/PosteoFeed';
import SkeletonTweet from '@/components/Skeleton/SkeletonTweet';
import FeedError from '@/components/FeedError/FeedError';
import { useFeed } from '@/presentation/hooks';
import './Feed.scss';

const Feed: React.FC = () => {
  const { posteos, hasMore, loadMore, loading, error, retry } = useFeed();

  return (
    <div className="feed" style={{ marginTop: '46px' }}>
      <div className="contenedor-feed">
        <PosteoFeed />
        {error && posteos.length === 0 ? (
          <FeedError onRetry={retry} />
        ) : loading && posteos.length === 0 ? (
          <SkeletonTweet />
        ) : (
          <CardTweet posteos={posteos} hasMore={hasMore} onLoadMore={loadMore} />
        )}
      </div>
    </div>
  );
};

export default Feed;
