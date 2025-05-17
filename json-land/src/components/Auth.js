const usersKey = 'users';
const currentUserKey = 'currentUser';

// Register a new user with an empty favorites array
export function registerUser({ username, email, password, photo }) {
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  const userExists = users.some((user) => user.email === email);
  if (userExists) {
    throw new Error('User already exists with this email');
  }
  const newUser = { username, email, password, photo, favorites: [] };
  users.push(newUser);
  localStorage.setItem(usersKey, JSON.stringify(users));
  localStorage.setItem(currentUserKey, JSON.stringify(newUser));
  return newUser;
}

// Log in a user
export function loginUser(email, password) {
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  localStorage.setItem(currentUserKey, JSON.stringify(user));
  return user;
}

// Log out the current user
export function logoutUser() {
  localStorage.removeItem(currentUserKey);
}

// Get the current logged-in user
export function getCurrentUser() {
  const user = JSON.parse(localStorage.getItem(currentUserKey));
  return user ? { ...user, favorites: user.favorites || [] } : null;
}

// Add a country to the user's favorites
export function addFavoriteCountry(countryCode) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not logged in');
  }
  if (!Array.isArray(user.favorites)) {
    user.favorites = [];
  }
  if (!user.favorites.includes(countryCode)) {
    user.favorites.push(countryCode);
    updateUser(user);
  }
  return user;
}

// Remove a country from the user's favorites
export function removeFavoriteCountry(countryCode) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not logged in');
  }
  if (!Array.isArray(user.favorites)) {
    user.favorites = [];
  }
  user.favorites = user.favorites.filter((code) => code !== countryCode);
  updateUser(user);
  return user;
}

// Update the user in localStorage (both in users array and currentUser)
function updateUser(updatedUser) {
  const users = JSON.parse(localStorage.getItem(usersKey)) || [];
  const userIndex = users.findIndex((u) => u.email === updatedUser.email);
  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
    localStorage.setItem(usersKey, JSON.stringify(users));
  }
  localStorage.setItem(currentUserKey, JSON.stringify(updatedUser));
}