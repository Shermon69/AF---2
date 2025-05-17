import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from './Auth';
import { UserContext } from '../context/UserContext';

// Register component for user registration with photo upload
const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  // Handle file input for profile photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result); // Store base64 string
      };
      reader.readAsDataURL(file);
    } else {
      setError('Please upload a valid image file');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !photo) {
      setError('All fields are required');
      return;
    }
    try {
      const user = registerUser({ username, email, password, photo });
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
      <div className="py-10">
        <div className="bg-black bg-opacity-50 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white border-opacity-20">
          <h1 className="text-4xl font-extrabold text-transparent mb-10 text-center bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text tracking-wide drop-shadow-lg">JSON LAND</h1>
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Register</h2>
          {error && <p className="text-red-300 mb-6 text-center bg-red-900 bg-opacity-70 p-3 rounded-lg">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-200 mb-2 font-medium" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-4 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-200 mb-2 font-medium" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-200 mb-2 font-medium" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition duration-200"
                required
              />
            </div>
            <div className="mb-8">
              <label className="block text-gray-200 mb-2 font-medium" htmlFor="photo">
                Profile Photo
              </label>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full p-4 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white file:hover:bg-blue-700"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition duration-200 font-semibold tracking-wide"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-300">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition duration-200">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;