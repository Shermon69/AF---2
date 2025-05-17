import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const CountryList = ({ countries }) => {
  const { user, handleAddFavorite, handleRemoveFavorite } = useContext(UserContext);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {countries.map((country) => {
        const isFavorite = user && user.favorites && Array.isArray(user.favorites) && user.favorites.includes(country.cca3);
        return (
          <div
            key={country.cca3}
            className="bg-gray-800 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
          >
            <span className="absolute top-3 right-3 text-xs font-semibold text-indigo-100 bg-indigo-600/80 px-2 py-1 rounded-full backdrop-blur-sm border border-indigo-400/30 shadow-sm">
            {country.region}
            </span>
            <Link to={`/country/${country.cca3}`}>
              <img
                src={country.flags.png}
                alt={`${country.name.common} flag`}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h2 className="text-xl font-bold text-indigo-400 mb-2">{country.name.common}</h2>
              <p className="text-gray-300">Capital: {country.capital && country.capital[0] ? country.capital[0] : 'N/A'}</p>
              <p className="text-gray-300">Population: {country.population.toLocaleString()}</p>
            </Link>
            {user && (
              <button
                onClick={() =>
                  isFavorite
                    ? handleRemoveFavorite(country.cca3)
                    : handleAddFavorite(country.cca3)
                }
                className={`mt-4 px-4 py-2 rounded-md text-white transition ${
                  isFavorite
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
                disabled={!user}
              >
                {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CountryList;