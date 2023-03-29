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
    Editable,
    ButtonGroup,
    useEditableControls,
    EditablePreview,
    EditableInput,
    Textarea,
    createStandaloneToast,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Stack,
    PopoverCloseButton
} from '@chakra-ui/react';
import { CloseIcon, PencilIcon } from '../../assets/icons';
import { convertTime, copyToClipBoard, getTruncatedText, getUserNameFromId } from '../../utils/common.utils';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';
import client from '../../apollo-client';
import { dmsEditExperiment } from '../../query';
import { getToastOptions } from '../../models/toastMessages';
import { ExperimentEdit, ExperimentEditDetail } from '../../models/experimentModel';
import { getAndUpdateExperimentData } from '../../zustandActions/experimentActions';
import Share from './Share';
import { AllUsers } from '../../models/profile';
import { MultiSelect } from 'chakra-multiselect';
import WhiteExperimentForProperties from '../../assets/icons/WhiteExperimentForProperties';
import { CopyIcon } from '@chakra-ui/icons';

const Properties = (props: any) => {
    const textColorIcon = useColorModeValue('#666C80', 'white');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const defaultInBoxTextColor = useColorModeValue('default.defaultTextColorInBox', 'default.veryLightGrayTextColor');
    const closeButton = useColorModeValue('#666C80', '#ffffff');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [inlineExperimentName, setInlineExperimentName] = useState<string>(props.data.name || '');
    const [inlineDescription, setInlineDescription] = useState<string>(props.data.description || '');
    const { toast } = createStandaloneToast();
    const editAccessModal = useDisclosure();
    const [accessUserListCreateMode, setAccessUserListCreateMode] = React.useState<any>([]);
    const tagPopOver = useDisclosure();
    const tagOptions: any = [];
    const [tagValue, setTagValue] = React.useState([]);
    function EditableControls() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        return isEditing ? (
            <ButtonGroup ml={'20px'} mt={'15px'} justifyContent="center">
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getSubmitButtonProps()}>
                    Save
                </Button>
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getCancelButtonProps()}>
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
    }
    function EditableControlsName() {
        const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

        return isEditing ? (
            <ButtonGroup ml={'20px'} justifyContent="center" mt={'45px'}>
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getSubmitButtonProps()}>
                    Save
                </Button>
                <Button cursor={'pointer'} variant="link" colorScheme="blue" {...getCancelButtonProps()}>
                    Cancel
                </Button>
            </ButtonGroup>
        ) : (
            <Flex>
                <Button variant={'solid'} _hover={{ bg: 'none' }} {...getEditButtonProps()} bg={'textColor'} top={'28px'} width={'48px'} height={'48px'}>
                    <PencilIcon color={'#666C80'} width={'40px'} height={'40px'} />
                </Button>
            </Flex>
        );
    }
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
                setTagValue([]);
            })
            .catch((err) => {
                updateSpinnerInfo(false);
                getAndUpdateExperimentData(props.data.id);
                toast(getToastOptions(`${err}`, 'error'));
            });
    };
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
    const handleEditName = () => {
        if (inlineExperimentName !== props.data.name) {
            const variables = {
                id: props.data.id,
                name: inlineExperimentName,
                description: props.data.description,
                tags: props.data.tags
            };
            handleEditExperiment(variables, {
                successMessage: 'Experiment Name Edited Successfully',
                errorMessage: 'Experiment Name Failed To edit'
            });
        }
    };
    const handleEditNameChange = (editChangeValue: string) => {
        setInlineExperimentName(editChangeValue);
    };
    const handleEditNameChangeCancel = () => {
        setInlineExperimentName(props.data.name);
    };
    const clipBoardSuccess = () => {
        toast(getToastOptions(`Location Copied To Clipboard`, 'success'));
    };

    const createUserAccessForCreateProjectMode = (userList: AllUsers) => {
        setAccessUserListCreateMode(userList);
    };
    const handleTagChange = (ev: any) => {
        setTagValue(ev);
    };
    const handleTagSubmit = () => {
        const variables = {
            id: props.data.id,
            name: props.data.name,
            description: props.data.description,
            tags: [...props.data.tags, ...tagValue]
        };
        handleEditExperiment(variables, {
            successMessage: 'Experiment Tags Edited Successfully',
            errorMessage: 'Experiment Tags Failed To edit'
        });
        tagPopOver.onClose();
    };

    const handleRemoveTag = (tag: string) => {
        props.data.tags = props.data.tags.filter((tagToKeep: any) => {
            return tagToKeep !== tag;
        });
        const variables = {
            id: props.data.id,
            name: props.data.name,
            description: props.data.description,
            tags: [...props.data.tags]
        };
        handleEditExperiment(variables, {
            successMessage: 'Project Tags Edited Successfully',
            errorMessage: 'Project Tags Failed To edit'
        });
    };
    return (
        <Modal size={'3xl'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent width={'714px'} borderRadius={'2'} maxHeight={'852px'}>
                <ModalHeader color={shretextColor} mt={'13'} ml={20}>
                    Properties
                </ModalHeader>
                <ModalCloseButton mt={'12'} mr={8} color={textColor2} cursor={'pointer'} />
                <Divider color={'default.dividerColor'} />
                <ModalBody pb={6}>
                    <Flex fontWeight={700}>
                        <Center>
                            <Text color={accesstextColor} mt={'20'} ml={20} mb={16}>
                                Project ID:
                            </Text>
                            <Text color={accesstextColor} mt={'20'} mb={16} ml={'5px'}>
                                {props.projectData.basic.id}
                            </Text>
                            <Box ml={8}>
                                <CopyIcon />
                            </Box>
                        </Center>
                        <Center>
                            <Text color={accesstextColor} mt={'20'} ml={31} mb={16}>
                                Project Name:
                            </Text>
                            <Text color={accesstextColor} mt={'20'} mb={16} ml={'5px'}>
                                {props.projectData.basic.name}
                            </Text>
                        </Center>
                    </Flex>

                    <FormControl mt={4}>
                        <Box borderColor={'light.lighterGrayishBlue'} borderWidth={1} mb={20} ml={16} pb={10} borderRadius={'4px'} width={'671px'} maxHeight={'635px'}>
                            <Flex>
                                <Center ml={'16px'}>
                                    <Box mt={'24px'}>
                                        <WhiteExperimentForProperties color={textColorIcon} />
                                    </Box>
                                    <Flex>
                                        <Box ml={12}>
                                            <Text mt={17} color={accesstextColor} fontWeight={600}>
                                                Experiment Name
                                            </Text>
                                            <Center>
                                                <Editable
                                                    cursor={'pointer'}
                                                    maxWidth={'800px'}
                                                    textAlign="left"
                                                    fontWeight={400}
                                                    onSubmit={handleEditName}
                                                    onChange={handleEditNameChange}
                                                    onCancel={handleEditNameChangeCancel}
                                                    value={inlineExperimentName}
                                                >
                                                    <Flex>
                                                        <Center mt={'-10'}>
                                                            <Box maxWidth={'425px'} height={'28px'} fontSize={24} fontWeight={700} color={accesstextColor}>
                                                                <EditablePreview />
                                                                <Input as={EditableInput} height={'30px'} mt={'-10px'} />
                                                            </Box>
                                                        </Center>
                                                        <Box mt={'-40px'}>
                                                            <EditableControlsName />
                                                        </Box>
                                                    </Flex>
                                                </Editable>
                                            </Center>
                                        </Box>
                                    </Flex>
                                </Center>
                            </Flex>
                            <Flex>
                                <Center ml={'56px'}>
                                    <Box mt={12} mr={'4px'} borderRadius="full" boxSize="14px" bg={'#ED6D74'} />
                                    <Text mt={15} fontSize={14} fontWeight={700} color={'#ED6D74'}>
                                        Not Yet Deployed{' '}
                                    </Text>
                                </Center>
                            </Flex>
                            <Flex>
                                <Center>
                                    <Text color={textColor2} mt={'20'} ml={16}>
                                        Tag:
                                    </Text>

                                    <Popover isOpen={tagPopOver.isOpen} onOpen={tagPopOver.onOpen} onClose={tagPopOver.onClose} placement="bottom" closeOnBlur={true}>
                                        <PopoverTrigger>
                                            <Button variant="link" color={'default.toolbarButton'} mt={'20'} ml={8} cursor={'pointer'}>
                                                + Add Tag
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent p={5} w={'399px'} h={'201px'} ml={'256px'}>
                                            <Stack cursor={'pointer'}>
                                                <Flex flexDirection={'row'}>
                                                    <Text color={'default.modalShareText'} fontWeight={700} mb={12}>
                                                        Add Tag
                                                    </Text>
                                                    <Box justifyContent="flex-end">
                                                        <PopoverCloseButton mr={'16px'} mt={'14px'} color={'#757575'} />
                                                    </Box>
                                                </Flex>
                                                    <MultiSelect
                                                        value={tagValue}
                                                        options={tagOptions}
                                                        color={defaultInBoxTextColor}
                                                        onChange={handleTagChange!}
                                                        create
                                                        bg={'black'}
                                                        marginInlineStart={'-10px'}
                                                    />
                                                <ButtonGroup display="flex" mt={'20px'} justifyContent="flex-start" cursor={'pointer'}>
                                                    <Button onClick={handleTagSubmit} bg={'default.toolbarButton'} cursor={'pointer'} width={'104px'} height={'36px'} borderRadius={4} mb={20} mt={16}>
                                                        Add Tag(s)
                                                    </Button>
                                                </ButtonGroup>
                                            </Stack>
                                        </PopoverContent>
                                    </Popover>
                                </Center>
                            </Flex>
                            <Flex>
                                <Center>
                                    {props.data.tags?.map((tag: any, tagIndex: number) => {
                                        if (tagIndex === 2) {
                                            return (
                                                <Box key={`${tag}_${tagIndex}`} ml={16} mt={8} bg={' #F2F4F8'} height={'24px'} borderRadius={3} minWidth={70}>
                                                    <Flex>
                                                        <Center>
                                                            <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                + {props.data.tags.length - 2} more
                                                            </Text>
                                                        </Center>
                                                    </Flex>
                                                </Box>
                                            );
                                        } else if (tagIndex < 2) {
                                            return (
                                                <Box cursor={'pointer'} key={`${tag}_${tagIndex}`} ml={16} mt={8} bg={' #F2F4F8'} height={'24px'} borderRadius={3} minWidth={70}>
                                                    <Flex cursor={'pointer'}>
                                                        <Center cursor={'pointer'}>
                                                            <Text title={tag} color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                                {getTruncatedText(tag, 9)}
                                                            </Text>
                                                            <Box onClick={() => handleRemoveTag(tag)} justifyContent={'flex-end'} ml={'10px'} mr={'8px'} cursor={'pointer'}>
                                                                <CloseIcon onClick={() => handleRemoveTag(tag)} cursor={'pointer'} color={closeButton} />
                                                            </Box>
                                                        </Center>
                                                    </Flex>
                                                </Box>
                                            );
                                        }
                                    })}
                                </Center>
                            </Flex>

                            <Divider color={'default.dividerColor'} mt={16} />

                            <Box width={671} pb={'16px'} minHeight={'330'}>
                                <Center>
                                    <Flex mt={'-51px'} ml={'16px'}>
                                        <Avatar p={'5px'} borderRadius="full" boxSize="42px" name={getUserNameFromId(props.userData, props.data.created_by)} color={'default.whiteText'} mt={'21px'} />
                                        <Center>
                                            <Box width={'300px'}>
                                                <Text ml={12} color={accesstextColor} mt={'21px'} fontWeight={600}>
                                                    Created by
                                                </Text>
                                                <Text ml={12} color={textColor2} fontWeight={700}>
                                                    {getUserNameFromId(props.userData, props.data.created_by)}
                                                </Text>
                                                <Text ml={12} color={accesstextColor} mt={'14px'} fontWeight={600}>
                                                    Created On
                                                </Text>
                                                <Text ml={12} color={textColor2} fontWeight={700}>
                                                    {convertTime(props.data.created_at, false)}
                                                </Text>
                                                <Text ml={12} color={accesstextColor} mt={'14px'} fontWeight={600}>
                                                    Last Modified
                                                </Text>
                                                <Text ml={12} color={textColor2} fontWeight={700}>
                                                    {convertTime(props.data.updated_at, true)}
                                                </Text>
                                            </Box>
                                        </Center>
                                    </Flex>
                                    <Flex as="nav" align="center" justify="space-between" wrap="wrap">
                                        <Box>
                                            <Flex mb={16}>
                                                <Center flex="2">
                                                    <Text mt={'21px'} ml={12} fontWeight={700} color={accesstextColor}>
                                                        Access by
                                                    </Text>
                                                    <Box ml={8} mt={16} bg={' #F2F4F8'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                                        <Text color={'#75858F'} fontSize={'14px'} mt={2}>
                                                            {props.userAccessList.length}
                                                        </Text>
                                                    </Box>
                                                    <Center flex="2" justifyContent={'flex-end'} ml={'44px'}>
                                                        <Text cursor={'pointer'} onClick={editAccessModal.onOpen} color={'default.toolbarButton'} mt={'21px'} fontWeight={600}>
                                                            {' '}
                                                            Edit
                                                        </Text>
                                                        <Text
                                                            cursor={'pointer'}
                                                            onClick={() => copyToClipBoard(window.location.href, clipBoardSuccess)}
                                                            color={'default.toolbarButton'}
                                                            mt={'21px'}
                                                            ml={16}
                                                            mr={16}
                                                            fontWeight={600}
                                                        >
                                                            {' '}
                                                            Copy Link
                                                        </Text>
                                                    </Center>
                                                </Center>
                                            </Flex>
                                            <Box overflowY="auto" overflowX="hidden" maxHeight="166px" minHeight="170px" h="100%" whiteSpace="nowrap" color="white" width={'100%'}>
                                                {props.userAccessList.map((project: any) => {
                                                    return (
                                                        <div key={project} style={{ marginBottom: '16px' }}>
                                                            <Flex justifyContent={'start'}>
                                                                <Avatar
                                                                    ml={16}
                                                                    p={'5px'}
                                                                    borderRadius="full"
                                                                    boxSize="32px"
                                                                    name={`${project.firstName} ${project.lastName}`}
                                                                    color={'default.whiteText'}
                                                                />
                                                                <Box width={'166px'}>
                                                                    <Text ml={12} color={accesstextColor} fontWeight={600}>
                                                                        {project?.firstName} {project?.lastName}
                                                                    </Text>
                                                                    <Text ml={12} color={'default.veryLightGrayTextColor'} fontWeight={600}>
                                                                        {project.email}{' '}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                            <Center mr={'36px'}></Center>
                                                        </div>
                                                    );
                                                })}
                                            </Box>
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
                                            height={'40px'}
                                            maxWidth={'639px'}
                                            minWidth={'639px'}
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
                                                    <Text mt={'15px'} color={accesstextColor} fontWeight={600}>
                                                        Description
                                                    </Text>
                                                    <EditableControls />
                                                </Center>
                                            </Flex>
                                            <Box maxWidth={'639px'} maxHeight={'40px'} overflowY={'auto'} color={textColor2} fontWeight={400} cursor={'pointer'}>
                                                <EditablePreview />
                                                <Textarea as={EditableInput} />
                                            </Box>
                                        </Editable>
                                    </Box>
                                </Flex>
                            </Box>
                        </Box>
                    </FormControl>
                    {editAccessModal.isOpen && (
                        <Share
                            isOpen={editAccessModal.isOpen}
                            retainData={accessUserListCreateMode}
                            onClose={editAccessModal.onClose}
                            isEdit={true}
                            onCreateUserAccess={(userList: AllUsers) => createUserAccessForCreateProjectMode(userList)}
                        ></Share>
                    )}
                </ModalBody>

                <Divider color={'default.dividerColor'} />
                <ModalFooter>
                    <Button onClick={props.onClose} bg={'default.toolbarButton'} borderRadius={'3'} mb={19} mr={20} mt={'19'} width={'72px'} height={'40px'}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Properties;
