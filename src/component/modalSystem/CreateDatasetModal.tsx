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
    Avatar
} from '@chakra-ui/react';
import { DownArrowShare } from '../../assets/icons';
import OrIconSmall from '../../assets/icons/OrIconSmall';
import SourceDBFS from '../../assets/icons/SourceDBFS';
import SourceCSV from '../../assets/icons/SourceCSV';
import SourceAzure from '../../assets/icons/SourceAzure';
import SourceDatabricks from '../../assets/icons/SourceDatabricks';

const CreateDataset = (props: any) => {
    const textColor = useColorModeValue('light.header', 'default.whiteText');
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
                <Divider color={'default.dividerColor'} mt={'13px'} mb={'20px'} />
                <Center>
                    <Avatar borderRadius="full" boxSize="32px" name={'1'} bg={'#929AA9'} color={'default.whiteText'} />

                    <Divider orientation="horizontal" maxWidth={'96px'} ml={'16px'} mr={'16px'} />
                    <Avatar borderRadius="full" boxSize="32px" name={'2'} bg={'#929AA9'} color={'default.whiteText'} />
                    <Divider orientation="horizontal" maxWidth={'96px'} ml={'16px'} mr={'16px'} />
                    <Avatar borderRadius="full" boxSize="32px" name={'3'} bg={'#929AA9'} color={'default.whiteText'} />
                </Center>
                <Flex>
                    <Center width={'856px'} bg={boxColor} height={'92px'} mt={'10px'} mb={'40px'} ml={'21px'}>
                        <FormControl isRequired>
                            <Box>
                                <FormLabel htmlFor="existingCompute" fontWeight={600} color={textColor} mt={14} ml={14}>
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
                        <Box mr={'23px'}>
                            {' '}
                            <OrIconSmall />
                        </Box>
                        <Box width={'324px'}>
                            <Text>Create New Project</Text>

                            <Button width={'151px'} height={'36px'} mt={8} mb={14} color={'#2180C2'} bg={'white'} border={'1px'} borderColor={'#2180C2'}>
                                Create Compute
                            </Button>
                        </Box>
                    </Center>
                </Flex>
                <Flex flexDirection={'row'}>
                    <Box>sdfsdf</Box>
                    <Stack direction="row" h="378px" p={4}>
                        <Divider orientation="vertical" />
                    </Stack>
                    <Flex>
                        <Center>
                            <Box>
                                <Text ml={'20px'}>Select Source</Text>

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
                        borderRadius={3}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateDataset;
