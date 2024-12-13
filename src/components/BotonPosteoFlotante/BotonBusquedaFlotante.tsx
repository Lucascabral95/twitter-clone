"use client"
import React from 'react'
import "./BotonPosteoFlotante.scss"
import { HiMagnifyingGlass } from "react-icons/hi2";
import Link from 'next/link';

const BotonBusquedaFlotante = () => {

    return (
        <div className='boton-busqueda-flotante'>
            <Link href="/feed/search" className='bot-busqueda-flotante'>
                <HiMagnifyingGlass className='icon' />
            </Link>
        </div>
    )
}

export default BotonBusquedaFlotante;