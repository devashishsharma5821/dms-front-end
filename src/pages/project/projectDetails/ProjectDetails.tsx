import React, { useEffect } from 'react';
import { Box, Text, Button, useDisclosure, Flex, Center, Input, Editable, Avatar, useColorModeValue, useEditableControls, ButtonGroup, EditablePreview, EditableInput } from '@chakra-ui/react';
import useAppStore from '../../../store';
import { GetSingleProjectAppStoreState } from '../../../models/project';
import { getAndUpdateSingleProjectData } from '../../../zustandActions/projectActions';
import { useNavigate, useParams } from 'react-router-dom';
import CreateProjectModal from '../../../component/modalSystem/CreateProjectModal';
import { CloseIcon, PencilIcon } from '../../../assets/icons';

const ProjectDetails = (props: any) => {
    const textColor2 = useColorModeValue('default.titleForShare', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.blackText', 'default.whiteText');
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const navigate = useNavigate();
    const params = useParams();
    const maxTextCharacters = 20;
    const createProjectModal = useDisclosure();
    const getTruncatedText = (name: string) => {
        if (name?.length >= 20) {
            const newName = `${name.slice(0, maxTextCharacters)}...`;
            return newName;
        } else {
            return name;
        }
    };
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
                    <Text color={'default.toolbarButton'}>Edit</Text>
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
                firstName: 'Jalaj',
                lastName: 'Goel',
                email: 'Jalaj.Goel@antuit.com'
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
    const navigateToDetails = () => {
        navigate(`/project`);
    };

    return (
        <>
            <Box marginLeft={36}>
                <Box fontSize={16} fontWeight={700} ml={'44'} mt={'35'} color={'default.darkGrayCreate'}>
                    <Text>Projects / My Project</Text>
                </Box>

                <Box fontSize={16} fontWeight={700} ml={'44'} mt={'6px'} mb={'24'} color={'default.darkGrayCreate'}>
                    <Flex flexDir={'row'}>
                        <Button mr={'8px'} color={'default.accessByNumber'} border={'1px'} borderColor={'light.lighterGrayishBlue'} bg={'white'} onClick={navigateToDetails}>
                            {' '}
                            <> {'<'} </>
                        </Button>
                        <Text fontSize={24} color={accesstextColor}>
                            {' '}
                            {SingleProjectData && SingleProjectData.basic.name}
                        </Text>
                        {SingleProjectData && (
                            <>
                                <Flex mt={'8px'} ml={'2px'}>
                                    <Box bg={'white'} color={'default.shareModalButton'} width={'80px'} height={'36px'} onClick={editProject}>
                                        <PencilIcon color={'#666C80'} height={'20px'} Height={'20px'} />
                                    </Box>
                                    <Button
                                        colorScheme="gray"
                                        bg={'white'}
                                        color={'default.hoverSideBarMenu'}
                                        border={'1px'}
                                        borderColor={'default.shareModalButton'}
                                        borderRadius={4}
                                        ml={'-38px'}
                                        mt={'-10px'}
                                    >
                                        Delete
                                    </Button>
                                </Flex>
                            </>
                        )}
                    </Flex>
                    <Box width={'883px'} height={'320px'} borderRadius={8} border={'1px'} borderColor={'light.lighterGrayishBlue'} mt={'32px'}>
                        <Center>
                            <Flex ml={'24px'} width={'500px'} maxHeight={'320px'}>
                                <Avatar p={'5px'} borderRadius="full" boxSize="42px" name={`Shirin Bampoori`} color={'default.whiteText'} mt={'21px'} />
                                <Center>
                                    <Box width={'450px'}>
                                        <Text ml={12} mt={'21px'} color={textColor2} fontWeight={400}>
                                            Created by
                                        </Text>
                                        <Text ml={12} color={accesstextColor} fontWeight={700}>
                                            Shirin Bampoori
                                        </Text>

                                        <Flex flexDir={'row'}>
                                            <Box>
                                                <Text ml={12} color={textColor2} mt={'12px'} fontWeight={400}>
                                                    Project ID
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {SingleProjectData && SingleProjectData.basic.id}
                                                </Text>
                                            </Box>
                                            <Box ml={'115px'}>
                                                <Text ml={12} color={textColor2} mt={'12px'} fontWeight={400}>
                                                    Project Name
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {getTruncatedText(SingleProjectData && SingleProjectData.basic.name)}
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Flex flexDir={'row'}>
                                            <Box>
                                                <Text ml={12} color={textColor2} mt={'12px'} fontWeight={400}>
                                                    Created On
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {SingleProjectData && SingleProjectData.basic.created_at.replace('T', ' ')}
                                                </Text>
                                            </Box>
                                            <Box ml={'40px'}>
                                                <Text ml={12} color={textColor2} mt={'12px'} fontWeight={400}>
                                                    Last Modified
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    10 Mins ago
                                                </Text>
                                            </Box>
                                        </Flex>
                                        <Flex ml={'12px'} mt={'-6px'}>
                                            <Text color={textColor2} mt={'15'} fontWeight={400}>
                                                Tag:
                                            </Text>
                                            <Center>
                                                <Box ml={14} mt={14} bg={'default.tagBoxColor'} height={'24px'} borderRadius={3} minWidth={70}>
                                                    <Flex>
                                                        <Center>
                                                            <Text color={'default.userCircleHeaderFont'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                Demo
                                                            </Text>
                                                            <Box justifyContent={'flex-end'} ml={'14px'}>
                                                                <CloseIcon color={'default.darkGrayCreate'} />
                                                            </Box>
                                                        </Center>
                                                    </Flex>
                                                </Box>
                                            </Center>
                                            <Text color={'default.toolbarButton'} mt={'20'} ml={20}>
                                                + Add Tag
                                            </Text>
                                        </Flex>

                                        <Editable
                                            maxWidth={'400px'}
                                            textAlign="left"
                                            fontWeight={400}
                                            ml={16}
                                            defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore..."
                                        >
                                            <Flex>
                                                <Center mt={'-12px'}>
                                                    <Text mt={'10px'} color={textColor2}>
                                                        Description
                                                    </Text>
                                                    <EditableControls />
                                                </Center>
                                            </Flex>
                                            <EditablePreview />
                                            <Input as={EditableInput} height={'40px'} />
                                        </Editable>
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
                                            <Box ml={14} mt={16} bg={'default.tagBoxColor'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                                <Text color={'default.accessByNumber'} fontSize={'14px'} mt={4}>
                                                    10
                                                </Text>
                                            </Box>
                                            <Center flex="2" justifyContent={'flex-end'} mr={46}>
                                                <Text color={'default.toolbarButton'} mt={'21px'}>
                                                    {' '}
                                                    Edit
                                                </Text>
                                                <Text color={'default.toolbarButton'} mt={'21px'} ml={16}>
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
