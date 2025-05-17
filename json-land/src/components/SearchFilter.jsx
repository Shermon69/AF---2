import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';

// Component for searching and filtering countries
function SearchFilter({ setCountries, setLoading, setError }) {
  const [search, setSearch] = useState(localStorage.getItem('lastSearch') || '');
  const [region, setRegion] = useState(localStorage.getItem('lastRegion') || '');
  const [languageSearch, setLanguageSearch] = useState(localStorage.getItem('lastLanguageSearch') || '');

  // Persist search, region, and language search to localStorage
  useEffect(() => {
    localStorage.setItem('lastSearch', search);
    localStorage.setItem('lastRegion', region);
    localStorage.setItem('lastLanguageSearch', languageSearch);
  }, [search, region, languageSearch]);

  // Fetch all countries
  const fetchAllCountries = useCallback(() => {
    setLoading(true);
    setError(null);
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((response) => {
        let filteredCountries = response.data;

        // Apply search filter client-side (by country name)
        if (search) {
          filteredCountries = filteredCountries.filter((country) =>
            country.name.common.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Apply region filter client-side
        if (region) {
          filteredCountries = filteredCountries.filter(
            (country) => country.region === region
          );
        }

        // Apply language filter client-side
        if (languageSearch) {
          filteredCountries = filteredCountries.filter((country) => {
            if (!country.languages) return false;
            const languageNames = Object.values(country.languages);
            return languageNames.some((lang) =>
              lang.toLowerCase().includes(languageSearch.toLowerCase())
            );
          });
        }

        setCountries(filteredCountries);
        setLoading(false);
        if (filteredCountries.length === 0) {
          setError('No countries found matching your criteria.');
        }
      })
      .catch((err) => {
        console.error('Error fetching all countries:', err);
        setError('Failed to fetch countries.');
        setLoading(false);
        setCountries([]);
      });
  }, [search, region, languageSearch, setCountries, setLoading, setError]);

  // Debounced search handler (inline function)
  const debouncedSearch = useCallback(
    debounce(() => fetchAllCountries(), 300),
    [fetchAllCountries]
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearch(value);
    debouncedSearch();
  };

  // Handle region filter change (inline function)
  const handleRegionFilter = useCallback((selectedRegion) => {
    setRegion(selectedRegion);
    debouncedSearch();
  }, [debouncedSearch]);

  // Handle language search change
  const handleLanguageSearchChange = (value) => {
    setLanguageSearch(value);
    debouncedSearch();
  };

  // Handle Enter key for immediate search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      debouncedSearch.cancel(); // Cancel pending debounced call
      fetchAllCountries(); // Immediate fetch
    }
  };

  // Initial fetch on component mount to restore search or filter state
  useEffect(() => {
    fetchAllCountries();
  }, [fetchAllCountries]);

  // Clean up debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4">
      <div className="flex flex-grow">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          placeholder="Search by country name..."
          className="p-3 bg-gray-800 border border-gray-700 rounded-l-md flex-grow text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => {
            debouncedSearch.cancel();
            fetchAllCountries();
          }}
          className="px-4 py-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
          aria-label="Search countries"
        >
          Search
        </button>
      </div>
      <select
        value={region}
        onChange={(e) => handleRegionFilter(e.target.value)}
        className="p-3 bg-gray-800 border border-gray-700 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Filter by region"
      >
        <option value="">All Regions</option>
        <option value="Africa">Africa</option>
        <option value="Americas">Americas</option>
        <option value="Asia">Asia</option>
        <option value="Europe">Europe</option>
        <option value="Oceania">Oceania</option>
      </select>
      <input
        type="text"
        value={languageSearch}
        onChange={(e) => handleLanguageSearchChange(e.target.value)}
        onKeyPress={handleSearchKeyPress}
        placeholder="Search by language..."
        className="p-3 bg-gray-800 border border-gray-700 rounded-md flex-grow text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

export default SearchFilter;