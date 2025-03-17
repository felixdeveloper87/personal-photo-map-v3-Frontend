import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Flag from 'react-world-flags';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { Box, Flex, Heading, Text, Link } from '@chakra-ui/react';
import PhotoManager from '../components/PhotoManager';
import moment from 'moment-timezone';

/**
 * Registers the English locale so that i18n-iso-countries can
 * retrieve country names in English.
 */
countries.registerLocale(en);

/**
 * Fetches country metadata (language, currency, capital, population)
 * from restcountries.com.
 * @param {string} countryId - ISO alpha-2 or alpha-3 country code
 */
const fetchCountryData = async (countryId) => {
  const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryId}`);
  if (!response.ok) throw new Error('Country not found');
  const data = await response.json();
  const countryData = data[0];
  return {
    officialLanguage: Object.values(countryData.languages || {})[0] || 'N/A',
    currency: Object.keys(countryData.currencies || {})[0] || 'N/A',
    capital: countryData.capital ? countryData.capital[0] : 'N/A',
    population: countryData.population || 0,
  };
};

/**
 * Fetches current weather data for the provided capital city.
 * @param {string} capital - The capital city name
 */
const fetchWeatherData = async (capital) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=e95265ec87670e7e1d84bd49cff7e84c`
  );
  if (!response.ok) throw new Error('Weather data not found');
  const data = await response.json();
  return {
    temperature: data.main.temp,
    timezone: data.timezone,
  };
};

/**
 * Fetches the exchange rate from GBP (British Pound) to the specified currency.
 * @param {string} currency - The currency code (e.g., "BRL", "USD").
 */
const fetchExchangeRate = async (currency) => {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/c70ba82c951cf6c5b6757ff5/latest/GBP`
  );
  if (!response.ok) throw new Error('Exchange rate not found');
  const data = await response.json();
  const rate = data.conversion_rates[currency];
  return rate ? rate.toFixed(2) : null;
};

/**
 * CountryDetails Component
 *
 * Displays detailed information about a specific country, including:
 * - Official language, currency, capital, population
 * - Current weather details (if available)
 * - Exchange rate from GBP
 * - A photo manager to view/upload photos for that country
 */
const CountryDetails = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query for country data
  const {
    data: countryInfo,
    isLoading: countryLoading,
    error: countryError,
  } = useQuery({
    queryKey: ['country', countryId],
    queryFn: () => fetchCountryData(countryId),
    staleTime: 1000 * 60 * 10,    // 10 minutes
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    onError: () => {
      navigate('/not-found');
    },
  });

  // Query for weather data (enabled if capital is valid)
  const { data: weatherData } = useQuery({
    queryKey: ['weather', countryInfo?.capital],
    queryFn: () => fetchWeatherData(countryInfo.capital),
    enabled: !!countryInfo?.capital && countryInfo.capital !== 'N/A',
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Query for exchange rate (enabled if currency is valid)
  const { data: exchangeRate } = useQuery({
    queryKey: ['exchangeRate', countryInfo?.currency],
    queryFn: () => fetchExchangeRate(countryInfo.currency),
    enabled: !!countryInfo?.currency,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  /**
   * Debug: check which countries are currently in the cache
   */
  const allQueries = queryClient.getQueryCache().getAll();
  const cachedCountries = allQueries
    .filter((query) => query.queryKey[0] === 'country')
    .map((query) => query.queryKey[1]);
  console.log('Countries currently in cache:', cachedCountries);

  // Loading or error states
  if (countryLoading) {
    return <Text>Loading...</Text>;
  }
  if (countryError) {
    return null;
  }

  // Format current time based on the country's timezone
  const currentTime = weatherData?.timezone
    ? moment().utcOffset(weatherData.timezone / 60).format('HH:mm:ss')
    : null;

  // Build a link to Google Flights for traveling from London to this capital
  const googleFlightsUrl = `https://www.google.com/travel/flights?q=Flights+from+London+to+${countryInfo?.capital}`;

  return (
    <Box
      minH="50vh"
      p={5}
      bgGradient="linear(to-r, #006d77, #83c5be)"

    >
      {/* Semi-transparent overlay to improve text readability */}
      <Box bg="whiteAlpha.800" p={6} borderRadius="md">
        <Heading as="h1" mb={4} textAlign="center">
          Photos in {countries.getName(countryId.toUpperCase(), 'en') || countryId.toUpperCase()}
        </Heading>

        <Flex direction={['column', 'row']} align="center" justify="center" mb={8}>
          <Box flex="0 0 auto" mb={[4, 0]} mr={[0, 8]}>
            <Flag code={countryId.toUpperCase()} style={{ width: '350px', height: 'auto' }} />
          </Box>
          <Box textAlign={['center', 'left']}>
            <Text>
              <b>Capital:</b> {countryInfo.capital}
            </Text>
            <Text>
              <b>Official Language:</b> {countryInfo.officialLanguage}
            </Text>
            <Text>
              <b>Currency:</b> {countryInfo.currency}
            </Text>
            <Text>
              <b>Population:</b> {countryInfo.population.toLocaleString('en-US')}
            </Text>
            {currentTime && (
              <Box>
                <Text>
                  <b>Actual day in {countryInfo.capital}:</b>{" "}
                  {new Date().toLocaleDateString("en-GB")} {/* Formato: DD/MM/YYYY */}
                </Text>
                <Text>
                  <b>Actual Time in {countryInfo.capital}:</b> {currentTime}
                </Text>
              </Box>
            )}
            {weatherData?.temperature && (
              <Text mt={2}>
                <b>Current Temperature in {countryInfo.capital}:</b>{' '}
                {weatherData.temperature}°C
              </Text>
            )}
            {exchangeRate && (
              <Text mt={2}>
                <b>Exchange Rate (1 £ to {countryInfo.currency}):</b> 1 £ = {exchangeRate}{' '}
                {countryInfo.currency}
              </Text>
            )}
            {countryInfo.capital && countryInfo.capital !== 'N/A' && (
              <Text mt={2}>
                <b>Flights from London:</b>{' '}
                <Link
                  href={googleFlightsUrl}
                  isExternal
                  color="blue.500"
                  textDecoration="underline"
                >
                  Check availability
                </Link>
              </Text>
            )}
          </Box>
        </Flex>

        {/* Photo management section for this country */}
        <PhotoManager countryId={countryId} />
      </Box>
    </Box>
  );
};

export default CountryDetails;
