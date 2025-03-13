import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Input,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Text,
  Select,
} from '@chakra-ui/react';

/**
 * Register Component
 *
 * Handles new user registration by:
 * - Fetching country data from RestCountries
 * - Providing a form for name, email, password, and country
 * - Submitting the form data to the backend for registration
 *
 * @returns {JSX.Element} A registration form with validation feedback
 */
const Register = () => {
  // Form states
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');

  // Dropdown data (countries from RestCountries API)
  const [countries, setCountries] = useState([]);

  // Feedback messages for error/success
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Backend base URL (docker-compose or local)
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8092';

  // React Router hook for navigation after a successful registration
  const navigate = useNavigate();

  /**
   * Logs the backend URL for debugging.
   */
  useEffect(() => {
    console.log('Backend URL:', backendUrl);
  }, [backendUrl]);

  /**
   * Fetches country data from RestCountries, placing "United Kingdom" at the top,
   * then sorts the rest in alphabetical order.
   */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        // Sort with "United Kingdom" on top, then alphabetical
        const sortedCountries = [
          { code: 'GB', name: 'United Kingdom' },
          ...data
            .filter((country) => country.name.common !== 'United Kingdom')
            .map((country) => ({
              code: country.cca2,
              name: country.name.common,
            }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        ];
        setCountries(sortedCountries);
      } catch (err) {
        console.error('Error fetching countries:', err);
      }
    };

    fetchCountries();
  }, []);

  /**
   * Submits the registration data to the backend.
   * On success, clears form, shows success message, and navigates to login.
   * On failure, displays an error message.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { fullname, email, password, country };

    try {
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess('Registration successful!');
        setError('');

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);

        // Clear form fields
        setFullname('');
        setEmail('');
        setPassword('');
        setCountry('');
      } else {
        const result = await response.json();
        setError(result.message || 'Registration failed.');
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setSuccess('');
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={5}
      boxShadow="md"
      borderWidth="1px"
      borderRadius="md"
      bg="white"
    >
      <Heading mb={6} textAlign="center" color="teal.700">
        Register
      </Heading>

      <form onSubmit={handleSubmit}>
        {/* Full Name Field */}
        <FormControl mb={4}>
          <FormLabel>Full Name</FormLabel>
          <Input
            type="text"
            placeholder="Type your full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            isRequired
            focusBorderColor="teal.500"
          />
        </FormControl>

        {/* Email Field */}
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Type your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
            focusBorderColor="teal.500"
          />
        </FormControl>

        {/* Password Field */}
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isRequired
            focusBorderColor="teal.500"
          />
        </FormControl>

        {/* Country Select */}
        <FormControl mb={4}>
          <FormLabel>Country</FormLabel>
          <Select
            placeholder="Select your country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            isRequired
            focusBorderColor="teal.500"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))}
          </Select>
        </FormControl>

        {/* Submit Button */}
        <Button type="submit" colorScheme="teal" width="100%" mt={4}>
          Register
        </Button>
      </form>

      {/* Error or Success Feedback */}
      {error && (
        <Text color="red.500" mt={4} fontWeight="semibold">
          {error}
        </Text>
      )}
      {success && (
        <Text color="green.500" mt={4} fontWeight="semibold">
          {success}
        </Text>
      )}
    </Box>
  );
};

export default Register;
