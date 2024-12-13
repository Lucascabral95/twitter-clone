import { NextResponse } from "next/server";
import DAODatosPersonales from "@/models/DAO/DAODatosPersonales";

interface CustomError {
    error: string;
    status: number;
}

export async function GET(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {

        if (!id) {
            throw { error: "Sin datos", status: 400 } as CustomError;
        }

        const results = await DAODatosPersonales.getDatosPersonalesByID(Number(id));

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        const CustomError = error as CustomError;

        if (CustomError && CustomError.error && CustomError.status) {
            return NextResponse.json({ error: CustomError.error }, { status: CustomError.status });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}

export async function POST(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {

        if (!id) {
            throw { error: "Sin datos", status: 400 } as CustomError;
        }

        const { biografia, localizacion, sitio_web, cumpleanos } = await req.json();

        const results = await DAODatosPersonales.createDatosPersonales({
            biografia: biografia,
            localizacion: localizacion,
            sitio_web: sitio_web,
            cumpleanos: cumpleanos,
            usuario_id: id
        });

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        const CustomError = error as CustomError;

        if (CustomError && CustomError.error && CustomError.status) {
            return NextResponse.json({ error: CustomError.error }, { status: CustomError.status });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}

export async function PUT(req: Request, { params }: { params: { id: number } }) {
    const { id } = params;
    try {

        if (!id) {
            throw { error: "Sin datos", status: 400 } as CustomError;
        }

        const { biografia, localizacion, sitio_web, cumpleanos } = await req.json();

        const results = await DAODatosPersonales.updateDatosPersonalesById(Number(id), {
            biografia: biografia,
            localizacion: localizacion,
            sitio_web: sitio_web,
            cumpleanos: cumpleanos,
            usuario_id: id,
        });

        return NextResponse.json({ result: results }, { status: 200 });
    } catch (error) {
        const CustomError = error as CustomError;

        if (CustomError && CustomError.error && CustomError.status) {
            return NextResponse.json({ error: CustomError.error }, { status: CustomError.status });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}