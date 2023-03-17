import React from 'react';
import '../dataset.scss';
import { Box, Center, Flex, Text, useColorModeValue } from '@chakra-ui/react';

const DatasetViews = (props: any) => {
    const textColorPage = useColorModeValue('default.blackText', 'dark.white');

    return (
        <>
            <Box border={'1px solid'} borderColor={'light.lighterGrayishBlue'} overflowX={'hidden'} overflowY={'scroll'} borderRadius={8} width={'100%'} mt={'16'} pb={'16'} pl={10}>
                {' '}
                <Flex ml={'24'} mt={'21'} mb={'3'}>
                    <Center>
                        <Box>
                            <Text color={textColorPage} fontWeight={700}>
                                Dataset Details
                            </Text>
                        </Box>
                        <Box color={'default.containerAgGridRecords'}>
                            <Text ml={'14'} fontWeight={700}>
                                12 Records
                            </Text>
                        </Box>
                    </Center>
                </Flex>
                <Flex flexWrap={'wrap'} flexDirection={'row'} ml={'24'}>
                    Add Grid here
                </Flex>
            </Box>
        </>
    );
};

export default DatasetViews;
