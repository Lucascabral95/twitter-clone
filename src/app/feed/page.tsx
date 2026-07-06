'use client';

import React from 'react';
import CardTweet from '@/components/EstructuraMain/CardTweet';
import PosteoFeed from '@/components/PosteoFeed/PosteoFeed';
import { useFeed } from '@/presentation/hooks';
import './Feed.scss';

const Feed: React.FC = () => {
  const { posteos, hasMore, loadMore } = useFeed();

  return (
    <div className="feed" style={{ marginTop: '46px' }}>
      <div className="contenedor-feed">
        <PosteoFeed />
        <CardTweet posteos={posteos} hasMore={hasMore} onLoadMore={loadMore} />
      </div>
    </div>
  );
};

export default Feed;
