import { Box, Container, Heading, Text, VStack, HStack, Link, Icon, Divider } from "@chakra-ui/react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center">
        <Heading as="h1" size="xl">
          📍 Contact Us
        </Heading>
        <Text fontSize="lg" textAlign="center">
          We'd love to hear from you! Whether you have questions, feedback, or need support, feel free to reach out.
        </Text>

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
          <Text fontSize="sm">Live Chat available from 9 AM - 6 PM (GMT)</Text>
        </Box>

        <Divider />

        <Box textAlign="center">
          <Heading as="h2" size="md">🏢 Company Information</Heading>
          <Text>Photomap Ltd.</Text>
          <Text>
            <Icon as={FaMapMarkerAlt} mr={2} />
            123 Tech Street, London, UK, W1A 1AA
          </Text>
          <Text fontSize="sm">Business Hours: Monday - Friday, 9 AM - 5 PM (GMT)</Text>
        </Box>

        <Divider />

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

        <Box textAlign="center">
          <Heading as="h2" size="md">📩 Feedback & Suggestions</Heading>
          <Text>
            Have an idea to improve Photomap? Submit your suggestions at 
            <Link href="mailto:feedback@photomap.com" color="blue.500" ml={1}>feedback@photomap.com</Link>.
          </Text>
        </Box>

        <Divider />

        <Box textAlign="center">
          <Heading as="h2" size="md">🛠 Technical Support</Heading>
          <Text>
            If you encounter technical issues, visit our{" "}
            <Link href="/404" isExternal color="blue.500">Help Center</Link> 
            {" "}or check our FAQ before reaching out.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default Contact;
