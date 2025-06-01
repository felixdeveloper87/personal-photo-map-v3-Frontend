// components/modals/UserProfileModal.jsx
import React from "react";
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
  Text
} from "@chakra-ui/react";

const UserProfileModal = ({ isOpen, onClose, fullname, email, photoCount, countryCount }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" motionPreset="slideInBottom">
      <ModalOverlay />
      <ModalContent rounded="lg" shadow="xl">
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="semibold">
          My Profile
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box p={4} borderRadius="md" shadow="sm">
            <Text fontSize="lg" fontWeight="bold">Full Name:</Text>
            <Text mb={2}>{fullname}</Text>

            <Text fontSize="lg" fontWeight="bold">Email:</Text>
            <Text mb={2}>{email}</Text>

            <Text fontSize="lg" fontWeight="bold">Photos:</Text>
            <Text mb={2}>{photoCount}</Text>

            <Text fontSize="lg" fontWeight="bold">Countries:</Text>
            <Text>{countryCount}</Text>
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
};

export default UserProfileModal;