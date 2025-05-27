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
import { FaUsers } from 'react-icons/fa';
import factbookRegionMap from '../data/factbookRegionMap.json';
import { isoToGec } from '../data/isoToGecMap';

const getFactbookRegion = (code) => factbookRegionMap[code.toLowerCase()] ?? null;

const getFactbookCode = (isoCode) => {
    return isoToGec[isoCode.toLowerCase()] || isoCode.toLowerCase();
};

export const fetchFactbookData = async (countryId) => {
    const region = getFactbookRegion(countryId);
    if (!region) throw new Error('Região não mapeada para o país.');

    const gecCode = getFactbookCode(countryId);
    const url = `https://raw.githubusercontent.com/factbook/factbook.json/master/${region}/${gecCode}.json`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Factbook data not found');

    const data = await response.json();

    return {
        religion:
            typeof data?.["People and Society"]?.["Religions"] === 'object'
                ? data["People and Society"]["Religions"].text ?? null
                : data?.["People and Society"]?.["Religions"] ?? null,
    };
};

const SocialModal = ({ indicatorsData, factbookData }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const backgroundGradient = useColorModeValue(
        // "linear(to-r, teal.400, blue.300)",
        "linear(to-r, rgb(151, 205, 228),rgb(101, 191, 201))",
        "linear(to-r,rgb(78, 123, 151),rgb(22, 47, 72))"
    );

    if (!indicatorsData) return null;

    return (
        <>
            <Button mt={1} ml={2} onClick={onOpen}>
                Social Info
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered motionPreset="slideInBottom">
                <ModalOverlay />
                <ModalContent
                    borderRadius="2xl"
                    shadow="xl"
                    bgGradient={backgroundGradient}
                >
                    <ModalHeader display="flex" alignItems="center" gap={2} fontSize="2xl"
                        fontWeight="bold">
                        <Icon as={FaUsers} color="blue.600" />
                        Social Indicators
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Stack spacing={4}>
                            {indicatorsData.lifeExpectancy && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">Life Expectancy</Text>
                                    <Text fontSize="md" fontWeight="light" >
                                        {indicatorsData.lifeExpectancy.value} ({indicatorsData.lifeExpectancy.year})
                                    </Text>
                                </Box>
                            )}

                            {indicatorsData.internetUsers && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" >Internet Usage</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        {indicatorsData.internetUsers.value} ({indicatorsData.internetUsers.year})
                                    </Text>
                                </Box>
                            )}

                            {indicatorsData.urbanPopulation && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" >Urban Population</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        {indicatorsData.urbanPopulation.value} ({indicatorsData.urbanPopulation.year})
                                    </Text>
                                </Box>
                            )}

                            {indicatorsData.unemployment && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">Unemployment Rate</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        {indicatorsData.unemployment.value} ({indicatorsData.unemployment.year})
                                    </Text>
                                </Box>
                            )}

                            {factbookData?.religion && (
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" >Major Religions</Text>
                                    <Text fontSize="md" fontWeight="light">
                                        {String(factbookData.religion)}
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
