import React, { useState, useRef } from 'react';
import { Box, Button, Input, Heading, Flex, Select, useToast } from '@chakra-ui/react';

/**
 * ImageUploader Component
 * 
 * This component allows users to upload images for a specific country and year.
 * It supports multiple image uploads and authentication through a token stored in localStorage.
 * 
 * Props:
 * - `countryId`: The ID of the country where the images will be associated.
 * - `onUpload`: Callback function that receives the uploaded image URLs and year.
 * - `onUploadSuccess`: Callback function triggered after a successful upload.
 */
const ImageUploader = ({ countryId, onUpload, onUploadSuccess }) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear); // Selected year for image upload
  const [isUploading, setIsUploading] = useState(false); // Tracks the upload status
  const [files, setFiles] = useState([]); // Stores selected files for upload
  const fileInputRef = useRef(null); // Reference to the file input field
  const toast = useToast();

  // Generate an array of years from 1900 to the current year for selection
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => 1900 + i);

  /**
   * Handles file selection from the input field.
   * Converts the selected files into an array and stores them in state.
   */
  const handleFileSelection = (event) => {
    const selectedFiles = event.target.files;
    setFiles(selectedFiles.length > 0 ? Array.from(selectedFiles) : []);
  };

  /**
   * Retrieves authentication headers with the stored token.
   * Ensures secure API requests by including the Authorization header.
   */
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  /**
   * Handles the image upload process.
   * - Validates if at least one file is selected.
   * - Constructs a FormData object with images, countryId, and year.
   * - Sends the request to the backend using the Fetch API.
   * - Calls the provided callbacks upon success.
   */
  const handleImageUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No file selected.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file)); // Append all selected files
    formData.append("countryId", countryId);
    formData.append("year", year);

    setIsUploading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/images/upload`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading image(s) to the server.');
      }

      const data = await response.json();
      const uploadedImageUrls = data.imageUrls;

      toast({
        title: "Success!",
        description: "Image(s) uploaded successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Invoke callbacks if provided
      if (onUpload) {
        onUpload(uploadedImageUrls, year);
      }
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      // Reset the file input and selected files
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload error",
        description: error.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box p={5} bg="gray.100" borderRadius="md" boxShadow="md" maxWidth="600px" mx="auto">
      <Heading as="h2" mb={4} textAlign="center">Upload Images</Heading>

      <Flex justify="space-between" align="center" mb={4}>
        {/* Dropdown for selecting the year */}
        <Select value={year} onChange={(e) => setYear(e.target.value)} width="150px">
          {years.map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </Select>

        {/* File input for selecting images */}
        <Input
          type="file"
          onChange={handleFileSelection}
          multiple
          accept=".jpg,.jpeg"
          width="auto"
          ref={fileInputRef}
        />
      </Flex>

      {/* Upload button */}
      <Button
        isLoading={isUploading}
        loadingText="Uploading"
        colorScheme="teal"
        width="100%"
        onClick={handleImageUpload}
        disabled={files.length === 0}
      >
        Upload
      </Button>
    </Box>
  );
};

export default ImageUploader;
