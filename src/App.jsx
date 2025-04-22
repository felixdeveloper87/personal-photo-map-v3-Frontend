import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react'; // Chakra UI components for layout styling
import Home from './pages/Home';
import Header from './components/Header';
import Login from './components/Login';
import Footer from './components/Footer';
import CountryDetails from './components/CountryDetails';
import Register from './components/Register';
import Contact from "./pages/Contact";
import NotFound from './components/Notfound.jsx';
import About from './pages/About';
import Welcome from './pages/Welcome.jsx';
import AdminPage from './pages/AdminPage';
import TimelinePage from './pages/TimelinePage';
import { AuthProvider } from './context/AuthContext';
import { CountriesProvider } from './context/CountriesContext';
import './styles/leaflet.css';


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
    <AuthProvider>
      <CountriesProvider>
          <Flex direction="column" minH="100vh">
            <Box as="header">
              <Header />
            </Box>
            <Box as="main" flex="1" p={4}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/countries/:countryId" element={<CountryDetails />} />
                <Route path="/timeline" element={<TimelinePage />} />
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/timeline/:year" element={<TimelinePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
            <Box as="footer">
              <Footer />
            </Box>
          </Flex>
        )}
      </CountriesProvider>
    </AuthProvider>
  );
}

export default App;
