/**
 * TimelinePage Component
 * 
 * This component serves as a wrapper for the `Timeline` component.
 * It extracts the `year` parameter from the URL and passes it as a prop to `Timeline`,
 * allowing dynamic rendering based on the selected year.
 * 
 */

import React from 'react';
import { Box } from '@chakra-ui/react'; 
import { useParams } from 'react-router-dom'; 
import Timeline from '../components/Timeline'; 


function TimelinePage() {
  // Extract the `year` parameter from the URL
  const { year } = useParams(); 

  return (
    <Box p={4} maxW="1600px" mx="auto"> 
      <Timeline selectedYear={year} /> {/* Passes the selected year to Timeline */}
    </Box>
  );
}

export default TimelinePage;
