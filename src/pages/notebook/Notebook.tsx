import React from 'react';
import './notebook.scss';
import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import ReactECharts from 'echarts-for-react';
import chart from '../../models/data';
const Notebook = () => {
    const textColor = useColorModeValue('light.header', 'dark.white');
    return (
        <>
            <Box className="notebook_page" color={textColor}>
                Notebook
            </Box>
            <Stack spacing={3}>
                <Text fontSize="md" ml={'38'} noOfLines={[2]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                    Duis aute irure dolor in reprehenderit in voluptate velit
                </Text>
                <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" ml={'10'}>
                    <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" noOfLines={1} ml={'17'} marginTop={'17'}>
                        Histogram
                    </Box>
                    <Box ml={'17'}>
                        <Text>Data frequency and age detail</Text>
                    </Box>
                    <Box ml={'17'}>
                        <ReactECharts option={chart} />
                    </Box>
                </Box>
            </Stack>
        </>
    );
};

export default Notebook;
