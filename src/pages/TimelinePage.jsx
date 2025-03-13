import React from 'react';
import { Box } from '@chakra-ui/react'; // Importing Chakra UI for layout styling
import { useParams } from 'react-router-dom'; // Hook to retrieve URL parameters
import Timeline from '../components/Timeline'; // Importing the Timeline component

/**
 * TimelinePage Component
 * 
 * This component serves as a wrapper for the `Timeline` component.
 * It extracts the `year` parameter from the URL and passes it as a prop to `Timeline`,
 * allowing dynamic rendering based on the selected year.
 * 
 * @returns {JSX.Element} A responsive container that renders the Timeline component.
 */
function TimelinePage() {
  // Extract the `year` parameter from the URL
  const { year } = useParams(); 

  return (
    <Box p={4} maxW="1600px" mx="auto"> {/* Responsive centered container */}
      <Timeline selectedYear={year} /> {/* Passes the selected year to Timeline */}
    </Box>
  );
}

export default TimelinePage;
