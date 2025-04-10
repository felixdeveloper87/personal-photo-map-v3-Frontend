import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td,
  Button, Spinner, Text, Input, FormControl, FormLabel
} from '@chakra-ui/react';

const AdminPage = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8092';
  const isAdmin = token && email === 'admin@personalphotomap.co.uk';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (email === 'admin@personalphotomap.co.uk') {
          localStorage.setItem('token', data.token);
          localStorage.setItem('email', email);
          setToken(data.token);
        } else {
          setError('Você não tem permissão de administrador.');
        }
      } else {
        setError('Credenciais inválidas.');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Erro ao buscar usuários.');
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Tem certeza que deseja deletar este usuário?');
    if (!confirm) return;
    try {
      const response = await fetch(`${backendUrl}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        alert('Erro ao deletar o usuário.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [token]);

  if (!isAdmin) {
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
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="100%" isLoading={loading}>
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
  }

  return (
    <Box maxW="6xl" mx="auto" mt={10} p={5} boxShadow="md" bg="white" borderRadius="md">
      <Heading mb={6} textAlign="center" color="teal.700">
        Painel de Administração
      </Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>País</Th>
              <Th>Fotos</Th>
              <Th>Ação</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.fullname}</Td>
                <Td>{user.email}</Td>
                <Td>{user.country}</Td>
                <Td>{user.photoCount}</Td>
                <Td>
                  <Button
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Deletar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default AdminPage;
