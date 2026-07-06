import { NextResponse } from "next/server";
import { CustomError } from "@/infrastructure/interfaces";

export function handleRouteError(error: unknown): NextResponse {
  const customError = error as CustomError;

  if (customError && customError.error && customError.status) {
    return NextResponse.json({ error: customError.error }, { status: customError.status });
  }

  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
