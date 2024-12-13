"use client"
import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { motion } from 'motion/react';
import useStore from '@/zustand';
import { postearComentario } from '@/utils/functions/Posteos';
import Avvvatars from 'avvvatars-react';

interface PosteoProps {
    setIsOpenPosteo: React.Dispatch<React.SetStateAction<boolean>>;
    creador_id: number;
    email: string;
}

const Posteo: React.FC<PosteoProps> = ({ setIsOpenPosteo, creador_id, email }) => {
    const { addTweet } = useStore();
    const [titulo, setTitulo] = useState<number>(0);
    const [contenido, setContenido] = useState<number>(0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className='posteo'>
            <div className='contenedor-posteo'>
                <div className="close-pagina">
                    <div className="close-icon" onClick={() => setIsOpenPosteo(false)}>
                        <IoMdClose className="icon" />
                    </div>
                </div>
                <form onSubmit={(event) => postearComentario(event, new FormData(event.currentTarget), setIsOpenPosteo, addTweet, creador_id)} className="contenido-posteo">
                    <div className="contenido-input">
                        <input onChange={(e) => setTitulo(e.target.value.length)} maxLength={100} type="text" name='titulo' placeholder='Titulo' required />
                    </div>
                    <div className="texto-aclaratorio">
                        <p style={{ color: titulo === 100 ? "red" : "var(--color-letra-gris)" }}> {titulo}/100 </p>
                    </div>
                    <div className="imagen-contenido">
                        <div className="imagen">
                            <Avvvatars size={40} value={email} style="shape" />
                        </div>
                        <div className="contenido">
                            <textarea onChange={(e) => setContenido(e.target.value.length)} maxLength={250} name="contenido" placeholder="¿Qué está pasando?" required />
                        </div>
                    </div>
                    <div className="texto-aclaratorio">
                            <p style={{ color: contenido === 250 ? "red" : "var(--color-letra-gris)" }}> {contenido}/250 </p>
                        </div>
                    <div className="postear">
                        <div className="post">
                            <button type="submit"> Postear </button>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default Posteo;