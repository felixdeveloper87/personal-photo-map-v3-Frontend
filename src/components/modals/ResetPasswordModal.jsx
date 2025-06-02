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
  FormControl,
  FormLabel,
  Input
} from "@chakra-ui/react";

const ResetPasswordModal = ({ isOpen, onClose, resetEmail, setResetEmail, handleResetPassword }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>Reset your password</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <FormControl>
          <FormLabel>Enter your email</FormLabel>
          <Input
            type="email"
            placeholder="your-email@example.com"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </FormControl>
      </ModalBody>

      <ModalFooter>
        <Button colorScheme="teal" mr={3} onClick={handleResetPassword}>
          Reset my password
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default ResetPasswordModal;
