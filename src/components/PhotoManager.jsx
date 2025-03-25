import React, { useContext, useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import PhotoGallery from './PhotoGallery';
import { CountriesContext } from '../context/CountriesContext';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box,
  Button,
  Text,
  Flex,
  Wrap,
  WrapItem,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * getAuthHeaders
 * Generates the headers needed for authenticated requests, including the JWT token.
 * @returns {Object} An object containing the Authorization header if a token exists.
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ----------------------------------------------------------------
 *                       Fetcher Functions (GET)
 * ----------------------------------------------------------------
 * These functions retrieve data (years, albums, images) from the backend.
 */

/**
 * fetchYears
 * Retrieves a list of available years for a specified country from the backend.
 * @param {string} countryId - The country identifier (e.g., "br").
 * @returns {Promise<number[]>} A Promise that resolves to an array of years.
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
 * fetchAlbums
 * Retrieves the list of albums associated with a given country.
 * @param {string} countryId - The country identifier (e.g., "br").
 * @returns {Promise<Array>} A Promise that resolves to an array of album objects.
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
 * fetchImages
 * Retrieves images for a given country, optionally filtered by year or album.
 * Depending on the parameters, images are fetched from different endpoints.
 * @param {string} countryId   - The country identifier (e.g., "br").
 * @param {number} [year]      - (Optional) Year filter for images.
 * @param {string} [albumId]   - (Optional) Album ID filter for images.
 * @param {boolean} showAllSelected - Whether to show all images for the country.
 * @returns {Promise<Array>} A Promise that resolves to an array of image objects.
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

/* ----------------------------------------------------------------
 *                       PhotoManager Component
 * ----------------------------------------------------------------
 * Manages uploads, filtering, and deletion of images for a specified country.
 * Implements React Query for data fetching and mutation.
 */

const PhotoManager = ({ countryId, onUploadSuccess }) => {
  // Hooks from React and external libraries
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isPremium } = useContext(AuthContext);
  const { refreshCountriesWithPhotos } = useContext(CountriesContext);
  const navigate = useNavigate();

  /* ----------------------------------------------------------------
   *                          Local States
   * ----------------------------------------------------------------
   * selectedYear, selectedAlbum, etc., control which images are shown,
   * and what operations (e.g., deletion) can be performed.
   */
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [showAllSelected, setShowAllSelected] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /**
   * Check for token presence on mount; redirect to login if missing.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  /* ----------------------------------------------------------------
   *                       React Query Calls
   * ----------------------------------------------------------------
   * 1. Use Query to fetch yearsData
   * 2. Use Query to fetch albumsData
   * 3. Use Query to fetch imagesData (depends on selected year/album)
   */

  // 1. Years
  const {
    data: yearsData = [],
    isLoading: isLoadingYears,
    isError: isErrorYears,
  } = useQuery({
    queryKey: ['years', countryId],
    queryFn: () => fetchYears(countryId),
    enabled: !!countryId && isLoggedIn,
  });

  // 2. Albums
  const {
    data: albumsData = [],
    isLoading: isLoadingAlbums,
    isError: isErrorAlbums,
  } = useQuery({
    queryKey: ['albums', countryId],
    queryFn: () => fetchAlbums(countryId),
    enabled: !!countryId && isLoggedIn,
  });

  // 3. Images
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
      !!isLoggedIn &&
      (!!selectedYear || !!selectedAlbum || showAllSelected),
    // Only fetch images if the user selects a year, album, or toggles "Show All"
  });

  /* ----------------------------------------------------------------
   *                       Mutations (POST/DELETE)
   * ----------------------------------------------------------------
   * Each useMutation handles a specific backend operation:
   * 1. Delete multiple images
   * 2. Create a new album
   * 3. Delete an album
   * 4. Delete images from a specific year
   * 5. Delete all images from a country
   */

  // 1. Deleting multiple images
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
      toast({
        title: 'Images Deleted',
        description: `${ids.length} image(s) deleted successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      // Invalidate queries so that React Query refetches fresh data
      queryClient.invalidateQueries(['images']);
      queryClient.invalidateQueries(['years']);
      queryClient.invalidateQueries(['albums']);
      refreshCountriesWithPhotos();
      setSelectedImageIds([]);
    },
    onError: () => {
      toast({
        title: 'Deletion Failed',
        description: 'There was an error deleting the images.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // 2. Creating a new album (Premium feature)
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
      toast({
        title: 'Album Created',
        description: 'The album was successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setNewAlbumName('');
      setSelectedImageIds([]);
      queryClient.invalidateQueries(['albums', countryId]);
    },
    onError: () => {
      toast({
        title: 'Creation Failed',
        description: 'There was an error creating the album.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // 3. Deleting an album
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
      toast({
        title: 'Album Deleted',
        description: 'The album was deleted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries(['albums']);
      queryClient.invalidateQueries(['images']);
      queryClient.invalidateQueries(['years']);
      refreshCountriesWithPhotos();
    },
    onError: () => {
      toast({
        title: 'Deletion Failed',
        description: 'There was an error deleting the album.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // 4. Deleting all images from a specific year
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
      toast({
        title: 'Images Deleted',
        description: `All images from year ${year} were deleted successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries(['images']);
      queryClient.invalidateQueries(['years']);
      queryClient.invalidateQueries(['albums']);
      refreshCountriesWithPhotos();
      setSelectedYear(null);
    },
    onError: (_, { year }) => {
      toast({
        title: 'Deletion Failed',
        description: `There was an error deleting images from year ${year}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  // 5. Deleting all images for an entire country
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
      toast({
        title: 'All Images Deleted',
        description: `All images were deleted successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries(['images']);
      queryClient.invalidateQueries(['years']);
      queryClient.invalidateQueries(['albums']);
      refreshCountriesWithPhotos();
      setShowAllSelected(false);
    },
    onError: (_, countryId) => {
      toast({
        title: 'Deletion Failed',
        description: `Error deleting all images of ${countryId?.toUpperCase()}.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  /* ----------------------------------------------------------------
   *                             Handlers
   * ----------------------------------------------------------------
   * These functions define how certain user actions (upload, delete, etc.)
   * are processed, often triggering the mutations above or invalidating queries.
   */

  /**
   * handleUpload
   * Called after a successful image upload. Invalidates queries so new data will be fetched.
   * @param {Array} newImages - The newly uploaded images.
   * @param {number} year     - The year associated with the uploaded images.
   */
  const handleUpload = (newImages, year) => {
    queryClient.invalidateQueries(['images']);
    queryClient.invalidateQueries(['years']);
    queryClient.invalidateQueries(['albums']);

    if (onUploadSuccess) {
      onUploadSuccess();
    }
    refreshCountriesWithPhotos();
  };

  /**
   * handleCreateAlbum
   * Creates a new album if the user is premium and has selected images.
   */
  const handleCreateAlbum = () => {
    if (!isPremium) {
      toast({
        title: 'Premium Feature',
        description: 'Album creation is available only for premium users.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!newAlbumName.trim()) {
      toast({
        title: 'Album Name Required',
        description: 'Please enter a name for the album.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (selectedImageIds.length === 0) {
      toast({
        title: 'No images selected',
        description: 'Please select at least one image to create an album.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    createAlbumMutation.mutate({
      countryId,
      albumName: newAlbumName,
      imageIds: selectedImageIds,
    });
  };

  /**
   * handleDeleteMultipleImages
   * Deletes multiple images after user confirmation.
   * @param {string[]} ids - The IDs of images to delete.
   */
  const handleDeleteMultipleImages = (ids) => {
    if (ids.length === 0) {
      toast({
        title: 'No images selected',
        description: 'Please select at least one image to delete.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (window.confirm(`Are you sure you want to delete ${ids.length} image(s)?`)) {
      deleteImagesMutation.mutate(ids);
    }
  };

  /**
   * handleDeleteAlbum
   * Deletes an entire album after user confirmation.
   * @param {string} albumId - The ID of the album to delete.
   */
  const handleDeleteAlbum = (albumId) => {
    if (window.confirm('Are you sure you want to delete this album and all of its images?')) {
      deleteAlbumMutation.mutate(albumId);
    }
  };

  /**
   * handleDeleteImagesByYear
   * Deletes all images from a specific year after user confirmation.
   * @param {number} year - The year from which images will be deleted.
   */
  const handleDeleteImagesByYear = (year) => {
    if (window.confirm(`Are you sure you want to delete all images from year ${year}?`)) {
      deleteImagesByYearMutation.mutate({ countryId, year });
    }
  };

  /**
   * handleDeleteAllImagesByCountry
   * Deletes all images for the specified country after user confirmation.
   */
  const handleDeleteAllImagesByCountry = () => {
    if (
      window.confirm(
        `Are you sure you want to delete all images of ${countryId.toUpperCase()}?`
      )
    ) {
      deleteAllImagesByCountryMutation.mutate(countryId);
    }
  };

  /**
   * toggleYearSelection
   * Selects/deselects a particular year. Clears album selection and "Show All" status.
   */
  const toggleYearSelection = (year) => {
    setSelectedYear((prevYear) => (prevYear === year ? null : year));
    setSelectedAlbum(null);
    setShowAllSelected(false);
  };

  /**
   * toggleAlbumSelection
   * Selects/deselects a particular album. Clears year selection and "Show All" status.
   */
  const toggleAlbumSelection = (albumId) => {
    setSelectedAlbum((prev) => (prev === albumId ? null : albumId));
    setSelectedYear(null);
    setShowAllSelected(false);
  };

  /**
   * toggleShowAll
   * Toggles whether to display all images, ignoring year or album filters.
   */
  const toggleShowAll = () => {
    setShowAllSelected((prev) => !prev);
    setSelectedYear(null);
    setSelectedAlbum(null);
  };

  /* ----------------------------------------------------------------
   *                       Image Data for Display
   * ----------------------------------------------------------------
   * Here is the key difference for S3:
   * We assume each "filePath" from the backend is already a FULL S3 URL,
   * so we use it directly (without prefixing import.meta.env.VITE_BACKEND_URL).
   */
  const images = Array.isArray(imagesData)
    ? imagesData.map((image) => ({
      url: image.filePath, // The full S3 URL is used directly
      id: image.id,
      year: image.year,
    }))
    : [];

  /**
   * Filter albums to only those that actually have images to display.
   */
  const albumsWithImages = Array.isArray(albumsData)
    ? albumsData.filter((album) => album.numberOfImages > 0)
    : [];

  return (
    <Box>
      {/* Image Upload Section */}
      <Box mb={3}>
        <ImageUploader countryId={countryId} onUpload={handleUpload} />
      </Box>

      {/* (Optional) Album Creation Section - Requires Premium */}
      {isPremium && (
        <Flex mb={4} justify="center">
          <Input
            placeholder="Album Name"
            value={newAlbumName}
            onChange={(e) => setNewAlbumName(e.target.value)}
            width="200px"
            mr={2}
          />
          <Button
            colorScheme="blue"
            onClick={handleCreateAlbum}
            isLoading={createAlbumMutation.isLoading}
          >
            Create Album
          </Button>
        </Flex>
      )}

      {/* Filters for Years and Albums */}
      <Wrap spacing={4} justify="center" mb={4}>
        {/* Display all available years */}
        {yearsData.map((year) => (
          <WrapItem key={year}>
            <Button
              colorScheme={selectedYear === year ? 'teal' : 'gray'}
              onClick={() => toggleYearSelection(year)}
            >
              {year}
            </Button>
          </WrapItem>
        ))}

        {/* Display all albums that contain images */}
        {albumsWithImages.map((album) => (
          <WrapItem key={album.id}>
            <Button
              colorScheme={selectedAlbum === album.id ? 'purple' : 'gray'}
              onClick={() => toggleAlbumSelection(album.id)}
            >
              {album.albumName}
            </Button>
            <Button
              ml={2}
              colorScheme="red"
              onClick={() => handleDeleteAlbum(album.id)}
              isLoading={deleteAlbumMutation.isLoading}
            >
              🗑️
            </Button>
          </WrapItem>
        ))}

        {/* Show All Images Button */}
        <WrapItem>
          <Button
            colorScheme={showAllSelected ? 'teal' : 'gray'}
            onClick={toggleShowAll}
          >
            Show All
          </Button>
        </WrapItem>
      </Wrap>

      {/* Main Image Display */}
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

      {/* Deletion Controls for Year or All Country Images */}
      {selectedYear && (
        <Button
          mt={4}
          colorScheme="red"
          onClick={() => handleDeleteImagesByYear(selectedYear)}
          isLoading={deleteImagesByYearMutation.isLoading}
        >
          Delete Images of {selectedYear}
        </Button>
      )}
      {showAllSelected && (
        <Button
          mt={4}
          colorScheme="red"
          onClick={handleDeleteAllImagesByCountry}
          isLoading={deleteAllImagesByCountryMutation.isLoading}
        >
          Delete All Photos
        </Button>
      )}
    </Box>
  );
};

export default PhotoManager;
