"use client"
import React, { useEffect } from 'react'
import "./Feed.scss"
import CardTweet from '@/components/EstructuraMain/CardTweet'
import useStore from '@/zustand'
import PosteoFeed from '@/components/PosteoFeed/PosteoFeed'

const Feed: React.FC = () => {
    const { limit, posteos, getAllTweets } = useStore();

    useEffect(() => {
        getAllTweets();
    }, [getAllTweets, limit])

    return (
        <div className='feed' style={{ marginTop: "46px" }}>
            <div className='contenedor-feed'>

                <PosteoFeed />

                <CardTweet posteos={posteos} />

            </div>
        </div>
    )
}

export default Feed