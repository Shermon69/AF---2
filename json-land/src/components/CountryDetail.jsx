import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Component for displaying detailed country information
function CountryDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get(`https://restcountries.com/v3.1/alpha/${code}`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setCountry(response.data[0]);
        } else {
          setError('Country data not found.');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error(`Error fetching country detail for ${code}:`, error);
        setError('Failed to load country details.');
        setLoading(false);
      });
  }, [code]);

  const BackButton = () => (
    <button
      onClick={() => navigate('/')}
      className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to List
    </button>
  );

  if (loading)
    return <p className="text-center mt-8 text-indigo-400 animate-pulse">Loading country details...</p>;

  if (error)
    return (
      <div className="text-center mt-8 px-4">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <BackButton />
      </div>
    );

  if (!country)
    return (
      <div className="text-center mt-8 px-4">
        <p className="text-gray-400 mb-4">No country data available.</p>
        <BackButton />
      </div>
    );

  const getLanguages = (languages) =>
    languages ? Object.values(languages).join(', ') : <span className="text-gray-400">N/A</span>;

  const getCapital = (capital) =>
    capital && capital.length > 0 ? capital.join(', ') : <span className="text-gray-400">N/A</span>;

  const getCurrencies = (currencies) =>
    currencies
      ? Object.entries(currencies)
          .map(([code, c]) => `${c.name} (${c.symbol || code})`)
          .join(', ')
      : <span className="text-gray-400">N/A</span>;

  const formatPopulation = (population) =>
    population !== undefined && population !== null ? (
      population.toLocaleString()
    ) : (
      <span className="text-gray-400">N/A</span>
    );

  return (
    <div className="max-w-4xl mx-auto">
      <BackButton />
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gray-700 flex justify-center">
          <img
            src={country.flags.svg || country.flags.png}
            alt={`${country.name.common} flag`}
            className="object-contain rounded-md border border-gray-600 shadow-md"
            style={{ maxHeight: '200px', width: 'auto' }}
          />
        </div>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-100 mb-2">{country.name.common}</h2>
          {country.name.official && country.name.official !== country.name.common && (
            <p className="text-lg text-gray-400 mb-4 italic">({country.name.official})</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
            <div>
              <span className="font-semibold text-indigo-400">Capital:</span>
              <p className="text-gray-100">{getCapital(country.capital)}</p>
            </div>
            <div>
              <span className="font-semibold text-indigo-400">Region:</span>
              <p className="text-gray-100">{country.region || <span className="text-gray-400">N/A</span>}</p>
            </div>
            <div>
              <span className="font-semibold text-indigo-400">Subregion:</span>
              <p className="text-gray-100">{country.subregion || <span className="text-gray-400">N/A</span>}</p>
            </div>
            <div>
              <span className="font-semibold text-indigo-400">Population:</span>
              <p className="text-gray-100">{formatPopulation(country.population)}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-indigo-400">Languages:</span>
              <p className="text-gray-100">{getLanguages(country.languages)}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-semibold text-indigo-400">Currencies:</span>
              <p className="text-gray-100">{getCurrencies(country.currencies)}</p>
            </div>
            {country.timezones && (
              <div className="md:col-span-2">
                <span className="font-semibold text-indigo-400">Timezones:</span>
                <p className="text-gray-100">{country.timezones.join(', ')}</p>
              </div>
            )}
            {country.maps?.googleMaps && (
              <div>
                <span className="font-semibold text-indigo-400">Map:</span>
                <p>
                  <a
                    href={country.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline transition"
                  >
                    View on Google Maps
                  </a>
                </p>
              </div>
            )}
            {country.cca2 && (
              <div>
                <span className="font-semibold text-indigo-400">Alpha-2 Code:</span>
                <p className="text-gray-100">{country.cca2}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryDetail;