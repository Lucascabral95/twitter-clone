export const create = (initializer: any) => {
  let state: any = {};
  const set = (partial: any) => {
    const next = typeof partial === 'function' ? partial(state) : partial;
    state = { ...state, ...next };
  };
  const get = () => state;
  state = initializer(set, get) || {};
  const useStore: any = () => state;
  useStore.getState = () => state;
  useStore.setState = (partial: any) => set(partial);
  return useStore;
};
export default { create } as any;
