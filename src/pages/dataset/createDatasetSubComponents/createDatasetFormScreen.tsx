import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Center,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Stack,
    Text,
    useColorModeValue,
    VStack
} from '@chakra-ui/react';
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
import { getProjectNameAndLabelsForSelect } from '../../../utils/common.utils';

const CreateDatasetFormScreen = (props: any) => {
    const datasetTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const boxColor = useColorModeValue('#F7FAFC', '#B3B3B3');
    const [datasetName, setDatasetName] = useState('');
    const [projectSelected, setProjectSelected] = useState('');
    const [formFields, setFormFields] = useState({});
    const [AllProjectsData] = useAppStore((state: GetAllProjectsAppStoreState) => [state.AllProjectsData]);
    const [projectNames, setProjectNames] = React.useState([{name: '', id: ''}]);
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
        props.handleFormFields(formFields);
    };
    const triggerAction = (type: string) => {
        if (type === 'Upload CSV') {
            const newScreens = {
                screen1: false,
                screen2: true,
                screen3: false
            };
            props.setScreenState(newScreens);
        }
    };
    const sorceSelectDataset = [
        {
            sections: [
                {
                    name: 'Databricks Tables',
                    icon: <SourceDatabricks color={'#666C80'} />,
                    type: 'icon'
                },
                { name: 'Azure Blob Storage', icon: <SourceAzure color={'#666C80'} />, type: 'icon' }
            ]
        },
        {
            sections: [
                {
                    name: 'DBFS',
                    icon: <SourceDBFS color={'#666C80'} />,
                    type: 'icon'
                },
                {
                    name: 'Upload CSV',
                    icon: <SourceCSV color={'#666C80'} />,
                    type: 'icon'
                }
            ]
        }
    ];
    useEffect(() => {
        if (AllProjectsData === null) {
            getAndUpdateAllProjectsData();
        } else {
            setProjectNames(getProjectNameAndLabelsForSelect(AllProjectsData));
        }
    }, [AllProjectsData]);
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
                            >
                                <>
                                    {projectNames.map((project, projectIndex) => {
                                        return <option key={projectIndex} value={project.id}>{project.name}</option>
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

                        <Button width={'127px'} height={'36px'} mt={18} color={'default.toolbarButton'} bg={'white'} border={'1px'} borderColor={'default.toolbarButton'}>
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

                                <FormLabel htmlFor="Description" mt={20} mb={6} color={datasetTitleColor} fontWeight={600}>
                                    Description
                                </FormLabel>
                                <Input
                                    height={98}
                                    width={484}
                                    borderRadius={3}
                                    border={'1px'}
                                    borderColor={'light.lighterGrayishBlue'}
                                    as={Input}
                                    id="DescriptionDatasetName"
                                    name="Description"
                                />
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
                    <Flex>
                        <Center>
                            <Avatar p={'5px'} borderRadius="full" boxSize="32px" name={`Shirin Bampoori`} color={'default.whiteText'} mt={'-14px'} />
                        </Center>
                    </Flex>
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
                                                            ml={'20px'}
                                                            bg="default.lightGray"
                                                            width={'155px'}
                                                            height="134px"
                                                            mt={'14px'}
                                                            className="sidebar-box"
                                                            borderRadius={'4'}
                                                            onClick={() => triggerAction(section.name)}
                                                        >
                                                            <Center mt={'35px'}>{section.icon}</Center>

                                                            <Box textAlign={'center'} mt={'4px'} color={'black'} fontWeight={400}>
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
            </Flex>
        </>
    );
};
export default CreateDatasetFormScreen;
