// src/components/SplashScreen.jsx
import { Box, Center, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2000); // inicia fade
    const timer2 = setTimeout(() => onFinish(), 3000); // remove completamente

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
      bg="white"
      zIndex={9999}
      opacity={fadeOut ? 0 : 1}
      transition="opacity 1s ease"
    >
      <Center h="100%">
        <Box textAlign="center">
        <Image src={logo} alt="Photomap Logo" boxSize="100px" mb={4} />
          <Text fontSize="3xl" fontWeight="bold" color="gray.700">
            Photomap
          </Text>
        </Box>
      </Center>
    </Box>
  );
};

export default SplashScreen;
