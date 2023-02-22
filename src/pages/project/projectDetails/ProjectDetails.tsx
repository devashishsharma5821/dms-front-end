import React, { useEffect } from 'react';
import { Box, Stack, Text, Button, useDisclosure } from '@chakra-ui/react';
import useAppStore from '../../../store';
import {  GetSingleProjectAppStoreState } from '../../../models/project';
import { getAndUpdateSingleProjectData } from '../../../zustandActions/projectActions';
import { useParams } from "react-router-dom"
import CreateProjectModal from '../../../component/modalSystem/CreateProjectModal';
const ProjectDetails = (props: any) => {
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const params = useParams();
    const createProjectModal = useDisclosure();
    useEffect(() => {
        if (SingleProjectData === null || params.projectId !== SingleProjectData.basic.id) {
            getAndUpdateSingleProjectData(params.projectId as string);
        } else {
            console.log('Project Details Data via Route Params', SingleProjectData);
        }
    }, [SingleProjectData]);
    const editProject = () => {
        createProjectModal.onOpen();
    };
    const onCreateProjectSuccess = () => {
        getAndUpdateSingleProjectData(SingleProjectData.basic.id);
        createProjectModal.onClose();
    }
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
                {SingleProjectData &&
                    <>
                        <Box ml={100}>
                            <Text fontSize="lg" ml={'24'} noOfLines={[2]}>{SingleProjectData.basic.name}</Text>
                            <Button
                                colorScheme="gray"
                                bg={'white'}
                                color={'default.shareModalButton'}
                                width={'80px'}
                                border={'1px'}
                                borderColor={'default.shareModalButton'}
                                height={'36px'}
                                borderRadius={4}
                                onClick={editProject}
                            >
                                Edit
                            </Button>
                            <Button
                                colorScheme="gray"
                                bg={'white'}
                                color={'default.shareModalButton'}
                                width={'80px'}
                                border={'1px'}
                                borderColor={'default.shareModalButton'}
                                height={'36px'}
                                borderRadius={4}
                            >
                                Delete
                            </Button>
                        </Box>
                    </>
                }
            </Box>
            {createProjectModal.isOpen && <CreateProjectModal isOpen={createProjectModal.isOpen} onClose={createProjectModal.onClose} onSuccess={onCreateProjectSuccess} isEdit={{status: true, data: SingleProjectData}} />}
        </>
    );
};

export default ProjectDetails;
