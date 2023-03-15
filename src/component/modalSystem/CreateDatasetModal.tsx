import React, { useMemo, useRef, useState } from 'react';
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
    Stack,
    Avatar,
    Input,
    VStack,
    useDisclosure,
    createStandaloneToast
} from '@chakra-ui/react';
import { CloseIcon, DownArrowShare } from '../../assets/icons';
import OrIconSmall from '../../assets/icons/OrIconSmall';
import SourceDBFS from '../../assets/icons/SourceDBFS';
import SourceCSV from '../../assets/icons/SourceCSV';
import SourceAzure from '../../assets/icons/SourceAzure';
import SourceDatabricks from '../../assets/icons/SourceDatabricks';
import { Field, Formik } from 'formik';
import FileUploadComponent from '../../pages/dataset/fileUpload/FileUploadComponent';
import { AgGridReact } from 'ag-grid-react';
import { OutputDetail } from '../../models/outputDetail';
import { ColDef } from 'ag-grid-community';
import { keys, startCase } from 'lodash';
import { getToastOptions } from '../../models/toastMessages';

const CreateDataset = (props: any) => {
    const textColor = useColorModeValue('dark.veryDarkGray', 'default.whiteText');
    const titleDarkCSV = useColorModeValue('default.blackText', 'default.whiteText');
    const datasetTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const idText = useColorModeValue('default.blackText', 'default.whiteText');
    const boxColor = useColorModeValue('#F7FAFC', '#B3B3B3');
    const finalRef = React.useRef(null);
    const [loading] = useState(false);
    const gridRef = useRef<AgGridReact<any>>(null);
    const gridStyle = useMemo(() => ({ height: '500px', width: '100%' }), []);
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const { toast } = createStandaloneToast();
    const [screenState, setScreenState] = useState({
        screen1: true,
        screen2: false,
        screen3: false
    });
    const createDataset = () => {
        props.onClose();
        toast(getToastOptions(`File Uploaded Successfully`, 'success'));
    };
    const deleteDataset = () => {
        toast(getToastOptions(`File Upload Cancelled`, 'error'));
    };
    const triggerAction = (type: string) => {
        if (type === 'Upload CSV') {
            const newScreens = {
                screen1: false,
                screen2: true,
                screen3: false
            };
            setScreenState(newScreens);
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
    const navigateToNextScreen = () => {
        if (screenState.screen1) {
            const newScreens = {
                screen1: false,
                screen2: true,
                screen3: false
            };
            setScreenState(newScreens);
        }
    };
    const getResponseFromFileUpload = (uploadResponse: any) => {
        console.log('Response From File Upload', uploadResponse);
        const colDefKeys = keys(uploadResponse['sample_rows'][0]);
        const colDef = colDefKeys.map((headerKeys: string) => {
            return { headerName: startCase(headerKeys), field: headerKeys } as ColDef;
        });
        setColumnDefs(colDef);
        setRowData(uploadResponse['sample_rows']);
        const newScreens = {
            screen1: false,
            screen2: false,
            screen3: true
        };
        setScreenState(newScreens);
    };
    return (
        <Modal size={'lg'} closeOnOverlayClick={false} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />
            <ModalContent minWidth={'901px'}>
                <ModalHeader color={textColor} mt={'13px'} ml={'20px'}>
                    Create Dataset
                </ModalHeader>
                <ModalCloseButton color={textColor} mr={'10px'} mt={'12px'} />
                <Divider color={'default.dividerColor'} mt={'13px'} mb={'19px'} />
                <Center>
                    <Box>
                        <Avatar borderRadius="full" boxSize="32px" name={'1'} bg={'default.toolbarButton'} color={'default.whiteText'} mb={'8px'} />
                        <Text ml={'-8px'}>Details</Text>
                    </Box>
                    <Divider borderColor={'default.toolbarButton'} borderWidth={'1px'} orientation="horizontal" maxWidth={'96px'} mr={'16px'} mt={'-22px'} />
                    <Box>
                        <Avatar
                            borderRadius="full"
                            boxSize="32px"
                            name={'2'}
                            bg={screenState.screen2 || screenState.screen3 ? 'default.toolbarButton' : 'default.bgDatasetLevels'}
                            color={'default.whiteText'}
                            mb={'8px'}
                        />
                        <Text ml={'-8px'}>Source</Text>
                    </Box>
                    <Divider
                        borderColor={screenState.screen2 || screenState.screen3 ? 'default.toolbarButton' : 'default.bgDatasetLevels'}
                        borderWidth={'1px'}
                        orientation="horizontal"
                        maxWidth={'96px'}
                        mr={'16px'}
                        mt={'-22px'}
                    />
                    <Box>
                        <Avatar borderRadius="full" boxSize="32px" name={'3'} bg={screenState.screen3 ? 'default.toolbarButton' : 'default.bgDatasetLevels'} color={'default.whiteText'} mb={'8px'} />
                        <Text ml={'-8px'}> Preview</Text>
                    </Box>
                </Center>
                {screenState.screen1 && (
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
                                            validate={(value: any) => {
                                                let error;
                                                if (value.length === 0) {
                                                    error = ' Select From Existing Project is required';
                                                }
                                                return error;
                                            }}
                                        >
                                            <>
                                                <option>Dataset 1</option>
                                                <option>Dataset 2</option>
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
                                        Create Compute
                                    </Button>
                                </Box>
                            </Center>
                        </Flex>
                        <Flex flexDirection={'row'}>
                            <Box width={'55%'} ml={'21'}>
                                <Flex>
                                    <Formik
                                        initialValues={{
                                            validateOnMount: true,
                                            notebookName: '',
                                            defaultLanguage: ''
                                        }}
                                        validateOnBlur={true}
                                        validateOnChange={true}
                                        onSubmit={(values) => {}}
                                    >
                                        <VStack align="flex-start">
                                            <FormControl isRequired>
                                                <FormLabel htmlFor="datasetName" mb={6} color={datasetTitleColor} fontWeight={600}>
                                                    Dataset Name
                                                </FormLabel>
                                                <Field
                                                    width={484}
                                                    height={34}
                                                    borderRadius={3}
                                                    border={'1px'}
                                                    borderColor={'light.lighterGrayishBlue'}
                                                    as={Input}
                                                    id="datasetName"
                                                    name="datasetName"
                                                    variant="outline"
                                                    validate={(value: any) => {
                                                        let error;
                                                        if (value.length === 0) {
                                                            error = 'dataset Name is required';
                                                        }

                                                        return error;
                                                    }}
                                                />

                                                <FormLabel htmlFor="Description" mt={20} mb={6} color={datasetTitleColor} fontWeight={600}>
                                                    Description
                                                </FormLabel>
                                                <Field
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
                                    </Formik>
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
                )}
                {screenState.screen2 && (
                    <>
                        <Flex>
                            <Center width={'901px'} pl={'-24px'}>
                                <Box width={'100%'} ml={'21'} mt={'17'}>
                                    <Flex mb={'19px'} fontSize={'21px'}>
                                        <Text color={datasetTitleColor}>Dataset Name:</Text>
                                        <Text color={titleDarkCSV} ml={'8px'}>
                                            My Dataset 1
                                        </Text>
                                    </Flex>
                                    <Text fontWeight={700} color={datasetTitleColor}>
                                        Upload CSV Files
                                    </Text>
                                    <Box mt={'8px'} width={'856px'} height={'315px'} border={'2px'} borderRadius={4} borderColor={'#E0E3E9'} borderStyle={'dashed'}>
                                        <Center>
                                            <Box>
                                                <FileUploadComponent
                                                    projectId={'41'}
                                                    datasetName={'Test1'}
                                                    getResponseFromFileUpload={(fileUploadResponse: any) => getResponseFromFileUpload(fileUploadResponse)}
                                                ></FileUploadComponent>
                                            </Box>
                                        </Center>
                                    </Box>
                                </Box>
                            </Center>
                        </Flex>
                    </>
                )}
                {screenState.screen3 && (
                    <>
                        <Flex>
                            <Center width={'856px'} height={'500px'}>
                                <Box ml={'23'} mr={'12'} borderColor={'light.lighterGrayishBlue'} width={'1400px'} mt={'18'}>
                                    <Box style={gridStyle} className="ag-theme-alpine">
                                        <AgGridReact<OutputDetail> ref={gridRef} rowData={rowData} columnDefs={columnDefs} animateRows={true}></AgGridReact>
                                    </Box>
                                </Box>
                            </Center>
                        </Flex>

                    </>
                )}


                <Divider color={'default.dividerColor'} mt={'70px'} width={'auto'} />
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
                    {!screenState.screen3 && (
                        <Button
                            disabled={loading}
                            onClick={navigateToNextScreen}
                            colorScheme="gray"
                            bg={'white'}
                            color={'default.toolbarButton'}
                            width={'81px'}
                            border={'1px'}
                            borderColor={'default.toolbarButton'}
                            height={'40px'}
                            borderRadius={4}
                            ml={'20px'}
                        >
                            Next
                        </Button>
                    )}
                    {screenState.screen3 && (
                        <Button
                            disabled={loading}
                            onClick={createDataset}
                            colorScheme="gray"
                            bg={'white'}
                            color={'default.toolbarButton'}
                            width={'120px'}
                            border={'1px'}
                            borderColor={'default.toolbarButton'}
                            height={'40px'}
                            borderRadius={4}
                            ml={'20px'}
                        >
                            Create Dataset
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateDataset;
