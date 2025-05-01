/**
 * Timeline.jsx
 *
 * Displays all user-uploaded photos grouped by year, forming a chronological timeline.
 * Uses React Query to fetch images, supports lazy loading with Suspense, and allows 
 * expanding/collapsing years. Requires user authentication.
 */


import React, { useContext, lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Spinner,
  Divider,
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import { CountriesContext } from '../context/CountriesContext';

// Lazy loading of PhotoGallery to improve performance
const LazyPhotoGallery = lazy(() => import('./PhotoGallery'));

/**
 * Fetches photos from your backend, optionally filtering by year.
 * This function is called by the React Query hook below.
 */
const fetchAllPictures = async (year) => {
  let url = `${import.meta.env.VITE_BACKEND_URL}/api/images/allPictures`;
  if (year) {
    url += `?year=${year}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching photos: ${response.statusText}`);
  }

  const data = await response.json();

  // If the response is not an array, we can return an empty array.
  if (!Array.isArray(data)) {
    return [];
  }

  // Map to the shape your PhotoGallery component expects
  return data.map((image) => ({
    url: image.filePath.includes('s3.') ? image.filePath : `${import.meta.env.VITE_BACKEND_URL}${image.filePath}`,
    id: image.id,
    year: image.year,
    countryId: image.countryId,
  }));
};

/**
 * The Timeline component fetches and displays images
 * (optionally filtered by a chosen year) in a chronological
 * grouping. It also allows users to delete selected images.
 *
 */
const Timeline = ({ selectedYear }) => {
  /**
   * Get the application-wide context for refreshing country data if needed
   */
  const { refreshCountriesWithPhotos } = useContext(CountriesContext);
  const [collapsedYears, setCollapsedYears] = useState({});

  const navigate = useNavigate();

  /**
   * Check for JWT token upon mounting or changing the selectedYear.
   * If no token, redirect to login.
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate, selectedYear]);

  /**
   * Use React Query to fetch and cache the photos
   */
  const { data: images = [], isLoading, error } = useQuery({
    queryKey: ['allPictures', selectedYear], // ✅ Correct format in React Query v5
    queryFn: () => fetchAllPictures(selectedYear),
    staleTime: 5 * 60 * 1000, // Keep data fresh for 5 minutes
    onSuccess: () => refreshCountriesWithPhotos?.(),
  });


  /**
   * If loading, display a spinner. If there's an error, display it.
   */
  if (isLoading) {
    return (
      <Box minH="100vh" p={5} bgGradient="linear(to-r, #006d77, #83c5be)" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" p={5} bgGradient="linear(to-r, #006d77, #83c5be)" display="flex" justifyContent="center" alignItems="center">
        <Text color="red.500">Error: {error.message}</Text>
      </Box>
    );
  }

  /**
   * Sort images descending by year, then group them by year
   */
  const sortedImages = [...images].sort((a, b) => b.year - a.year);
  const groupedByYear = sortedImages.reduce((acc, image) => {
    if (!acc[image.year]) {
      acc[image.year] = [];
    }
    acc[image.year].push(image);
    return acc;
  }, {});

  const toggleYear = (year) => {
    setCollapsedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  return (
    <Box
    minH="100vh"
    p={5}
    bgGradient="linear(to-r, #006d77, #83c5be)"
    display="flex"
  >
    <Box w="100%" p={5} bg="whiteAlpha.800">
      <Text fontSize="2xl" textAlign="center" mb={4} fontWeight="bold">
        {selectedYear ? `Timeline for ${selectedYear}` : 'All Photos'}
      </Text>

      {Object.keys(groupedByYear).length > 0 ? (
        Object.keys(groupedByYear).map((year) => (
          <Box key={year} mb={8}>
            <Box display="flex" alignItems="center" justifyContent="space-between" cursor="pointer" onClick={() => toggleYear(year)}>
              <Text fontSize="xl" fontWeight="semibold" color="teal.700">
                {year}
              </Text>
              <IconButton
                aria-label={`Toggle photos for ${year}`}
                icon={collapsedYears[year] ? <ChevronDownIcon /> : <ChevronUpIcon />}
                size="sm"
                variant="ghost"
              />
            </Box>
            <Divider mb={4} />
            {!collapsedYears[year] && (
              <Suspense fallback={<Spinner size="xl" />}>
                <LazyPhotoGallery images={groupedByYear[year] || []} />
              </Suspense>
            )}
          </Box>
        ))
      ) : (
        <Text mt={4} mb={4} textAlign="center">
          No photos to display
        </Text>
      )}
    </Box>
  </Box>
  );
};

export default Timeline;
