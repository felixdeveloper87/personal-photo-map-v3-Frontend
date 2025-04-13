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
      // bgSize={["150%", "150%", "contain"]}
      // bgSize={["cover", "cover", "contain"]}
      bgSize="contain"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
      px={[4, 6, 8]}
      pt={0}
    >
      {/* overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg="gray.700"
        opacity={0.1}
        zIndex={0}
      />

      {/* Conteúdo principal */}
      <Box
        textAlign="center"
        maxW="xl"
        position="relative"
        zIndex={1}
        color="white"
        py={[2, 4, 8]}
        px={[2, 4, 6]}
      >
        <Heading
          fontSize={["3xl", "4xl", "5xl"]}
          mb={4}
          textShadow="0 2px 4px black"
        >
          Welcome to Photomap
        </Heading>
        <Text
          fontSize={["md", "lg", "xl"]}
          mb={6}
          textShadow="0 4px 2px black"
        >
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
