import { NextResponse } from "next/server";
import DAOPosteos from "@/models/DAO/DAOPosteos";

interface CustomError {
     error: string;
     status: number;
 }

export async function GET() {
     try {
          const results = await DAOPosteos.getAllPosteos();

          return NextResponse.json({ result: results }, { status: 200 });
     } catch (error: unknown) {
          const customError = error as CustomError;

          if (customError && customError.error && customError.status) {
               return NextResponse.json({ error: customError.error }, { status: customError.status });
          } else {
               return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
          }
     }
}