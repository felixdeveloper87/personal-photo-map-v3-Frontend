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
  useDisclosure,
  Modal,
  Flex,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { SignInButton } from "../components/CustomButtons";
import ResetPasswordModal from "../components/modals/ResetPasswordModal";



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

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [resetEmail, setResetEmail] = useState('');
  const toast = useToast();


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

  const handleResetPassword = () => {
    onClose();
    toast({
      position: "top",
      duration: 6000,
      isClosable: true,
      render: () => (
        <Box
          bg="blue.500"
          color="white"
          px={6}
          py={4}
          borderRadius="lg"
          maxW="420px"
          boxShadow="xl"
        >
          <Flex direction="column">
            <Flex align="center" mb={1}>
              <InfoIcon boxSize={5} mr={3} />
              <Text fontWeight="semibold">Password reset</Text>
            </Flex>
            <Text fontSize="sm">
              You will soon receive an email with instructions to reset your password.
            </Text>
          </Flex>
        </Box>
      ),
    });
    setResetEmail('');
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
      borderColor={'blackAlpha.500'}
    >
      <Heading mb={6} textAlign="center" >
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
          />
        </FormControl>

        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}

          />
        </FormControl>
        <SignInButton type="submit" width="100%" mt={6} />
        <Text mt={4} textAlign="center">
          <Button variant="link" color="teal.500" onClick={onOpen}>
            I've forgotten my password
          </Button>
        </Text>
      </form>
      <ResetPasswordModal
        isOpen={isOpen}
        onClose={onClose}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
        handleResetPassword={handleResetPassword}
      />

    </Box>
  );
}

export default Login;
