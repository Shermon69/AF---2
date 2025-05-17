import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from './Auth';
import { UserContext } from '../context/UserContext';

// Login component for user authentication
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      const user = loginUser(email, password);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('https://www.wallpaperflare.com/static/832/647/752/map-countries-black-world-wallpaper.jpg')`
      }}
    >
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white border-opacity-20">
      <h1 className="text-5xl font-bold text-center mb-12 font-serif">
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-50 to-blue-300 
                  tracking-tight drop-shadow-xl
                  pb-2 border-b border-blue-500/30">
    JSON <span className="text-blue-400/80 font-light">LAND</span>
  </span>
</h1>
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center tracking-tight">Login</h2>
        {error && <p className="text-red-300 mb-6 text-center bg-red-800 bg-opacity-50 p-3 rounded-lg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-200 mb-2 font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-800 bg-opacity-50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-200 mb-2 font-medium" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 bg-gray-800 bg-opacity-50 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition duration-200 font-semibold tracking-wide"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition duration-200">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;