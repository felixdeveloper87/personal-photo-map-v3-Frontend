import { useState, useEffect } from 'react';
import { Box, Text, Icon, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import moment from 'moment-timezone';
import { motion } from 'framer-motion';
import { BsClockHistory } from 'react-icons/bs';
import {
    FaLanguage, FaMoneyBillWave, FaUsers, FaSun,
    FaCloud,
    FaCloudRain,
    FaSnowflake,
    FaSmog,
    FaBolt,
} from 'react-icons/fa';

/**
 * Motion-enabled Box for animation
 */
const MotionBox = motion(Box);

/**
 * LiveClock Component
 * Displays a live digital clock and local date with animation.
 *
 * @param {number} timezoneOffset - Offset in seconds from UTC (e.g., 3600 = UTC+1)
 */
const LiveClock = ({ timezoneOffset, countryInfo, temperature, weatherDescription, weatherIcon }) => {
    const [time, setTime] = useState(moment().utcOffset(timezoneOffset / 60));
    const backgroundGradient = useColorModeValue(
        "linear(to-r,rgb(80, 120, 106),rgb(142, 171, 159))",   // light mode
        "linear(to-r,rgb(57, 84, 128),rgb(123, 126, 126))"   // dark mode
    );

    const getWeatherIcon = (description) => {
        const desc = description?.toLowerCase() || "";

        if (desc.includes("clear")) return <FaSun size={20} />;
        if (desc.includes("cloud")) return <FaCloud size={20} />;
        if (desc.includes("rain")) return <FaCloudRain size={20} />;
        if (desc.includes("snow")) return <FaSnowflake size={20} />;
        if (desc.includes("fog") || desc.includes("mist")) return <FaSmog size={20} />;
        if (desc.includes("thunder")) return <FaBolt size={20} />;

        return <FaSun size={20} />; // fallback genérico
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment().utcOffset(timezoneOffset / 60));
        }, 1000);

        return () => clearInterval(interval);
    }, [timezoneOffset]);

    return (
        <MotionBox
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            bgGradient={backgroundGradient}
            px={{ base: 3, md: 5 }}
            py={{ base: 2, md: 3 }}
            borderRadius="2xl"
            boxShadow="2xl"
            mt={{ base: 2, md: 4 }}
            // color="white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            width="fit-content"
        >
            <>
                {countryInfo?.capital && (
                    <Flex align="center" mb={1}>
                        <Icon as={BsClockHistory} boxSize={5} mr={2} />
                        <Text fontSize="lg">
                            <Box
                                as="span"
                                fontSize="xl"
                                letterSpacing="wide"
                                mr={1}
                                fontWeight="bold"
                            >
                                Capital:
                            </Box>
                            <Box as="span" fontWeight="medium" color="gray.200">
                                {countryInfo.capital}

                            </Box>
                            <Box borderBottom="2px" borderColor="gray.300" opacity={0.3} />
                        </Text>
                    </Flex>
                )}

                <Flex align="center" mb={1}>
                    <Icon as={FaLanguage} boxSize={5} mr={2} />
                    <Text fontSize="lg">
                        <Box as="span"
                            fontSize="xl"
                            letterSpacing="wide"
                            mr={1}
                            fontWeight="bold"
                        >
                            Language:</Box>{' '}
                        <Box as="span" fontWeight="medium" color="gray.200">
                            {countryInfo.officialLanguage}
                        </Box>
                        <Box borderBottom="2px" borderColor="gray.300" opacity={0.3} />
                    </Text>
                </Flex>

                <Flex align="center" mb={1}>
                    <Icon as={FaMoneyBillWave} boxSize={5} mr={2} />
                    <Text fontSize="lg">
                        <Box as="span"
                            fontSize="xl"
                            letterSpacing="wide"
                            mr={1}
                            fontWeight="bold"
                        >
                            Currency: </Box>
                        <Box as="span" fontWeight="medium" color="gray.200">
                            {countryInfo.currencyName}
                        </Box>
                        <Box borderBottom="2px" borderColor="gray.300" opacity={0.3} />

                    </Text>
                </Flex>

                <Flex align="center" mb={1}>
                    <Icon as={FaUsers} boxSize={5} mr={2} />
                    <Text fontSize="lg">
                        <Box as="span"
                            fontSize="xl"
                            letterSpacing="wide"
                            mr={1}
                            fontWeight="bold"
                        >
                            Population: </Box>
                        <Box as="span" fontWeight="medium" color="gray.200">
                            {countryInfo.population.toLocaleString('en-US')}
                        </Box>
                        <Box borderBottom="2px" borderColor="gray.300" opacity={0.3} />
                    </Text>
                </Flex>

                <Flex align="center" mb={0}>
                    <Icon as={BsClockHistory} boxSize={5} mr={2} />
                    <Text fontSize="lg">
                        <Box as="span" mr={1} fontSize="x1" fontWeight="bold">
                            {time.format('D MMMM YYYY')} –
                        </Box>{' '}
                        <Box
                            as="span"
                            px={2}
                            py={0.5}
                            bg="gray.800"
                            fontFamily="monospace"
                            borderRadius="md"
                            boxShadow="md"
                            color="gray.200"
                        >
                            {time.format('HH:mm:ss')}
                        </Box>{' '}
                        <Box borderBottom="2px" borderColor="gray.300" opacity={0.3} />
                    </Text>
                </Flex>


                <Flex align="center" mt={1}>
                    <Box
                        mr={2}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {getWeatherIcon(weatherDescription)}
                    </Box>

                    <Text fontSize="lg">
                        <Box
                            as="span"
                            borderRadius="md"
                            mr={2}
                            letterSpacing="wide"
                            fontWeight="bold"
                        >
                            {temperature}°C
                        </Box>
                        <Box as="span" fontWeight="medium" color="gray.200">
                            {weatherDescription}
                        </Box>
                        <Box borderBottom="2px" borderColor="gray.300" opacity={0.3} />
                    </Text>
                </Flex>
            </>
        </MotionBox>

    );
};

export default LiveClock;
