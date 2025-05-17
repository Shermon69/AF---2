import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Register from '../components/Register';
import { registerUser } from '../components/Auth';
import '@testing-library/jest-dom';

jest.mock('../components/Auth');

describe('Register', () => {
  const mockSetUser = jest.fn();
  const mockNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
  }));

  beforeEach(() => {
    registerUser.mockResolvedValue({ username: 'testuser', email: 'test@example.com', photo: 'base64data' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders register form', () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </UserContext.Provider>
    );
    expect(screen.getByText('JSON LAND')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Profile Photo')).toBeInTheDocument();
  });

  test('shows error for empty fields', async () => {
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText('All fields are required')).toBeInTheDocument();
  });

  test('submits form with valid data', async () => {
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    const mockReader = { readAsDataURL: jest.fn(), onloadend: null };
    window.FileReader = jest.fn(() => mockReader);

    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Profile Photo'), { target: { files: [file] } });
    mockReader.onloadend = () => mockReader.onloadend({ target: { result: 'base64data' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(registerUser).toHaveBeenCalledWith({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data' });
    expect(mockSetUser).toHaveBeenCalledWith({ username: 'testuser', email: 'test@example.com', photo: 'base64data' });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('shows error on invalid file type', async () => {
    const file = new File(['dummy content'], 'example.txt', { type: 'text/plain' });
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.change(screen.getByLabelText('Profile Photo'), { target: { files: [file] } });
    expect(await screen.findByText('Please upload a valid image file')).toBeInTheDocument();
  });

  test('shows error on registration failure', async () => {
    registerUser.mockRejectedValue(new Error('Email already in use'));
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    render(
      <UserContext.Provider value={{ setUser: mockSetUser }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </UserContext.Provider>
    );
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(screen.getByLabelText('Profile Photo'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    expect(await screen.findByText('Email already in use')).toBeInTheDocument();
  });
});