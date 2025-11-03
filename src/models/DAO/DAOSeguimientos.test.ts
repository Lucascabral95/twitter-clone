import DAOSeguimientos from './DAOSeguimientos';

describe('DAOSeguimientos', () => {
  it('getSeguimientosById throws on NaN', async () => {
    await expect(DAOSeguimientos.getSeguimientosById(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
  it('getSeguimientosSeguidoresById throws on NaN', async () => {
    await expect(DAOSeguimientos.getSeguimientosSeguidoresById(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
  it('deleteSeguimientosByID throws on NaN id', async () => {
    await expect(DAOSeguimientos.deleteSeguimientosByID(Number('x'), 1)).rejects.toMatchObject({ status: 400 });
  });
});
