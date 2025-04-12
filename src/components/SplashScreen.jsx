import { Box, Flex, Image, Text } from "@chakra-ui/react";
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
      bg="black" // fundo único preto
    >
      {/* Conteúdo centralizado com overlay */}
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="100%"
        position="relative"
        zIndex={1}
        textAlign="center"
        px={4}
      >
        <Box mb={6}>
          <Image src={logo} alt="Photomap Logo" boxSize="90px" mx="auto" />
        </Box>

        <Box
          w={["90%", "80%", "70%"]}
          h={["250px", "300px", "800px"]}
          bgImage={`url(${bgImage})`}
          bgSize="contain"
          bgPosition="center"
          bgRepeat="no-repeat"
          bgColor="black"
          position="relative"
        >
          {/* Overlay preto sobre a imagem */}
          <Box
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            bg="blackAlpha.700"
            zIndex={0}
          />

          {/* Texto sobre o mapa */}
          <Flex
            align="center"
            justify="center"
            h="100%"
            position="relative"
            zIndex={1}
          >
            <Text fontSize={["2xl", "3xl"]} fontWeight="bold" color="white">
              Welcome to Photomap
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default SplashScreen;
