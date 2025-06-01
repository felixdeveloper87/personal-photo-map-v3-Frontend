import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Text,
  Button,
  VStack
} from "@chakra-ui/react";

/**
 * Modal that shows the benefits of becoming a premium user.
 */
const PremiumBenefitsModal = ({ isOpen, onClose, onUpgrade, isLoading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent rounded="lg" shadow="xl">
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold" color="yellow.600">
          🎉 Premium User Benefits
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={4} borderRadius="md" shadow="sm">
            <Text mb={3} fontSize="lg" fontWeight="medium" color="gray.700">
              By becoming a Premium user, you unlock:
            </Text>
            <VStack spacing={3} align="start" pl={2}>
              <Text>✅ <b>100gb photo storage</b></Text>
              <Text>✅ <b>Create Albums</b></Text>
              <Text>✅ <b>Priority support</b></Text>
            </VStack>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button w="full" onClick={onUpgrade} isLoading={isLoading}>
            Upgrade to Premium
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PremiumBenefitsModal;
