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
    useColorModeValue,
    chakra
} from '@chakra-ui/react';
import {
    FaUsers,
    FaChartPie,
    FaWifi,
    FaCity,
    FaUserTimes,
    FaPrayingHands,
    FaBaby,
    FaBolt,
    FaHeartbeat,
    FaBook,
    FaPlaneDeparture,
    FaPercent
} from 'react-icons/fa';
import { motion } from 'framer-motion';

import factbookRegionMap from '../data/factbookRegionMap.json';
import { isoToGec } from '../data/isoToGecMap';

const getFactbookRegion = (code) => factbookRegionMap[code.toLowerCase()] ?? null;


const getFactbookCode = (isoCode) => {
    return isoToGec[isoCode.toLowerCase()] || isoCode.toLowerCase();
};

export const fetchFactbookData = async (countryId) => {
    const region = getFactbookRegion(countryId);
    if (!region) throw new Error('Region not mapped for this country.');

    const gecCode = getFactbookCode(countryId);
    const url = `https://raw.githubusercontent.com/factbook/factbook.json/master/${region}/${gecCode}.json`;

    const response = await fetch(url);

    if (response.status === 404) {
        throw new Error(`Factbook data not found for country code "${countryId}"`);
    }

    if (!response.ok) {
        throw new Error('Failed to fetch factbook data.');
    }

    const data = await response.json();

    return {
        religion:
            typeof data?.["People and Society"]?.["Religions"] === 'object'
                ? data["People and Society"]["Religions"].text ?? null
                : data?.["People and Society"]?.["Religions"] ?? null,
    };
};


const SocialModal = ({ indicatorsData, factbookData, factbookError }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const backgroundGradient = useColorModeValue(
        // "linear(to-r, teal.400, blue.300)",
        "linear(to-r, rgb(151, 205, 228),rgb(101, 191, 201))",
        "linear(to-r,rgb(78, 123, 151),rgb(22, 47, 72))"
    );

    

    return (
        <>
            <Button mt={1} ml={2} onClick={onOpen} isDisabled={!indicatorsData}>
  Social Info
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
                        <Icon as={FaUsers} color="blue.600" />
                        Social Indicators
                    </ModalHeader>
                    <ModalCloseButton />

                    <ModalBody
                        pb={6}
                        overflowY="auto" // Habilita rolagem vertical
                        pr={2} // padding à direita para afastar da barra de rolagem
                    >
                        
                        <Stack spacing={4}>
                            <Box>
                                <Text fontWeight="bold" fontSize="lg">
                                    <Icon as={FaChartPie} mr={2} />
                                    Life Expectancy
                                </Text>
                                <Text fontSize="md" fontWeight="light">
                                    {indicatorsData.lifeExpectancy.value} ({indicatorsData.lifeExpectancy.year})
                                </Text>
                            </Box>

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.internetUsers && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaWifi} mr={2} />
                                        Internet Usage
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block" >
                                        {indicatorsData.internetUsers.value} ({indicatorsData.internetUsers.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.urbanPopulation && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaCity} mr={2} />
                                        Urban Population
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.urbanPopulation.value} ({indicatorsData.urbanPopulation.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.unemployment && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaUserTimes} mr={2} />
                                        Unemployment Rate
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.unemployment.value} ({indicatorsData.unemployment.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {factbookData?.religion ? (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaPrayingHands} mr={2} />
                                        Major Religions
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {String(factbookData.religion)}
                                    </Text>
                                </Box>
                            ) : factbookError && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaPrayingHands} mr={2} />
                                        Major Religions
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block" color="red.300">
                                        No data available for this country.
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.fertilityRate && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaBaby} mr={2} />
                                        Fertility Rate
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.fertilityRate.value} ({indicatorsData.fertilityRate.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.accessToEletricity && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaBolt} mr={2} />
                                        Access to Electricity
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.accessToEletricity.value} ({indicatorsData.accessToEletricity.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.healthExpenses && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaHeartbeat} mr={2} />
                                        Health Expenditure (% of GDP)
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.healthExpenses.value} ({indicatorsData.healthExpenses.year})
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            <Box>
                                <Text fontWeight="bold" fontSize="lg">
                                    <Icon as={FaBook} mr={2} />
                                    Literacy Rate
                                </Text>
                                {indicatorsData.education ? (
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.education.value} ({indicatorsData.education.year})
                                    </Text>
                                ) : (
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block" color="red.300">
                                        No data available for this indicator.
                                    </Text>
                                )}
                            </Box>

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.netMigration ? (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaPlaneDeparture} mr={2} />
                                        Net Migration
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.netMigration.value} ({indicatorsData.netMigration.year})
                                    </Text>
                                </Box>
                            ) : (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaPlaneDeparture} mr={2} />
                                        Net Migration
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block" color="red.300">
                                        No data available for this indicator.
                                    </Text>
                                </Box>
                            )}

                            <Box borderBottom="1px" borderColor="gray.300" opacity={0.5} />

                            {indicatorsData.inflationCPI && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">
                                        <Icon as={FaPercent} mr={2} />
                                        Inflation Rate (CPI)
                                    </Text>
                                    <Text fontSize="md" fontWeight="light" bg="whiteAlpha.300" px={2} py={1} borderRadius="md" display="inline-block">
                                        {indicatorsData.inflationCPI.value} ({indicatorsData.inflationCPI.year})
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

export default SocialModal;
