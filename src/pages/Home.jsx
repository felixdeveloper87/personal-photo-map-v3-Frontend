import React from 'react';
import { Box } from '@chakra-ui/react'; // Importing Chakra UI for layout styling
import Map from '../components/Map'; // Importing the Map component

/**
 * Home Component
 * 
 * This component serves as the main landing page of the application.
 * It acts as a wrapper for the `Map` component, which displays an interactive map.
 * 
 * @returns {JSX.Element} A simple container rendering the map.
 */
function Home() {
    return (
        <Box> {/* Wrapper to structure the map component */}
            <Map /> {/* Displays the interactive map */}
        </Box>
    );
}

export default Home;


