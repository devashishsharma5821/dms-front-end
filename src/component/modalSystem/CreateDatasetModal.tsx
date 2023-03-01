import React, { useState } from 'react';
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
    VStack
} from '@chakra-ui/react';
import { CloseIcon, DownArrowShare } from '../../assets/icons';
import OrIconSmall from '../../assets/icons/OrIconSmall';
import SourceDBFS from '../../assets/icons/SourceDBFS';
import SourceCSV from '../../assets/icons/SourceCSV';
import SourceAzure from '../../assets/icons/SourceAzure';
import SourceDatabricks from '../../assets/icons/SourceDatabricks';
import { Field, Formik } from 'formik';

const CreateDataset = (props: any) => {
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const datasetTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');

    const boxColor = useColorModeValue('#F7FAFC', '#B3B3B3');
    const finalRef = React.useRef(null);
    const [loading] = useState(false);
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
                        <Avatar borderRadius="full" boxSize="32px" name={'1'} bg={'#929AA9'} color={'default.whiteText'} mb={'8px'} />
                        <Text ml={'-8px'}>Details</Text>
                    </Box>
                    <Divider orientation="horizontal" maxWidth={'96px'} mr={'16px'} mt={'-12px'} />
                    <Box>
                        <Avatar borderRadius="full" boxSize="32px" name={'2'} bg={'#929AA9'} color={'default.whiteText'} mb={'8px'} />
                        <Text ml={'-8px'}>Source</Text>
                    </Box>
                    <Divider orientation="horizontal" maxWidth={'96px'} mr={'16px'} mt={'-12px'} />
                    <Box>
                        <Avatar borderRadius="full" boxSize="32px" name={'3'} bg={'#929AA9'} color={'default.whiteText'} mb={'8px'} />
                        <Text ml={'-8px'}> Preview</Text>
                    </Box>
                </Center>
                <Flex>
                    <Center width={'856px'} bg={boxColor} height={'92px'} mt={'10px'} mb={'21px'} ml={'21px'}>
                        <FormControl isRequired>
                            <Box>
                                <FormLabel htmlFor="existingCompute" fontWeight={600} color={datasetTitleColor} mt={14} ml={14}>
                                    Project Name
                                </FormLabel>
                                <Select
                                    icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                    borderRadius={3}
                                    width={'381px'}
                                    mb={14}
                                    ml={14}
                                    border={'1px'}
                                    borderColor={'#D8DCDE'}
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
                            <Text fontWeight={600} color={datasetTitleColor} mb={'-14px'}>
                                Create New Project
                            </Text>

                            <Button width={'127px'} height={'36px'} mt={18} color={'#2180C2'} bg={'white'} border={'1px'} borderColor={'#2180C2'}>
                                Create Compute
                            </Button>
                        </Box>
                    </Center>
                </Flex>
                <Flex flexDirection={'row'}>
                    <Box width={'55%'} ml={'21'}>
                        <Flex mb={'19px'}>
                            <Text fontWeight={600} color={datasetTitleColor}>
                                Dataset ID:
                            </Text>
                            <Text fontWeight={400} color={textColor} ml={'8px'}>
                                f8iEY4
                            </Text>
                        </Flex>

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
                                        <FormLabel htmlFor="datasetName" fontWeight={600} mb={6} color={datasetTitleColor}>
                                            Dataset Name
                                        </FormLabel>
                                        <Field
                                            width={486}
                                            borderRadius={3}
                                            border={'1px'}
                                            borderColor={'#D8DCDE'}
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

                                        <FormLabel htmlFor="Description" fontWeight={600} mt={20} mb={6} color={datasetTitleColor}>
                                            Description
                                        </FormLabel>
                                        <Field height={100} width={486} borderRadius={3} border={'1px'} borderColor={'#D8DCDE'} as={Input} id="DescriptionDatasetName" name="Description" />
                                    </FormControl>
                                </VStack>
                            </Formik>
                        </Flex>
                        <Flex>
                            <Center>
                                <Text fontWeight={600} color={datasetTitleColor} mt={'20'}>
                                    Tag:
                                </Text>
                                <Center>
                                    <Box ml={14} mt={16} bg={' #F2F4F8'} height={'24px'} borderRadius={3} minWidth={70}>
                                        <Flex>
                                            <Center>
                                                <Text color={'#1A3F59'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                    Demo
                                                </Text>
                                                <Box justifyContent={'flex-end'} ml={'14px'}>
                                                    <CloseIcon color={'black'} />
                                                </Box>
                                            </Center>
                                        </Flex>
                                    </Box>
                                </Center>
                                <Text color={'#2180C2'} mt={'20'} ml={20}>
                                    + Add Tag
                                </Text>
                            </Center>
                        </Flex>
                        <Flex mb={'21px'}>
                            <Center>
                                <Text fontWeight={600} color={datasetTitleColor} mt={'20'}>
                                    Shared with:
                                </Text>
                                <Center>
                                    <Box ml={14} mt={16} bg={'default.tagBoxColor'} height={'24px'} borderRadius={3} minWidth={'auto'} width={'auto'}>
                                        <Flex>
                                            <Center>
                                                <Text color={'default.userCircleHeaderFont'} fontSize={'14px'} mt={'2px'} ml={6}>
                                                    SB
                                                </Text>
                                                <Box justifyContent={'flex-end'} ml={'14px'} mr={'6px'}>
                                                    <CloseIcon color={'#666C80'} />
                                                </Box>
                                            </Center>
                                        </Flex>
                                    </Box>
                                </Center>

                                <Text cursor={'pointer'} color={'default.shareModalButton'} mt={'20'} ml={'8px'}>
                                    + Add Member(s)
                                </Text>
                            </Center>
                        </Flex>
                        <Flex>
                            <Center>
                                <Avatar p={'5px'} borderRadius="full" boxSize="42px" name={`Shirin Bampoori`} color={'default.whiteText'} />
                            </Center>
                        </Flex>
                    </Box>

                    <Stack direction="row" h="378px" p={4}>
                        <Divider orientation="vertical" />
                    </Stack>
                    <Flex mt={-86}>
                        <Center>
                            <Box>
                                <Text ml={'20px'} fontWeight={600} color={datasetTitleColor}>
                                    Select Source
                                </Text>

                                {sorceSelectDataset?.map((row) => {
                                    return (
                                        <Flex flexDirection={'row'} key={'DatasetModal'}>
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
                                                                >
                                                                    <Center mt={'35px'}>{section.icon}</Center>

                                                                    <Box textAlign={'center'} mb={'14px'} mt={'4px'} color={'black'}>
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
                <Divider color={'default.dividerColor'} mt={'26px'} width={'auto'} />
                <ModalFooter mb={'18px'} mt={'21px'} mr={'20px'}>
                    <Button
                        disabled={loading}
                        onClick={props.onClose}
                        colorScheme="gray"
                        bg={'white'}
                        color={'#2180C2'}
                        width={'81px'}
                        border={'1px'}
                        borderColor={'#2180C2'}
                        height={'40px'}
                        borderRadius={4}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={loading}
                        onClick={props.onClose}
                        colorScheme="gray"
                        bg={'white'}
                        color={'#2180C2'}
                        width={'81px'}
                        border={'1px'}
                        borderColor={'#2180C2'}
                        height={'40px'}
                        borderRadius={4}
                        ml={'20px'}
                    >
                        Next
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateDataset;
