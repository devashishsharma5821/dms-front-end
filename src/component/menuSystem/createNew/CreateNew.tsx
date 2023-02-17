import React, { useState } from 'react';
import './CreateNew.scss';
import { Box, Center, Divider, Flex, Square, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';

import PlusIcont from '../../../assets/icons/PlusIcont';
import { WhiteCollection, WhiteComputeIcon, WhiteDatasetIcon, WhiteExperiment, WhiteNotebookIcon, WhiteWorkflowsIcon } from '../../../assets/icons';
import LeftSideBarMenuCreateProjectModal from '../../modalSystem/LeftSideBarMenuCreateProjectModal';

const CreateNew = (props: any) => {
    const textColor = useColorModeValue('dark.header', 'default.whiteText');
    const headerIconColor = useColorModeValue('black', 'white');
    const createProjectModal = useDisclosure();
    const triggerAction = (type: string) => {
        if (type === 'Compute') {
            props.openCreateModal();
        } else if (type === 'Project') {
            createProjectModal.onOpen();
        }
    };
    const subMenuForCreate = [
        {
            sections: [
                {
                    name: 'Compute',
                    icon: <WhiteComputeIcon color={'#666C80'} />,
                    type: 'icon'
                },
                {
                    name: 'Project',
                    icon: <WhiteCollection color={'#666C80'} />,
                    type: 'icon'
                }
            ]
        },
        {
            sections: [
                {
                    name: 'Dataset',
                    icon: <WhiteDatasetIcon color={'#666C80'} />,
                    type: 'icon'
                },
                {
                    name: 'Experiment',
                    icon: <WhiteExperiment color={'#666C80'} />,
                    type: 'icon'
                }
            ]
        },
        {
            sections: [
                {
                    name: 'Notebook',
                    icon: <WhiteNotebookIcon color={'#666C80'} />,
                    type: 'icon'
                },
                {
                    name: 'Workflow',
                    icon: <WhiteWorkflowsIcon color={'#666C80'} />,
                    type: 'icon'
                }
            ]
        }
    ];
    return (
        <>
            <Flex mt={'1px'}>
                <Square ml={'16px'}>
                    <PlusIcont color={headerIconColor} />
                </Square>

                <Text fontWeight={800} ml={'11px'} color={textColor}>
                    {' '}
                    Create New
                </Text>
            </Flex>
            <Divider mt={'16px'} mb={'10px'} orientation="horizontal" bg={'light.lighterGrayishBlue'} />
            {subMenuForCreate &&
                subMenuForCreate.map((row) => {
                    return (
                        <Flex>
                            {row.sections &&
                                row.sections.map((section) => {
                                    return (
                                        <>
                                            {section.type === 'icon' && (
                                                <Box
                                                    _hover={{ bg: 'default.toolbarButton', color: 'white' }}
                                                    ml={'14px'}
                                                    bg="default.lightGray"
                                                    width={'106px'}
                                                    height="76px"
                                                    mt={'14px'}
                                                    className="sidebar-box"
                                                    borderRadius={'4'}
                                                    onClick={() => triggerAction(section.name)}
                                                >
                                                    <Center mt={'14px'}>{section.icon}</Center>

                                                    <Box textAlign={'center'} mb={'14px'} mt={'4px'} color={'black'}>
                                                        {' '}
                                                        {section.name}{' '}
                                                    </Box>
                                                </Box>
                                            )}
                                        </>
                                    );
                                })}
                            {createProjectModal.isOpen && <LeftSideBarMenuCreateProjectModal isOpen={createProjectModal.isOpen} onClose={createProjectModal.onClose} />}
                        </Flex>
                    );
                })}
        </>
    );
};

export default CreateNew;
