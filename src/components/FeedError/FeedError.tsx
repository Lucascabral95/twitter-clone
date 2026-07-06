import React from 'react';
import './FeedError.scss';

interface FeedErrorProps {
    mensaje?: string;
    onRetry: () => void;
}

const FeedError: React.FC<FeedErrorProps> = ({ mensaje = 'No pudimos cargar el feed.', onRetry }) => {
    return (
        <div className="feed-error" role="alert">
            <p>{mensaje}</p>
            <button type="button" className="boton-reintentar" onClick={onRetry}>
                Reintentar
            </button>
        </div>
    );
};

export default FeedError;
