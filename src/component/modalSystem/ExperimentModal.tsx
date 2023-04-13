import React, { useEffect, useState } from 'react';
import {
    Button,
    Divider,
    Modal,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    ModalCloseButton,
    ModalFooter,
    useColorModeValue,
    Center,
    Flex,
    Box,
    Text,
    FormControl,
    FormLabel,
    Select,
    Avatar,
    Input,
    VStack,
    createStandaloneToast,
    AvatarGroup,
    Popover,
    PopoverTrigger,
    useDisclosure,
    FormErrorMessage,
    PopoverContent,
    Stack,
    PopoverCloseButton,
    ButtonGroup
} from '@chakra-ui/react';
import { CloseIcon, DownArrowShare } from '../../assets/icons';
import OrIconSmall from '../../assets/icons/OrIconSmall';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import { getProjectAccessList, getProjectNameAndLabelsForSelect, getTruncatedText, getUserNameFromId } from '../../utils/common.utils';
import useAppStore from '../../store';
import { GetAllProjectsAppStoreState } from '../../models/project';
import { getAndUpdateAllUsersData, updateSpinnerInfo } from '../../zustandActions/commonActions';
import client from '../../apollo-client';
import { createExperiment } from '../../query';
import { getToastOptions } from '../../models/toastMessages';
import { ExperimentCreate, ExperimentCreateDetail } from '../../models/experimentModel';
import { useNavigate } from 'react-router-dom';
import CreateProjectModal from './CreateProjectModal';
import { MultiSelect } from 'chakra-multiselect';
import IsRequired from '../../assets/icons/IsRequired';
import Share from './Share';
// import CreateProjectModal from './CreateProjectModal';

