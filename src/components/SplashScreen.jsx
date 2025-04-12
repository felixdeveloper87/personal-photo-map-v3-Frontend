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
        {/* LOGO animado */}
        <MotionImage
          src={logo}
          alt="Photomap Logo"
          boxSize={["60px", "80px", "100px"]}
          mb={6}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        />

        {/* MAPA COM OVERLAY + TEXTO */}
        <MotionBox
          w={["90%", "80%", "60%"]}
          h={["250px", "300px", "400px"]}
          bgImage={`url(${bgImage})`}
          bgSize="contain"
          bgPosition="center"
          bgRepeat="no-repeat"
          position="relative"
          borderRadius="2x1"
          overflow="hidden"
          mb={6}
          bgColor="black"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {/* Texto central */}
          <Flex
            align="center"
            justify="center"
            h="100%"
            position="relative"
            zIndex={2}
          >
            <MotionText
              fontSize={["xl", "2xl", "3xl"]}
              fontWeight="bold"
              color="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Welcome to Photomap
            </MotionText>
          </Flex>
        </MotionBox>

        {/* SUBTÍTULO */}
        <MotionText
          fontSize={["sm", "md"]}
          color="gray.400"
          maxW="80%"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          Discover cultures, save memories, and explore the world — one photo at a time.
        </MotionText>
      </Flex>
    </MotionBox>
  );
};

export default SplashScreen;
