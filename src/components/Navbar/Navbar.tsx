"use client";
import React, { useEffect, useState } from "react";
import "./Navbar.scss";
import Image from "next/image";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { usePathname } from "next/navigation";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import ListaBusqueda from "../ListaBusqueda/ListaBusqueda";
import useStore from "@/zustand";
import Avvvatars from "avvvatars-react";

interface IArrayDeBusqueda { 
  id: number;
  nombre: string;
  email: string;
  password: string;
  fecha_creacion: string;
  identificador: string
}

const Header: React.FC = () => {
  const pathname = usePathname();
  const [inputBusqueda, setInputBusqueda] = useState<string>("");
  const [arrayDeBusqueda, setArrayDeBusqueda] = useState<IArrayDeBusqueda[]>([]);
  const { obtenerDatosDeCookie } = useStore();
  const [image, setImage] = useState<string>("");

  useEffect(() => {
    const getBusqueda = async () => {
      try {
        const results = await axios.get(`/api/busqueda`);

        if (results.status === 200) {
          // setData(results.data.result);
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

    getBusqueda();
  }, [inputBusqueda])

  useEffect(() => {
    const buscarUsuarios = async () => {
      try {
        const results = await axios.get(`/api/usuario`)

        if (results.status === 200) {
          const filtro = await results.data.result.filter((user: IArrayDeBusqueda) => user.email.toLowerCase().includes(inputBusqueda.toLowerCase())
            || user.nombre.toLowerCase().includes(inputBusqueda.toLowerCase()));
          setArrayDeBusqueda(filtro);
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

    buscarUsuarios();
  }, [inputBusqueda])

  useEffect(() => {
    const getData = async () => {
      const response = await obtenerDatosDeCookie();
      setImage(response?.email as string);
    }

    getData();
  }, [])

  return (
    <>
      {pathname !== "/" &&
        <nav className="header">
          <div className="contenedor-header">
            <Link href="/feed" className="imagen-logo">
              <Image className="imagen" src="/img/twitter.svg" alt="Logo" width={32} height={32} />
            </Link>
            <div className="contenedor-de-busquedas">
              <div className="contenedor-de-busqueda">
                <div className="lupa">
                  <HiMagnifyingGlass className="icon" />
                </div>
                <div className="input">
                  <input type="text" placeholder="Buscar usuario..." value={inputBusqueda} onChange={(e) => setInputBusqueda(e.target.value)} />
                </div>
                {inputBusqueda !== "" &&
                  <div className="lupa icono-de-close" style={{ cursor: "pointer" }} onClick={() => setInputBusqueda("")}>
                    <IoMdClose className="icon" />
                  </div>
                }
              </div>
              <Link href="/feed/search" className="boton-de-busqueda-navbar">
                <HiMagnifyingGlass className="icon" />
              </Link>
              {inputBusqueda !== "" &&
                <ListaBusqueda datos={arrayDeBusqueda} palabra={inputBusqueda} cerrarBusqueda={() => setInputBusqueda("")} />
              }
            </div>
            <Link href="/home" className="nombre">
              {image &&
                <Avvvatars value={image} size={32} style="shape" />
              }
            </Link>
          </div>
        </nav >
      }
    </>
  );
};

export default Header;
