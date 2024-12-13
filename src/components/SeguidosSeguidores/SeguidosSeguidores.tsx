"use client"
import React from 'react'
import './SeguidosSeguidores.scss'
import { IoMdClose } from "react-icons/io";
import BusquedaDeUsuarios from '../BusquedaDeUsuarios/BusquedaDeUsuarios';

interface IMisSeguidos {
    email: string;
    fecha_creacion: string;
    id: number;
    id_a_seguir: number;
    id_mio: number;
    id_seguimiento: number;
    identificador: string;
    nombre: string;
}

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