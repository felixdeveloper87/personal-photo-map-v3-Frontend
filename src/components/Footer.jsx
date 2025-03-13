import React from 'react';
import { Box, Flex, Text, Link, HStack } from '@chakra-ui/react';

/**
 * The Footer component provides a simple navigational area
 * (e.g. About, Contact links) and displays a copyright
 * notice at the bottom of the page.
 *
 * @returns {JSX.Element} A responsive footer section.
 */
const Footer = () => {
  return (
    <Box
      as="footer"
      bg="gray.900"
      color="white"
      py={6}          
      w="100%"
      mt={8}
      boxShadow="inner"
    >
      <Flex direction="column" align="center" justify="center">
        {/* Navigation Links */}
        <HStack spacing={8} mb={4}>
          <Link
            href="/about"
            fontSize="md"
            fontWeight="medium"
            _hover={{ color: "teal.300", textDecoration: "underline" }}
          >
            About
          </Link>
          <Link
            href="/contact"
            fontSize="md"
            fontWeight="medium"
            _hover={{ color: "teal.300", textDecoration: "underline" }}
          >
            Contact
          </Link>
        </HStack>

        {/* Copyright */}
        <Text fontSize="sm" color="gray.500">
          &copy; {new Date().getFullYear()} My Personal Photo Gallery. All Rights Reserved.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;
