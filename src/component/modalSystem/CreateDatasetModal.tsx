import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    Avatar,
    createStandaloneToast
} from '@chakra-ui/react';
import FileUploadComponent from '../../pages/dataset/fileUpload/FileUploadComponent';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { keys, startCase } from 'lodash';
import { getToastOptions } from '../../models/toastMessages';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import CreateDatasetFormScreen from '../../pages/dataset/createDatasetSubComponents/createDatasetFormScreen';
import { datasetPreviewSchema, DeleteDataset, DeleteDatasetDetail } from '../../models/dataset';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';
import client from '../../apollo-client';
import { deleteDataset } from '../../query';
const CreateDataset = (props: any) => {
    const textColor = useColorModeValue('dark.veryDarkGray', 'default.whiteText');
    const titleDarkCSV = useColorModeValue('default.blackText', 'default.whiteText');
    const datasetTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const finalRef = React.useRef(null);
    const [loading] = useState(false);
    const [datasetName, setDatasetName] = useState('');
    const [datasetId, setDatasetId] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const gridRef = useRef<AgGridReact<any>>(null);
    const gridStyle = useMemo(() => ({ height: '300px', width: '856px' }), []);
    const [rowData, setRowData] = useState<any[]>([]);
    const [columnDefs, setColumnDefs] = useState<ColDef[]>([]);
    const gridRefSchema = useRef<AgGridReact<any>>(null);
    const gridStyleSchema = useMemo(() => ({ height: '270px', width: '511px' }), []);
    const [rowDataSchema, setRowDataSchema] = useState<datasetPreviewSchema[]>([]);
    const [columnDefsSchema, setColumnDefsSchema] = useState<ColDef[]>([]);
    const { toast } = createStandaloneToast();
    const [isNextAvaiable, setIsNextAvaiable] = useState(false);
    const [isNextAvaiableForFileUpload, setIsNextAvaiableForFileUpload] = useState(false);
    const [screenState, setScreenState] = useState({
        screen1: true,
        screen2: false,
        screen3: false
    });
    const [previousStateData, setPreviousStateData] = useState({});

    const handleDeleteDataset = () => {
        // TODO After backend adds the delete dataset Id as a input add the delete dataset mutation
        if (screenState.screen3) {
            updateSpinnerInfo(true);
            client
                .mutate<DeleteDataset<DeleteDatasetDetail>>({
                    mutation: deleteDataset(datasetId)
                })
                .then(() => {
                    toast(getToastOptions(`Dataset Delete Successfully`, 'success'));
                    getAndUpdateAllProjectsData();
                    getAndUpdateSingleProjectData(selectedProjectId);
                    setSelectedProjectId('');
                    setDatasetName('');
                    updateSpinnerInfo(false);
                    props.onClose();
                    setScreenState({ screen1: true,
                        screen2: false,
                        screen3: false});
                })
                .catch((err: any) => {
                    updateSpinnerInfo(false);
                    props.onClose();
                    toast(getToastOptions(`${err}`, 'error'));
                    setScreenState({ screen1: true,
                        screen2: false,
                        screen3: false});
                });
        } else {
            updateSpinnerInfo(false);
            props.onClose();
            setScreenState({ screen1: true,
                screen2: false,
                screen3: false});
        }
    };
    const createDataset = () => {
        getAndUpdateSingleProjectData(selectedProjectId);
        setSelectedProjectId('');
        setDatasetName('');
        setPreviousStateData({
            datasetName: '',
            projectSelected: ''
        });
        props.onClose();
        toast(getToastOptions(`File Uploaded Successfully`, 'success'));
    };
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
    const navigateToNextScreenFileUpload = () => {
        if (screenState.screen2) {
            const newScreens = {
                screen1: false,
                screen2: false,
                screen3: true
            };
            setScreenState(newScreens);
        }
    };
    const getResponseFromFileUpload = (uploadResponse: any) => {
        if (!uploadResponse) {
            toast(getToastOptions(`File Upload Failed, contact support`, 'error'));
        } else {
            setDatasetId(uploadResponse.id);
            const colDefKeysSchema = [
                {
                    field: 'col_name',
                    headerName: 'Col_name'
                },
                {
                    field: 'data_type',
                    headerName: 'Data_type'
                },
                {
                    field: 'comment',
                    headerName: 'Comment'
                }
            ];
            setColumnDefsSchema(colDefKeysSchema);
            setRowDataSchema(
                uploadResponse['schema'].map((row: any) => {
                    return {
                        col_name: row[0],
                        data_type: row[1],
                        comment: row[2]
                    };
                })
            );
            const colDefKeys = keys(uploadResponse['sample_rows'][0]);
            const colDef = colDefKeys.map((headerKeys: string) => {
                return { headerName: startCase(headerKeys), field: headerKeys } as ColDef;
            });
            setColumnDefs(colDef);
            setRowData(uploadResponse['sample_rows']);
            setIsNextAvaiableForFileUpload(true);
        }
    };
    const handleFormFields = (formFields: any) => {
        setDatasetName(formFields.datasetName);
        setSelectedProjectId(formFields.projectSelected);
    };
    const enableNext = (enableNextButton: boolean) => {
        console.log("asdfds",enableNextButton, datasetName )
        setIsNextAvaiable(enableNextButton);
    };
    const navigateToPrevScreen = () => {
        setPreviousStateData({
            datasetName: datasetName,
            projectSelected: selectedProjectId
        });
        setScreenState({
            screen1: true,
            screen2: false,
            screen3: false
        });

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
                    <CreateDatasetFormScreen
                        setScreenState={(stateOfNextButton: any) => enableNext(stateOfNextButton)}
                        previousState={previousStateData}
                        handleFormFields={(formFields: any) => {
                            handleFormFields(formFields);
                        }}
                    ></CreateDatasetFormScreen>
                )}
                {screenState.screen2 && (
                    <>
                        <Flex>
                            <Center width={'901px'} pl={'-24px'}>
                                <Box width={'100%'} ml={'21'} mt={'17'}>
                                    <Flex mb={'19px'} fontSize={'21px'}>
                                        <Text color={datasetTitleColor}>Dataset Name:</Text>
                                        <Text color={titleDarkCSV} ml={'8px'}>
                                            {datasetName}
                                        </Text>
                                    </Flex>
                                    <Text fontWeight={700} color={datasetTitleColor}>
                                        Upload CSV Files
                                    </Text>
                                    <Box mt={'8px'} width={'856px'} height={'315px'} border={'2px'} borderRadius={4} borderColor={'#E0E3E9'} borderStyle={'dashed'}>
                                        <Center>
                                            <Box>
                                                <FileUploadComponent
                                                    projectId={selectedProjectId}
                                                    datasetName={datasetName}
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
                        <Flex flexDirection={'column'}>
                            <Box ml={'23'} mr={'12'} borderColor={'light.lighterGrayishBlue'} width={'1400px'} mt={'18'}>
                                <Text fontWeight={700} fontSize={'16px'} color={textColor}>
                                    Schema
                                </Text>
                                <Box style={gridStyleSchema} className="ag-theme-alpine">
                                    <AgGridReact<any> ref={gridRefSchema} rowData={rowDataSchema} columnDefs={columnDefsSchema} animateRows={true}></AgGridReact>
                                </Box>
                            </Box>
                            <Box ml={'23'} mr={'12'} borderColor={'light.lighterGrayishBlue'} width={'1400px'} mt={'18'}>
                                <Text fontWeight={700} fontSize={'16px'} color={textColor}>
                                    Sample Data
                                </Text>
                                <Box style={gridStyle} className="ag-theme-alpine">
                                    <AgGridReact<any> ref={gridRef} rowData={rowData} columnDefs={columnDefs} animateRows={true}></AgGridReact>
                                </Box>
                            </Box>
                        </Flex>
                    </>
                )}

                <Divider color={'default.dividerColor'} mt={'70px'} width={'auto'} />
                <ModalFooter mb={'18px'} mt={'21px'} mr={'20px'}>
                    <Button
                        disabled={loading}
                        onClick={handleDeleteDataset}
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
                    {screenState.screen1 && (
                        <Button
                            disabled={loading || (!isNextAvaiable || datasetName === "")}
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
                    {screenState.screen2 && (
                        <Button
                            onClick={navigateToPrevScreen}
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
                            Previous
                        </Button>
                    )}
                    {screenState.screen2 && (
                        <Button
                            disabled={!isNextAvaiableForFileUpload}
                            onClick={navigateToNextScreenFileUpload}
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
