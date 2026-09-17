import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';

describe('Navbar Component', () => {
  it('renders store brand title and navigation links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    expect(screen.getByText('Anand')).toBeInTheDocument();
    expect(screen.getByText(/Electronics & Steel Furniture/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Catalog/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Repair Services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Exchange Program/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Admin Portal/i })).toBeInTheDocument();
  });
});
