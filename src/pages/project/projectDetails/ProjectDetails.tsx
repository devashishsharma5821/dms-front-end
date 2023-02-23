import React, { useEffect } from 'react';
import {
    Box,
    Stack,
    Text,
    Button,
    useDisclosure,
    Flex,
    Center,
    Input,
    Editable,
    Avatar,
    useColorModeValue,
    Link,
    useEditableControls,
    ButtonGroup,
    EditablePreview,
    EditableInput
} from '@chakra-ui/react';
import useAppStore from '../../../store';
import { GetSingleProjectAppStoreState } from '../../../models/project';
import { getAndUpdateSingleProjectData } from '../../../zustandActions/projectActions';
import { useParams } from 'react-router-dom';
import CreateProjectModal from '../../../component/modalSystem/CreateProjectModal';
import Project from '../Project';

import { CloseIcon, PencilIcon } from '../../../assets/icons';
const ProjectDetails = (props: any) => {
    const textColor2 = useColorModeValue('default.titleForShare', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const params = useParams();
    const createProjectModal = useDisclosure();
    function EditableControls() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        return isEditing ? (
            <ButtonGroup justifyContent="center">
                <PencilIcon {...getSubmitButtonProps()} />
                <PencilIcon {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <Flex justifyContent="center">
                <Button {...getEditButtonProps()} bg={'textColor'} mt={'10px'} ml={'12px'} width={'33px'} height={'33px'}>
                    <Text color={'#2180C2'}>Edit</Text>
                </Button>
            </Flex>
        );
    }
    const shareData1 = {
        data: [
            {
                firstName: 'Shirin',
                lastName: 'Bampoori',
                email: 'shirin.bampoori@antuit.com'
            },
            {
                firstName: 'Zubin',
                lastName: 'Shah',
                email: 'Zubin.Shah@antuit.com'
            },
            {
                firstName: 'Arjun',
                lastName: 'Guntuka',
                email: 'Arjun.Guntuka@antuit.com'
            },
            {
                firstName: 'Shirin',
                lastName: 'Bampoori',
                email: 'shirin.bampoori@antuit.com'
            }
        ]
    };
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
    };

    return (
        <>
            <Box marginLeft={36}>
                <Box fontSize={16} fontWeight={700} ml={'44'} mt={'35'} mb={'24'} color={'#666C80'}>
                    <Text>Projects / My Project</Text>
                </Box>

                <Box fontSize={16} fontWeight={700} ml={'44'} mt={'35'} mb={'24'} color={'#666C80'}>
                    <Flex flexDir={'row'}>
                        <Button> </Button>
                        <Text> {SingleProjectData && SingleProjectData.basic.name}</Text>
                        {SingleProjectData && (
                            <>
                                <Box ml={100}>
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
                        )}
                    </Flex>
                    <Box width={'883px'} height={'320px'} borderRadius={8} border={'1px'} borderColor={'#D8DCDE'} mt={'32px'}>
                        <Center>
                            <Flex ml={'24px'} width={'500px'} maxHeight={'320px'}>
                                <Avatar p={'5px'} borderRadius="full" boxSize="42px" name={`Shirin Bampoori`} color={'default.whiteText'} mt={'21px'} />
                                <Center>
                                    <Box width={'450px'}>
                                        <Text ml={12} mt={'21px'} color={textColor2}>
                                            Created by
                                        </Text>
                                        <Text ml={12} color={accesstextColor} fontWeight={700}>
                                            Shirin Bampoori
                                        </Text>

                                        <Flex flexDir={'row'}>
                                            <Box>
                                                <Text ml={12} color={accesstextColor} mt={'12px'}>
                                                    Project ID
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {SingleProjectData && SingleProjectData.basic.id}
                                                </Text>
                                            </Box>
                                            <Box ml={'115px'}>
                                                <Text ml={12} color={accesstextColor} mt={'12px'}>
                                                    Project Name
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {SingleProjectData && SingleProjectData.basic.name}
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Flex flexDir={'row'}>
                                            <Box>
                                                <Text ml={12} color={accesstextColor} mt={'12px'}>
                                                    Created On
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {SingleProjectData && SingleProjectData.basic.created_at.replace('T', ' ')}
                                                </Text>
                                            </Box>
                                            <Box ml={'40px'}>
                                                <Text ml={12} color={accesstextColor} mt={'12px'}>
                                                    Last Modified
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    10 Mins ago
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Flex ml={'10px'} mt={'-6px'}>
                                            <Text color={accesstextColor} mt={'15'}>
                                                Tag:
                                            </Text>
                                            <Center>
                                                <Box ml={14} mt={14} bg={' #F2F4F8'} height={'24px'} borderRadius={3} minWidth={70}>
                                                    <Flex>
                                                        <Center>
                                                            <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                Demo
                                                            </Text>
                                                            <Box justifyContent={'flex-end'} ml={'14px'}>
                                                                <CloseIcon color={'default.darkGrayCreate'} />
                                                            </Box>
                                                        </Center>
                                                    </Flex>
                                                </Box>
                                            </Center>
                                            <Text color={'#2180C2'} mt={'20'} ml={20}>
                                                + Add Tag
                                            </Text>
                                        </Flex>

                                        <Editable maxWidth={'400px'} textAlign="left" fontWeight={400} ml={16}>
                                            <Flex>
                                                <Center mt={'-6px'}>
                                                    <Text mt={'10px'} color={textColor2}>
                                                        Description
                                                    </Text>
                                                    <EditableControls />
                                                </Center>
                                            </Flex>
                                            <EditablePreview />
                                            <Input as={EditableInput} height={'97px'} />
                                        </Editable>
                                        <Box ml={16} mt={'-30px'}>
                                            <Text color={textColor2} fontWeight={400}>
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore...{' '}
                                            </Text>
                                        </Box>
                                    </Box>
                                </Center>
                            </Flex>
                            <Flex as="nav" align="center" justify="space-between" mt={'-14px'} wrap="wrap" width={'400px'} maxHeight={'320px'}>
                                <Box>
                                    <Flex>
                                        <Center flex="2">
                                            <Text mt={'24px'} ml={12} color={accesstextColor}>
                                                Access by
                                            </Text>
                                            <Box ml={14} mt={16} bg={' #F2F4F8'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                                <Text color={'#75858F'} fontSize={'14px'} mt={4}>
                                                    10
                                                </Text>
                                            </Box>
                                            <Center flex="2" justifyContent={'flex-end'} mr={46}>
                                                <Text color={'#2180C2'} mt={'21px'}>
                                                    {' '}
                                                    Edit
                                                </Text>
                                                <Text color={'#2180C2'} mt={'21px'} ml={16}>
                                                    {' '}
                                                    Copy Link
                                                </Text>
                                            </Center>
                                        </Center>
                                    </Flex>
                                    {shareData1 &&
                                        shareData1.data.map((icons) => {
                                            return (
                                                <>
                                                    <Center>
                                                        <Avatar ml={16} p={'5px'} borderRadius="full" boxSize="32px" name={`${icons.firstName} ${icons.lastName}`} color={'default.whiteText'} />
                                                        <Box mt={'17px'} width={'300px'}>
                                                            <Text ml={12} color={accesstextColor}>
                                                                {icons?.firstName} {icons?.lastName}
                                                            </Text>
                                                            <Text ml={12} color={'default.veryLightGrayTextColor'}>
                                                                {icons.email}{' '}
                                                            </Text>
                                                        </Box>
                                                    </Center>
                                                    <Center mr={'36px'}></Center>
                                                </>
                                            );
                                        })}
                                </Box>
                            </Flex>
                        </Center>
                    </Box>
                </Box>
            </Box>
            {createProjectModal.isOpen && (
                <CreateProjectModal isOpen={createProjectModal.isOpen} onClose={createProjectModal.onClose} onSuccess={onCreateProjectSuccess} isEdit={{ status: true, data: SingleProjectData }} />
            )}
        </>
    );
};

export default ProjectDetails;
