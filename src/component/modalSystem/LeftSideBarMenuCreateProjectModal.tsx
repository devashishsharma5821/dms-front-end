import React, { useState } from 'react';
import { Button, Divider, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalFooter, useColorModeValue, Center, Flex, Box, useDisclosure } from '@chakra-ui/react';
import { ScratchIcon, TemplateIconCreateProject } from '../../assets/icons';
import CreateProjectModal from './CreateProjectModal';
import OrIconCreateProject from '../../assets/icons/OrIconCreateProject';

const LeftSideBarMenuCreateProjectModal = (props: any) => {
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const finalRef = React.useRef(null);
    const [loading] = useState(false);
    const createProjectModal = useDisclosure();
    const triggerAction = (type: string) => {
        if (type === 'Start from scratch') {
            props.openCreateProjectFromScratch();
        }
    };
    const subMenuForCreateProject = [
        {
            sections: [
                {
                    name: 'Start from scratch',
                    icon: <ScratchIcon />,
                    type: 'icon'
                },
                {
                    name: 'Use a template',
                    icon: <TemplateIconCreateProject />,
                    type: 'icon'
                }
            ]
        }
    ];
    return (
        <Modal closeOnOverlayClick={false} size={'md'} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} isCentered>
            <ModalOverlay />

            <ModalContent width={'491px'}>
                <ModalHeader color={textColor} mt={'13px'} ml={'20px'}>
                    Create Project
                </ModalHeader>
                <ModalCloseButton color={textColor} mr={'10px'} mt={'12px'} />
                <Divider color={'default.dividerColor'} mt={'13px'} mb={'20px'} />

                {subMenuForCreateProject &&
                    subMenuForCreateProject.map((row) => {
                        return (
                            <Flex>
                                {row.sections &&
                                    row.sections.map((section, iconIndex) => {
                                        const lastItemLength = row.sections.length - 1;
                                        if (lastItemLength === iconIndex) {
                                            return (
                                                <>
                                                    {section.type === 'icon' && (
                                                        <Box
                                                            _hover={{ bg: 'default.toolbarButton', color: 'white' }}
                                                            ml={'14px'}
                                                            bg="default.lightGray"
                                                            width={'199px'}
                                                            height="144px"
                                                            mt={'14px'}
                                                            mr={'19px'}
                                                            className="sidebar-box"
                                                            borderRadius={'4'}
                                                            onClick={() => triggerAction(section.name)}
                                                        >
                                                            <Center mt={'43px'}>{section.icon}</Center>

                                                            <Box textAlign={'center'} mb={'39px'} mt={'16px'} color={'black'}>
                                                                {' '}
                                                                {section.name}{' '}
                                                            </Box>
                                                        </Box>
                                                    )}
                                                </>
                                            );
                                        } else {
                                            return (
                                                <>
                                                    {section.type === 'icon' && (
                                                        <Box
                                                            _hover={{ bg: 'default.toolbarButton', color: 'white' }}
                                                            ml={'19px'}
                                                            bg="default.lightGray"
                                                            width={'199px'}
                                                            height="144px"
                                                            mt={'14px'}
                                                            mr={'9px'}
                                                            className="sidebar-box"
                                                            borderRadius={'4'}
                                                            onClick={() => triggerAction(section.name)}
                                                        >
                                                            <Center mt={'43px'}>{section.icon}</Center>

                                                            <Box textAlign={'center'} mb={'39px'} mt={'16px'} color={'black'}>
                                                                {' '}
                                                                {section.name}{' '}
                                                            </Box>
                                                        </Box>
                                                    )}{' '}
                                                    <Box mt={'16px'}>{subMenuForCreateProject[0].sections[0].name === 'Start from scratch' && <OrIconCreateProject />}</Box>
                                                </>
                                            );
                                        }
                                    })}
                            </Flex>
                        );
                    })}

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

export default LeftSideBarMenuCreateProjectModal;
