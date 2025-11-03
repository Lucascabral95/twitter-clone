import '@testing-library/jest-dom'

// opcional: si querés silenciar warnings de act en tareas async pequeñas
// jest.spyOn(console, 'error').mockImplementation((...args) => {
//   if (String(args[0]).includes('Warning: An update to')) return
//   // @ts-ignore
//   return originalError(...args)
// })

// import '@testing-library/jest-dom';

// afterEach(() => {
//   jest.clearAllMocks();
// });
