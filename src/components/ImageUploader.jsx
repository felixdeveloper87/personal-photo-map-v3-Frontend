/**
 * ImageUploader.jsx
 *
 * This component provides a UI for authenticated users to upload one or more images
 * associated with a specific country and year. It handles file selection, preview state,
 * and interacts with the backend API to persist image data. Includes error handling
 * and user feedback via toast notifications.
 */


import React, { useState, useRef } from 'react';
import { Box, Input, Heading, Flex, Select, useToast } from '@chakra-ui/react';
import { UploadButton } from "../components/Buttons/CustomButtons";
import heic2any from 'heic2any';
import { showSuccessToast, showErrorToast } from "../components/CustomToast";



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
      showErrorToast(toast, "No file selected.");
      return;
    }
    const formData = new FormData();

    try {
      for (const file of files) {
        const isHeic =
          file.type === "image/heic" ||
          file.name.toLowerCase().endsWith(".heic");

        if (isHeic) {
          try {
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
              quality: 0.9,
            });

            const convertedFile = new File(
              [convertedBlob],
              file.name.replace(/\.heic$/i, ".jpg"),
              { type: "image/jpeg" }
            );

            formData.append("images", convertedFile);
          } catch (conversionError) {
            console.error("Erro ao converter HEIC:", conversionError);
            showErrorToast(toast, "Formato HEIC não suportado. Tente usar JPG/PNG.");


            return;
          }
        } else {
          formData.append("images", file);
        }
      }

      formData.append("countryId", countryId);
      formData.append("year", year);

      setIsUploading(true);

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

      showSuccessToast(toast, "Image(s) uploaded successfully!");


      if (onUpload) {
        onUpload(uploadedImageUrls, year);
      }
      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = null;

    } catch (error) {
      showErrorToast(toast, error.message);

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Box p={5} borderRadius="md"
      boxShadow="lg"
      maxWidth="600px" mx="auto"
      border="1px"
      borderColor="teal.800">

      <Heading as="h2" mb={4} textAlign="center">Upload Images</Heading>

      <Flex justify="space-between" align="center" mb={4}>
        {/* Dropdown for selecting the year */}
        <Select value={year}
          onChange={(e) => setYear(e.target.value)}
          width="150px"
          border="1px"
          borderColor="teal.800">
          {years.map((yr) => (
            <option key={yr} value={yr}>{yr}</option>
          ))}
        </Select>

        {/* File input for selecting images */}
        <Input
          type="file"
          onChange={handleFileSelection}
          multiple
          accept=".jpg,.jpeg,.png,.webp,.bmp,.heic,image/heic"
          width="auto"
          border="1px"
          borderColor="teal.800"
          ref={fileInputRef}
        />
      </Flex>

      {files.length > 0 && (
        <Box mt={4} p={2} borderRadius="md" boxShadow="sm" fontSize="sm" maxHeight="100px" overflowY="auto" >
          {files.map((file, idx) => (
            <Box key={idx}>
              <strong>{file.name}</strong>: {file.type}
            </Box>
          ))}
        </Box>
      )}

      {/* Upload button */}
      <UploadButton
        isLoading={isUploading}
        loadingText="Uploading"
        onClick={handleImageUpload}
        disabled={files.length === 0}
      />
    </Box>
  );
};

export default ImageUploader;
