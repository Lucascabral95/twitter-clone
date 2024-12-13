import React from 'react'
import "./ListaBusqueda.scss"
import { HiMagnifyingGlass } from "react-icons/hi2";
import Avvvatars from 'avvvatars-react';
import Link from 'next/link';
import { motion } from 'motion/react';

interface Usuario {
    id: number;
    email: string;
    nombre: string;
}

interface ListaProps {
    datos: Usuario[];
    palabra: string;
    cerrarBusqueda: () => void
}

const ListaBusqueda: React.FC<ListaProps> = ({ datos, palabra, cerrarBusqueda }) => {

    return (
        <motion.div
            initial={{ transform: 'translateY(-10px)' }}
            animate={{ transform: 'translateY(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className='lista-busqueda'>
            <div className='contenedor-lista-busqueda'>

                <div className="busqueda">
                    <div className="icono">
                        <HiMagnifyingGlass className='icon' />
                    </div>
                    <div className="texto">
                        <p> {palabra} </p>
                    </div>
                </div>

                <div className="contenedor-de-posteos-personas-buscadas">
                    {datos?.slice(0, 5).map((item: Usuario, index: number) => (
                        <Link href={`/home/user/${item?.id}`} className="usuario" key={index} onClick={cerrarBusqueda}>
                            <div className="imagen-usuario">
                                <Avvvatars value={item?.email} size={40} style="shape" />
                            </div>
                            <div className="nombre-email">
                                <div className="nombre-nombre">
                                    <p> {item?.nombre} </p>
                                </div>
                                <div className="email">
                                    <p> {item?.email} </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </motion.div>
    )
}

export default ListaBusqueda;