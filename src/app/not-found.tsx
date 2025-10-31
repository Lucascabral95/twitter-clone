import React from 'react'

import NotFound from '@/components/NotFound/NotFound';
import "./App.scss";

const NotFoundPage: React.FC = () => {
    return (
        <div className='not-found-original'>
            <div className='contenedor-not-found'>

                <NotFound error="404 Not Found" />

            </div>
        </div>
    )
}

export default NotFoundPage;