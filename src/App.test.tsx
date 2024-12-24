import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders game header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Blackjack Royale/i);
  expect(headerElement).toBeInTheDocument();
});
