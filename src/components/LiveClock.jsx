import { useState, useEffect } from 'react';
import { Box, Text, Icon, Flex, Image, useColorModeValue } from '@chakra-ui/react';
import moment from 'moment-timezone';
import { motion } from 'framer-motion';
import { BsClockHistory } from 'react-icons/bs';
import { FaLanguage, FaMoneyBillWave, FaUsers } from 'react-icons/fa';

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

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(moment().utcOffset(timezoneOffset / 60));
        }, 1000);

        return () => clearInterval(interval);
    }, [timezoneOffset]);

    const iconUrl = weatherIcon
        ? `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
        : null;

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
            color="white"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            width="fit-content"
        >
            <>
                {countryInfo?.capital && (
                    <Flex align="center" mb={1}>
                        <Icon as={BsClockHistory} boxSize={5} mr={2} />
                        <Text fontSize="lg" fontWeight="medium">
                            Capital: {countryInfo.capital}
                        </Text>
                    </Flex>
                )}

                <Flex align="center" mb={1}>
                    <Icon as={FaLanguage} boxSize={5} mr={2} />
                    <Text fontSize="lg" fontWeight="medium">
                        Official Language: {countryInfo.officialLanguage}
                    </Text>
                </Flex>

                <Flex align="center" mb={1}>
                    <Icon as={FaMoneyBillWave} boxSize={5} mr={2} />
                    <Text fontSize="lg" fontWeight="medium">
                        Currency: {countryInfo.currency}
                    </Text>
                </Flex>

                <Flex align="center" mb={1}>
                    <Icon as={FaUsers} boxSize={5} mr={2} />
                    <Text fontSize="lg" fontWeight="medium">
                        Population: {countryInfo.population.toLocaleString('en-US')}
                    </Text>
                </Flex>

                <Flex align="center" mb={1}>
                    <Icon as={BsClockHistory} boxSize={5} mr={2} />
                    <Text fontSize="lg" fontWeight="medium">
                        {time.format('D MMMM YYYY')} –{' '}
                        <Box
                            as="span"
                            px={2}
                            py={0.5}
                            bg="gray.800"
                            fontFamily="monospace"
                            borderRadius="md"
                            boxShadow="md"
                            fontSize="lg"
                        >
                            {time.format('HH:mm:ss')}
                        </Box>{' '}
                        {/* (UTC {timezoneOffset >= 0 ? '+' : ''}{timezoneOffset / 3600}) */}
                    </Text>
                </Flex>

                <Flex align="center" mt={1}>
                    {iconUrl && (
                        <Box
                            boxSize="40px"
                            mr={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Image
                                src={iconUrl}
                                alt={weatherDescription}
                                boxSize="100%"
                                objectFit="contain"
                                mt="-2px"
                            />
                        </Box>
                    )}
                    <Text fontSize="lg" fontWeight="medium">
                        {temperature}°C – {weatherDescription}
                    </Text>
                </Flex>

            </>
        </MotionBox>

    );
};

export default LiveClock;