const ExperimentModal = (props: any) => {
    const textColor2 = useColorModeValue('default.titleForShare', 'default.whiteText');
    const textColor = useColorModeValue('dark.veryDarkGray', 'default.whiteText');
    const projectTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const defaultInBoxTextColor = useColorModeValue('default.defaultTextColorInBox', 'default.veryLightGrayTextColor');
    const boxColor = useColorModeValue('#F7FAFC', '#B3B3B3');
    const finalRef = React.useRef(null);
    const [loading] = useState(false);
    const closeButton = useColorModeValue('#666C80', '#ffffff');
    const [AllUsersData] = useAppStore((state: any) => [state.AllUsersData]);
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [formFields, setFormFields] = useState({
        experimentName: '',
        projectSelected: '',
        tags: [],
        description: ''
    });
    const [projectNames, setProjectNames] = React.useState([{ name: '', id: '' }]);
    const [projectAccess, setProjectAccess] = React.useState<any>([]);
    const [projectSelected, setProjectSelected] = useState('');
    const [experimentDescription, setExperimentDescription] = useState('');
    const [experimentName, setExperimentName] = useState('');
    const tagOptions: any = [];
    const [tagValue, setTagValue] = React.useState([]);
    const { toast } = createStandaloneToast();
    const navigate = useNavigate();
    const projectModal = useDisclosure();
    const AddMembers = useDisclosure();
    const tagPopOver = useDisclosure();
    const handleProjectChange = (evt: any) => {
        setProjectSelected(evt.target.value);
        const formFields = {
            experimentName,
            projectSelected: evt.target.value,
            tags: tagValue,
            description: experimentDescription
        };
        setFormFields(formFields);
        setProjectAccess(getProjectAccessList(AllProjectsData, evt.target.value));
    };
    const handleExperimentDescriptionChange = (evt: any) => {
        setExperimentDescription(evt.target.value);
        const formFields = {
            experimentName: experimentName,
            projectSelected: projectSelected,
            tags: tagValue,
            description: evt.target.value
        };
        setFormFields(formFields);
    };
    const handleExperimentNameChange = (evt: any) => {
        setExperimentName(evt.target.value);
        const formFields = {
            experimentName: evt.target.value,
            projectSelected: projectSelected,
            tags: tagValue,
            description: experimentDescription
        };
        setFormFields(formFields);
    };
    const handleRemoveTag = (tag: string) => {
        const newTags = formFields.tags.filter((tagToKeep: any) => {
            return tagToKeep !== tag;
        });
        const formFieldsNew = {
            experimentName: experimentName,
            projectSelected: projectSelected,
            tags: newTags,
            description: experimentDescription
        };
        setFormFields(formFieldsNew);
    };
    const handleTagChange = (ev: any) => {
        setTagValue(ev);
    };
    const handleTagSubmit = (ev: any) => {
        const formFields = {
            experimentName: experimentName,
            projectSelected: projectSelected,
            tags: tagValue,
            description: experimentDescription
        };
        setFormFields(formFields);
        tagPopOver.onClose();
    };
    const handleExperimentCreate = () => {
        updateSpinnerInfo(true);
        client
            .mutate<ExperimentCreate<ExperimentCreateDetail>>({
                mutation: createExperiment(formFields)
            })
            .then((response) => {
                toast(getToastOptions(`Experiment has being successfully created`, 'success'));
                navigate(`/projectDetails/${projectSelected}/experiment/${response.data?.dmsCreateExperiment}`);
                updateSpinnerInfo(false);
                setFormFields({
                    experimentName: '',
                    projectSelected: '',
                    tags: [],
                    description: ''
                });
                setProjectSelected('');
                setExperimentName('');
                setTagValue([]);
                props.onClose();
            })
            .catch((err) => {
                updateSpinnerInfo(false);
                toast(getToastOptions(`${err}`, 'error'));
                props.onClose();
            });
    };
    const handleProjectCreate = () => {
        projectModal.onOpen();
    };
    const handleAddMember = () => {
        AddMembers.onOpen();
    };
    const onCreateProjectSuccess = (projectName: any, projectId: any) => {
        setProjectSelected(projectId);
        projectModal.onClose();
    };
    useEffect(() => {
        updateSpinnerInfo(true);
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            updateSpinnerInfo(false);
            if (projectSelected === '') {
                setProjectSelected(AllProjectsData[0].id);
            }
            setProjectNames(getProjectNameAndLabelsForSelect(AllProjectsData));
            setProjectAccess(getProjectAccessList(AllProjectsData, projectSelected));
        }
    }, [AllProjectsData]);

    useEffect(() => {
        updateSpinnerInfo(true);
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        } else {
            updateSpinnerInfo(false);
        }
    }, [AllUsersData]);

    return (
        <Modal size={'md'} closeOnOverlayClick={false} trapFocus={false} lockFocusAcrossFrames={true} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent minWidth={'653px'}>
                <ModalHeader color={textColor} mt={'20px'} ml={'20px'}>
                    Create Experiment
                </ModalHeader>
                <ModalCloseButton color={textColor} mr={'10px'} mt={'20px'} />
                <Divider color={'default.dividerColor'} mt={'18px'} mb={'20px'} />

                <Flex>
                    <Center width={'612px'} bg={boxColor} height={'92px'} mb={'18px'} ml={'21px'} borderRadius={4}>
                        <FormControl isRequired>
                            <Box>
                                <FormLabel htmlFor="existingCompute" color={projectTitleColor} mt={14} ml={14} fontWeight={600}>
                                    Project Name
                                </FormLabel>
                                <Select
                                    icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                    borderRadius={3}
                                    width={'259px'}
                                    mb={14}
                                    ml={14}
                                    border={'1px'}
                                    borderColor={'light.lighterGrayishBlue'}
                                    as={Select}
                                    id="existingProject"
                                    name="existingProject"
                                    variant="outline"
                                    onChange={handleProjectChange}
                                    value={projectSelected}
                                >
                                    <>
                                        {projectNames.map((project, projectIndex) => {
                                            return (
                                                <option key={projectIndex} value={project.id}>
                                                    {project.name}
                                                </option>
                                            );
                                        })}
                                    </>
                                </Select>
                            </Box>
                        </FormControl>
                        <Box mr={'18px'} ml={'18px'}>
                            {' '}
                            <OrIconSmall />
                        </Box>
                        <Box width={'768px'}>
                            <Text color={projectTitleColor} mb={'-14px'} fontWeight={600}>
                                Create New Project
                            </Text>
                            <Text ml={'152px'} mt={'-20px'}>
                                {' '}
                                <IsRequired />
                            </Text>

                            <Button
                                onClick={handleProjectCreate}
                                width={'127px'}
                                height={'36px'}
                                mt={18}
                                color={'default.toolbarButton'}
                                bg={'white'}
                                border={'1px'}
                                borderColor={'default.toolbarButton'}
                                borderRadius={4}
                                fontWeight={600}
                            >
                                Create Project
                            </Button>
                        </Box>
                        {projectModal.isOpen && (
                            <CreateProjectModal isOpen={projectModal.isOpen} onClose={projectModal.onClose} onSuccess={onCreateProjectSuccess} isEdit={{ status: false, data: {}, usersData: [] }} />
                        )}
                    </Center>
                </Flex>
                <Flex flexDirection={'row'}>
                    <Box ml={'21'}>
                        <Flex>
                            <VStack align="flex-start">
                                <FormControl isInvalid={experimentName === ''} isRequired>
                                    <FormLabel htmlFor="Project Name" mb={6} color={projectTitleColor} fontWeight={600}>
                                        Experiment Name
                                    </FormLabel>
                                    <Input
                                        width={612}
                                        height={'36px'}
                                        borderRadius={3}
                                        border={'1px'}
                                        borderColor={'light.lighterGrayishBlue'}
                                        as={Input}
                                        id="projectName"
                                        name="projectName"
                                        variant="outline"
                                        value={experimentName}
                                        mb={'20px'}
                                        onChange={handleExperimentNameChange}
                                    />{' '}
                                    {experimentName === '' && <FormErrorMessage>Experiment Name is required</FormErrorMessage>}
                                </FormControl>
                                <Flex maxHeight={'37px'} maxWidth={'400px'}>
                                    <Center>
                                        <Text fontWeight={600} color={textColor2} mt={'20'}>
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
                                                        <Button
                                                            onClick={handleTagSubmit}
                                                            bg={'default.toolbarButton'}
                                                            cursor={'pointer'}
                                                            width={'104px'}
                                                            height={'36px'}
                                                            borderRadius={4}
                                                            mb={20}
                                                            mt={16}
                                                        >
                                                            Add Tag(s)
                                                        </Button>
                                                    </ButtonGroup>
                                                </Stack>
                                            </PopoverContent>
                                        </Popover>
                                    </Center>
                                </Flex>
                                <Flex>
                                    {formFields?.tags.map((tag: string, tagIndex: number) => {
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
                                    })}
                                </Flex>
                                {/*<FormControl isRequired>*/}
                                {/*    <FormLabel htmlFor="existingCompute" color={projectTitleColor} mt={12} fontWeight={600}>*/}
                                {/*        Link To*/}
                                {/*    </FormLabel>*/}
                                {/*    <Select*/}
                                {/*        icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}*/}
                                {/*        borderRadius={3}*/}
                                {/*        width={612}*/}
                                {/*        height={'36px'}*/}
                                {/*        border={'1px'}*/}
                                {/*        borderColor={'light.lighterGrayishBlue'}*/}
                                {/*        as={Select}*/}
                                {/*        id="existingProject"*/}
                                {/*        name="existingProject"*/}
                                {/*        variant="outline"*/}
                                {/*    >*/}
                                {/*        <>*/}
                                {/*            <option>Link 1</option>*/}
                                {/*            <option>Link 2</option>*/}
                                {/*        </>*/}
                                {/*    </Select>*/}
                                {/*</FormControl>*/}
                                <FormControl>
                                    <FormLabel htmlFor="Description" mt={12} mb={6} color={projectTitleColor} fontWeight={600}>
                                        Description
                                    </FormLabel>
                                    <Input
                                        value={experimentDescription}
                                        onChange={handleExperimentDescriptionChange}
                                        height={97}
                                        width={612}
                                        borderRadius={3}
                                        border={'1px'}
                                        borderColor={'light.lighterGrayishBlue'}
                                        as={Input}
                                        id="DescriptionProjectName"
                                        name="Description"
                                    />
                                </FormControl>
                            </VStack>
                        </Flex>
                        <Flex mb={'8px'}>
                            <Center>
                                <Text color={projectTitleColor} mt={'46'} fontWeight={600}>
                                    Shared with:
                                </Text>
                                {/* <Text onClick={handleAddMember} color={'default.textButton'} ml={8} mt={'46'} fontWeight={600} minWidth={'76'} cursor={'pointer'}>
                                    + Add Member(s)
                                </Text>
                                {AddMembers.isOpen && <Share isOpen={AddMembers.isOpen} onClose={AddMembers.onClose} />} */}
                            </Center>
                        </Flex>
                        {AllUsersData && (
                            <Flex>
                                <Center>
                                    <AvatarGroup size={'md'} max={4} spacing={1}>
                                        {projectAccess?.map((access: any, accessIndex: any) => {
                                            return <Avatar key={access.id} name={getUserNameFromId(AllUsersData, access.user_id)} color={'default.whiteText'} />;
                                        })}
                                    </AvatarGroup>
                                </Center>
                            </Flex>
                        )}
                    </Box>
                </Flex>

                <Divider color={'default.dividerColor'} mt={'28px'} width={'auto'} />
                <ModalFooter mb={'18px'} mt={'21px'} mr={'20px'}>
                    <Button
                        disabled={loading}
                        onClick={props.onClose}
                        colorScheme="gray"
                        bg={'white'}
                        color={'default.toolbarButton'}
                        width={'72px'}
                        border={'1px'}
                        borderColor={'default.toolbarButton'}
                        height={'36px'}
                        borderRadius={4}
                    >
                        Close
                    </Button>

                    <Button
                        disabled={experimentName === '' || projectSelected === ''}
                        colorScheme="gray"
                        bg={'default.toolbarButton'}
                        color={'white'}
                        width={'72px'}
                        border={'1px'}
                        borderColor={'default.toolbarButton'}
                        height={'36px'}
                        borderRadius={4}
                        ml={'14px'}
                        onClick={handleExperimentCreate}
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ExperimentModal;
