import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react'; // Chakra UI components for layout styling
import Home from './pages/Home';
import Header from './components/Header';
import Login from './components/Login';
import Footer from './components/Footer';
import CountryDetails from './components/CountryDetails';
import Register from './components/Register';
import NotFound from './components/Notfound.jsx';
import About from './pages/About';
import TimelinePage from './pages/TimelinePage';
import { AuthProvider } from './context/AuthContext'; // Authentication context provider
import { CountriesProvider } from './context/CountriesContext'; // Context provider for managing country-related data

/**
 * App Component
 * 
 * This is the root component of the application. It sets up global providers,
 * the main layout structure (Header, Footer, and Content), and defines the
 * routing structure using React Router.
 * 
 * It also manages a state (`updateCounts`) to trigger updates when an upload
 * event occurs.
 * 
 * @returns {JSX.Element} The main application wrapper.
 */
function App() {

  return (
    <AuthProvider> {/* Provides authentication context to the entire app */}
      <CountriesProvider> {/* Provides country-related data to the app */}
        <Flex direction="column" minH="100vh"> {/* Ensures a full-height layout */}
          
          {/* Header Section */}
          <Box as="header">
            <Header />
          </Box>

          {/* Main Content Section */}
          <Box as="main" flex="1" p={4}> {/* Ensures the content takes up available space */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/countries/:countryId" element={<CountryDetails />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/timeline/:year" element={<TimelinePage />} />
              <Route path="*" element={<NotFound />} /> {/* 404 Page */}
            </Routes>
          </Box>

          {/* Footer Section */}
          <Box as="footer">
            <Footer />
          </Box>
          
        </Flex>
      </CountriesProvider>
    </AuthProvider>
  );
}

export default App;
