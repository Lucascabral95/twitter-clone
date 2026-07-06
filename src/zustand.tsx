import axios, { AxiosError } from 'axios'
import { create } from 'zustand'
import toast from 'react-hot-toast';
import { logger } from '@/infrastructure/logger';

interface Dat {
    busqueda: string;
    tipoDeBusqueda: string;
}

interface Logueo {
    id: number;
    email: string;
    nombre: string;
    exp: number;
    iat: number;
    fecha_creacion: string;
    identificador: string;
}

interface Posteos {
    id: number;
    nombre: string;
    email: string;
    fecha_creacion: string;
    identificador: string;
    posteo_id: number;
    titulo: string;
    contenido: string;
    created_at: string;
    updated_at: string;
    creador_id: number;
    likes: number;
    comentarios_count: number;
    reposteos_count: number;
}

// Fila cruda que devuelve `POST /api/posteo` (tabla `posteos`), sin el join con
// `usuarios` que sí trae la vista `usuarios_posteos`. Se enriquece con `datosLogueo`
// para poder prependear al feed con la misma forma que `Posteos`.
interface PosteoCreado {
    id: number;
    titulo: string;
    contenido: string;
    created_at: string;
    updated_at: string;
    creador_id: number;
    likes: number;
    comentarios_count: number;
    reposteos_count: number;
}

interface DatosPersonales {
    id: number;
    biografia: string;
    localizacion: string;
    sitio_web: string;
    cumpleanos: string;
    usuario_id: number;
    created_at: string;
    updated_at: string
}

interface SeguidosYSeguidores {
    id_seguimiento: number;
    id_mio: number;
    id_a_seguir: number;
    id: number;
    nombre: string;
    email: string;
    identificador: string;
    fecha_creacion: string;
}

interface Pagination {
    limit: number;
    nextCursor: number | null;
    hasMore: boolean;
}

interface StoreState {
    posteos: Posteos[];
    posteosUser: Posteos[];
    posteosTotales: number;
    esMiAmigo: boolean;
    loading: boolean;
    error: boolean;
    detalleError: string;
    datosLogueo: Logueo;
    arrayDeBusqueda: Posteos[],
    limit: number;
    limitFeed: number;
    getAllTweets: () => Promise<void>;
    addTweet: (nuevoPosteo: PosteoCreado) => Promise<void>;
    getTweetsByID: () => Promise<void>;
    getCookieLogueo: () => Promise<void>;
    getTweetsByIDUser: (id: number) => Promise<void>;
    addTweetDinamico: () => Promise<void>;
    getDatosPersonalesByID: (id: number) => Promise<void>;
    datosPersonales: DatosPersonales;
    obtenerDatosDeCookie: () => Promise<Logueo | null>;
    obtenerResultadosDeBusqueda: (response: Dat) => Promise<void>;
    existeEnMiListaDeAmigos: (id_mio: number, id_del_usuario: number) => Promise<void>;
    seguirUsuario: (id_mio: number, id_a_seguir: number) => Promise<void>;
    eliminarSeguimiento: (id_mio: number, id_a_seguir: number) => Promise<void>;
    change: boolean;
    getMisSeguidos: () => Promise<void>;
    misSeguidos: SeguidosYSeguidores[];
    seguidores: SeguidosYSeguidores[];
    obtenerSeguidores: () => Promise<void>;
    posteosHome: Posteos[];
    getTweetsOfHome: () => Promise<void>;
    hasMoreTweets: boolean;
    nextCursorTweets: number | null;
    loadMoreTweets: () => Promise<void>;
    hasMoreTweetsUser: boolean;
    nextCursorTweetsUser: number | null;
    loadMoreTweetsUser: (id: number) => Promise<void>;
    hasMoreTweetsHome: boolean;
    nextCursorTweetsHome: number | null;
    loadMoreTweetsHome: () => Promise<void>;
}

