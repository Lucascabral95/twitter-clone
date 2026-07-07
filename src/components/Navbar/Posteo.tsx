"use client"
import React, { useRef, useState } from 'react'
import { IoMdClose, IoMdImage } from "react-icons/io";
import { motion } from 'motion/react';
import Image from 'next/image';
import useStore from '@/zustand';
import { postearComentario } from '@/utils/functions/Posteos';
import { useImageUpload } from '@/presentation/hooks/useImageUpload';
import { cloudinaryLoader } from '@/lib/cloudinaryLoader';
import Avvvatars from 'avvvatars-react';

interface PosteoProps {
    setIsOpenPosteo: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
}

const Posteo: React.FC<PosteoProps> = ({ setIsOpenPosteo, email }) => {
    const addTweet = useStore((s) => s.addTweet);
    const [titulo, setTitulo] = useState<number>(0);
    const [contenido, setContenido] = useState<number>(0);
    const [enviando, setEnviando] = useState<boolean>(false);
    const { preview, subiendo, progreso, error, seleccionarImagen, subir, limpiar } = useImageUpload();
    const inputImagenRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        setEnviando(true);

        const imagen = preview ? await subir() : null;

        if (preview && !imagen) {
            setEnviando(false);
            return;
        }

        await postearComentario(event, new FormData(form), setIsOpenPosteo, addTweet, imagen);
        setEnviando(false);
    };

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
                <form onSubmit={handleSubmit} className="contenido-posteo">
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

                    {preview && (
                        <div className="preview-imagen-posteo">
                            <Image loader={cloudinaryLoader} src={preview} alt="" width={500} height={300} unoptimized={!preview.startsWith('http')} />
                            <button type="button" className="quitar-imagen" aria-label="Quitar imagen" onClick={limpiar} disabled={subiendo}>
                                <IoMdClose className="icon" />
                            </button>
                            {subiendo && (
                                <div className="barra-progreso-imagen">
                                    <div className="barra-progreso-imagen-relleno" style={{ width: `${progreso}%` }} />
                                </div>
                            )}
                        </div>
                    )}

                    {error && <p className="error-imagen-posteo">{error}</p>}

                    <div className="postear">
                        <input
                            ref={inputImagenRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            hidden
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) seleccionarImagen(file);
                                e.target.value = '';
                            }}
                        />
                        <button
                            type="button"
                            className="boton-adjuntar-imagen"
                            aria-label="Adjuntar imagen"
                            onClick={() => inputImagenRef.current?.click()}
                        >
                            <IoMdImage className="icon" />
                        </button>
                        <div className="post">
                            <button type="submit" disabled={enviando || subiendo}> {enviando ? 'Posteando...' : 'Postear'} </button>
                        </div>
                    </div>
                </form>
            </div>
        </motion.div>
    )
}

export default Posteo;

