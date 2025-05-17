import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Login from '../components/Login';
import { loginUser } from '../components/Auth';
import '@testing-library/jest-dom';

jest.mock('../components/Auth');

describe('Login', () => {
  const mockSetUser = jest.fn();
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    loginUser.mockResolvedValue({ email: 'test@example.com', username: 'testuser' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText('JSON LAND')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('shows error for empty fields', async () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.click(screen.getByText('Login'));
    expect(await screen.findByText('Email and password are required')).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.click(screen.getByText('Login'));
    expect(loginUser).toHaveBeenCalledWith('test@example.com', 'password');
    expect(mockSetUser).toHaveBeenCalledWith({ email: 'test@example.com', username: 'testuser' });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('shows error on login failure', async () => {
    loginUser.mockRejectedValue(new Error('Invalid credentials'));
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText('Login'));
    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });
});