/**
 * About.jsx
 *
 * Displays a user's profile information and the list of countries
 * where they have uploaded photos. Uses Chakra UI for layout and styling.
 */


import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import {
  Box,
  Heading,
  Text,
  Avatar,
  Flex,
  Grid,
  Spinner,
  SlideFade,
} from '@chakra-ui/react';

// Configuring the ISO country library to use English as the default locale
countries.registerLocale(en);

const About = () => {
  const { username } = useContext(AuthContext);
  const [countriesWithPhotos, setCountriesWithPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching the list of countries where the user has uploaded photos
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/countries-with-photos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((countriesWithPhotosData) => {
          setCountriesWithPhotos(countriesWithPhotosData);
        })
        .catch((error) => {
          console.error('Error fetching countries with photos:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  // Mapping country codes to country names
  const countryNamesList = countriesWithPhotos.map((code) => {
    const countryName = countries.getName(code.toUpperCase(), 'en');
    return countryName || code;
  });

  return (
    <SlideFade in={true} offsetY="20px">
      <Box p={8} maxW="900px" mx="auto" bg="gray.50" borderRadius="lg" boxShadow="lg">
        {/* User Info Section */}
        <Flex align="center" direction="column" mb={6}>
          <Avatar
            size="xl"
            name={username}
            src="https://via.placeholder.com/150" 
            mb={4}
          />
          <Heading as="h1" size="xl">
            {username}
          </Heading>
          <Text fontSize="md" color="gray.600">
            Travel Enthusiast & Photography Lover
          </Text>
        </Flex>

        {/* Countries Visited Section */}
        <Box textAlign="center">
          <Heading as="h2" size="lg" mb={4}>
            🌍 Countries I've Been To
          </Heading>

          {loading ? (
            <Spinner size="lg" thickness="4px" speed="0.65s" color="blue.500" />
          ) : countriesWithPhotos.length > 0 ? (
            <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={4}>
              {countryNamesList.map((country, index) => (
                <Box
                  key={index}
                  bg="blue.100"
                  color="blue.800"
                  p={3}
                  borderRadius="md"
                  fontWeight="bold"
                  textAlign="center"
                  transition="0.3s"
                  _hover={{ bg: 'blue.300', transform: 'scale(1.05)' }}
                >
                  {country}
                </Box>
              ))}
            </Grid>
          ) : (
            <Text fontSize="lg" color="gray.500">
              No countries added yet. Start your journey! ✈️
            </Text>
          )}
        </Box>
      </Box>
    </SlideFade>
  );
};

export default About;
