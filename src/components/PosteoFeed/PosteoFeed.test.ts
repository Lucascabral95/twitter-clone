import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PosteoFeed from './PosteoFeed';
import { usePostForm } from '@/presentation/hooks/usePostForm';

jest.mock('@/infrastructure/services', () => ({
  postService: { createPost: jest.fn().mockResolvedValue({ success: true, data: {} }) }
}));

jest.mock('@/presentation/hooks/usePostForm', () => ({
  __esModule: true,
  usePostForm: jest.fn(),
}));

jest.mock('@/zustand', () => ({
  __esModule: true,
  default: jest.fn(() => ({ datosLogueo: { id: 1, email: 'a@a.com' }, addTweet: jest.fn() })),
}));

const mockUsePostForm = usePostForm as unknown as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

it('submits form and calls createPost', async () => {
  const setTituloMock = jest.fn();
  const setContenidoMock = jest.fn();
  
  mockUsePostForm.mockReturnValueOnce({
    setTitulo: setTituloMock,
    setContenido: setContenidoMock,
    titulo: 0,
    contenido: 0,
    isLoading: false,
    datosLogueo: { id: 1, email: 'a@a.com', nombre: 'User', exp: 0, iat: 0, fecha_creacion: '', identificador: 'abc' },
    handleSubmit: jest.fn(),
  });

  render(React.createElement(PosteoFeed));

  const inputs = screen.getAllByPlaceholderText('¿Qué estás pensando?');
  fireEvent.change(inputs[0], { target: { value: 'Hola' } });
  fireEvent.change(inputs[1], { target: { value: 'Contenido' } });

  const btn = screen.getByRole('button', { name: /Postear/i });
  fireEvent.click(btn);

  expect(setTituloMock).toHaveBeenCalledWith('Hola'.length);
  expect(setContenidoMock).toHaveBeenCalledWith('Contenido'.length);
  expect(mockUsePostForm).toHaveBeenCalled();
});

