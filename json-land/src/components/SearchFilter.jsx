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

  // Define fields needed for the app
  const fields = 'name,capital,population,flags,region,subregion,languages,currencies,timezones,cca2';

  // Fetch countries with server-side filtering when possible
  const fetchAllCountries = useCallback(async () => {
    setLoading(true);
    setError(null); // Clear error on new search
    try {
      let url;
      // Use server-side filtering for name and region, but not language
      if (search) {
        url = `https://restcountries.com/v3.1/name/${encodeURIComponent(search)}?fields=${fields}`;
      } else if (region) {
        url = `https://restcountries.com/v3.1/region/${encodeURIComponent(region)}?fields=${fields}`;
      } else {
        url = `https://restcountries.com/v3.1/all?fields=${fields}`;
      }

      const response = await axios.get(url);
      let filteredCountries = Array.isArray(response.data) ? response.data : [response.data];
      console.log('API Response:', filteredCountries); // Debug log

      // Apply client-side filtering for language
      if (languageSearch) {
        filteredCountries = filteredCountries.filter((country) => {
          if (!country.languages) return false;
          const languageNames = Object.values(country.languages);
          return languageNames.some((lang) =>
            lang.toLowerCase().includes(languageSearch.toLowerCase())
          );
        });
      }

      // Apply client-side filtering for search (if not using /name endpoint)
      if (search && !url.includes('/name/')) {
        filteredCountries = filteredCountries.filter((country) =>
          country.name.common.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply client-side filtering for region (if not using /region endpoint)
      if (region && !url.includes('/region/')) {
        filteredCountries = filteredCountries.filter(
          (country) => country.region === region
        );
      }

      setCountries(filteredCountries);
      setLoading(false);
      if (filteredCountries.length === 0) {
        setError('No countries found matching your criteria.');
      }
    } catch (err) {
      console.error('Error fetching countries:', err);
      setError('Failed to fetch countries.');
      setLoading(false);
      setCountries([]);
    }
  }, [search, region, languageSearch, setCountries, setLoading, setError]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce(() => fetchAllCountries(), 300),
    [fetchAllCountries]
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearch(value);
    setError(null); // Clear error on input change
    debouncedSearch();
  };

  // Handle region filter change
  const handleRegionFilter = useCallback((selectedRegion) => {
    setRegion(selectedRegion);
    setError(null); // Clear error on region change
    debouncedSearch();
  }, [debouncedSearch]);

  // Handle language search change
  const handleLanguageSearchChange = (value) => {
    setLanguageSearch(value);
    setError(null); // Clear error on language change
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