import React, { useEffect } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';
import useAppStore from '../../../store';
import {  GetSingleProjectAppStoreState } from '../../../models/project';
import { getAndUpdateSingleProjectData } from '../../../zustandActions/projectActions';

const ProjectDetails = () => {
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    useEffect(() => {
        if (SingleProjectData === null) {
            // Hard Code Project ID 7 For now
            // This needs to come from Previous Page
            getAndUpdateSingleProjectData("7");
        } else {
            console.log('Project 7 Data', SingleProjectData);
        }
    }, [SingleProjectData]);
    return (
        <>
            <Box marginLeft={36}>
                <Box fontSize={'24px'} fontWeight={700} ml={'24'} mt={'35'} mb={'24'}>
                    Project Details
                </Box>
                <Stack spacing={4}>
                    <Text fontSize="md" ml={'24'} noOfLines={[2]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                        Duis aute irure dolor in reprehenderit in voluptate velit
                    </Text>
                </Stack>
            </Box>
        </>
    );
};

export default ProjectDetails;
