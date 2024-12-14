import axios, { AxiosError } from 'axios'
import { create } from 'zustand'
import toast from 'react-hot-toast';

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
    password?: string;
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
    addTweet: (posteo: Posteos) => Promise<void>;
    getTweetsByID: () => Promise<void>;
    getCookieLogueo: () => Promise<void>;
    getTweetsByIDUser: (id: number) => Promise<void>;
    addTweetDinamico: (posteo: Posteos) => Promise<void>;
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
}

const useStore = create<StoreState>((set, get) => ({
    posteos: [],
    posteosUser: [],
    posteosTotales: 0,
    loading: false,
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

    getCookieLogueo: async (): Promise<void> => {
        try {
            const response = await axios.get<{ result: Logueo }>('/api/auth/datasesion');
            set({ datosLogueo: response.data.result });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: true });
                if (error.response) {
                    console.error('Error en la respuesta:', error.response.data.error);
                } else {
                    console.error('Error inesperado:', error);
                }
            }
        }
    },

    getAllTweets: async (): Promise<void> => {
        set({ loading: true });
        try {
            const response = await axios.get('/api/posteo');
            set({ posteos: response.data.result, loading: false, posteosTotales: response.data.result.length });
        } catch {
            set({ error: true, loading: false });
        }
    },

    getTweetsByID: async (): Promise<void> => {
        set({ loading: true });
        await get().getCookieLogueo();

        const { datosLogueo } = get();
        if (!datosLogueo) {
            set({ error: true, loading: false });
            console.error('No se encontraron datos de logueo');
            return;
        }

        try {
            const response = await axios.get(`/api/posteo`);
            const filtro = response.data.result.filter((posteo: Posteos) => posteo.creador_id === datosLogueo.id);
            set({ posteos: filtro, loading: false, posteosTotales: filtro.length });
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    set({ error: true, loading: false, detalleError: error.response.data.result });
                    console.error(error.response.data.result);
                } else {
                    console.error('Unexpected error', error);
                }
            }
        }
    },

    addTweet: async (posteo): Promise<void> => {
        set({ loading: true });
        await get().getCookieLogueo();
        const { datosLogueo } = get();

        if (!datosLogueo) {
            set({ error: true, loading: false });
            console.error('No se encontraron datos de logueo');
            return;
        }

        try {
            const response = await axios.get('/api/posteo');
            const filtro = response.data.result.filter((posteo: Posteos) => posteo.creador_id === datosLogueo.id);
            set({ posteos: [...filtro], loading: false });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: true, loading: false });
                if (error.response) {
                    console.error(error.response.data.error);
                } else {
                    console.error('Unexpected error', error);
                }
            }
        }
    },

    addTweetDinamico: async (posteo: Posteos): Promise<void> => {
        set({ loading: true });
        try {
            const response = await axios.get('/api/posteo');
            const filtro = response.data.result.filter((posteo: Posteos) => posteo.creador_id === Number(posteo.creador_id));
            set({ posteosUser: [...filtro, posteo], loading: false });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: true, loading: false });
                if (error.response) {
                    console.error(error.response.data.error);
                } else {
                    console.error('Unexpected error', error);
                }
            }
        }
    },

    getTweetsByIDUser: async (id: number): Promise<void> => {
        set({ loading: true });

        try {
            const response = await axios.get(`/api/posteo`);
            const filtro = response.data.result.filter((posteo: Posteos) => posteo.id === Number(id));
            set({ posteosUser: filtro, loading: false, posteosTotales: filtro.length });
        } catch (error) {
            if (error instanceof AxiosError) {
                set({ error: true, loading: false });
                if (error.response) {
                    console.error(error.response.data.error);
                } else {
                    console.error('Unexpected error', error);
                }
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
                    console.error(error.response.data.error);
                } else {
                    console.error('Unexpected error', error);
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
                    console.error('Error en la respuesta:', error.response.data.error);
                } else {
                    console.error('Error inesperado:', error);
                }
            }
        }

        return null;
    },

    obtenerResultadosDeBusqueda: async (response: Dat): Promise<void> => {
        try {
            const { busqueda, tipoDeBusqueda } = response;
            const endpoint = tipoDeBusqueda === 'usuarios' ? '/api/usuario' : '/api/posteo';
            const propiedadesFiltro = tipoDeBusqueda === 'usuarios' ? ['nombre', 'email'] : ['contenido', 'titulo', 'nombre'];

            const busquedaLower = busqueda.toLowerCase();
            let filtro: Posteos[] = [];

            const results = await axios.get(endpoint);

            if (results.status === 200) {
                const data: Posteos[] = results.data.result || [];
                filtro = data.filter((item: Posteos) =>
                    propiedadesFiltro.some((prop) => {
                        const value = item[prop as keyof Posteos];
                        return value && typeof value === 'string' && value.toLowerCase().includes(busquedaLower);
                    })
                );
            }

            set({ arrayDeBusqueda: busqueda ? filtro : [], posteosTotales: filtro.length });
        } catch (error) {
            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data?.error || error.message || "Error desconocido";
                console.error("Error al obtener resultados de búsqueda:", errorMessage);
            } else {
                console.log(error);
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
                    console.error(error.response.data.error);
                } else {
                    console.error(error);
                }
            }
        }
    },

    seguirUsuario: async (id_mio: number, id_a_seguir: number): Promise<void> => {
        try {
            const result = await axios.post(`/api/seguimientos/${id_mio}`, {
                id_a_seguir: id_a_seguir
            })

            if (result.status === 200) {
                console.log("Usuario seguido")
                toast.success("Usuario seguido exitosamente", {
                    position: "top-center",
                    duration: 2000
                })

                set({ esMiAmigo: true, change: !get().change })
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    console.log(error.response.data.error)
                    toast.error(error.response.data.error, {
                        position: "top-center",
                        duration: 2000
                    })
                } else {
                    console.log(error)
                }
            }
        }
    },
    eliminarSeguimiento: async (id_mio: number, id_a_seguir: number): Promise<void> => {
        try {
            const result = await axios.delete(`/api/seguimientos/${id_mio}`, {
                data: {
                    id_a_seguir: id_a_seguir
                }
            })

            if (result.status === 200) {
                console.log("Seguimiento eliminado")
                toast.success("Usuario eliminado exitosamente", {
                    position: "top-center",
                    duration: 2000
                })

                set({ esMiAmigo: false, change: !get().change })
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response) {
                    console.log(error.response.data.error)
                    toast.error(error.response.data.error, {
                        position: "top-center",
                        duration: 2000
                    })
                } else {
                    console.log(error)
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
                    console.log(error.response.data.error)
                } else {
                    console.log(error.message)
                }
            }
        }
    },
    obtenerSeguidores: async (): Promise<void> => {
        try {
            const results = await axios.get(`/api/seguimientos/`);

            if (results.status === 200) {
                const filtrarPorSeguidores = results.data.result.filter(({ id_a_seguir, id_mio }: { id_a_seguir: number, id_mio: number }) => id_a_seguir === get().datosLogueo?.id && id_mio !== get().datosLogueo?.id);

                set({ seguidores: filtrarPorSeguidores });
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
}));

export default useStore;
