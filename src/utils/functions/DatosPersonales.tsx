import axios from "axios";
import toast from "react-hot-toast";

interface Datos {
    biografia: string;
    created_at: string;
    cumpleanos: string;
    id: number;
    localizacion: string;
    sitio_web: string;
    updated_at: string;
    usuario_id: number;
}

export const guardarDatos = async (event: React.FormEvent<HTMLFormElement>, datos: Datos, id: number, sinDatos: boolean) => {
    event.preventDefault();

    try {
        const metodo = !sinDatos ? 'put' : 'post';

        const response = await axios[metodo](`/api/datospersonales/${id}`, {
            biografia: datos.biografia,
            localizacion: datos.localizacion,
            sitio_web: datos.sitio_web,
            cumpleanos: datos.cumpleanos.split("/").reverse().join("-")
        });

        if (response.status === 200) {
            toast.success(metodo === 'put' ? 'Datos actualizados correctamente' : 'Datos creados correctamente', {
                position: 'top-center',
                duration: 2500
            });
            console.log(`Datos ${metodo === 'put' ? 'actualizados' : 'creados'}:`, response.data.result);
        }

    } catch (error) {
        console.error("Error al actualizar los datos:", error);
    }
};