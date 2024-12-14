"use client"
import React from 'react'
import "./BotonPosteoFlotante.scss"
import { RiLogoutBoxLine } from "react-icons/ri";
import Link from 'next/link';
import axios from 'axios';

const BotonLogoutFlotante = () => {

    const cerrarSession = async() => {
        try {
            const logout = await axios.get('/api/auth/logout');

            if(logout.status === 200) {
                window.location.href = "/";
            }

        } catch {
            console.log(`Error al cerrar session`);
        }
    }

    return (
        <div className='boton-logout-flotante'>
            <Link href="/feed/search" className='bot-logout-flotante' onClick={cerrarSession}>
                <RiLogoutBoxLine className='icon' />
            </Link>
        </div>
    )
}

export default BotonLogoutFlotante;