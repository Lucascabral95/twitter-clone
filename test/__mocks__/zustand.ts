const mockState: any = {
  posteos: [],
  posteosUser: [],
  posteosUserOwnerId: null,
  posteosUserRequestId: null,
  loadingTweetsUser: false,
  posteosUserError: '',
  posteosTotales: 0,
  esMiAmigo: false,
  loading: false,
  error: false,
  detalleError: '',
  datosLogueo: { id: 1, email: 'user@test.com', nombre: 'User', exp: 0, iat: 0, fecha_creacion: '', identificador: 'abc' },
  arrayDeBusqueda: [],
  limit: 20,
  limitFeed: 20,
  datosPersonales: {},
  misSeguidos: [],
  seguidores: [],
  posteosHome: [],
  change: false,
  hasMoreTweets: false,
  nextCursorTweets: null,
  hasMoreTweetsUser: false,
  nextCursorTweetsUser: null,
  hasMoreTweetsHome: false,
  nextCursorTweetsHome: null,

  getAllTweets: async () => {},
  addTweet: async () => {},
  getTweetsByID: async () => {},
  getCookieLogueo: async () => {},
  getTweetsByIDUser: async () => {},
  addTweetDinamico: async () => {},
  getDatosPersonalesByID: async () => {},
  obtenerDatosDeCookie: async () => ({ id: 1, email: 'user@test.com', nombre: 'User' }),
  obtenerResultadosDeBusqueda: async () => {},
  existeEnMiListaDeAmigos: async () => {},
  seguirUsuario: async () => {},
  eliminarSeguimiento: async () => {},
  getMisSeguidos: async () => {},
  getTweetsOfHome: async () => {},
  loadMoreTweets: async () => {},
  loadMoreTweetsUser: async () => {},
  loadMoreTweetsHome: async () => {},
};

export const create = (initializer: any) => {
  // Inicializa el store con el estado por defecto
  const storeState = {
    ...mockState,
    ...(typeof initializer === 'function' 
      ? initializer(
          (partial: any) => {
            const next = typeof partial === 'function' ? partial(storeState) : partial;
            Object.assign(storeState, next);
          },
          () => storeState
        )
      : {})
  };

  const store: any = (selector?: (state: any) => any) => {
    return selector ? selector(storeState) : storeState;
  };

  store.getState = () => storeState;
  store.setState = (partial: any) => {
    const next = typeof partial === 'function' ? partial(storeState) : partial;
    Object.assign(storeState, next);
  };
  store.subscribe = () => () => {};
  store.destroy = () => {
    Object.keys(storeState).forEach(key => delete storeState[key]);
  };

  store.__setMockState = (partial: any) => {
    Object.assign(storeState, partial);
  };

  store.__resetMockState = () => {
    Object.assign(storeState, mockState);
  };

  store.__getMockState = () => storeState;

  return store;
};

export default { create };

