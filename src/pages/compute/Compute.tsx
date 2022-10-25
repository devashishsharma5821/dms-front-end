import React from 'react';
import './compute.scss';
import { Box, Stack, Text } from '@chakra-ui/react';
const Compute = () => {
    return (
        <>
            <Box className="compute_page">Compute</Box>
            <Stack spacing={3}>
                <Text fontSize="md" ml={'38'} noOfLines={[2]}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat. <br /> Duis aute irure dolor in reprehenderit in voluptate velit
                </Text>
            </Stack>
        </>
    );
};

export default Compute;