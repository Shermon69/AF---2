import { registerUser, loginUser, logoutUser, getCurrentUser, addFavoriteCountry, removeFavoriteCountry } from './components/Auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('registers a new user', () => {
    const user = registerUser({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data' });
    expect(user).toEqual({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data', favorites: [] });
    expect(JSON.parse(localStorage.getItem('users')).length).toBe(1);
    expect(JSON.parse(localStorage.getItem('currentUser'))).toEqual(user);
  });

  test('throws error on duplicate email registration', () => {
    registerUser({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data' });
    expect(() => registerUser({ username: 'testuser2', email: 'test@example.com', password: 'password2', photo: 'base64data2' })).toThrow('User already exists with this email');
  });

  test('logs in a user', () => {
    registerUser({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data' });
    const user = loginUser('test@example.com', 'password');
    expect(user).toEqual({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data', favorites: [] });
    expect(JSON.parse(localStorage.getItem('currentUser'))).toEqual(user);
  });

  test('throws error on invalid login', () => {
    expect(() => loginUser('test@example.com', 'wrong')).toThrow('Invalid email or password');
  });

  test('logs out user', () => {
    registerUser({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data' });
    logoutUser();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  test('gets current user', () => {
    const user = { username: 'testuser', email: 'test@example.com', favorites: ['US'] };
    localStorage.setItem('currentUser', JSON.stringify(user));
    expect(getCurrentUser()).toEqual({ ...user, favorites: ['US'] });
  });

  test('adds favorite country', () => {
    const user = registerUser({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data' });
    const updatedUser = addFavoriteCountry('US');
    expect(updatedUser.favorites).toContain('US');
    expect(JSON.parse(localStorage.getItem('currentUser')).favorites).toContain('US');
  });

  test('removes favorite country', () => {
    const user = registerUser({ username: 'testuser', email: 'test@example.com', password: 'password', photo: 'base64data', favorites: ['US'] });
    const updatedUser = removeFavoriteCountry('US');
    expect(updatedUser.favorites).not.toContain('US');
    expect(JSON.parse(localStorage.getItem('currentUser')).favorites).not.toContain('US');
  });
});