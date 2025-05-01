/**
 * SearchForm Component
 *
 * Opens a modal to allow the user to pick a country or year, then either:
 * - Navigates to /countries/[countryId]?year=[year], or
 * - Navigates to /timeline/[year], if only a year is selected.
 *
 */

import React, { useState, useContext } from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { CountriesContext } from '../context/CountriesContext';


export default function SearchForm({ onSearch }) {
  // Chakra UI modal controls
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Retrieve country data and available years from context
  const { countriesWithPhotos, availableYears } = useContext(CountriesContext);

  // Local states for selected country and year
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // React Router navigation
  const navigate = useNavigate();

  /**
   * Handles the form submission when the user clicks "Search".
   * - If a country is selected, call onSearch (if provided).
   * - If only a year is selected, navigate to /timeline/[year].
   * - If neither is selected, prompt the user to pick an option.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedCountry) {
      onSearch({ country: selectedCountry });
    } else if (selectedYear) {
      navigate(`/timeline/${selectedYear}`);
    } else {
      alert('Please select a country or a year!');
      return;
    }

    // Close the modal after a successful search
    onClose();
  };

  return (
    <>
      {/* Button to open the "Search Photos" modal */}
      <Button onClick={onOpen} colorScheme="cyan">
        Search Photos
      </Button>

      {/* Modal for selecting a country/year */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search Photos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form id="search-form" onSubmit={handleSubmit}>
              {/* Country Selection */}
              <div style={{ marginBottom: '1rem' }}>
                <label>Country:</label>
                <Select
                  placeholder="Select a country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                >
                  {(countriesWithPhotos || []).length > 0 ? (
                    countriesWithPhotos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No countries available yet</option>
                  )}
                </Select>
              </div>

              {/* Year Selection */}
              <div style={{ marginBottom: '1rem' }}>
                <label>Year:</label>
                <Select
                  placeholder="Select a year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {(availableYears || []).length > 0 ? (
                    availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))
                  ) : (
                    <option disabled>No years available</option>
                  )}
                </Select>
              </div>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={onClose}>
              Close
            </Button>
            <Button type="submit" form="search-form" colorScheme="cyan">
              Search
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
