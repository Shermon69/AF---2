import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CountryList from '../components/CountryList';
import { UserContext } from '../context/UserContext';
import '@testing-library/jest-dom';

describe('CountryList', () => {
  const mockCountries = [
    { cca3: 'US', name: { common: 'United States' }, flags: { png: 'us.png' }, capital: ['Washington, D.C.'], population: 331002651, region: 'North America' },
    { cca3: 'CA', name: { common: 'Canada' }, flags: { png: 'ca.png' }, capital: ['Ottawa'], population: 37742154, region: 'North America' },
  ];

  const mockUser = { favorites: ['US'], handleAddFavorite: jest.fn(), handleRemoveFavorite: jest.fn() };
  const mockContextValue = { user: mockUser, handleAddFavorite: mockUser.handleAddFavorite, handleRemoveFavorite: mockUser.handleRemoveFavorite };

  test('renders country list with favorites', () => {
    render(
      <UserContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <CountryList countries={mockCountries} />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Remove Favorite')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
    expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
  });

  test('toggles favorite status on button click', () => {
    render(
      <UserContext.Provider value={mockContextValue}>
        <MemoryRouter>
          <CountryList countries={mockCountries} />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.click(screen.getByText('Remove Favorite'));
    expect(mockUser.handleRemoveFavorite).toHaveBeenCalledWith('US');
    fireEvent.click(screen.getByText('Add to Favorites'));
    expect(mockUser.handleAddFavorite).toHaveBeenCalledWith('CA');
  });
});