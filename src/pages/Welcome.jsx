/**
 * Welcome.jsx
 *
 * Landing page for new users, introducing the Photomap application.
 * Provides Sign In and Sign Up options with a visually engaging background.
 */

import { Box, Button, Heading, Stack, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/continents.jpg";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Flex
      minH={["100vh", "100vh", "100vh"]}
      direction="column"
      justify={["center", "center", "flex-start"]}
      align="center"
      bgImage={`url(${bgImage})`}
      bgSize={["cover", "cover", "contain"]} // cover para mobile, contain para desktop
      bgPosition={["center", "top", "top"]}
      bgRepeat="no-repeat"
      position="relative"
      px={[4, 6, 8]}
      pt={[8, 10, 0]}
    >
      {/* overlay */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg="rgba(0, 0, 0, 0.5)"
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
        bg="rgba(0, 0, 0, 0.6)"
        borderRadius="md"
        boxShadow="lg"
      >
        <Heading
          fontSize={["3xl", "4xl", "5xl"]}
          mb={4}
          textShadow="2px 2px 6px rgba(0, 0, 0, 0.8)"
        >
          Welcome to Photomap - please create an account or log in if you're already registered.
        </Heading>
        <Text
          fontSize={["md", "lg", "xl"]}
          mb={4}
          textShadow="2px 2px 6px rgba(0, 0, 0, 0.8)"
        >
          Explore new ideas, cultures and history around the world. Get real-time information about countries, register your memories and explore our beautiful planet.
        </Text>

        <Text
          fontSize={["sm", "md", "lg"]}
          mb={6}
          textShadow="1px 1px 4px rgba(0, 0, 0, 0.7)"
          color="gray.200"
        >
          To access detailed country insights such as flags, capitals, economic and social data — and most importantly, to add your own photos linked chronologically to each country.
        </Text>


        <Stack direction={["column", "row"]} spacing={4} justify="center">
          <Button colorScheme="blue" size="lg" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button colorScheme="blue" size="lg" onClick={() => navigate("/register")}>
            Sign Up
          </Button>
        </Stack>
      </Box>
    </Flex>
  );
};

export default Welcome;
