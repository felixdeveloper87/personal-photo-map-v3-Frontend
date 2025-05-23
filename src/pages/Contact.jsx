/**
 * Contact.jsx
 *
 * Displays contact and support information for the Photomap application, including
 * developer details, company address, customer support, social media links, and more.
 */


import { 
  Box, Container, Heading, Text, VStack, HStack, Link, Icon, Divider, Avatar 
} from "@chakra-ui/react";
import { 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebook, FaLinkedin 
} from "react-icons/fa";
import leandroPhoto from "../assets/leandro.jpg"; 

const Contact = () => {
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="xl" textAlign="center">
          📍 Contact Us
        </Heading>
        <Text fontSize="lg" textAlign="center" maxW="lg">
          We'd love to hear from you! Whether you have questions, feedback, or need support, feel free to reach out.
        </Text>

        {/* Profile of the project lead */}
        <Box textAlign="center" mt={4}>
          <Avatar src={leandroPhoto} size="2xl" name="Leandro Félix" mb={3} />
          <Heading as="h2" size="md">Leandro Felix</Heading>
          <Text fontSize="sm" color="gray.600">
            Developer & Project Lead – Photomap Application
          </Text>
        </Box>

        <Divider />

        {/* Customer support section */}
        <Box textAlign="center">
          <Heading as="h2" size="md">📞 Customer Support</Heading>
          <Text>
            <Icon as={FaEnvelope} mr={2} />
            <Link href="mailto:support@photomap.com" color="blue.500">support@photomap.com</Link>
          </Text>
          <Text>
            <Icon as={FaPhone} mr={2} />
            +44 20 1234 5678
          </Text>
          <Text fontSize="sm" color="gray.600">Live Chat: 9 AM - 6 PM (GMT)</Text>
        </Box>

        <Divider />

        {/* Company address and info */}
        <Box textAlign="center">
          <Heading as="h2" size="md">🏢 Company Information</Heading>
          <Text>Photomap Ltd.</Text>
          <Text>
            <Icon as={FaMapMarkerAlt} mr={2} />
            123 Tech Street, London, UK, W1A 1AA
          </Text>
          <Text fontSize="sm" color="gray.600">Business Hours: Mon - Fri, 9 AM - 5 PM (GMT)</Text>
        </Box>

        <Divider />

        {/* Social media links */}
        <Box textAlign="center">
          <Heading as="h2" size="md">🌍 Follow Us</Heading>
          <HStack spacing={5} mt={2}>
            <Link href="https://instagram.com" isExternal>
              <Icon as={FaInstagram} boxSize={6} color="pink.500" />
            </Link>
            <Link href="https://twitter.com" isExternal>
              <Icon as={FaTwitter} boxSize={6} color="blue.400" />
            </Link>
            <Link href="https://facebook.com" isExternal>
              <Icon as={FaFacebook} boxSize={6} color="blue.600" />
            </Link>
            <Link href="https://linkedin.com" isExternal>
              <Icon as={FaLinkedin} boxSize={6} color="blue.700" />
            </Link>
          </HStack>
        </Box>

        <Divider />

        {/* Feedback section */}
        <Box textAlign="center">
          <Heading as="h2" size="md">📩 Feedback & Suggestions</Heading>
          <Text>
            Have an idea to improve Photomap? Email us at 
            <Link href="mailto:feedback@photomap.com" color="blue.500" ml={1}>feedback@photomap.com</Link>.
          </Text>
        </Box>

        <Divider />

        {/* Technical support section */}
        <Box textAlign="center">
          <Heading as="h2" size="md">🛠 Technical Support</Heading>
          <Text>
            Experiencing technical issues? Visit our{" "}
            <Link href="/404" isExternal color="blue.500">Help Centre</Link> or check the FAQ section before reaching out.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Contact;
