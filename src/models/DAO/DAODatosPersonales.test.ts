import DAODatosPersonales from './DAODatosPersonales';

describe('DAODatosPersonales', () => {
  it('getDatosPersonalesByID throws on NaN', async () => {
    await expect(DAODatosPersonales.getDatosPersonalesByID(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
  it('updateDatosPersonalesById throws on NaN', async () => {
    await expect(DAODatosPersonales.updateDatosPersonalesById(Number('x'), {} as any)).rejects.toMatchObject({ status: 400 });
  });
});
