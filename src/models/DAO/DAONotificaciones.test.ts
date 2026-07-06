import DAONotificaciones from './DAONotificaciones';

describe('DAONotificaciones', () => {
  it('getByUsuario throws on NaN', async () => {
    await expect(DAONotificaciones.getByUsuario(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
  it('contarNoLeidas throws on NaN', async () => {
    await expect(DAONotificaciones.contarNoLeidas(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
  it('marcarTodasLeidas throws on NaN', async () => {
    await expect(DAONotificaciones.marcarTodasLeidas(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
});
