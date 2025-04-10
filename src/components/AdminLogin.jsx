import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Input,
  Button,
  Heading,
  FormControl,
  FormLabel,
  Text
} from '@chakra-ui/react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8092';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (email === 'admin@personalphotomap.co.uk') {
          // Armazena o token e redireciona
          localStorage.setItem('token', data.token);
          window.location.href = '/admin';
        } else {
          setError('Você não tem permissão de administrador.');
        }
      } else {
        setError('Credenciais inválidas.');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor.');
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} boxShadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <Heading mb={6} textAlign="center" color="teal.700">
        Admin Login
      </Heading>

      <form onSubmit={handleLogin}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="admin@personalphotomap.co.uk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isRequired
            focusBorderColor="teal.500"
          />
        </FormControl>

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

        <Button type="submit" colorScheme="teal" width="100%" mt={4}>
          Login
        </Button>
      </form>

      {error && (
        <Text color="red.500" mt={4} fontWeight="semibold">
          {error}
        </Text>
      )}
    </Box>
  );
};

export default AdminLogin;
