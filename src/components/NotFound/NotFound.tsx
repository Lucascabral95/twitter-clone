import React from 'react'
import Image from "next/image";

import "./NotFound.scss";

interface NotFoundProps {
    error: string
}

const NotFound: React.FC<NotFoundProps> = ({ error }) => {
    return (
        <div className="not-found">
            <div className="contenedor-not-found">
                <div className="texto-error">
                    <p> {error} </p>
                </div>
                <div className="imagen-error">
                    <Image src={"/img/cat-wait.webp"} alt="Not Found" className='imagen' width={160} height={160} />
                </div>
            </div>
        </div>
    )
}

export default NotFound