"use client"
import "./PosteoFeed.scss"
import React, { useEffect, useState } from 'react'
import Avvvatars from "avvvatars-react"
import useStore from "@/zustand"
import axios, { AxiosError } from "axios"

const PosteoFeed: React.FC = () => {
    const { getCookieLogueo, datosLogueo, addTweet } = useStore();
    const [titulo, setTitulo] = useState<number>(0);
    const [contenido, setContenido] = useState<number>(0);

    useEffect(() => {
        getCookieLogueo();
    }, [getCookieLogueo])

    const enviar = async (event: React.FormEvent<HTMLFormElement>, formData: FormData) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const titulo: string = formData.get('titulo') as string;
        const contenido: string = formData.get('contenido') as string;
        const creador_id: number = Number(datosLogueo?.id);

        try {
            const result = await axios.post('/api/posteo', {
                titulo: titulo,
                contenido: contenido,
                creador_id: creador_id
            })

            if (result.status === 200) {
                addTweet();
                form.reset();
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    console.log(error.response.data.error)
                } else {
                    console.log(error)
                }
            }
        }
    }

    return (
        <div className='posteo-feed'>
            <div className='contenedor-posteo-feed'>
                <div className="imagen-de-posteo-feed">
                    {datosLogueo && <Avvvatars size={40} style="shape" value={datosLogueo?.email} />}
                </div>
                <form onSubmit={(event) => enviar(event, new FormData(event.currentTarget))} className="div-postear-escribir">
                    <div className="input-titulo">
                        <input onChange={(e) => setTitulo(e.target.value.length)} maxLength={100} type="text" name="titulo" placeholder="¿Que estas pensando?" required />
                    </div>
                    <div className="reglainput">
                        <p style={{ color: titulo === 100 ? "red" : "var(--color-letra-gris)" }}> {titulo}/100 </p>
                    </div>
                    <div className="input-titulo">
                        <textarea onChange={(e) => setContenido(e.target.value.length)} maxLength={250} className="textarea-post-feed" name="contenido" placeholder="¿Que estas pensando?" required />
                    </div>
                    <div className="reglainput">
                        <p style={{ color: contenido === 250 ? "red" : "var(--color-letra-gris)" }}> {contenido}/250 </p>
                    </div>
                    <div className="boton-de-posteo-feed">
                        <button type="submit"> Postear </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PosteoFeed