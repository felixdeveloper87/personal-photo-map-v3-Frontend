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

function PhotoStorageModal({ isOpen, onClose, isPremium }) {
  const backgroundGradient = useColorModeValue(
    "linear(to-r, rgb(151, 205, 228),rgb(101, 191, 201))",
    "linear(to-r,rgb(78, 123, 151),rgb(22, 47, 72))"
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent rounded="lg" shadow="xl" bgGradient={backgroundGradient}>
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Photo Storage
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box textAlign="center" p={4} borderRadius="md" shadow="sm">
            <Text fontSize="lg" fontWeight="medium">
              {isPremium ? "100GB Photo Storage 📸" : "5GB Photo Storage 📷"}
            </Text>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button w="full" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default PhotoStorageModal;
