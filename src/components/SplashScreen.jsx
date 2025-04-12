import { Box, Flex, Image, Text, keyframes } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import bgImage from "../assets/background.jpg";

// Animações simples
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2200);
    const timer2 = setTimeout(() => onFinish(), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="black"
      zIndex={9999}
      opacity={fadeOut ? 0 : 1}
      transition="opacity 1s ease"
    >
      <Flex
        direction="column"
        align="center"
        justify="center"
        h="100%"
        px={4}
        textAlign="center"
      >
        {/* LOGO */}
        <Image
          src={logo}
          alt="Photomap Logo"
          boxSize={["60px", "80px", "100px"]}
          mb={6}
          animation={`${fadeIn} 1s ease-in`}
        />

        {/* MAPA COM OVERLAY */}
        <Box
          w={["90%", "80%", "60%"]}
          h={["250px", "300px", "400px"]}
          bgImage={`url(${bgImage})`}
          bgSize="contain"
          bgPosition="center"
          bgRepeat="no-repeat"
          position="relative"
          boxShadow="lg"
          borderRadius="lg"
          overflow="hidden"
          mb={6}
        >
          {/* Overlay escuro */}
          <Box
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            bg="blackAlpha.700"
            zIndex={1}
          />

          {/* Texto sobre o mapa */}
          <Flex
            align="center"
            justify="center"
            h="100%"
            position="relative"
            zIndex={2}
          >
            <Text
              fontSize={["xl", "2xl", "3xl"]}
              fontWeight="bold"
              color="white"
              animation={`${fadeIn} 1.5s ease-in`}
            >
              Welcome to Photomap
            </Text>
          </Flex>
        </Box>

        {/* SUBTÍTULO OPCIONAL */}
        <Text
          fontSize={["sm", "md"]}
          color="gray.400"
          maxW="80%"
          animation={`${fadeIn} 2s ease-in`}
        >
          Discover cultures, save memories, and explore the world — one photo at a time.
        </Text>
      </Flex>
    </Box>
  );
};

export default SplashScreen;
