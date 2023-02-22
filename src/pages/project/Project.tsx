import React, { useEffect } from 'react';
import './project.scss';
import { Box, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../../store';
import { GetAllProjectsAppStoreState } from '../../models/project';
import { getAndUpdateAllProjectsData } from '../../zustandActions/projectActions';

const Project = () => {
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const navigate = useNavigate();
    useEffect(() => {
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            console.log('Here is your Projects Data', AllProjectsData);
        }
    }, [AllProjectsData]);
    const navigateToDetails = (id: string) => {
        navigate(`/projectDetails/${id}`);
    }
    return (
        <>
            <Box marginLeft={36}>
                <Box fontSize={'24px'} fontWeight={700} ml={'24'} mt={'35'} mb={'24'}>
                    Projects
                </Box>
                <Stack spacing={4}>
                    <Text fontSize="md" ml={'24'} noOfLines={[2]}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                        ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
                        Duis aute irure dolor in reprehenderit in voluptate velit
                    </Text>
                </Stack>
                {
                    AllProjectsData &&
                    AllProjectsData.map((project) => {
                        return <>
                            <Text onClick={() => navigateToDetails(project.id)} cursor="pointer" color="#1A3F59" marginLeft={300}><a>{project.name}</a></Text>
                        </>
                    })
                }
            </Box>
        </>
    );
};

export default Project;
