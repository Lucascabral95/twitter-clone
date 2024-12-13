import { NextResponse } from "next/server";
import DAOReposteos from "@/models/DAO/DAOReposteos";

interface CustomError {
    error: string;
    status: number;
}

export async function POST(req: Request) {
    try {
        const { posteo_id, reposteador_id } = await req.json();

        if (!posteo_id || !reposteador_id) {
            return NextResponse.json({ result: "Faltan datos" }, { status: 400 });
        }

        const results = await DAOReposteos.createReposteo({ 
            posteo_id: posteo_id, 
            reposteador_id: reposteador_id
         });

        if (results) {
            return NextResponse.json({ result: results }, { status: 200 });
        } else {
            return NextResponse.json({ result: "Error al crear el reposteo" }, { status: 400 });
        }
    } catch (error) {
        const customError = error as CustomError;
        
        if (customError && customError.error && customError.status) {
            return NextResponse.json({ error: customError.error }, { status: customError.status });
        } else {
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
}