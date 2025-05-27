/**
 * Header.jsx
 *
 * This component renders the main navigation bar of the application,
 * featuring logo, title, authentication controls, and responsive menus.
 * It provides access to features like search, timeline, profile, premium upgrade,
 * and modals showing photo and country statistics.
 * Styled using Chakra UI for a consistent and adaptive design.
 */


import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Image,
  Button,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  IconButton,
  VStack,
  HStack,
  Collapse,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { AuthContext } from "../context/AuthContext";
import { CountriesContext } from "../context/CountriesContext";
import SearchForm from "../components/SearchForm";
import logo from "../assets/logo.png";
import { FaMoon, FaSun } from 'react-icons/fa';


/**
 * Enhanced Header with a travel-themed design:
 * - Increased height for a more premium look
 * - Background color inspired by maps & travel
 * - Responsive navbar with a mobile menu
 */


function Header() {
  const navigate = useNavigate();
  const toast = useToast();
  const photoStorageModal = useDisclosure();
  const countriesModal = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  const backgroundGradient = useColorModeValue(
    "linear(to-r, rgb(151, 205, 228),rgb(101, 191, 201))",
    "linear(to-r,rgb(78, 123, 151),rgb(22, 47, 72))"
  );


  // Auth and Countries contexts
  const {
    isLoggedIn,
    fullname,
    email,
    isPremium,
    updatePremiumStatus,
    logout
  } = useContext(AuthContext);

  const {
    countriesWithPhotos,
    loading,
    photoCount,
    countryCount
  } = useContext(CountriesContext);

  // Profile and Premium modals
  const profileModal = useDisclosure();
  const premiumModal = useDisclosure();

  // State for loading spinner when upgrading to premium
  const [loadingPremium, setLoadingPremium] = useState(false);

  // Responsive menu disclosure
  const { isOpen, onToggle, onClose } = useDisclosure();

  // Function to upgrade the user to premium
  const handleBecomePremium = async () => {
    setLoadingPremium(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/users/make-premium`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upgrade to premium");
      }

      // Update the premium status in context
      updatePremiumStatus(true);

      toast({
        title: "Success!",
        description: "You are now a Premium user! 🎉",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      premiumModal.onClose();
    } catch (error) {
      console.error("Premium upgrade error:", error);
      toast({
        title: "Error!",
        description: "Failed to become premium.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setLoadingPremium(false);
  };


  return (
    <Box
      w="100%"
      mx="auto"
      bgGradient={backgroundGradient}
      boxShadow="lg"
      px={6}
      py={3}
      mb={2.5}
    >
      <Flex
        justify="space-between"
        align="center"
        maxW="1400px"
        mx="auto"
        wrap="wrap"
      >
        {/* Logo & Title */}
        <Flex
          align="center"
          cursor="pointer"
          onClick={() => navigate("/")}
          flex="1"
          transition="transform 3s ease-in-out"
          _hover={{ transform: "scale(1.10)" }}

        >
          <Image
            src={logo}
            alt="Home logo"
            h="60px"
            w="60px"
            objectFit="contain"
            mr={2}
          />
          <Heading
            as="h1"
            size="lg"
            color="white"
            fontFamily="'Rock Salt', cursive"
            fontWeight="bold"
            mr={5}
            _hover={{ color: "cyan.300", transition: "0.2s ease-in-out" }}
            textShadow="0 1px 2px black"
          >
            Photomap
          </Heading>
        </Flex>

        {/* Hamburger Menu (Mobile View) */}
        <IconButton
          display={{ base: "block", md: "none" }}
          onClick={onToggle}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          variant="outline"
          aria-label="Toggle Navigation"
        />

        {/* Desktop Navigation */}
        <HStack
          display={{ base: "none", md: "flex" }}
          spacing={4}
          ml="auto"
          align="center"
        >
          {isLoggedIn ? (
            <>
              <IconButton
                aria-label="Toggle Dark Mode"
                icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                onClick={toggleColorMode}
                isRound
                variant="ghost"
                size="lg"
                _hover={{ bg: "whiteAlpha.300" }}
              />

              <Text
                fontSize="lg"
                bgGradient={backgroundGradient}
                p={2}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "whiteAlpha.500", transition: "0.2s" }} // 
                onClick={photoStorageModal.onOpen}
              >
                📸 Photos: {photoCount}
              </Text>

              <Text
                fontSize="lg"
                bgGradient={backgroundGradient}
                p={2}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "whiteAlpha.500", transition: "0.2s" }} // 
                onClick={countriesModal.onOpen}
              >
                🌍 Countries: {countryCount}
              </Text>

              {!loading ? (
                <>
                  <SearchForm
                    countriesWithPhotos={countriesWithPhotos}
                    onSearch={(searchParams) =>
                      navigate(`/countries/${searchParams.country}?year=${searchParams.year}`)
                    }
                  />
                  <Button
                    fontSize="lg"
                    variant="solid"
                    onClick={() => navigate("/timeline")}
                  >
                    Timeline
                  </Button>
                </>
              ) : (
                <Text>Loading search...</Text>
              )}

              <Text
                fontSize="lg"
                fontWeight="bold"
                cursor="pointer"
                onClick={profileModal.onOpen}
              >
                Welcome, {fullname} {isPremium && "(Premium 🌟)"}
              </Text>

              {!isPremium && (
                <Button
                  colorScheme="yellow"
                  fontSize="lg"
                  variant="solid"
                  onClick={premiumModal.onOpen}
                >
                  Upgrade to Premium 🌟
                </Button>
              )}

              <Button colorScheme="red" variant="solid" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button variant="solid" onClick={() => navigate("/login")}>
                Sign in
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </>
          )}
        </HStack>
      </Flex>

      {/* Mobile Menu (Collapsible) */}
      {/* Mobile Menu (Collapsible) */}
      <Collapse in={isOpen} animateOpacity>
        <Box
          display={{ base: "flex", md: "none" }}
          rounded="md"
          shadow="md"
          mt={2}
          px={4}
          py={3}
        >
          {isLoggedIn ? (
            <VStack align="start" spacing={3}>
              <IconButton
                aria-label="Toggle Dark Mode"
                icon={colorMode === 'light' ? <FaMoon /> : <FaSun />}
                onClick={toggleColorMode}
                isRound
                variant="ghost"
                size="md"
                alignSelf="flex-start"
                _hover={{ bg: "whiteAlpha.300" }}
              />

              <Text
                fontWeight="bold"
                cursor="pointer"
                onClick={profileModal.onOpen}
              >
                Welcome, {fullname} {isPremium && "(Premium 🌟)"}
              </Text>

              {!isPremium && (
                <Button
                  colorScheme="yellow"
                  variant="solid"
                  onClick={premiumModal.onOpen}
                >
                  Upgrade to Premium 🌟
                </Button>
              )}
              <Text
                fontSize="md"
                p={2}
                borderRadius="md"
                cursor="pointer"
                _hover={{ transition: "0.2s" }}
                onClick={photoStorageModal.onOpen}
              >
                📸 Photos: {photoCount}
              </Text>

              <Text
                fontSize="md"
                p={2}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "whiteAlpha.500", transition: "0.2s" }}
                onClick={countriesModal.onOpen}
              >
                🌍 Countries: {countryCount}
              </Text>

              <SearchForm
                countriesWithPhotos={countriesWithPhotos}
                onSearch={(searchParams) => {
                  navigate(`/countries/${searchParams.country}?year=${searchParams.year}`);
                  onClose();
                }}
              />

              <Button
                variant="solid"
                onClick={() => {
                  navigate("/timeline");
                  onClose();
                }}
              >
                Timeline
              </Button>

              <Button variant="solid" onClick={logout}>
                Sign out
              </Button>
            </VStack>
          ) : (
            <VStack align="start" spacing={3}>
              <Button
                variant="solid"
                onClick={() => {
                  navigate("/login");
                  onClose();
                }}
              >
                Sign in
              </Button>
              <Button
                variant="solid"
                onClick={() => {
                  navigate("/register");
                  onClose();
                }}
              >
                Sign up
              </Button>
            </VStack>
          )}
        </Box>
      </Collapse>

      {/* Photo Storage Modal */}
      <Modal isOpen={photoStorageModal.isOpen} onClose={photoStorageModal.onClose} size="sm" motionPreset="slideInBottom"  >
        <ModalOverlay />
        <ModalContent rounded="lg" shadow="xl" bgGradient={backgroundGradient} >
          <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold" >
            Photo Storage
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box textAlign="center" p={4} borderRadius="md" shadow="sm">
              <Text fontSize="lg" fontWeight="medium" >
                {isPremium ? "100GB Photo Storage 📸" : "5GB Photo Storage 📷"}
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button w="full" onClick={photoStorageModal.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Countries Visited Modal */}
      <Modal isOpen={countriesModal.isOpen} onClose={countriesModal.onClose} size="sm" motionPreset="slideInBottom" >
        <ModalOverlay />
        <ModalContent rounded="lg" shadow="xl" bgGradient={backgroundGradient}>
          <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold" >
            Countries Visited
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box textAlign="center" p={4} borderRadius="md" shadow="sm">
              <Text fontSize="lg" fontWeight="medium" >
                You have visited <b>{countryCount}</b> out of <b>195</b> countries! 🌍
              </Text>
              <Box mt={4}>
                <progress
                  value={countryCount}
                  max="195"
                  style={{
                    width: "100%",
                    height: "20px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#e0e0e0",
                  }}
                />
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button w="full" onClick={countriesModal.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>



      {/* Profile Modal */}
      <Modal isOpen={profileModal.isOpen} onClose={profileModal.onClose} size="lg" motionPreset="slideInBottom"  >
        <ModalOverlay />
        <ModalContent rounded="lg" shadow="xl" >
          <ModalHeader textAlign="center" fontSize="2xl" fontWeight="semibold">
            My Profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={4} borderRadius="md" shadow="sm">
              <Text fontSize="lg" fontWeight="bold" >Full Name:</Text>
              <Text mb={2}>{fullname}</Text>

              <Text fontSize="lg" fontWeight="bold" >Email:</Text>
              <Text mb={2}>{email}</Text>

              <Text fontSize="lg" fontWeight="bold" >Photos:</Text>
              <Text mb={2}>{photoCount}</Text>

              <Text fontSize="lg" fontWeight="bold" >Countries:</Text>
              <Text>{countryCount}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button w="full" onClick={profileModal.onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Premium Benefits Modal */}
      <Modal isOpen={premiumModal.isOpen} onClose={premiumModal.onClose} size="lg" motionPreset="slideInBottom">
        <ModalOverlay />
        <ModalContent rounded="lg" shadow="xl">
          <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold" color="yellow.600">
            🎉 Premium User Benefits
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box p={4} borderRadius="md" shadow="sm">
              <Text mb={3} fontSize="lg" fontWeight="medium" color="gray.700">
                By becoming a Premium user, you unlock:
              </Text>
              <VStack spacing={3} align="start" pl={2}>
                <Text>✅ <b>100gb photo storage</b></Text>
                <Text>✅ <b>Create Albums</b></Text>
                <Text>✅ <b>Priority support</b></Text>
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={premiumModal.onClose}>
              Cancel
            </Button>
            <Button w="full" onClick={handleBecomePremium} isLoading={loadingPremium}>
              Upgrade to Premium
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Header;
