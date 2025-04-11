// src/components/SplashScreen.jsx
import { Box, Center, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import bgImage from "../assets/background.jpg";

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2000); // inicia fade ee
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
      zIndex={9999}
      opacity={fadeOut ? 0 : 1}
      transition="opacity 1s ease"
      bgImage={`url(${bgImage})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
    >
      {/* Overlay escuro pra dar contraste */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg="blackAlpha.700"
      />

      <Center h="100%" position="relative" zIndex={1}>
        <Box textAlign="center">
          <Image src={logo} alt="Photomap Logo" boxSize="100px" mb={4} />
          <Text fontSize="3xl" fontWeight="bold" color="white">
            Welcome to Photomap
          </Text>
        </Box>
      </Center>
    </Box>
  );
};

export default SplashScreen;
