// src/pages/Welcome.jsx
import { Box, Button, Heading, Stack, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/continents.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Flex
      minH="100vh"
      direction="column"
      justify="flex-start"
      align="center"
      bgImage={`url(${bgImage})`}
      // bgSize="contain"
      bgSize="150%"  
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
      px={6}
    >
      {/* Overlay escuro
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg="blackAlpha.700"
        zIndex={0}
      /> */}

      {/* Conteúdo principal */}
      <Box
        textAlign="center"
        maxW="xl"
        position="relative"
        zIndex={1}
        color="white"
        mt={[10, 12, 16]}
        py={[10, 16, 24]} // padding vertical responsivo
        px={[4, 6, 8]}
      >
        <Heading fontSize={["2xl", "3xl", "4xl"]} mb={4}>
          Welcome to Photomap 🌍
        </Heading>
        <Text fontSize={["md", "lg"]} mb={6}>
          Explore new ideas, cultures and history around the world. Get real-time information about countries, register your memories and explore our beautiful planet.
        </Text>

        <Stack direction={["column", "row"]} spacing={4} justify="center">
          <Button colorScheme="blue" size="lg" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button variant="outline" colorScheme="blue" size="lg" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Welcome;
