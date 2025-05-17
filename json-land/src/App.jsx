import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CountryDetail from './components/CountryDetail';
import CountryList from './components/CountryList';
import SearchFilter from './components/SearchFilter';
import Register from './components/Register';
import Login from './components/Login';
import { UserProvider, UserContext } from './context/UserContext';
import { logoutUser } from './components/Auth';

// Main App component with routing and state management
function App() {
  const { user, setUser, loadingUser } = useContext(UserContext);
  const [countries, setCountries] = useState([]);
  const [favoriteCountries, setFavoriteCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  // Fetch favorite countries when user changes
  useEffect(() => {
    if (user && user.favorites && user.favorites.length > 0) {
      setLoading(true);
      axios
        .get(`https://restcountries.com/v3.1/alpha?codes=${user.favorites.join(',')}`)
        .then((response) => {
          setFavoriteCountries(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching favorite countries:', err);
          setError('Failed to fetch favorite countries.');
          setLoading(false);
        });
    } else {
      setFavoriteCountries([]);
    }
  }, [user]);

  // Show auth buttons and user info only on home page and its sub-routes
  const isHomeOrDetail = location.pathname === '/' || location.pathname.startsWith('/country');
  const showAuthButtons = !user && isHomeOrDetail;
  const showUserInfo = user && isHomeOrDetail;
  const isLoginOrRegister = location.pathname === '/login' || location.pathname === '/register';

  // If still loading user state, don't render routes or redirect yet
  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-indigo-400 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className={isLoginOrRegister ? '' : 'min-h-screen bg-gray-900'}>
      {isLoginOrRegister ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/country/:code" element={<CountryDetail />} />
        </Routes>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8 flex items-center justify-between bg-gradient-to-r from-indigo-800 to-purple-800 p-4 rounded-xl shadow-lg">
            <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 hover:scale-105 transition-transform duration-300 ease-in-out drop-shadow-lg">
              JSON LAND
            </h1>
            <div className="flex items-center space-x-4">
              {showAuthButtons && (
                <>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                  >
                    Login
                  </Link>
                </>
              )}
              {showUserInfo && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.photo && (
                      <img
                        src={user.photo}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border border-gray-600"
                      />
                    )}
                    <span className="text-gray-100">Hello, {user.username}</span>
                  </div>
                  <button
                    onClick={() => {
                      logoutUser();
                      setUser(null);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </header>
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  <>
                    <SearchFilter setCountries={setCountries} setLoading={setLoading} setError={setError} />
                    {user.favorites && user.favorites.length > 0 && (
                      <>
                        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Favorite Countries</h2>
                        <CountryList countries={favoriteCountries} />
                      </>
                    )}
                    <h2 className="text-2xl font-bold text-indigo-400 mb-4 mt-8">All Countries</h2>
                    {loading && (
                      <p className="text-center mt-8 text-indigo-400 animate-pulse">Loading countries...</p>
                    )}
                    {error && <p className="text-center mt-8 text-red-500">{error}</p>}
                    {!loading && !error && <CountryList countries={countries} />}
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="/country/:code" element={<CountryDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      )}
    </div>
  );
}

// Wrap App with Router to use useLocation
export default function AppWithRouter() {
  return (
    <Router>
      <UserProvider>
        <App />
      </UserProvider>
    </Router>
  );
}