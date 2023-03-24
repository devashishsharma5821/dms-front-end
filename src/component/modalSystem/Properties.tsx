import React, { useState } from 'react';
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
    Button,
    Center,
    Avatar,
    useDisclosure,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    FormControl,
    ModalBody,
    Input,
    ModalCloseButton,
    ModalFooter,
    Modal,
    Divider,
    Link,
    Editable,
    ButtonGroup,
    useEditableControls,
    EditablePreview,
    EditableInput, Textarea, createStandaloneToast
} from '@chakra-ui/react';
import { CloseIcon, LinkChain, PencilIcon, WhiteExperiment } from '../../assets/icons';
import { ShareData } from '../../models/share';
import { convertTime, getUserNameFromId } from '../../utils/common.utils';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';
import client from '../../apollo-client';
import { ProjectEdit, ProjectEditDetail } from '../../models/project';
import { dmsEditExperiment, editProject } from '../../query';
import { getToastOptions } from '../../models/toastMessages';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import { ExperimentEdit, ExperimentEditDetail } from '../../models/experimentModel';
import { getAndUpdateExperimentData } from '../../zustandActions/experimentActions';

const Properties = (props: any) => {
    const textColorIcon = useColorModeValue('#666C80', 'white');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const { onClose } = useDisclosure();
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [inlineDescription, setInlineDescription] = useState<string>(props.data.description || '');
    const { toast } = createStandaloneToast();
    console.log('Project', props.projectData);
    console.log('Ex', props.data);
    console.log('all user', props.userData);
    console.log('user', props.userAccessList)
    function EditableControls() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        return isEditing ? (
            <ButtonGroup ml={'20px'} mt={'15px'} justifyContent="center">
                <Button cursor={'pointer'} variant='link' colorScheme="blue" {...getSubmitButtonProps()}>
                    Save
                </Button>
                <Button cursor={'pointer'} variant='link' colorScheme="blue" {...getCancelButtonProps()}>
                    Cancel
                </Button>
            </ButtonGroup>
        ) : (
            <Flex justifyContent="center">
                <Button {...getEditButtonProps()} bg={'textColor'} mt={'10px'} ml={'12px'} width={'33px'} height={'33px'}>
                    <Text color={'default.toolbarButton'}>Edit</Text>
                </Button>
            </Flex>
        );
    };
    const handleEditExperiment = (variables: any, toastMessages: any) => {
        updateSpinnerInfo(true);
        client
            .mutate<ExperimentEdit<ExperimentEditDetail>>({
                mutation: dmsEditExperiment(variables)
            })
            .then(() => {
                toast(getToastOptions(toastMessages.successMessage, 'success'));
                getAndUpdateExperimentData(props.data.id);
                updateSpinnerInfo(false);
            })
            .catch((err) => {
                updateSpinnerInfo(false);
                getAndUpdateExperimentData(props.data.id);
                toast(getToastOptions(`${err}`, 'error'));
            });
    }
    const handleEditDescription = (nextDescription: string) => {
        if (nextDescription !== props.data.description) {
            const variables = {
                id: props.data.id,
                name: props.data.name,
                description: nextDescription,
                tags: props.data.tags
            };
            handleEditExperiment(variables, {
                successMessage: 'Experiment Description Edited Successfully',
                errorMessage: 'Experiment Description Failed To edit'
            });
        }
    };

    const handleEditDescriptionChange = (editChangeValue: string) => {
        setInlineDescription(editChangeValue);
    };
    const handleEditDescriptionChangeCancel = () => {
        setInlineDescription(props.data.description);
    };

    return (
        <Modal size={'3xl'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={'714px'} borderRadius={'2'} maxHeight={'852px'}>
                <ModalHeader color={shretextColor} mt={'13'} ml={20}>
                    Properties
                </ModalHeader>
                <ModalCloseButton mt={'12'} mr={8} color={textColor2} />
                <Divider color={'default.dividerColor'} />
                <ModalBody pb={6}>
                    <Flex fontWeight={700}>
                        <Center>
                            <Text color={textColor2} mt={'20'} ml={20} mb={10}>
                                Project Id:
                            </Text>
                            <Text color={textColor2} mt={'20'} mb={10} ml={'5px'}>
                                {props.projectData.basic.id}
                            </Text>
                        </Center>
                        <Center>
                            <Text color={textColor2} mt={'20'} ml={20} mb={10}>
                                Project Name:
                            </Text>
                            <Text color={textColor2} mt={'20'} mb={10} ml={'5px'}>
                                {props.projectData.basic.name}
                            </Text>
                        </Center>
                    </Flex>

                    <FormControl mt={4}>
                        <Box borderColor={'light.lighterGrayishBlue'} borderWidth={1} mt={20} mb={20} ml={16} pb={10} borderRadius={'4px'} width={'671px'} maxHeight={'635px'}>
                            <Flex>
                                <Center ml={'19px'}>
                                    <Box mt={'-10px'}>
                                        <WhiteExperiment color={textColorIcon} />
                                    </Box>
                                    <Flex>
                                        <Box ml={12}>
                                            <Text mt={17} color={accesstextColor}>
                                                Experiment Name
                                            </Text>
                                            <Center>
                                                <Text color={accesstextColor} fontWeight={700} mr={'4px'}>
                                                    {props.data.name}
                                                </Text>
                                                <PencilIcon color={textColorIcon} height={'20px'} Height={'20px'} />
                                            </Center>
                                            <Center>
                                                <Box mt={12} mr={'4px'} ml={'-32px'} borderRadius="full" boxSize="14px" bg={'#ED6D74'} />
                                                <Text mt={15} fontSize={14} fontWeight={700} color={'#ED6D74'}>
                                                    Not Yet Deployed{' '}
                                                </Text>
                                            </Center>
                                        </Box>
                                    </Flex>
                                </Center>
                            </Flex>
                            <Flex mb={'21px'}>
                                <Center>
                                    <Text color={textColor2} mt={'20'} ml={20}>
                                        Tag:
                                    </Text>
                                    <Center>
                                        {
                                            props.data.tags?.map((tag: any, tagIndex: number) => {
                                                return (
                                                    <Box key={`${tag}_${tagIndex}`} ml={14} mt={16} bg={' #F2F4F8'} height={'24px'} borderRadius={3} minWidth={70}>
                                                        <Flex>
                                                            <Center>
                                                                <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                    {tag}
                                                                </Text>
                                                                <Box justifyContent={'flex-end'} ml={'14px'}>
                                                                    <CloseIcon color={'default.darkGrayCreate'} />
                                                                </Box>
                                                            </Center>
                                                        </Flex>
                                                    </Box>
                                                )
                                            })
                                        }
                                    </Center>
                                    <Text color={'#2180C2'} mt={'20'} ml={20}>
                                        + Add Tag
                                    </Text>
                                </Center>
                            </Flex>

                            <Divider color={'default.dividerColor'} />

                            <Box width={671}>
                                <Center>
                                    <Flex ml={'36px'} mt={'-51px'}>
                                        <Avatar p={'5px'} borderRadius="full" boxSize="42px" name={getUserNameFromId(props.userData, props.data.created_by)} color={'default.whiteText'} mt={'21px'} />
                                        <Center>
                                            <Box width={'300px'}>
                                                <Text ml={12} color={accesstextColor} mt={'21px'}>
                                                    Created by
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {getUserNameFromId(props.userData, props.data.created_by)}
                                                </Text>
                                                <Text ml={12} color={accesstextColor} mt={'14px'}>
                                                    Created On
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {convertTime(props.data.created_at, false)}
                                                </Text>
                                                <Text ml={12} color={accesstextColor} mt={'14px'}>
                                                    Last Modified
                                                </Text>
                                                <Text ml={12} color={accesstextColor} fontWeight={700}>
                                                    {convertTime(props.data.updated_at, true)}
                                                </Text>
                                            </Box>
                                        </Center>
                                    </Flex>
                                    <Flex as="nav" align="center" justify="space-between" wrap="wrap">
                                        <Box>
                                            <Flex>
                                                <Center flex="2">
                                                    <Text mt={'21px'} ml={12}>
                                                        Access by
                                                    </Text>
                                                    <Box ml={14} mt={16} bg={' #F2F4F8'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                                        <Text color={'#75858F'} fontSize={'14px'} mt={2}>
                                                            {props.userAccessList.length}
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
                                            {props.userAccessList.map((project: any) => {
                                                return (
                                                    <>
                                                        <Center>
                                                            <Avatar ml={16} p={'5px'} borderRadius="full" boxSize="32px" name={`${project.firstName} ${project.lastName}`} color={'default.whiteText'} />
                                                            <Box mt={'17px'} width={'300px'}>
                                                                <Text ml={12} color={accesstextColor}>
                                                                    {project?.firstName} {project?.lastName}
                                                                </Text>
                                                                <Text ml={12} color={'default.veryLightGrayTextColor'}>
                                                                    {project.email}{' '}
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
                                {/*<Flex>*/}
                                {/*    <Center>*/}
                                {/*        <Text color={textColor2} mt={'20'} ml={16} mb={10}>*/}
                                {/*            Link To{' '}*/}
                                {/*        </Text>*/}
                                {/*        <Text color={'#2180C2'} mt={'20'} ml={10} mb={10}>*/}
                                {/*            {' '}*/}
                                {/*            Edit{' '}*/}
                                {/*        </Text>*/}
                                {/*    </Center>*/}
                                {/*</Flex>*/}
                                {/*<Flex>*/}
                                {/*    <Box>*/}
                                {/*        <Center ml={16}>*/}
                                {/*            <Box mb={'10px'}>*/}
                                {/*                <LinkChain />*/}
                                {/*            </Box>*/}
                                {/*            <Link ml={8} mt={-8} color={'light.button'} href="https://chakra-ui.com" isExternal>*/}
                                {/*                Experiment 2{' '}*/}
                                {/*            </Link>*/}
                                {/*        </Center>*/}
                                {/*    </Box>*/}
                                {/*</Flex>*/}
                                <Flex>
                                    <Box>
                                        <Editable
                                            height={'80px'}
                                            maxWidth={'400px'}
                                            textAlign="left"
                                            fontWeight={400}
                                            ml={16}
                                            onSubmit={handleEditDescription}
                                            onChange={handleEditDescriptionChange}
                                            onCancel={handleEditDescriptionChangeCancel}
                                            value={inlineDescription}
                                        >
                                            <Flex>
                                                <Center>
                                                    <Text mt={'15px'} color={textColor2} lineHeight={'22px'} fontWeight={600}>
                                                        Description
                                                    </Text>
                                                    <EditableControls />
                                                </Center>
                                            </Flex>
                                            <Box maxWidth={'425px'} maxHeight={'80px'} overflowY={'auto'} color={accesstextColor}>
                                                <EditablePreview />
                                                <Textarea as={EditableInput} />
                                            </Box>
                                        </Editable>
                                    </Box>
                                </Flex>
                            </Box>
                        </Box>
                    </FormControl>
                </ModalBody>

                <Divider color={'default.dividerColor'} />
                <ModalFooter>
                    <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={20} mt={'19'} width={'72px'} height={'40px'}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Properties;
