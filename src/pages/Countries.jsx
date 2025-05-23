/**
 * Countries.jsx
 *
 * Renders the CountryDetails component based on the dynamic countryId from the route.
 * Acts as a route-level container for viewing individual country pages in Photomap.
 */


import React from 'react';
import { useParams } from 'react-router-dom';
import CountryDetails from '../components/CountryDetails';
import { Box } from '@chakra-ui/react'; 

/**
 * Countries Component
 * 
 * This component serves as a container for displaying details of a selected country.
 * It extracts the `countryId` parameter from the URL and passes it to the `CountryDetails` component.
 * 
 * @returns {JSX.Element} A wrapper that dynamically loads the country details.
 */
function Countries() {
  // Extract the country ID from the URL parameters
  const { countryId } = useParams();

  return (
    <Box p={4} maxW="800px" mx="auto"> {/* Centered container with padding */}
      <CountryDetails countryId={countryId} /> {/* Loads the details of the selected country */}
    </Box>
  );
}

export default Countries;
