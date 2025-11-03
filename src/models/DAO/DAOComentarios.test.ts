import DAOComentarios from './DAOComentarios';

describe('DAOComentarios', () => {
  it('getAllCommetsByIdPost throws on NaN id', async () => {
    await expect(DAOComentarios.getAllCommetsByIdPost(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
});
