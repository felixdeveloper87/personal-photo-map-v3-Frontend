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
import { FaChartLine, FaGlobeAmericas, FaHandHoldingUsd, FaUniversity, FaExchangeAlt, FaBalanceScale, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'framer-motion';


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
                    maxHeight="50vh" // Limita a altura máxima da janela modal
                    overflow="hidden"
                >
                    <ModalHeader
                        display="flex"
                        alignItems="center"
                        gap={2}
                        fontSize="2xl"
                        fontWeight="bold"
                    >
                        <Icon as={FaChartLine} />
                        Economic Indicators
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody
                        pb={6}
                        overflowY="auto" // Habilita rolagem vertical
                        maxHeight="calc(80vh - 80px)" // Altura considerando header + footer
                        pr={2} // padding à direita para afastar da barra de rolagem
                    >
                        <Stack spacing={4}>
                            {exchangeRate && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaExchangeAlt} mr={2} />
                                        Exchange Rate
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        1 £ = {exchangeRate} {currency}
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.gdp && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaMoneyBillWave} mr={2} />
                                        GDP
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.gdp.value} ({indicatorsData.gdp.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.gdpPerCapitaCurrent && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaUniversity} mr={2} />
                                        GDP Per Capita
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.gdpPerCapitaCurrent.value} ({indicatorsData.gdpPerCapitaCurrent.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.gniPerCapita && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaHandHoldingUsd} mr={2} />
                                        GNI per Capita
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.gniPerCapita.value} ({indicatorsData.gniPerCapita.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.hdiProxy && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaGlobeAmericas} mr={2} />
                                        GNI per Capita (PPP)
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.hdiProxy.value} ({indicatorsData.hdiProxy.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.gdpGrowth && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaChartLine} mr={2} />
                                        GDP Growth
                                    </Text>
                                    <Text
                                        fontSize="md"
                                        fontWeight="semibold"
                                        bg="whiteAlpha.300"
                                        px={2}
                                        py={1}
                                        borderRadius="md"
                                        display="inline-block"
                                        color={parseFloat(indicatorsData.gdpGrowth.value) >= 0 ? "green.400" : "red.400"}
                                    >
                                        {indicatorsData.gdpGrowth.value} ({indicatorsData.gdpGrowth.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            <Box>
                                <Text fontWeight="bold" fontSize="lg">
                                    <Icon as={FaBalanceScale} mr={2} />
                                    Public Debt (% of GDP)
                                </Text>
                                {indicatorsData.debtToGDP ? (
                                    <Text fontSize="md" fontWeight="semibold" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.debtToGDP.value} ({indicatorsData.debtToGDP.year})
                                    </Text>
                                ) : (
                                    <Text fontSize="md" fontWeight="light" color="red.300">
                                        No data available for this indicator.
                                    </Text>
                                )}
                            </Box>
                        </Stack>

                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default EconomicModal;
