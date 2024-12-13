"use client"
import React, { useEffect, useState } from 'react'
import "./Search.scss"
import CardTweet from '@/components/EstructuraMain/CardTweet'
import useStore from '@/zustand'
import BusquedaDeUsuarios from '@/components/BusquedaDeUsuarios/BusquedaDeUsuarios'
import { IoMdClose } from "react-icons/io";
import { Toaster } from 'react-hot-toast';

type TCriterioBusqueda = {
    tipoDeBusqueda: string,
    busqueda: string
}

const Search: React.FC = () => {
    const { obtenerResultadosDeBusqueda, arrayDeBusqueda } = useStore();
    const [response, setResponse] = useState<TCriterioBusqueda>({
        tipoDeBusqueda: "publicaciones",
        busqueda: ""
    } as TCriterioBusqueda);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResponse({ ...response, busqueda: e.target.value });
    }

    useEffect(() => {
        const getData = async () => {
            await obtenerResultadosDeBusqueda(response);
        }

        getData();
    }, [response]);

    return (
        <div className='search'>
            <div className='contenedor-search'>

                <div className="formulario-de-busqueda-mobile">
                    <div className="input-busqueda">
                        <input type="text" placeholder="Buscar..." value={response.busqueda} name='busqueda' onChange={handleChange} />
                        <div className="icono" onClick={() => setResponse({ ...response, busqueda: "" })}>
                            <IoMdClose className="icon" />
                        </div>
                    </div>

                    <div className="buscar-por">
                        <div className="por">
                            <p> Buscar por: </p>
                        </div>
                        <select className="publicacion-o-usuario" name="tipo" id="tipo" value={response.tipoDeBusqueda} onChange={(e) => setResponse({ ...response, tipoDeBusqueda: e.target.value })}>
                            <option value="publicaciones"> Publicaciones</option>
                            <option value="usuarios"> Usuarios</option>
                        </select>
                    </div>
                </div>

                {response.tipoDeBusqueda === "publicaciones"
                    ?
                    <CardTweet posteos={arrayDeBusqueda} />
                    :
                    <BusquedaDeUsuarios usuarios={arrayDeBusqueda} />
                }

                <Toaster />

            </div>
        </div>
    )
}

export default Search;