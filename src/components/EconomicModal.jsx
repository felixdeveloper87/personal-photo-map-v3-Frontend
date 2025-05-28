import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Text,
    useDisclosure,
    Button,
    Stack,
    Box,
    Icon,
    useColorModeValue
} from '@chakra-ui/react';
import { FaChartLine } from 'react-icons/fa';

const EconomicModal = ({ indicatorsData, exchangeRate, currency, countryInfo }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const backgroundGradient = useColorModeValue(
        "linear(to-r, rgb(151, 205, 228),rgb(101, 191, 201))",
        "linear(to-r,rgb(78, 123, 151),rgb(22, 47, 72))"
    );

    const valueColor = useColorModeValue("gray.900", "whiteAlpha.900");

    if (!indicatorsData) return null;

    return (
        <>
            <Button mt={1} onClick={onOpen}>
                Economic Info
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered motionPreset="slideInBottom">
                <ModalOverlay />
                <ModalContent
                    borderRadius="2xl"
                    shadow="xl"
                    bgGradient={backgroundGradient}
                    color={valueColor}
                >
                    <ModalHeader display="flex" alignItems="center" gap={2} fontSize="2xl"
                        fontWeight="bold">
                        <Icon as={FaChartLine} />
                        Economic Indicators
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody pb={6}>
                        <Stack spacing={4}  >
                            {exchangeRate && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">Exchange Rate</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        1 £ = {exchangeRate} {currency}
                                    </Text>
                                </Box>
                            )}

                            {indicatorsData.gdp && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" >GDP</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        {indicatorsData.gdp.value} ({indicatorsData.gdp.year})
                                    </Text>
                                </Box>
                            )}

                            {indicatorsData.gniPerCapita && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" >GNI per Capita</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        {indicatorsData.gniPerCapita.value} ({indicatorsData.gniPerCapita.year})
                                    </Text>
                                </Box>
                            )}

                            {indicatorsData.hdiProxy && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">GNI per Capita (PPP)</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        {indicatorsData.hdiProxy.value} ({indicatorsData.hdiProxy.year})
                                    </Text>
                                </Box>
                            )}

                            {indicatorsData.gdpGrowth && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">GDP Growth</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        {indicatorsData.gdpGrowth.value} ({indicatorsData.gdpGrowth.year})
                                    </Text>
                                </Box>
                            )}
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EconomicModal;
