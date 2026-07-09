const mockSql = jest.fn();

jest.mock("@/services/neon", () => ({
  __esModule: true,
  default: jest.fn(async () => mockSql),
}));

import DAOPerfiles from "./DAOPerfiles";

describe("DAOPerfiles", () => {
  beforeEach(() => {
    mockSql.mockReset();
  });

  it("builds a profile with stats and viewer relation", async () => {
    mockSql.mockResolvedValueOnce([
      {
        id: 7,
        nombre: "Ana",
        email: "ana@test.com",
        identificador: "ana",
        fecha_creacion: "2024-01-01",
        datos_id: 2,
        biografia: "Bio",
        localizacion: "",
        sitio_web: "",
        cumpleanos: "2000-01-01",
        datos_created_at: "2024-01-02",
        datos_updated_at: "2024-01-03",
        seguidos: 4,
        seguidores: 8,
        lo_sigo: true,
      },
    ]);

    const profile = await DAOPerfiles.getPerfilByUsuarioId(7, {
      id: 1,
      email: "viewer@test.com",
      nombre: "Viewer",
      identificador: "viewer",
      fecha_creacion: "2024-01-01",
    });

    expect(profile.usuario).toEqual({
      id: 7,
      nombre: "Ana",
      email: "ana@test.com",
      identificador: "ana",
      fecha_creacion: "2024-01-01",
    });
    expect(profile.datosPersonales?.biografia).toBe("Bio");
    expect(profile.stats).toEqual({ seguidos: 4, seguidores: 8 });
    expect(profile.relacion).toEqual({ viewerId: 1, esMiPerfil: false, loSigo: true });
  });

  it("throws 404 when the user does not exist", async () => {
    mockSql.mockResolvedValueOnce([]);

    await expect(DAOPerfiles.getPerfilByUsuarioId(99, null)).rejects.toMatchObject({ status: 404 });
  });
});
