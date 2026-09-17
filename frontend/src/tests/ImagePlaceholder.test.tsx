import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ImagePlaceholder } from '../components/common/ImagePlaceholder';

describe('ImagePlaceholder Component', () => {
  it('renders styled placeholder box when src is not provided', () => {
    render(<ImagePlaceholder alt="Steel Almirah" category="Steel Furniture" />);

    const placeholder = screen.getByTestId('image-placeholder');
    expect(placeholder).toBeInTheDocument();
    expect(screen.getByText('Steel Almirah')).toBeInTheDocument();
    expect(screen.getByText(/GESF Official Catalog/i)).toBeInTheDocument();
  });

  it('renders image element when src is valid', () => {
    render(<ImagePlaceholder src="https://example.com/cooler.jpg" alt="Desert Cooler" />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/cooler.jpg');
    expect(img).toHaveAttribute('alt', 'Desert Cooler');
  });
});
