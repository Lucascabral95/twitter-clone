"use client"
import React, { useEffect, useState } from 'react'
import "./BotonPosteoFlotante.scss"
import { FiEdit3 } from "react-icons/fi";
import { AnimatePresence } from 'motion/react';
import Posteo from '../Navbar/Posteo';
import useStore from '@/zustand';

const BotonPosteoFlotante = () => {
    const [isOpenPosteo, setIsOpenPosteo] = useState<boolean>(false);
    const getCookieLogueo = useStore((s) => s.getCookieLogueo);
    const datosLogueo = useStore((s) => s.datosLogueo);

    useEffect(() => {
        const getData = async () => {
            getCookieLogueo();
        }
        getData();
    }, [getCookieLogueo]);

    return (
        <div className='boton-posteo-flotante'>
            <button className='bot-posteo-flotante' onClick={() => setIsOpenPosteo(!isOpenPosteo)}>
                <FiEdit3 className='icon' />
            </button>

            <AnimatePresence>
                {isOpenPosteo && <Posteo email={String(datosLogueo?.email)} setIsOpenPosteo={setIsOpenPosteo} />}
            </AnimatePresence>

        </div>
    )
}

export default BotonPosteoFlotante
