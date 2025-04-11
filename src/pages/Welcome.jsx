// src/pages/Welcome.jsx
import { Box, Button, Heading, Stack, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Flex bg="blue.50" minH="100vh" justify="center" pt={20} px={6}>
      <Box textAlign="center" maxW="xl">
        <Heading mb={4}>Welcome to Photomap 🌍</Heading>
        <Text fontSize="lg" mb={6}>
          Explore new ideas, cultures and history around the world. Get real time information about countries, register your memories and explore our beatiful planet.
        </Text>

        <Stack direction={["column", "row"]} spacing={4} justify="center">
          <Button colorScheme="blue" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button variant="outline" colorScheme="blue" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Welcome;
