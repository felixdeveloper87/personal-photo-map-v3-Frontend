// src/components/CustomToast.jsx
import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import { Box, Flex, Text } from "@chakra-ui/react";

export const showSuccessToast = (toast, message = "Action completed successfully") => {
  toast({
    position: "top",
    duration: 3000,
    isClosable: true,
    render: () => (
      <Box
        bg="green.500"
        color="white"
        px={6}
        py={4}
        borderRadius="lg"
        maxW="420px"
        boxShadow="xl"
      >
        <Flex direction="column">
          <Flex align="center" mb={1}>
            <CheckCircleIcon boxSize={5} mr={3} />
            <Text fontWeight="semibold">Success!</Text>
          </Flex>
          <Text fontSize="sm">{message}</Text>
        </Flex>
      </Box>
    ),
  });
};

export const showErrorToast = (toast, message = "Something went wrong") => {
  toast({
    position: "top",
    duration: 3000,
    isClosable: true,
    render: () => (
      <Box
        bg="red.500"
        color="white"
        px={6}
        py={4}
        borderRadius="lg"
        maxW="420px"
        boxShadow="xl"
      >
        <Flex direction="column">
          <Flex align="center" mb={1}>
            <WarningTwoIcon boxSize={5} mr={3} />
            <Text fontWeight="semibold">Error!</Text>
          </Flex>
          <Text fontSize="sm">{message}</Text>
        </Flex>
      </Box>
    ),
  });
};
