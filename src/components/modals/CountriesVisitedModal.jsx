import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

function CountriesVisitedModal({ isOpen, onClose, countryCount }) {
  const backgroundGradient = useColorModeValue(
    "linear(to-r, rgb(151, 205, 228),rgb(101, 191, 201))",
    "linear(to-r,rgb(78, 123, 151),rgb(22, 47, 72))"
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent rounded="lg" shadow="xl" bgGradient={backgroundGradient}>
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Countries Visited
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box textAlign="center" p={4} borderRadius="md" shadow="sm">
            <Text fontSize="lg" fontWeight="medium">
              You have visited <b>{countryCount}</b> out of <b>195</b> countries! 🌍
            </Text>
            <Box mt={4}>
              <progress
                value={countryCount}
                max="195"
                style={{
                  width: "100%",
                  height: "20px",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "#e0e0e0",
                }}
              />
            </Box>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" w="full" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CountriesVisitedModal;
