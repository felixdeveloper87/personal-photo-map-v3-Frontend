import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/logo.png";
import bgImage from "../assets/background.jpg";

// Componentes animados com motion
const MotionBox = motion(Box);
const MotionImage = motion(Image);
const MotionText = motion(Text);

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
    <MotionBox
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg="black"
      zIndex={9999}
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 1 }}
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
        <MotionImage
          src={logo}
          alt="Photomap Logo"
          boxSize={["60px", "80px", "100px"]}
          mb={1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* TÍTULO: Welcome to Photomap */}
        <MotionText
          fontSize={["2xl", "3xl", "5xl"]}
          fontWeight="extrabold"
          color="white"
          mb={3}
          sx={{
            WebkitTextStroke: "1px black",
            textStroke: "1px black",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Welcome to Photomap
        </MotionText>

        {/* MAPA (imagem de fundo) */}
        <MotionBox
          w={["90%", "80%", "60%"]}
          h={["250px", "400px", "700px"]}
          bgImage={`url(${bgImage})`}
          bgSize="150%" // ou ajuste conforme necessário
          bgPosition="center"
          bgRepeat="no-repeat"
          position="relative"
          borderRadius="3xl"
          overflow="hidden"
          mb={4}
          bgColor="black"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />

        {/* SUBTÍTULO */}
        <MotionText
          fontSize={["md", "lg", "xl"]}
          color="gray.300"
          maxW="90%"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.2 }}
        >
          Discover cultures, save memories, and explore the world — one photo at a time.
        </MotionText>
      </Flex>
    </MotionBox>
  );

};

export default SplashScreen;
