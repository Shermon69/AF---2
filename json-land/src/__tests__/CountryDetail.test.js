import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CountryDetail from '../components/CountryDetail';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ code: 'US' }),
}));

describe('CountryDetail', () => {
  const mockCountry = {
    name: { common: 'United States', official: 'United States of America' },
    flags: { svg: 'us.svg', png: 'us.png' },
    capital: ['Washington, D.C.'],
    region: 'North America',
    subregion: 'Northern America',
    population: 331002651,
    languages: { eng: 'English' },
    currencies: { USD: { name: 'US Dollar', symbol: '$' } },
    timezones: ['UTC-05:00', 'UTC-04:00'],
    maps: { googleMaps: 'https://goo.gl/maps/us' },
    cca2: 'US',
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [mockCountry] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading country details...')).toBeInTheDocument();
  });

  test('renders country details on successful fetch', async () => {
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );
    expect(await screen.findByText('United States')).toBeInTheDocument();
    expect(screen.getByText('Capital: Washington, D.C.')).toBeInTheDocument();
    expect(screen.getByText('Population: 331,002,651')).toBeInTheDocument();
    expect(screen.getByText('Languages: English')).toBeInTheDocument();
    expect(screen.getByText('View on Google Maps')).toHaveAttribute('href', 'https://goo.gl/maps/us');
  });

  test('renders error state on fetch failure', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );
    expect(await screen.findByText('Failed to load country details.')).toBeInTheDocument();
    expect(screen.getByText('Back to List')).toBeInTheDocument();
  });

  test('navigates back on button click', () => {
    axios.get.mockResolvedValue({ data: [mockCountry] });
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Back to List'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});