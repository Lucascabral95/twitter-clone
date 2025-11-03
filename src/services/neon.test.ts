import { neon } from "@neondatabase/serverless";
import db from "@/services/neon";

// Mockeamos la librería de neon
jest.mock("@neondatabase/serverless", () => ({
  neon: jest.fn(),
}));

describe("db", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mockeamos las variables de entorno
    process.env.DATABASE_URL = "postgresql://test-url";
  });

  it("debe retornar una función SQL cuando se llama", async () => {
    const mockSql = jest.fn();
    (neon as jest.Mock).mockReturnValue(mockSql);

    const result = await db();

    expect(result).toBe(mockSql);
  });

  it("debe llamar a neon con la DATABASE_URL correcta", async () => {
    const mockSql = jest.fn();
    (neon as jest.Mock).mockReturnValue(mockSql);

    await db();

    expect(neon).toHaveBeenCalledWith("postgresql://test-url");
  });

  it("debe lanzar error si DATABASE_URL no está definida", async () => {
    delete process.env.DATABASE_URL;
    const mockSql = jest.fn();
    (neon as jest.Mock).mockReturnValue(mockSql);

    // Esto dependerá de cómo manejes el error en tu código
    await db();

    expect(neon).toHaveBeenCalledWith(undefined);
  });
});
