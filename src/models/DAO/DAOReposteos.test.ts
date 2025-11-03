import DAOReposteos from './DAOReposteos';

describe('DAOReposteos', () => {
  it('getReposteoById throws on NaN', async () => {
    await expect(DAOReposteos.getReposteoById(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
  it('deleteReposteoById throws on NaN', async () => {
    await expect(DAOReposteos.deleteReposteoById(Number('x'))).rejects.toMatchObject({ status: 400 });
  });
});
