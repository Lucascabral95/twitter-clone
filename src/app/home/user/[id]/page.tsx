"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CardSecciones from '@/components/EstructuraMain/CardSecciones';
import useStore from '@/zustand';
import axios, { AxiosError } from 'axios';
import NotFound from '@/components/NotFound/NotFound';
import HeaderDinamico from '@/components/Header/HeaderDinamico';
import Loading from '@/components/Loading/Loading';

interface DataUser {
  id: number
  email: string
  nombre: string
  exp: number
  iat: number
  fecha_creacion: string
  identificador: string
}

const UserID: React.FC = () => {
  const { id } = useParams();
  const [dataUser, setDataUser] = useState<DataUser>({} as DataUser);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const { getTweetsByIDUser, posteosUser } = useStore();

  useEffect(() => {
    getTweetsByIDUser(Number(id) as number);
  }, [getTweetsByIDUser, id])

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await axios.get(`/api/usuario/${Number(id)}`);

        if (result.status === 200) {
          setDataUser(result.data.result[0]);
          console.log(dataUser);
        }

      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && (error.response.status === 400 || error.response.status === 404)) {
            setError(error.response.data.error);
            console.log(error.response.data.error);
          }
        }
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, [id])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <section>

      {!error
        ? (
          <>
            <HeaderDinamico id={Number(id)} />
            <CardSecciones id={Number(id)} publicaciones={posteosUser} />
          </>
        ) : (
          <NotFound error={error} />
        )
      }

    </section>
  )
}

export default UserID