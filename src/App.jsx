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
 */

import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
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
import { SpeedInsights } from "@vercel/speed-insights/react";
import { CountriesProvider } from './context/CountriesContext';
import './styles/leaflet.css';

function App() {

  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <AuthProvider>
      <CountriesProvider>
        <Flex direction="column" minH="100vh">
          <Box as="header">
            <Header />
          </Box>
          <Box as="main" flex="1" pt={isHomePage ? 5 : 0} px={0} pb={0}>
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
        <SpeedInsights />
      </CountriesProvider>
    </AuthProvider>
  );
}

export default App;
