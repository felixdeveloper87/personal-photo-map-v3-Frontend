import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Flag from 'react-world-flags';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { Box, Flex, Heading, Text, Link } from '@chakra-ui/react';
import PhotoManager from '../components/PhotoManager';
import moment from 'moment-timezone'; // Biblioteca para fusos horários

countries.registerLocale(en);

const CountryDetails = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const [countryInfo, setCountryInfo] = useState({
    officialLanguage: '',
    currency: '',
    capital: '',
    population: '',
  });
  const [temperature, setTemperature] = useState(null); // Temperatura atual
  const [exchangeRate, setExchangeRate] = useState(null); // Taxa de conversão
  const [currentTime, setCurrentTime] = useState(null); // Horário atual

  // Constrói URL do Google Flights, ex: Londres -> capital do país
  const googleFlightsUrl = `https://www.google.com/travel/flights?q=Flights+from+London+to+${countryInfo.capital}`;

  useEffect(() => {
    fetch(`https://restcountries.com/v3.1/alpha/${countryId}`)
      .then((response) => response.json())
      .then((data) => {
        const countryData = data[0];
        const officialLanguage = Object.values(countryData.languages || {})[0];
        const currency = Object.keys(countryData.currencies || {})[0];
        const capital = countryData.capital ? countryData.capital[0] : 'N/A';
        const population = countryData.population || 0;

        setCountryInfo({ officialLanguage, currency, capital, population });

        // Busca a temperatura atual e o fuso horário da capital
        if (capital && capital !== 'N/A') {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=e95265ec87670e7e1d84bd49cff7e84c`
          )
            .then((response) => response.json())
            .then((weatherData) => {
              setTemperature(weatherData.main.temp);

              // Obtém o fuso horário da capital
              const timezone = weatherData.timezone; // Offset em segundos
              const currentTimeInCapital = moment().utcOffset(timezone / 60).format('YYYY-MM-DD HH:mm:ss');
              setCurrentTime(currentTimeInCapital);
            })
            .catch((error) => console.error('Erro ao buscar temperatura:', error));
        }

        // Busca a taxa de conversão da moeda local para GBP
        if (currency) {
          fetch(
            `https://v6.exchangerate-api.com/v6/c70ba82c951cf6c5b6757ff5/latest/GBP`
          )
            .then((response) => response.json())
            .then((exchangeData) => {
              const rate = exchangeData.conversion_rates[currency];
              if (rate) {
                setExchangeRate(rate.toFixed(2));
              } else {
                console.error('Taxa de câmbio não encontrada para a moeda:', currency);
              }
              setExchangeRate(exchangeData.conversion_rates[currency]);
            })
            .catch((error) => console.error('Erro ao buscar taxa de câmbio:', error));
        }
      })
      .catch(() => {
        navigate('/not-found');
      });
  }, [countryId, navigate]);

  return (
    <Box p={5}>
      <Heading as="h1" mb={4} textAlign="center">
        Photos in {countries.getName(countryId.toUpperCase(), 'en') || countryId.toUpperCase()}
      </Heading>
      <Flex direction={['column', 'row']} align="center" justify="center" mb={8}>
        {/* Bandeira */}
        <Box flex="0 0 auto" mb={[4, 0]} mr={[0, 8]}>
          <Flag code={countryId.toUpperCase()} style={{ width: '300px', height: 'auto' }} />
        </Box>
        {/* Informações do país */}
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

          {/* Horário atual */}
          {currentTime && (
            <Text mt={2}>
              <b>Current Time in {countryInfo.capital}:</b> {currentTime}
            </Text>
          )}

          {/* Temperatura atual */}
          {temperature !== null && (
            <Text mt={2}>
              <b>Current Temperature in {countryInfo.capital}:</b> {temperature}°C
            </Text>
          )}

          {/* Taxa de conversão */}
          {exchangeRate !== null && (
            <Text mt={2}>
              <b>Exchange Rate (1 £ to {countryInfo.currency}):</b> 1 £ = {exchangeRate} {countryInfo.currency}
            </Text>
          )}

          {/* Link para Google Flights */}
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
      {/* PhotoManager */}
      <PhotoManager countryId={countryId} />
    </Box>
  );
};

export default CountryDetails;