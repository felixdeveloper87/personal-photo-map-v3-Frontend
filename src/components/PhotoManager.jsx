import React, { useContext, useState, useEffect, useRef } from 'react';
import ImageUploader from './ImageUploader';
import PhotoGallery from './PhotoGallery';
import { CountriesContext } from '../context/CountriesContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ConfirmDialog } from './ConfirmDialog';
import {
  Box,
  Button,
  Text,
  Flex,
  Wrap,
  WrapItem,
  Input,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from './CustomToast';
import {
  DeleteAllByYearButton,
  CreateAlbumButton,
  DeleteAlbum,
  DeleteByYearButton
} from './Buttons/CustomButtons';
import {
  ShowAllButton,
  YearSelectableButton,
  AlbumSelectableButton,

} from "../components/Buttons/SelectableButtons";

/**
 * Returns a headers object containing the Authorization token, if any.
 * Used to authenticate requests to the backend.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ---------------- Fetchers (GET) ---------------- */

/**
 * Fetches a list of years for which the country has images.
 * @param {string} countryId - The country identifier (e.g., "br").
 * @returns {Promise<Array<number>>} Array of available years.
 */
async function fetchYears(countryId) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/images/${countryId}/available-years`,
    { headers: getAuthHeaders() }
  );
  if (!response.ok) {
    throw new Error(`Error fetching years: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetches albums associated with a particular country.
 * @param {string} countryId - The country identifier (e.g., "br").
 * @returns {Promise<Array>} Array of album objects.
 */
async function fetchAlbums(countryId) {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/api/albums/${countryId}`,
    { headers: getAuthHeaders() }
  );
  if (!response.ok) {
    throw new Error(`Error fetching albums: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetches images based on a country and optional filters (year, album).
 * @param {string} countryId - The country identifier.
 * @param {number} [year] - Optional year filter for images.
 * @param {string} [albumId] - Optional album ID filter for images.
 * @param {boolean} showAllSelected - Whether to display all images from the country.
 * @returns {Promise<Array>} Array of image objects (filePaths, IDs, etc.)
 */
async function fetchImages(countryId, year, albumId, showAllSelected) {
  let url = `${import.meta.env.VITE_BACKEND_URL}/api/images/${countryId}`;
  if (albumId) {
    url = `${import.meta.env.VITE_BACKEND_URL}/api/albums/${albumId}/images`;
  } else if (year && !showAllSelected) {
    url += `/${year}`;
  }

  const response = await fetch(url, { headers: getAuthHeaders() });
  if (!response.ok) {
    throw new Error(`Error fetching images: ${response.status}`);
  }
  return response.json();
}

/**
 * PhotoManager Component
 *
 * Manages displaying and handling images for a given country, including:
 * - Uploading new images
 * - Filtering images by year or album
 * - Deleting images, albums, or all photos
 * - Creating new albums (Premium feature)
 */
const PhotoManager = ({ countryId, onUploadSuccess }) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isPremium } = useContext(AuthContext);
  const { refreshCountriesWithPhotos } = useContext(CountriesContext);
  const navigate = useNavigate();

  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const [pendingAlbumId, setPendingAlbumId] = useState(null);
  const [yearToDelete, setYearToDelete] = useState(null);

  const {
    isOpen: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onClose: onDeleteConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteAlbumOpen,
    onOpen: onDeleteAlbumOpen,
    onClose: onDeleteAlbumClose,
  } = useDisclosure();

  const {
    isOpen: isYearDeleteOpen,
    onOpen: onYearDeleteOpen,
    onClose: onYearDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isAllDeleteOpen,
    onOpen: onAllDeleteOpen,
    onClose: onAllDeleteClose,
  } = useDisclosure();


  /** Local UI state */
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [showAllSelected, setShowAllSelected] = useState(false);

  /** Stores the IDs of images the user has selected for deletion/album creation */
  const [selectedImageIds, setSelectedImageIds] = useState([]);

  /* ---------------- useQuery Calls ---------------- */

  // Fetch years for the given country
  const {
    data: yearsData = [],
    isLoading: isLoadingYears,
    isError: isErrorYears,
  } = useQuery({
    queryKey: ['years', countryId],
    queryFn: () => fetchYears(countryId),
    enabled: !!countryId,
  });

  // Fetch albums for the given country
  const {
    data: albumsData = [],
    isLoading: isLoadingAlbums,
    isError: isErrorAlbums,
  } = useQuery({
    queryKey: ['albums', countryId],
    queryFn: () => fetchAlbums(countryId),
    enabled: !!countryId,
  });

  // Fetch images for the given country, filtered by year/album if selected
  const {
    data: imagesData = [],
    isLoading: isLoadingImages,
    isError: isErrorImages,
    refetch: refetchImages,
  } = useQuery({
    queryKey: ['images', countryId, selectedYear, selectedAlbum, showAllSelected],
    queryFn: () => fetchImages(countryId, selectedYear, selectedAlbum, showAllSelected),
    enabled:
      !!countryId &&
      !!(selectedYear || selectedAlbum || showAllSelected),
    // Only fetch images if the user selects a year, album, or toggles 'Show All'
  });

  /* ---------------- Mutations (POST/DELETE) ---------------- */

  // Deleting multiple images
  const deleteImagesMutation = useMutation({
    mutationFn: async (ids) => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/images/delete-multiple`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
          body: JSON.stringify(ids),
        }
      );
      if (!response.ok) {
        throw new Error('Error deleting images.');
      }
      return response;
    },
    onSuccess: (_, ids) => {
      showSuccessToast(toast, `${ids.length} image(s) deleted successfully.`);
      // Invalidate relevant queries so React Query refetches fresh data
      queryClient.invalidateQueries(['images']);
      queryClient.invalidateQueries(['years']);
      queryClient.invalidateQueries(['albums']);
      refreshCountriesWithPhotos();
      setSelectedImageIds([]);
    },
    onError: () => {
      showErrorToast(toast, 'There was an error deleting the images.');
    },
  });

  // Creating a new album (Premium only)
  const createAlbumMutation = useMutation({
    mutationFn: async ({ countryId, albumName, imageIds }) => {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ countryId, albumName, imageIds }),
      });
      if (!response.ok) {
        throw new Error('Error creating album.');
      }
      return response.json();
    },
    onSuccess: () => {
      showSuccessToast(toast, 'The album was successfully created.');
      setNewAlbumName('');
      setSelectedImageIds([]);
      queryClient.invalidateQueries(['albums']);
    },
    onError: () => {
      showErrorToast(toast, 'There was an error creating the album.');
    },
  });

  // Delete an entire album
  const deleteAlbumMutation = useMutation({
    mutationFn: async (albumId) => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/albums/${albumId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(`Error deleting album: ${response.statusText}`);
      }
      return response;
    },
    onSuccess: () => {
      showSuccessToast(toast, 'The album was deleted successfully.');
      queryClient.invalidateQueries(['albums']);
      queryClient.invalidateQueries(['images']);
      queryClient.invalidateQueries(['years']);
      refreshCountriesWithPhotos();
    },
    onError: () => {
      showErrorToast(toast, 'There was an error deleting the album.');
    },
  });

  // Delete images by year
  const deleteImagesByYearMutation = useMutation({
    mutationFn: async ({ countryId, year }) => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/images/${countryId}/${year}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(`Error deleting images from year ${year}: ${response.status}`);
      }
      return response;
    },
    onSuccess: (_, { year }) => {
      showSuccessToast(toast, `All images from year ${year} were deleted successfully.`);
      queryClient.invalidateQueries(['images']);
      queryClient.invalidateQueries(['years']);
      queryClient.invalidateQueries(['albums']);
      refreshCountriesWithPhotos();
      setSelectedYear(null);
    },
    onError: (_, { year }) => {
      showErrorToast(toast, `There was an error deleting images from year ${year}.`);
    },
  });

  // Delete all images for an entire country
  const deleteAllImagesByCountryMutation = useMutation({
    mutationFn: async (countryId) => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/images/delete-all-images/${countryId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error deleting all images of ${countryId.toUpperCase()}: ${response.statusText}`
        );
      }
      return response;
    },
    onSuccess: () => {
      showSuccessToast(toast, 'All images were deleted successfully.');
      queryClient.invalidateQueries(['images']);
      queryClient.invalidateQueries(['years']);
      queryClient.invalidateQueries(['albums']);
      refreshCountriesWithPhotos();
      setShowAllSelected(false);
    },
    onError: (_, countryId) => {
      showErrorToast(toast, `Error deleting all images of ${countryId?.toUpperCase()}.`);
    },
  });

  /* ---------------- Handlers ---------------- */

  /**
   * Called after a successful image upload from ImageUploader.
   * Optionally invalidates queries or triggers re-fetch to show new images.
   */
  const handleUpload = (newImages, year) => {
    // Option 1: Invalidate queries to refetch new data
    queryClient.invalidateQueries(['images']);
    queryClient.invalidateQueries(['years']);
    queryClient.invalidateQueries(['albums']);

    // Optionally call an onUploadSuccess prop
    if (onUploadSuccess) {
      onUploadSuccess();
    }
    // Refresh countries context
    refreshCountriesWithPhotos();
  };

  /**
   * Attempts to create an album if user is Premium and
   * has selected at least one image. Otherwise shows a warning toast.
   */
  const handleCreateAlbum = () => {
    if (!isPremium) {
      showWarningToast(toast, 'Album creation is available only for premium users.');
      return;
    }

    if (!newAlbumName.trim()) {
      showWarningToast(toast, 'Please enter a name for the album.');
      return;
    }

    if (selectedImageIds.length === 0) {
      showWarningToast(toast, 'Please select at least one image.');
      return;
    }

    createAlbumMutation.mutate({
      countryId,
      albumName: newAlbumName,
      imageIds: selectedImageIds,
    });
  };

  /**
   * Deletes multiple selected images after user confirms.
   * @param {Array<string>} ids - The IDs of the images to delete.
   */
  const handleDeleteMultipleImages = (ids) => {
    if (ids.length === 0) {
      showWarningToast(toast, 'Please select at least one image.');
      return;
    }

    setPendingDeleteIds(ids.map(id => Number(id)));
    onDeleteConfirmOpen();
  };

  /**
   * Deletes an entire album after user confirmation.
   * @param {string} albumId - The ID of the album to delete.
   */
  const handleDeleteAlbum = (albumId) => {
    setPendingAlbumId(albumId);
    onDeleteAlbumOpen();
  };


  /**
   * Deletes all images from a selected year for the current country.
   * @param {number} year - The year from which to delete images.
   */
  const handleDeleteImagesByYear = (year) => {
    setYearToDelete(year);
    onYearDeleteOpen();
  };

  /**
   * Deletes ALL images for the current country.
   */
  const handleDeleteAllImagesByCountry = () => {
    onAllDeleteOpen();
  };


  /**
   * Toggles the selected year. If the same year is clicked again, deselect.
   */
  const toggleYearSelection = (year) => {
    setSelectedYear((prevYear) => (prevYear === year ? null : year));
    setSelectedAlbum(null);
    setShowAllSelected(false);
  };

  /**
   * Toggles the selected album. If the same album is clicked again, deselect.
   */
  const toggleAlbumSelection = (albumId) => {
    setSelectedAlbum((prev) => (prev === albumId ? null : albumId));
    setSelectedYear(null);
    setShowAllSelected(false);
  };

  /**
   * Toggles whether to display all images regardless of year or album filter.
   */
  const toggleShowAll = () => {
    setShowAllSelected((prev) => !prev);
    setSelectedYear(null);
    setSelectedAlbum(null);
  };

  /**
   * Convert imagesData from the backend into the shape <PhotoGallery> needs.
   */
  const images = Array.isArray(imagesData)
    ? imagesData.map((image) => ({
      url: image.filePath, // The full S3 URL is used directly
      id: image.id,
      year: image.year,
    }))
    : [];
  /**
   * Filter out only albums that actually contain images.
   */
  const albumsWithImages = Array.isArray(albumsData)
    ? albumsData.filter((album) => album.images && album.images.length > 0)
    : [];

  return (
    <Box>
      {/* Image Upload Section */}
      <Box mb={3}>
        <ImageUploader countryId={countryId} onUpload={handleUpload} />
      </Box>

      {/* Album Creation (Premium) */}
      {isPremium && (
        <Flex mb={4} justify="center" >
          <Input
            placeholder="Album Name"
            value={newAlbumName}
            border="1px"
            borderColor="teal.800"
            onChange={(e) => setNewAlbumName(e.target.value)}
            width="200px"
            mr={2}
          />
          <CreateAlbumButton
            onClick={handleCreateAlbum}
            isLoading={createAlbumMutation.isLoading}
          >
            Create Album
          </CreateAlbumButton>

        </Flex>
      )}

      {/* Year and Album Selection */}
      <Wrap spacing={4} justify="center" mb={4}>
        {/* List of Years */}
        {yearsData.map((year) => (
          <WrapItem key={year}>
            <YearSelectableButton
              year={year}
              isSelected={selectedYear === year}
              onClick={() => toggleYearSelection(year)}
            />
          </WrapItem>
        ))}

        {/* List of Albums that have images */}
        {albumsWithImages.map((album) => (
          <WrapItem key={album.id}>
            <AlbumSelectableButton
              album={album}
              isSelected={selectedAlbum === album.id}
              onClick={() => toggleAlbumSelection(album.id)}
            />
          </WrapItem>
        ))}

        {/* "Show All" Button */}
        {images.length > 0 && (yearsData.length > 1 || (yearsData.length >= 1 && albumsWithImages.length >= 1)) && (
          <WrapItem>
            <ShowAllButton isSelected={showAllSelected} onClick={toggleShowAll} />
          </WrapItem>
        )}

      </Wrap>

      {/* Image Display */}
      {isLoadingImages ? (
        <Text mt={4} mb={4} textAlign="center">
          Loading photos...
        </Text>
      ) : images.length > 0 ? (
        <PhotoGallery
          images={images}
          onDeleteSelectedImages={handleDeleteMultipleImages}
          selectedImageIds={selectedImageIds}
          setSelectedImageIds={setSelectedImageIds}
        />
      ) : (
        <Text mt={4} mb={4} textAlign="center">
          No photos to display
        </Text>
      )}
      {(selectedYear || selectedAlbum) && (
        <Flex
          mt={4}
          justify="center"
          direction={{ base: "column", sm: "row" }}
          align="center"
          gap={4}

        >
          {selectedAlbum && (
            <DeleteAlbum
              onClick={() => handleDeleteAlbum(selectedAlbum)}
              isLoading={deleteAlbumMutation.isLoading} borderRadius="xl"
            />
          )}

          {selectedYear && (
            <DeleteByYearButton
              year={selectedYear}
              onClick={() => handleDeleteImagesByYear(selectedYear)}
              isLoading={deleteImagesByYearMutation.isLoading}
            />
          )}
        </Flex>
      )}

      {/* Delete all country images */}
      {showAllSelected && (
        <Flex mt={3} justify="center">
          <DeleteAllByYearButton
            year={selectedYear}
            onClick={() => handleDeleteImagesByYear(selectedYear)}
            isLoading={deleteImagesByYearMutation.isLoading}
          />
        </Flex>
      )}

      {/* 🔒 Modals de Confirmação */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={onDeleteConfirmClose}
        onConfirm={() => {
          deleteImagesMutation.mutate(pendingDeleteIds);
          onDeleteConfirmClose();
        }}
        title="Delete Images"
        message={`Are you sure you want to delete ${pendingDeleteIds.length} image(s)? This action cannot be undone.`}
      />

      <ConfirmDialog
        isOpen={isDeleteAlbumOpen}
        onClose={onDeleteAlbumClose}
        onConfirm={() => {
          deleteAlbumMutation.mutate(pendingAlbumId);
          onDeleteAlbumClose();
        }}
        title="Delete Album"
        message="Are you sure you want to delete this album and all of its images?"
      />

      <ConfirmDialog
        isOpen={isYearDeleteOpen}
        onClose={onYearDeleteClose}
        onConfirm={() => {
          deleteImagesByYearMutation.mutate({ countryId, year: yearToDelete });
          onYearDeleteClose();
        }}
        title="Delete Images by Year"
        message={`Are you sure you want to delete all images from year ${yearToDelete}? This action cannot be undone.`}
      />

      <ConfirmDialog
        isOpen={isAllDeleteOpen}
        onClose={onAllDeleteClose}
        onConfirm={() => {
          deleteAllImagesByCountryMutation.mutate(countryId);
          onAllDeleteClose();
        }}
        title="Delete All Images"
        message={`Are you sure you want to delete all images of ${countryId.toUpperCase()}? This action cannot be undone.`}
      />

    </Box>
  );
};

export default PhotoManager;
