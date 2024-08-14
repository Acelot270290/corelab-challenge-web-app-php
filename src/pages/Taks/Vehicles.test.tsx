import React from 'react';
import { render, screen } from '@testing-library/react';
import TaskPage from './index';

test('renders task page correctly', () => {
  render(<TaskPage />);
  const searchElement = screen.getByPlaceholderText(/pesquisar notas/i); // Atualize o texto do placeholder conforme necessário
  const buttonElement = screen.getByText(/add new task/i); // Atualize o texto do botão conforme necessário
  expect(searchElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});
