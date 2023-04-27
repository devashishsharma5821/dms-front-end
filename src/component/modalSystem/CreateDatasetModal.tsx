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
import { useNavigate } from 'react-router-dom';
import TickIcon from '../../assets/icons/TickIcon';
import { getColDefsForDataset, getRowDataForDataset } from '../../utils/common.utils';
const CreateDataset = (props: any) => {
    const textColor = useColorModeValue('dark.veryDarkGray', 'default.whiteText');
    const textColor2 = useColorModeValue('#646A78', 'default.whiteText');
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
    const [disableStatus, setDisableStatus] = useState(false);
    const navigate = useNavigate();
    const [screenState, setScreenState] = useState({
        screen1: true,
        screen2: false,
        screen3: false
    });
    const [previousStateData, setPreviousStateData] = useState({});

    const handleDeleteDataset = () => {
        // TODO After backend adds the delete dataset Id as a input add the delete dataset mutation
        if (datasetId !== '') {
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
                    setScreenState({ screen1: true, screen2: false, screen3: false });
                })
                .catch((err: any) => {
                    updateSpinnerInfo(false);
                    props.onClose();
                    toast(getToastOptions(`${err}`, 'error'));
                    setScreenState({ screen1: true, screen2: false, screen3: false });
                });
        } else {
            updateSpinnerInfo(false);
            props.onClose();
            setDatasetName('');
            setScreenState({ screen1: true, screen2: false, screen3: false });
        }
    };
    const createDataset = () => {
        props.onClose();
        navigate(`/datasetDetails/${selectedProjectId}/${datasetId}`);
        setSelectedProjectId('');
        setDatasetName('');
        setPreviousStateData({
            datasetName: '',
            projectSelected: ''
        });
        toast(getToastOptions(`Dataset Created Successfully`, 'success'));
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
            setDatasetId(uploadResponse.dataset_id);
            const storedColDefs = getColDefsForDataset(uploadResponse['sample_rows'][0]);
            setColumnDefsSchema(storedColDefs.colDefKeysSchema);
            setColumnDefs(storedColDefs.colDef);
            const storedData = getRowDataForDataset(uploadResponse);
            setRowDataSchema(storedData.rowDataForSchema);
            setRowData(storedData.rowDataForSample);
            setIsNextAvaiableForFileUpload(true);
        }
    };
    const handleFormFields = (formFields: any) => {
        setDatasetName(formFields.datasetName);
        setSelectedProjectId(formFields.projectSelected);
    };
    const enableNext = (enableNextButton: boolean) => {
        setIsNextAvaiable(enableNextButton);
    };
    const navigateToPrevScreen = () => {
        if (screenState.screen2) {
            setPreviousStateData({
                datasetName: datasetName,
                projectSelected: selectedProjectId
            });
            setScreenState({
                screen1: true,
                screen2: false,
                screen3: false
            });
        } else if (screenState.screen3) {
            setPreviousStateData({
                datasetName: datasetName,
                projectSelected: selectedProjectId
            });
            setScreenState({
                screen1: false,
                screen2: true,
                screen3: false
            });
        }
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
                        {screenState.screen1 && <Avatar borderRadius="full" boxSize="32px" name={'1'} bg={'default.toolbarButton'} color={'default.whiteText'} mb={'8px'} />}
                        {(screenState.screen2 || screenState.screen3) && <Avatar borderRadius="full" bg={'default.toolbarButton'} boxSize="32px" icon={<TickIcon />} mb={'8px'} />}
                        <Text ml={'-8px'}>Details</Text>
                    </Box>
                    <Divider borderColor={'default.toolbarButton'} borderWidth={'1px'} orientation="horizontal" maxWidth={'96px'} mr={'16px'} mt={'-22px'} />
                    <Box>
                        {(screenState.screen1 || screenState.screen2) && (
                            <Avatar
                                borderRadius="full"
                                boxSize="32px"
                                name={'2'}
                                bg={screenState.screen2 || screenState.screen3 ? 'default.toolbarButton' : 'default.bgDatasetLevels'}
                                color={'default.whiteText'}
                                mb={'8px'}
                            />
                        )}
                        {screenState.screen3 && <Avatar borderRadius="full" bg={'default.toolbarButton'} boxSize="32px" icon={<TickIcon />} mb={'8px'} />}

                        {screenState.screen1 && (
                            <Text fontWeight={400} color="#929AA9" ml={'-8px'}>
                                Source
                            </Text>
                        )}
                        {(screenState.screen2 || screenState.screen3) && (
                            <Text fontWeight={400} color="#111111" ml={'-8px'}>
                                Source
                            </Text>
                        )}
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
                        {(screenState.screen1 || screenState.screen2) && (
                            <Text fontWeight={400} color="#929AA9" ml={'-8px'}>
                                Preview
                            </Text>
                        )}
                        {screenState.screen3 && (
                            <Text fontWeight={400} color="#111111" ml={'-8px'}>
                                Preview
                            </Text>
                        )}
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
                                                    disableStatus={(status: boolean) => setDisableStatus(status)}
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
                                <Flex>
                                    <Text fontWeight={700} fontSize={'16px'} color={textColor}>
                                        Schema
                                    </Text>
                                    <Text ml={'16px'} fontWeight={700} fontSize={'16px'} color={textColor2}>
                                        {rowDataSchema.length} Records
                                    </Text>
                                </Flex>

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
                    {screenState.screen1 && (
                        <>
                            <Button
                                disabled={loading || disableStatus}
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
                            <Button
                                disabled={loading || !isNextAvaiable || datasetName === ''}
                                onClick={navigateToNextScreen}
                                colorScheme="gray"
                                bg={'default.toolbarButton'}
                                color={'white'}
                                width={'81px'}
                                border={'1px'}
                                borderColor={'default.toolbarButton'}
                                height={'40px'}
                                borderRadius={4}
                                ml={'20px'}
                            >
                                Next
                            </Button>
                        </>
                    )}
                    {(screenState.screen2 || screenState.screen3) && (
                        <>
                            <Button
                                disabled={loading || disableStatus}
                                onClick={handleDeleteDataset}
                                bg={'transparent'}
                                color={'default.toolbarButton'}
                                width={'81px'}
                                height={'40px'}
                                variant="link"
                                borderRadius={4}
                                textDecoration="none"
                            >
                                Cancel
                            </Button>
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
                                disabled={disableStatus}
                            >
                                Previous
                            </Button>
                        </>
                    )}
                    {screenState.screen2 && (
                        <Button
                            disabled={!isNextAvaiableForFileUpload || disableStatus}
                            onClick={navigateToNextScreenFileUpload}
                            colorScheme="gray"
                            bg={'default.toolbarButton'}
                            color={'white'}
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
                            bg={'default.toolbarButton'}
                            color={'white'}
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