const useStore = create<StoreState>((set, get) => ({
    posteos: [],
    posteosUser: [],
    posteosTotales: 0,
    loading: true,
    error: false,
    detalleError: "",
    datosLogueo: {} as Logueo,
    limit: 20 as number,
    limitFeed: 20 as number,
    datosPersonales: {} as DatosPersonales,
    arrayDeBusqueda: [],
    esMiAmigo: false,
    change: false,
    misSeguidos: [],
    seguidores: [],
    posteosHome: [],
    hasMoreTweets: false,
    nextCursorTweets: null,
    hasMoreTweetsUser: false,
    nextCursorTweetsUser: null,
    hasMoreTweetsHome: false,
    nextCursorTweetsHome: null,

    getCookieLogueo: async (): Promise<void> => {
        try {
            const response = await axios.get<{ result: Logueo }>('/api/auth/datasesion');
            set({ datosLogueo: response.data.result });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: true });
                if (error.response) {
                    logger.error('Error en la respuesta:', error.response.data.error);
                } else {
                    logger.error('Error inesperado:', error);
                }
            }
        }
    },

    getAllTweets: async (): Promise<void> => {
        set({ loading: true });
        try {
            const response = await axios.get(`/api/posteo?limit=${get().limitFeed}`);
            const pagination: Pagination | undefined = response.data.pagination;
            set({
                posteos: response.data.result,
                loading: false,
                error: false,
                posteosTotales: response.data.result.length,
                nextCursorTweets: pagination?.nextCursor ?? null,
                hasMoreTweets: pagination?.hasMore ?? false,
            });
        } catch {
            set({ error: true, loading: false });
        }
    },

    loadMoreTweets: async (): Promise<void> => {
        const { nextCursorTweets, hasMoreTweets, limitFeed, posteos } = get();
        if (!hasMoreTweets || nextCursorTweets === null) return;

        try {
            const response = await axios.get(`/api/posteo?limit=${limitFeed}&cursor=${nextCursorTweets}`);
            const pagination: Pagination | undefined = response.data.pagination;
            set({
                posteos: [...posteos, ...response.data.result],
                nextCursorTweets: pagination?.nextCursor ?? null,
                hasMoreTweets: pagination?.hasMore ?? false,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.error('Error al cargar más posteos:', error.response?.data?.error ?? error.message);
            }
        }
    },

    getTweetsByID: async (): Promise<void> => {
        set({ loading: true });
        await get().getCookieLogueo();

        const { datosLogueo } = get();
        if (!datosLogueo) {
            set({ error: true, loading: false });
            logger.error('No se encontraron datos de logueo');
            return;
        }

        try {
            const response = await axios.get(`/api/posteo?creador_id=${datosLogueo.id}`);
            set({ posteos: response.data.result, loading: false, posteosTotales: response.data.result.length });
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    set({ error: true, loading: false, detalleError: error.response.data.result });
                    logger.error(error.response.data.result);
                } else {
                    logger.error('Unexpected error', error);
                }
            }
        }
    },

    addTweet: async (nuevoPosteo: PosteoCreado): Promise<void> => {
        await get().getCookieLogueo();
        const { datosLogueo, posteos, posteosHome } = get();

        if (!datosLogueo) {
            set({ error: true });
            logger.error('No se encontraron datos de logueo');
            return;
        }

        const posteoEnriquecido: Posteos = {
            id: datosLogueo.id,
            nombre: datosLogueo.nombre,
            email: datosLogueo.email,
            fecha_creacion: datosLogueo.fecha_creacion,
            identificador: datosLogueo.identificador,
            posteo_id: nuevoPosteo.id,
            titulo: nuevoPosteo.titulo,
            contenido: nuevoPosteo.contenido,
            created_at: nuevoPosteo.created_at,
            updated_at: nuevoPosteo.updated_at,
            creador_id: nuevoPosteo.creador_id,
            likes: nuevoPosteo.likes,
            comentarios_count: nuevoPosteo.comentarios_count,
            reposteos_count: nuevoPosteo.reposteos_count,
        };

        set({
            posteos: [posteoEnriquecido, ...posteos],
            posteosHome: [posteoEnriquecido, ...posteosHome],
            change: !get().change,
        });
    },

    addTweetDinamico: async (): Promise<void> => {
        set({ loading: true });
        try {
            const response = await axios.get('/api/posteo');
            const filtro = response.data.result.filter((posteo: Posteos) => posteo.creador_id === Number(posteo.creador_id));
            set({ posteosUser: filtro, loading: false, change: !get().change });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: true, loading: false });
                if (error.response) {
                    logger.error(error.response.data.error);
                } else {
                    logger.error('Unexpected error', error);
                }
            }
        }
    },

    getTweetsByIDUser: async (id: number): Promise<void> => {
        set({ loading: true });

        try {
            const response = await axios.get(`/api/posteo?creador_id=${Number(id)}&limit=${get().limit}`);
            const pagination: Pagination | undefined = response.data.pagination;
            set({
                posteosUser: response.data.result,
                loading: false,
                posteosTotales: response.data.result.length,
                nextCursorTweetsUser: pagination?.nextCursor ?? null,
                hasMoreTweetsUser: pagination?.hasMore ?? false,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: true, loading: false });
                if (error.response) {
                    logger.error(error.response.data.error);
                } else {
                    logger.error('Unexpected error', error);
                }
            }
        }
    },

    loadMoreTweetsUser: async (id: number): Promise<void> => {
        const { nextCursorTweetsUser, hasMoreTweetsUser, limit, posteosUser } = get();
        if (!hasMoreTweetsUser || nextCursorTweetsUser === null) return;

        try {
            const response = await axios.get(`/api/posteo?creador_id=${Number(id)}&limit=${limit}&cursor=${nextCursorTweetsUser}`);
            const pagination: Pagination | undefined = response.data.pagination;
            set({
                posteosUser: [...posteosUser, ...response.data.result],
                nextCursorTweetsUser: pagination?.nextCursor ?? null,
                hasMoreTweetsUser: pagination?.hasMore ?? false,
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.error('Error al cargar más posteos del usuario:', error.response?.data?.error ?? error.message);
            }
        }
    },

    getDatosPersonalesByID: async (id: number): Promise<void> => {
        try {
            const { data } = await axios.get(`/api/datospersonales/${id}`);
            set({ datosPersonales: data.result[0] });
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    logger.error(error.response.data.error);
                } else {
                    logger.error('Unexpected error', error);
                }
            }
        }
    },

    obtenerDatosDeCookie: async (): Promise<Logueo | null> => {
        try {
            const response = await axios.get<{ result: Logueo }>('/api/auth/datasesion');

            return response.data.result;
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: true });
                if (error.response) {
                    logger.error('Error en la respuesta:', error.response.data.error);
                } else {
                    logger.error('Error inesperado:', error);
                }
            }
        }

        return null;
    },

    obtenerResultadosDeBusqueda: async (response: Dat): Promise<void> => {
        try {
            const { busqueda, tipoDeBusqueda } = response;

            if (!busqueda) {
                set({ arrayDeBusqueda: [], posteosTotales: 0 });
                return;
            }

            const endpoint = tipoDeBusqueda === 'usuarios' ? '/api/usuario' : '/api/posteo';
            const results = await axios.get(`${endpoint}?q=${encodeURIComponent(busqueda)}`);
            const data: Posteos[] = results.status === 200 ? (results.data.result || []) : [];

            set({ arrayDeBusqueda: data, posteosTotales: data.length });
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error || error.message || "Error desconocido";
                logger.error("Error al obtener resultados de búsqueda:", errorMessage);
            } else {
                logger.log(error);
            }
        }
    },

    existeEnMiListaDeAmigos: async (id_mio: number, id_del_usuario: number): Promise<void> => {
        try {
            const { data } = await axios.get(`/api/seguimientos/${id_mio}`);

            const esMiAMigoONo = data.result.some((seguidor: SeguidosYSeguidores) => seguidor.id_a_seguir === id_del_usuario);

            set({ esMiAmigo: esMiAMigoONo });

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    logger.error(error.response.data.error);
                } else {
                    logger.error(error);
                }
            }
        }
    },

    seguirUsuario: async (id_mio: number, id_a_seguir: number): Promise<void> => {
        set({ esMiAmigo: true });

        try {
            const result = await axios.post(`/api/seguimientos/${id_mio}`, {
                id_a_seguir: id_a_seguir
            })

            if (result.status === 200) {
                logger.log("Usuario seguido")
                toast.success("Usuario seguido exitosamente", {
                    position: "top-center",
                    duration: 2000
                })

                set({ change: !get().change })
            }

        } catch (error) {
            set({ esMiAmigo: false });

            if (error instanceof AxiosError) {
                if (error.response) {
                    logger.log(error.response.data.error)
                    toast.error(error.response.data.error, {
                        position: "top-center",
                        duration: 2000
                    })
                } else {
                    logger.log(error)
                }
            }
        }
    },
    eliminarSeguimiento: async (id_mio: number, id_a_seguir: number): Promise<void> => {
        set({ esMiAmigo: false });

        try {
            const result = await axios.delete(`/api/seguimientos/${id_mio}`, {
                data: {
                    id_a_seguir: id_a_seguir
                }
            })

            if (result.status === 200) {
                logger.log("Seguimiento eliminado")
                toast.success("Usuario eliminado exitosamente", {
                    position: "top-center",
                    duration: 2000
                })

                set({ change: !get().change })
            }

        } catch (error) {
            set({ esMiAmigo: true });

            if (error instanceof AxiosError) {
                if (error.response) {
                    logger.log(error.response.data.error)
                    toast.error(error.response.data.error, {
                        position: "top-center",
                        duration: 2000
                    })
                } else {
                    logger.log(error)
                }
            }
        }
    },

    getMisSeguidos: async (): Promise<void> => {
        try {
            const { data } = await axios.get(`/api/seguimientos/${get().datosLogueo?.id}`);

            set({ misSeguidos: data.result });
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    logger.log(error.response.data.error)
                } else {
                    logger.log(error.message)
                }
            }
        }
    },

    obtenerSeguidores: async (): Promise<void> => {
        try {
            const myId = get().datosLogueo?.id;
            const results = await axios.get(`/api/seguimientos/seguidores/${myId}`);

            if (results.status === 200) {
                const sinMiMismo = results.data.result.filter(({ id_mio }: { id_mio: number }) => id_mio !== myId);

                set({ seguidores: sinMiMismo });
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    logger.log(error.response.data.error)
                } else {
                    logger.log(error)
                }
            }
        }
    },

    getTweetsOfHome: async (): Promise<void> => {
        try {
            await get().getCookieLogueo();
            const { datosLogueo, limitFeed } = get();

            const results = await axios.get(`/api/posteo?siguiendoDe=${Number(datosLogueo?.id)}&limit=${limitFeed}`);

            if (results.status === 200) {
                const pagination: Pagination | undefined = results.data.pagination;
                set({
                    posteosHome: results.data.result,
                    nextCursorTweetsHome: pagination?.nextCursor ?? null,
                    hasMoreTweetsHome: pagination?.hasMore ?? false,
                });
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    logger.log(error.response.data.error)
                } else {
                    logger.log(error)
                }
            }
        }
    },

    loadMoreTweetsHome: async (): Promise<void> => {
        const { nextCursorTweetsHome, hasMoreTweetsHome, limitFeed, posteosHome, datosLogueo } = get();
        if (!hasMoreTweetsHome || nextCursorTweetsHome === null) return;

        try {
            const results = await axios.get(`/api/posteo?siguiendoDe=${Number(datosLogueo?.id)}&limit=${limitFeed}&cursor=${nextCursorTweetsHome}`);

            if (results.status === 200) {
                const pagination: Pagination | undefined = results.data.pagination;
                set({
                    posteosHome: [...posteosHome, ...results.data.result],
                    nextCursorTweetsHome: pagination?.nextCursor ?? null,
                    hasMoreTweetsHome: pagination?.hasMore ?? false,
                });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                logger.log(error.response?.data?.error ?? error.message);
            }
        }
    }
}));

export default useStore;
