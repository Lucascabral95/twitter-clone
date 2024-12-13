import axios, { AxiosError } from "axios";
import toast from 'react-hot-toast';

interface DatosLogueo {
    id: number;
    email: string;
    nombre: string;
    exp: number;
    iat: number;
    fecha_creacion: string;
    identificador: string;
}

export const repostearPosteo = async (dataPosteo: number, datosLogueo: DatosLogueo) => {
    try {
        const result = await axios.post(`/api/reposteos`, {
            posteo_id: dataPosteo,
            reposteador_id: datosLogueo?.id
        });

        if (result.status === 200) {
            toast.success("Reposteado con éxito", {
                position: "top-center",
                duration: 2500,
            })
        }

    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                toast.error(error.response.data.error, {
                    position: "top-center",
                    duration: 2500,
                })
                console.log(error.response.data.error);
            } else {
                toast.error(error.message, {
                    position: "top-center",
                    duration: 2500,
                })
                console.log(error);
            }
        }
    }
}