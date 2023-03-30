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
    useDisclosure
} from '@chakra-ui/react';
import { CloseIcon, DownArrowShare } from '../../assets/icons';
import OrIconSmall from '../../assets/icons/OrIconSmall';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import { getProjectAccessList, getProjectNameAndLabelsForSelect, getUserNameFromId } from '../../utils/common.utils';
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
// import CreateProjectModal from './CreateProjectModal';

const ExperimentModal = (props: any) => {
    const textColor = useColorModeValue('dark.veryDarkGray', 'default.whiteText');
    const projectTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const defaultInBoxTextColor = useColorModeValue('default.defaultTextColorInBox', 'default.veryLightGrayTextColor');
    const boxColor = useColorModeValue('#F7FAFC', '#B3B3B3');
    const finalRef = React.useRef(null);
    const [loading] = useState(false);
    const [AllUsersData] = useAppStore((state: any) => [state.AllUsersData]);
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [formFields, setFormFields] = useState({});
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
    const handleTagChange = (ev: any) => {
        setTagValue(ev);
        const formFields = {
            experimentName: experimentName,
            projectSelected: projectSelected,
            tags: ev,
            description: experimentDescription
        };
        setFormFields(formFields);
    };
    const handleExperimentCreate = () => {
        updateSpinnerInfo(true);
        client
            .mutate<ExperimentCreate<ExperimentCreateDetail>>({
                mutation: createExperiment(formFields)
            })
            .then(() => {
                toast(getToastOptions(`Experiment has being successfully created`, 'success'));
                getAndUpdateSingleProjectData(projectSelected);
                updateSpinnerInfo(false);
                navigate(`/projectDetails/${projectSelected}`);
                setFormFields({});
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
        <Modal size={'md'} closeOnOverlayClick={false} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
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
                                <FormControl isRequired>
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
                                        onChange={handleExperimentNameChange}
                                    />{' '}
                                </FormControl>
                                <Flex>
                                    <Center>
                                        <Text color={projectTitleColor} mt={'14'} fontWeight={600}>
                                            Tag:
                                        </Text>
                                    </Center>
                                </Flex>
                                <Flex>
                                    <Box width={'592px'} mr={'20px'} pl={'-50px'} height={'36px'}>
                                        <MultiSelect
                                            value={tagValue}
                                            options={tagOptions}
                                            mr={'200px'}
                                            color={defaultInBoxTextColor}
                                            label=""
                                            onChange={handleTagChange!}
                                            create
                                            bg={'black'}
                                            marginInlineStart={'-4px'}
                                        />
                                    </Box>
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
                            </Center>
                        </Flex>
                        {AllUsersData && (
                            <Flex>
                                <Center>
                                    <AvatarGroup size={'md'} max={3} spacing={1}>
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
                        width={'81px'}
                        border={'1px'}
                        borderColor={'default.toolbarButton'}
                        height={'40px'}
                        borderRadius={4}
                    >
                        Cancel
                    </Button>

                    <Button
                        disabled={loading}
                        colorScheme="gray"
                        bg={'white'}
                        color={'default.toolbarButton'}
                        width={'81px'}
                        border={'1px'}
                        borderColor={'default.toolbarButton'}
                        height={'40px'}
                        borderRadius={4}
                        ml={'20px'}
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
