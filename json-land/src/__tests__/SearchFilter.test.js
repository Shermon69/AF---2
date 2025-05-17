import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import SearchFilter from '../components/SearchFilter';
import '@testing-library/jest-dom';

jest.mock('axios');
jest.mock('lodash.debounce', () => jest.fn(fn => fn));

describe('SearchFilter', () => {
  const mockSetCountries = jest.fn();
  const mockSetLoading = jest.fn();
  const mockSetError = jest.fn();

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [{ name: { common: 'United States' } }, { name: { common: 'Canada' } }] });
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders search and filter inputs', () => {
    render(
      <MemoryRouter>
        <SearchFilter setCountries={mockSetCountries} setLoading={mockSetLoading} setError={mockSetError} />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText('Search by country name...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search by language...')).toBeInTheDocument();
    expect(screen.getByText('All Regions')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('filters countries by search term', async () => {
    render(
      <MemoryRouter>
        <SearchFilter setCountries={mockSetCountries} setLoading={mockSetLoading} setError={mockSetError} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Search by country name...'), { target: { value: 'United' } });
    expect(mockSetCountries).toHaveBeenCalledWith(expect.arrayContaining([{ name: { common: 'United States' } }]));
  });

  test('filters countries by region', async () => {
    render(
      <MemoryRouter>
        <SearchFilter setCountries={mockSetCountries} setLoading={mockSetLoading} setError={mockSetError} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText('Filter by region'), { target: { value: 'Americas' } });
    expect(mockSetCountries).toHaveBeenCalledWith(expect.arrayContaining([{ name: { common: 'United States' } }, { name: { common: 'Canada' } }]));
  });

  test('triggers immediate search on Enter key', async () => {
    render(
      <MemoryRouter>
        <SearchFilter setCountries={mockSetCountries} setLoading={mockSetLoading} setError={mockSetError} />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText('Search by country name...'), { target: { value: 'United' } });
    fireEvent.keyPress(screen.getByPlaceholderText('Search by country name...'), { key: 'Enter', code: 'Enter' });
    expect(mockSetCountries).toHaveBeenCalledWith(expect.arrayContaining([{ name: { common: 'United States' } }]));
  });

  test('shows error on fetch failure', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    render(
      <MemoryRouter>
        <SearchFilter setCountries={mockSetCountries} setLoading={mockSetLoading} setError={mockSetError} />
      </MemoryRouter>
    );
    expect(mockSetError).toHaveBeenCalledWith('Failed to fetch countries.');
  });
});