"use client"
import React from 'react'
import { IoMdClose } from "react-icons/io";

import BusquedaDeUsuarios from '../BusquedaDeUsuarios/BusquedaDeUsuarios';
import { IMisSeguidos } from '@/infrastructure/interfaces';
import './SeguidosSeguidores.scss'

interface ISeguidosSeguidoresProps {
    setIsOpenSeguidosSeguidores: React.Dispatch<React.SetStateAction<boolean>>
    misSeguidos: IMisSeguidos[]
}

const SeguidosSeguidores: React.FC<ISeguidosSeguidoresProps> = ({ setIsOpenSeguidosSeguidores, misSeguidos }) => {

    return (
        <div className='seguidos-seguidoress'>
            <div className='contenedor-seguidos-seguidores'>

                <div className="icono-close-seguidos-seguidores">
                    <div className="icono" onClick={() => setIsOpenSeguidosSeguidores(false)}>
                        <IoMdClose className="icon" />
                    </div>
                </div>

                <BusquedaDeUsuarios usuarios={misSeguidos} />

            </div>
        </div>
    )
}

export default SeguidosSeguidores