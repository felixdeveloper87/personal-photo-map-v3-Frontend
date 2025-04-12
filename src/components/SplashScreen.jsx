import { Box, Center, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import bgImage from "../assets/background.jpg";

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2000);
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
      zIndex={9999}
      opacity={fadeOut ? 0 : 1}
      transition="opacity 1s ease"
      bg="blackAlpha.700"
    >
      {/* LOGO ACIMA DO MAPA */}
      <Box textAlign="center" pt={[10, 12]} zIndex={2} position="relative">
        <Image src={logo} alt="Photomap Logo" boxSize="80px" mx="auto" mb={2} />
      </Box>

      {/* MAPA COMO IMAGEM DE FUNDO */}
      <Box
        position="relative"
        w="100%"
        h={["60vh", "70vh"]}
        bgImage={`url(${bgImage})`}
        bgSize="contain"
        bgPosition="center"
        bgRepeat="no-repeat"
        mt={4}
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
          <Text fontSize={["2xl", "3xl"]} fontWeight="bold" color="white">
            Welcome to Photomap
          </Text>
        </Center>
      </Box>
    </Box>
  );
};

export default SplashScreen;
