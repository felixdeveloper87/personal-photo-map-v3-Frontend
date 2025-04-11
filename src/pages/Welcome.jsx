// src/pages/Welcome.jsx
import { Box, Button, Heading, Stack, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/continents.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Flex
      minH="100vh"
      justify="center"
      align="flex-start"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
      px={6}
    >
      {/* Overlay escuro */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg="blackAlpha.700"
        zIndex={0}
      />

      {/* Conteúdo principal */}
      <Box
        textAlign="center"
        maxW="xl"
        position="relative"
        zIndex={1}
        color="white"
        py={[16, 24]} // padding vertical responsivo
      >
        <Heading mb={4}>Welcome to Photomap 🌍</Heading>
        <Text fontSize="lg" mb={6}>
          Explore new ideas, cultures and history around the world. Get real time information about countries, register your memories and explore our beautiful planet.
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
