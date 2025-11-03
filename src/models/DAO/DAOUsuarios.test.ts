import DAOUsuarios from './DAOUsuarios';

describe('DAOUsuarios', () => {
  it('getUserByIdentificador throws on NaN', async () => {
    await expect(DAOUsuarios.getUserByIdentificador(Number('x') as any)).rejects.toMatchObject({ status: 400 });
  });
});
