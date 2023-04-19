import React, { useEffect, useState } from 'react';
import { Avatar, AvatarGroup, Box, Button, Center, Divider, Flex, FormControl, FormLabel, Input, Select, Stack, Text, useColorModeValue, useDisclosure, VStack } from '@chakra-ui/react';
import { DownArrowShare } from '../../../assets/icons/DownArrowShare';
import OrIconSmall from '../../../assets/icons/OrIconSmall';
import { CloseIcon } from '../../../assets/icons/CloseIcon';
import SourceDatabricks from '../../../assets/icons/SourceDatabricks';
import SourceAzure from '../../../assets/icons/SourceAzure';
import SourceDBFS from '../../../assets/icons/SourceDBFS';
import SourceCSV from '../../../assets/icons/SourceCSV';
import useAppStore from '../../../store';
import { GetAllProjectsAppStoreState } from '../../../models/project';
import { getAndUpdateAllProjectsData } from '../../../zustandActions/projectActions';
import { getProjectAccessList, getProjectNameAndLabelsForSelect, getUserNameFromId } from '../../../utils/common.utils';
import CreateProjectModal from '../../../component/modalSystem/CreateProjectModal';
import { getAndUpdateAllUsersData } from '../../../zustandActions/commonActions';
import IsRequired from '../../../assets/icons/IsRequired';

