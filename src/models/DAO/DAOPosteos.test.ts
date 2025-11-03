import DAOPosteos from './DAOPosteos';

describe('DAOPosteos', () => {
  it('getPosteosById throws on NaN', async () => {
    await expect(DAOPosteos.getPosteosById(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
  it('obtenerPosteoPorID throws on NaN', async () => {
    await expect(DAOPosteos.obtenerPosteoPorID(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
  it('addLikePosteo throws on NaN', async () => {
    await expect(DAOPosteos.addLikePosteo(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
});
