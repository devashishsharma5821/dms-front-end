import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const DatasetDetails = (props: any) => {
    return (
        <>
            <Box marginLeft={'50px'}>
                <Box fontSize={16} fontWeight={600} ml={'24'} mt={'24'}>
                    <Text>Dataset / My Dataset</Text>
                </Box>
            </Box>
        </>
    );
};

export default DatasetDetails;
