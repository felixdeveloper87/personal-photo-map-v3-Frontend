import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Image,
  Button,
  Text,
  useDisclosure,
  useToast,
  IconButton,
  VStack,
  HStack,
  Collapse,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react";
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  TimelineButton,
} from "../components/CustomButtons";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { AuthContext } from "../context/AuthContext";
import { CountriesContext } from "../context/CountriesContext";
import SearchForm from "../components/SearchForm";
import UserProfileModal from "../components/modals/UserProfileModal";
import PremiumBenefitsModal from "../components/modals/PremiumBenefitsModal";
import PhotoStorageModal from "../components/modals/PhotoStorageModal";
import { showSuccessToast, showErrorToast } from "../components/CustomToast";
import CountriesVisitedModal from '../components/modals/CountriesVisitedModal';
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

      updatePremiumStatus(true);
      showSuccessToast(toast, "You are now a Premium user! 🎉");
      premiumModal.onClose();
    } catch (error) {
      console.error("Premium upgrade error:", error);
      showErrorToast(toast, "Failed to become premium.");
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
                _hover={{ bg: "whiteAlpha.500", transition: "0.2s" }}
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
                  <TimelineButton onClick={() => navigate("/timeline")} color="white" />
                </>
              ) : (
                <Text>Loading search...</Text>

              )}

              <Text
                fontWeight="semibold"
                cursor="pointer"
                fontSize="lg"
                onClick={profileModal.onOpen}
              >
                {fullname} {isPremium && "(Premium 🌟)"}
              </Text>

              {!isPremium && (
                <UpgradeToPremiumButton onClick={premiumModal.onOpen} />

              )}

              <SignOutButton onClick={logout} />
            </>
          ) : (
            <>
              <SignInButton onClick={() => navigate("/login")} />

              <SignUpButton onClick={() => navigate("/register")} />


            </>
          )}
        </HStack>
      </Flex>

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
                <UpgradeToPremiumButton onClick={premiumModal.onOpen} />
              )}
              <Text
                fontSize="md"
                p={2}
                borderRadius="md"
                cursor="pointer"
                _hover={{ bg: "whiteAlpha.500", transition: "0.2s" }}
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

              <TimelineButton onClick={() => navigate("/timeline")} color="white" />

              <SignOutButton onClick={logout} />
            </VStack>
          ) : (
            <VStack align="start" spacing={3}>
              <SignInButton onClick={() => navigate("/login")} />
              <SignUpButton onClick={() => navigate("/register")} />
            </VStack>
          )}
        </Box>
      </Collapse>

      {/* Photo Storage Modal */}
      <PhotoStorageModal
        isOpen={photoStorageModal.isOpen}
        onClose={photoStorageModal.onClose}
        isPremium={isPremium}
      />

      {/* Countries Visited Modal */}
      <CountriesVisitedModal
        isOpen={countriesModal.isOpen}
        onClose={countriesModal.onClose}
        countryCount={countryCount}
      />

      {/* Profile Modal */}
      <UserProfileModal
        isOpen={profileModal.isOpen}
        onClose={profileModal.onClose}
        fullname={fullname}
        email={email}
        photoCount={photoCount}
        countryCount={countryCount}
      />

      {/* Premium Benefits Modal */}
      <PremiumBenefitsModal
        isOpen={premiumModal.isOpen}
        onClose={premiumModal.onClose}
        onUpgrade={handleBecomePremium}
        isLoading={loadingPremium}
      />
    </Box>
  );
}

export default Header;
