import React from 'react';
import './SkeletonTweet.scss';

interface SkeletonTweetProps {
    count?: number;
}

const SkeletonTweetItem: React.FC = () => (
    <div className="skeleton-card-tweet" aria-hidden="true">
        <div className="skeleton-foto-card" />
        <div className="skeleton-contenido-card">
            <div className="skeleton-nombre-fecha">
                <div className="skeleton-bar skeleton-nombre" />
                <div className="skeleton-bar skeleton-fecha" />
            </div>
            <div className="skeleton-bar skeleton-titulo" />
            <div className="skeleton-bar skeleton-contenido" />
            <div className="skeleton-bar skeleton-like" />
        </div>
    </div>
);

const SkeletonTweet: React.FC<SkeletonTweetProps> = ({ count = 3 }) => {
    return (
        <div className="skeleton-card-tweet-lista" role="status" aria-label="Cargando publicaciones">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonTweetItem key={index} />
            ))}
        </div>
    );
};

export default SkeletonTweet;
