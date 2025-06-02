import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Image,
  useDisclosure,
  Flex,
  Text,
} from '@chakra-ui/react';
import { FiZoomIn, FiZoomOut, FiX, FiMaximize } from 'react-icons/fi';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import countries from 'i18n-iso-countries';
import en from 'i18n-iso-countries/langs/en.json';
import { DeleteButton } from '../components/CustomButtons';
import FullImageModal from './modals/FullImageModal';

/**
 * PhotoGallery Component
 *
 * Displays a grid of images with the following features:
 * - Selecting and deleting multiple images
 * - Enlarge images in a modal view
 * - Zoom in/out and reset within the modal
 * - Navigate between images using arrows or keyboard events
 *
 * @param {Array}   images               - An array of images to display (each object should contain `url` and `id`)
 * @param {Function} onDeleteSelectedImages - A callback for deleting selected images
 * @param {Array}   selectedImageIds     - An array storing the IDs of selected images
 * @param {Function} setSelectedImageIds - State setter for selected image IDs
 *
 * @returns {JSX.Element} A customizable photo gallery with zoom and deletion functionalities
 */

countries.registerLocale(en);
const PhotoGallery = ({
  images,
  onDeleteSelectedImages,
  selectedImageIds,
  setSelectedImageIds,
}) => {
  // Chakra UI's modal control
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Tracks the index of the currently displayed image in the modal
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fullscreenRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);


  /**
   * Opens the modal at the clicked image's index.
   * @param {number} index - The index of the clicked image in the `images` array
   */
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
    onOpen();
  };

  /**
   * Closes the modal.
   */
  const closeModal = () => {
    onClose();
  };

  /**
   * Moves to the next image in the array. Loops around if at the end.
   * @param {Event} e - Optional click event to stop propagation
   */
  const showNextImage = (e) => {
    if (e) e.stopPropagation();
    const nextIndex = (currentImageIndex + 1) % images.length;
    setCurrentImageIndex(nextIndex);
  };

  /**
   * Moves to the previous image in the array. Loops around if at the beginning.
   * @param {Event} e - Optional click event to stop propagation
   */
  const showPrevImage = (e) => {
    if (e) e.stopPropagation();
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(prevIndex);
  };

  /**
   * Keyboard listeners for modal navigation:
   * - Right Arrow -> next image
   * - Left Arrow  -> previous image
   * - Escape      -> close modal
   */
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
          showNextImage();
        } else if (event.key === 'ArrowLeft') {
          showPrevImage();
        } else if (event.key === 'Escape') {
          closeModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, currentImageIndex, images.length]);

  /**
   * Toggles the selection state of a specific image by ID.
   * @param {string|number} imageId - The ID of the image to select/deselect
   */
  const toggleImageSelection = (imageId) => {
    setSelectedImageIds?.((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  /**
   * Invokes the callback to delete all selected images,
   * then clears the selectedImageIds array.
   */
  const handleDeleteSelected = () => {
    onDeleteSelectedImages?.(selectedImageIds);
    setSelectedImageIds?.([]);
  };

  // If there are no images to display, provide a simple fallback message
  if (!Array.isArray(images) || images.length === 0) {
    return <Text fontSize="lg">You haven't been here yet.</Text>;
  }

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Entra em full screen
      if (fullscreenRef.current) {
        fullscreenRef.current.requestFullscreen();
      }
    } else if (document.exitFullscreen) {
      // Sai do full screen
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);


  return (
    <Box>
      {/* Show delete button only if there are selected images */}
      {Array.isArray(selectedImageIds) && selectedImageIds.length > 0 && (
        <Flex mb={6} justify="center">
          <DeleteButton
            size="sm"
            borderRadius="xl"
            boxShadow="md"
            onClick={handleDeleteSelected}
          >
            Delete {selectedImageIds.length} image{selectedImageIds.length > 1 ? 's' : ''}
          </DeleteButton>
        </Flex>
      )}

      {/* Image Grid */}
      <Flex wrap="wrap" justifyContent="center">
        {images.map((image, index) => (
          <Box
            key={index}
            position="relative"
            m={2}
            border={
              Array.isArray(selectedImageIds) &&
                selectedImageIds.includes(image.id)
                ? '2px solid red'
                : '2px solid gray'
            }
            borderRadius="md"
            cursor="pointer"
          >
            {/* Selection indicator in the top-left corner */}
            <Box
              position="absolute"
              top="2px"
              left="2px"
              bg={
                Array.isArray(selectedImageIds) &&
                  selectedImageIds.includes(image.id)
                  ? 'red.500'
                  : 'white'
              }
              borderRadius="full"
              boxSize="1rem"
              onClick={() => toggleImageSelection(image.id)}
            ></Box>
            {/* Thumbnail display */}
            <Image
              src={image.url}
              alt={`Country image ${index + 1}`}
              boxSize="300px"
              objectFit="cover"
              loading="lazy"
              fallbackSrc="https://via.placeholder.com/200"
              onClick={() => handleImageClick(index)}
            />
            {/* Water Mark */}
            <Box
              position="absolute"
              bottom="5px"
              right="5px"
              bg="rgba(0, 0, 0, 0.5)"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
            >
              <Text fontSize="xs">
                {countries.getName(image.countryId?.toUpperCase(), 'en') || image.countryId?.toUpperCase()}
              </Text>
            </Box>

          </Box>
        ))}
      </Flex>

      {/* Full-size image modal */}
      <FullImageModal
        isOpen={isOpen}
        onClose={closeModal}
        imageUrl={images[currentImageIndex].url}
        onNext={showNextImage}
        onPrev={showPrevImage}
        hasMultiple={images.length > 1}
        fullscreenRef={fullscreenRef}
        toggleFullScreen={toggleFullScreen}
        isFullscreen={isFullscreen}
      />
    </Box>
  );
};

export default PhotoGallery;
