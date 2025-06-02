import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  Button,
  Flex,
  VStack,
  Image,
  Text,
  Box,
} from '@chakra-ui/react';
import { FiX, FiZoomIn, FiZoomOut, FiMaximize } from 'react-icons/fi';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const FullImageModal = ({
  isOpen,
  onClose,
  imageUrl,
  onNext,
  onPrev,
  hasMultiple,
  fullscreenRef,
  toggleFullScreen,
  isFullscreen,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={4}>
          <IconButton
            icon={<FiX />}
            aria-label="Close modal"
            position="absolute"
            top="10px"
            right="10px"
            onClick={onClose}
            colorScheme="red"
            zIndex="10"
          />

          <Box ref={fullscreenRef}>
            <TransformWrapper
              initialScale={1}
              wheel={{ step: 0.2 }}
              doubleClick={{ disabled: true }}
              pinch={{ step: 5 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <VStack spacing={4}>
                  <Flex justifyContent="center" mb={4}>
                    <IconButton
                      onClick={zoomOut}
                      icon={<FiZoomOut />}
                      aria-label="Zoom out"
                      mx={2}
                    />
                    <IconButton
                      onClick={zoomIn}
                      icon={<FiZoomIn />}
                      aria-label="Zoom in"
                      mx={2}
                    />
                    <Button onClick={resetTransform} mx={2}>
                      Reset
                    </Button>
                    <IconButton
                      onClick={toggleFullScreen}
                      icon={<FiMaximize />}
                      aria-label="Fullscreen"
                      mx={2}
                    />
                  </Flex>

                  <TransformComponent>
                    <Flex justify="center" align="center" w="100%" h="100%">
                      <Image
                        src={imageUrl}
                        alt="Full size"
                        maxWidth={isFullscreen ? '100%' : '90%'}
                        maxHeight={isFullscreen ? '90vh' : '80vh'}
                        objectFit="contain"
                        borderRadius="md"
                        boxShadow="lg"
                      />
                    </Flex>
                  </TransformComponent>
                </VStack>
              )}
            </TransformWrapper>
          </Box>

          {hasMultiple && (
            <>
              <IconButton
                icon={<Text fontSize="2xl">&#10094;</Text>}
                onClick={onPrev}
                aria-label="Previous Image"
                position="absolute"
                top="50%"
                left="20px"
                transform="translateY(-50%)"
                zIndex="10"
                variant="ghost"
                size="lg"
              />
              <IconButton
                icon={<Text fontSize="2xl">&#10095;</Text>}
                onClick={onNext}
                aria-label="Next Image"
                position="absolute"
                top="50%"
                right="20px"
                transform="translateY(-50%)"
                zIndex="10"
                variant="ghost"
                size="lg"
              />
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullImageModal;
