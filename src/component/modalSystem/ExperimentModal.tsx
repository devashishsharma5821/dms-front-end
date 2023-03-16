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
    Avatar,
    Input,
    VStack
} from '@chakra-ui/react';
import { CloseIcon, DownArrowShare } from '../../assets/icons';
import OrIconSmall from '../../assets/icons/OrIconSmall';
// import CreateProjectModal from './CreateProjectModal';

const ExperimentModal = (props: any) => {
    const textColor = useColorModeValue('dark.veryDarkGray', 'default.whiteText');
    const projectTitleColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const boxColor = useColorModeValue('#F7FAFC', '#B3B3B3');
    const finalRef = React.useRef(null);
    const [loading] = useState(false);

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
                                    validate={(value: any) => {
                                        let error;
                                        if (value.length === 0) {
                                            error = ' Select here';
                                        }
                                        return error;
                                    }}
                                >
                                    <>
                                        <option>Project 1</option>
                                        <option>Project 2</option>
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
                                //onClick={openCreateProjectModal.onOpen}
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

                            {/* <CreateProjectModal isOpen={openCreateProjectModal.isOpen} onClose={openCreateProjectModal.onClose} /> */}
                        </Box>
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
                                    />{' '}
                                </FormControl>
                                <Flex>
                                    <Center>
                                        <Text color={projectTitleColor} mt={'14'} fontWeight={600}>
                                            Tag:
                                        </Text>
                                        <Text color={'default.toolbarButton'} mt={'20'} ml={20} fontWeight={600}>
                                            + Add Tag
                                        </Text>
                                    </Center>
                                </Flex>
                                <Box ml={14} bg={' #F2F4F8'} height={'24px'} borderRadius={3} minWidth={70}>
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

                                <FormControl isRequired>
                                    <FormLabel htmlFor="existingCompute" color={projectTitleColor} mt={12} fontWeight={600}>
                                        Link To
                                    </FormLabel>
                                    <Select
                                        icon={<DownArrowShare pl={'15px'} color={'#666C80'} />}
                                        borderRadius={3}
                                        width={612}
                                        height={'36px'}
                                        border={'1px'}
                                        borderColor={'light.lighterGrayishBlue'}
                                        as={Select}
                                        id="existingProject"
                                        name="existingProject"
                                        variant="outline"
                                        validate={(value: any) => {
                                            let error;
                                            if (value.length === 0) {
                                                error = ' Select here';
                                            }
                                            return error;
                                        }}
                                    >
                                        <>
                                            <option>Link 1</option>
                                            <option>Link 2</option>
                                        </>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="Description" mt={12} mb={6} color={projectTitleColor} fontWeight={600}>
                                        Description
                                    </FormLabel>
                                    <Input height={97} width={612} borderRadius={3} border={'1px'} borderColor={'light.lighterGrayishBlue'} as={Input} id="DescriptionProjectName" name="Description" />
                                </FormControl>
                            </VStack>
                        </Flex>
                        <Flex mb={'8px'}>
                            <Center>
                                <Text color={projectTitleColor} mt={'46'} fontWeight={600}>
                                    Shared with:
                                </Text>
                                <Text color={'default.toolbarButton'} mt={'46'} ml={20} fontWeight={600}>
                                    + Add Member(s)
                                </Text>
                            </Center>
                        </Flex>
                        <Flex>
                            <Center>
                                <Avatar p={'5px'} borderRadius="full" boxSize="32px" name={`Shirin Bampoori`} color={'default.whiteText'} />
                            </Center>
                        </Flex>
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
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ExperimentModal;
