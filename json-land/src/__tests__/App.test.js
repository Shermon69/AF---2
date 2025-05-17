import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import App from '../App';
import '@testing-library/jest-dom';

describe('App', () => {
  const mockUser = { username: 'testuser', favorites: ['US'] };
  const mockSetUser = jest.fn();

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login page for unauthenticated user', () => {
    localStorage.removeItem('currentUser');
    render(
      <UserContext.Provider value={{ user: null, setUser: mockSetUser, loadingUser: false }}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText('JSON LAND')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('renders home page for authenticated user', () => {
    render(
      <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser, loadingUser: false }}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText('All Countries')).toBeInTheDocument();
  });

  test('toggles theme between light and dark modes', () => {
    render(
      <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser, loadingUser: false }}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );

    const toggleButton = screen.getByLabelText(/Switch to dark mode/i);
    const rootDiv = toggleButton.closest('div.min-h-screen');

    // Initially in light mode
    expect(rootDiv).toHaveClass('bg-gray-100');
    expect(rootDiv).not.toHaveClass('dark:bg-gray-900');

    // Toggle to dark mode
    fireEvent.click(toggleButton);
    expect(rootDiv).toHaveClass('dark:bg-gray-900');

    // Toggle back to light mode
    fireEvent.click(toggleButton);
    expect(rootDiv).toHaveClass('bg-gray-100');
  });

  test('logs out user', () => {
    render(
      <UserContext.Provider value={{ user: mockUser, setUser: mockSetUser, loadingUser: false }}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.click(screen.getByText('Logout'));
    expect(mockSetUser).toHaveBeenCalledWith(null);
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});