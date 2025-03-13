import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Input,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Text,
} from '@chakra-ui/react';

/**
 * The Login component handles user authentication by:
 * - Accepting an email and password.
 * - Sending credentials to the backend for validation.
 * - Storing the JWT/response in AuthContext upon success.
 *
 * @returns {JSX.Element} A login form with email and password fields.
 */
function Login() {
  // Local states for form inputs and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Navigation hook for redirecting upon successful login
  const navigate = useNavigate();

  // Auth context method for updating global authentication state
  const { login } = useContext(AuthContext);

  /**
   * Submits the login form:
   * - Sends a POST request with email/password to the login endpoint.
   * - On success, updates context and redirects to the homepage.
   * - On failure, displays an error message.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Login response:', data);
      login(data);
      navigate('/'); // Redirect to the homepage on successful login
    } catch (error) {
      setError(error.message);
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
        Login
      </Heading>

      {/* Error message display */}
      {error && (
        <Text color="red.500" mb={4} fontWeight="semibold">
          {error}
        </Text>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            focusBorderColor="teal.500"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            focusBorderColor="teal.500"
          />
        </FormControl>

        <Button type="submit" colorScheme="teal" width="100%" mt={6}>
          Login
        </Button>
      </form>
    </Box>
  );
}

export default Login;
