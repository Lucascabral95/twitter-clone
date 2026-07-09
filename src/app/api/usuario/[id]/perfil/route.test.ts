/**
 * @jest-environment node
 */

const mockGetPerfilByUsuarioId = jest.fn();
const mockGetSessionUser = jest.fn();

jest.mock("@/models/DAO/DAOPerfiles", () => ({
  __esModule: true,
  default: {
    getPerfilByUsuarioId: (...args: unknown[]) => mockGetPerfilByUsuarioId(...args),
  },
}));

jest.mock("@/infrastructure/auth/session", () => ({
  getSessionUser: () => mockGetSessionUser(),
}));

import { GET } from "./route";

describe("/api/usuario/[id]/perfil", () => {
  beforeEach(() => {
    mockGetPerfilByUsuarioId.mockReset();
    mockGetSessionUser.mockReset();
  });

  it("returns the profile with no-store headers", async () => {
    const viewer = { id: 1, email: "viewer@test.com", nombre: "Viewer", identificador: "viewer", fecha_creacion: "2024-01-01" };
    const profile = {
      usuario: { id: 7, nombre: "Ana", email: "ana@test.com", identificador: "ana", fecha_creacion: "2024-01-01" },
      datosPersonales: null,
      stats: { seguidos: 2, seguidores: 3 },
      relacion: { viewerId: 1, esMiPerfil: false, loSigo: true },
    };
    mockGetSessionUser.mockResolvedValue(viewer);
    mockGetPerfilByUsuarioId.mockResolvedValue(profile);

    const response = await GET(new Request("http://localhost/api/usuario/7/perfil"), { params: { id: 7 } });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(body.result).toEqual(profile);
    expect(mockGetPerfilByUsuarioId).toHaveBeenCalledWith(7, viewer);
  });
});