const CreateDatasetFormScreen = (props: any) => {
    const datasetTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const boxColor = useColorModeValue('#F7FAFC', '#B3B3B3');
    const [datasetName, setDatasetName] = useState('');
    const [projectSelected, setProjectSelected] = useState('');
    const [formFields, setFormFields] = useState({});
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [AllUsersData] = useAppStore((state: any) => [state.AllUsersData]);
    const [projectNames, setProjectNames] = React.useState([{ name: '', id: '' }]);
    const [projectAccess, setProjectAccess] = React.useState<any>([]);
    const sourceData = [
        {
            sections: [
                {
                    name: 'Databricks Tables',
                    icon: <SourceDatabricks color={'#666C80'} />,
                    type: 'icon',
                    disable: true,
                    selected: false
                },
                { name: 'Azure Blob Storage', icon: <SourceAzure color={'#666C80'} />, type: 'icon', disable: true, selected: false }
            ]
        },
        {
            sections: [
                {
                    name: 'DBFS',
                    icon: <SourceDBFS color={'#666C80'} />,
                    type: 'icon',
                    disable: true,
                    selected: false
                },
                {
                    name: 'Upload CSV OR PARQUET',
                    icon: <SourceCSV color={'#666C80'} />,
                    type: 'icon',
                    disable: false,
                    selected: false
                }
            ]
        }
    ];
    const [sorceSelectDataset, setSorceSelectDataset] = useState(sourceData);
    const projectModal = useDisclosure();
    const handleDataSetNameChange = (evt: any) => {
        setDatasetName(evt.target.value);
        const formFields = {
            datasetName: evt.target.value,
            projectSelected: projectSelected
        };
        setFormFields(formFields);
        props.handleFormFields(formFields);
    };
    const handleProjectChange = (evt: any) => {
        setProjectSelected(evt.target.value);
        const formFields = {
            datasetName,
            projectSelected: evt.target.value
        };
        setFormFields(formFields);
        setProjectAccess(getProjectAccessList(AllProjectsData, evt.target.value));
        props.handleFormFields(formFields);
    };
    const enableUploadCSVSelection = (type: string) => {
        let sourceSelectState = sorceSelectDataset;
        if(type === 'auto') {
            sourceSelectState[1].sections[1].selected = !sourceSelectState[1].sections[1].selected;
            sourceSelectState[1].sections[1].icon = (sourceSelectState[1].sections[1].selected) ? <SourceCSV color={'#FFFFFF'} /> : <SourceCSV color={'#666C80'} />;
            setSorceSelectDataset(sourceSelectState);
            props.setScreenState(sourceSelectState[1].sections[1].selected);
        } else {
            sourceSelectState[1].sections[1].selected = true;
            sourceSelectState[1].sections[1].icon = <SourceCSV color={'#FFFFFF'} />
            setSorceSelectDataset(sourceSelectState);
            props.setScreenState(true);
        }

    };
    const triggerAction = (type: string) => {
        if (type === 'Upload CSV OR PARQUET') {
            enableUploadCSVSelection('auto')
        }
    };
    useEffect(() => {
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            if (projectSelected === '') {
                setProjectSelected(AllProjectsData[0].id);
                const formFields = {
                    datasetName,
                    projectSelected: projectSelected
                };
                setFormFields(formFields);
                props.handleFormFields(formFields);
            }
            setProjectNames(getProjectNameAndLabelsForSelect(AllProjectsData));
            setProjectAccess(getProjectAccessList(AllProjectsData, projectSelected));
        }
    }, [AllProjectsData]);

    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        }
    }, [AllUsersData]);

    useEffect(() => {
        if(Object.keys(props.previousState).length) {
            setProjectSelected(props.previousState.projectSelected);
            setDatasetName(props.previousState.datasetName);
            setSorceSelectDataset(sourceData);
            const formFields = {
                datasetName: props.previousState.datasetName,
                projectSelected: props.previousState.projectSelected
            };
            setFormFields(formFields);
            setProjectAccess(getProjectAccessList(AllProjectsData, props.previousState.projectSelected));
            props.handleFormFields(formFields);
            enableUploadCSVSelection('nonAuto');
        }
    }, [props.previousState]);

    const handleProjectCreate = () => {
        projectModal.onOpen();
    };

    const onCreateProjectSuccess = (projectName: any, projectId: any) => {
        setProjectSelected(projectId);
        projectModal.onClose();
    };

    return (
        <>
            <Flex>
                <Center width={'856px'} bg={boxColor} height={'92px'} mt={'10px'} mb={'21px'} ml={'21px'}>
                    <FormControl isRequired>
                        <Box>
                            <FormLabel htmlFor="existingCompute" color={datasetTitleColor} mt={14} ml={14} fontWeight={600}>
                                Project Name
                            </FormLabel>
                            <Select
                                icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                borderRadius={3}
                                width={'381px'}
                                mb={14}
                                ml={14}
                                border={'1px'}
                                borderColor={'light.lighterGrayishBlue'}
                                as={Select}
                                id="existingCompute"
                                name="existingCompute"
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
                    <Box mr={'20px'} ml={'-20px'}>
                        {' '}
                        <OrIconSmall />
                    </Box>
                    <Box width={'768px'}>
                        <Text color={datasetTitleColor} mb={'-14px'} fontWeight={600}>
                            Create New Project
                        </Text>
                        <Text ml={'152px'} mt={'-20px'}>
                            {' '}
                            <IsRequired />
                        </Text>

                        <Button onClick={handleProjectCreate} width={'127px'} height={'36px'} mt={18} color={'default.toolbarButton'} bg={'white'} border={'1px'} borderColor={'default.toolbarButton'}>
                            Create Project
                        </Button>
                    </Box>
                </Center>
            </Flex>
            <Flex flexDirection={'row'}>
                <Box width={'55%'} ml={'21'}>
                    <Flex>
                        <VStack align="flex-start">
                            <FormControl isRequired>
                                <FormLabel htmlFor="datasetName" mb={6} color={datasetTitleColor} fontWeight={600}>
                                    Dataset Name
                                </FormLabel>
                                <Input
                                    width={484}
                                    height={34}
                                    borderRadius={3}
                                    border={'1px'}
                                    borderColor={'light.lighterGrayishBlue'}
                                    value={datasetName}
                                    onChange={handleDataSetNameChange}
                                    as={Input}
                                    id="datasetName"
                                    name="datasetName"
                                    variant="outline"
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="Description" mt={20} mb={6} color={datasetTitleColor} fontWeight={600}>
                                    Description
                                </FormLabel>
                                <Input height={98} width={484} borderRadius={3} border={'1px'} borderColor={'light.lighterGrayishBlue'} as={Input} id="DescriptionDatasetName" name="Description" />
                            </FormControl>
                        </VStack>
                    </Flex>
                    <Flex>
                        <Center>
                            <Text color={datasetTitleColor} mt={'20'} fontWeight={600}>
                                Tag:
                            </Text>
                            <Center>
                                <Box ml={14} mt={16} bg={' #F2F4F8'} height={'24px'} borderRadius={3} minWidth={70}>
                                    <Flex>
                                        <Center>
                                            <Text color={'default.userCircleHeaderFont'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                Demo
                                            </Text>
                                            <Box justifyContent={'flex-end'} ml={'14px'}>
                                                <CloseIcon color={'black'} />
                                            </Box>
                                        </Center>
                                    </Flex>
                                </Box>
                            </Center>
                            <Text color={'default.toolbarButton'} mt={'20'} ml={20} fontWeight={600}>
                                + Add Tag
                            </Text>
                        </Center>
                    </Flex>
                    <Flex mb={'21px'}>
                        <Center>
                            <Text color={datasetTitleColor} mt={'20'} fontWeight={600}>
                                Shared with:
                            </Text>
                        </Center>
                    </Flex>
                    {AllUsersData && AllProjectsData && (
                        <Flex>
                            <Center>
                                <AvatarGroup size={'md'} max={3} spacing={1}>
                                    {projectAccess?.map((access: any, accessIndex: any) => {
                                        return <Avatar key={accessIndex} name={getUserNameFromId(AllUsersData, access.user_id)} color={'default.whiteText'} />;
                                    })}
                                </AvatarGroup>
                            </Center>
                        </Flex>
                    )}
                </Box>

                <Stack direction="row" h="338px" p={4}>
                    <Divider orientation="vertical" />
                </Stack>
                <Flex mt={-86}>
                    <Center>
                        <Box>
                            <Text ml={'20px'} color={datasetTitleColor} mt={'72px'} fontWeight={600}>
                                Select Source
                            </Text>
                            <Text ml={'132px'} mt={'-20px'}>
                                {' '}
                                <IsRequired />
                            </Text>

                            {sorceSelectDataset?.map((row, rowIndex) => {
                                return (
                                    <Flex flexDirection={'row'} key={rowIndex}>
                                        {row.sections &&
                                            row.sections.map((section) => {
                                                return (
                                                    <>
                                                        {section.type === 'icon' && (
                                                            <Box
                                                                key={section.name}
                                                                _hover={{ bg: 'default.toolbarButton', color: 'white' }}
                                                                cursor={section.disable ? 'not-allowed' : 'pointer'}
                                                                ml={'20px'}
                                                                bg={(section.selected) ? 'default.toolbarButton': 'default.lightGray'}
                                                                color={(section.selected) ? 'white': 'black'}
                                                                width={'155px'}
                                                                height="134px"
                                                                mt={'14px'}
                                                                className="sidebar-box"
                                                                borderRadius={'4'}
                                                                onClick={() => triggerAction(section.name)}
                                                            >
                                                                <Center cursor={section.disable ? 'not-allowed' : 'pointer'} mt={'35px'}>
                                                                    {section.icon}
                                                                </Center>

                                                                <Box cursor={section.disable ? 'not-allowed' : 'pointer'} textAlign={'center'} mt={'4px'} color={(section.selected) ? 'white': 'black'} fontWeight={400}>
                                                                    {' '}
                                                                    {section.name}{' '}
                                                                </Box>
                                                            </Box>
                                                        )}
                                                    </>
                                                );
                                            })}
                                    </Flex>
                                );
                            })}
                        </Box>
                    </Center>
                </Flex>
                {projectModal.isOpen && (
                    <CreateProjectModal isOpen={projectModal.isOpen} onClose={projectModal.onClose} onSuccess={onCreateProjectSuccess} isEdit={{ status: false, data: {}, usersData: [] }} />
                )}
            </Flex>
        </>
    );
};
export default CreateDatasetFormScreen;
