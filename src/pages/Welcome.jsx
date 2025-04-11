// src/pages/Welcome.jsx
import { Box, Button, Heading, Stack, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Flex bg="blue.50" minH="100vh" justify="center" pt={20} px={6}>
      <Box textAlign="center" maxW="xl">
        <Heading mb={4}>Bem-vindo ao Photomap 🌍</Heading>
        <Text fontSize="lg" mb={6}>
          Descubra países, culturas e histórias ao redor do mundo. Receba informações em tempo real sobre os destinos, registre suas memórias de viagem e explore nosso planeta com propósito.
        </Text>

        <Stack direction={["column", "row"]} spacing={4} justify="center">
          <Button colorScheme="blue" onClick={() => navigate("/login")}>
            Fazer Login
          </Button>
          <Button variant="outline" colorScheme="blue" onClick={() => navigate("/register")}>
            Criar Conta
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Welcome;
