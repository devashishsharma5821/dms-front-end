import React from 'react';
import { Box, Flex, Divider, useColorModeValue, Center, VStack } from '@chakra-ui/react';
import {
    CreateIcon,
    WhiteHome,
    WhiteRecentIcon,
    WhiteExperiment,
    WhiteCollection,
    WhiteComputeIcon,
    WhiteDatasetIcon,
    WhiteNotebookIcon,
    WhiteArtifactsIcon,
    WhiteWorkflowsIcon,
    WhiteDocumentationIcon,
    WhiteResourceCenterIcon,
    WhiteInfoIcon,
    WhiteSettingIcon,
    WhiteFluentIcon
} from '../../assets/icons';
const SideBarMenu = () => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const sideBarMenuIcons = [
        {
            section: [
                {
                    icon: <CreateIcon />,
                    iconName: 'Create'
                },
                {
                    icon: <WhiteHome />,
                    iconName: 'Home'
                },
                {
                    icon: <WhiteRecentIcon />,
                    iconName: 'Recent'
                },
                {
                    icon: <WhiteExperiment />,
                    iconName: 'Experiment'
                },
                {
                    icon: <WhiteCollection />,
                    iconName: 'Collection'
                },
                {
                    icon: <WhiteComputeIcon />,
                    iconName: 'Compute'
                },
                {
                    icon: <WhiteDatasetIcon />,
                    iconName: 'Dataset'
                }
            ]
        },
        {
            section: [
                {
                    icon: <WhiteNotebookIcon />,
                    iconName: 'Notebook'
                },
                {
                    icon: <WhiteArtifactsIcon />,
                    iconName: 'Artifacts'
                },
                {
                    icon: <WhiteWorkflowsIcon />,
                    iconName: 'Workflows'
                }
            ]
        },
        {
            section: [
                {
                    icon: <WhiteDocumentationIcon />,
                    iconName: 'Documentation'
                },
                {
                    icon: <WhiteResourceCenterIcon />,
                    iconName: 'ResourceCenter'
                },
                {
                    icon: <WhiteInfoIcon />,
                    iconName: 'Info'
                },
                {
                    icon: <WhiteSettingIcon />,
                    iconName: 'Setting'
                }
            ]
        },
        {
            section: [
                {
                    icon: <WhiteFluentIcon />,
                    iconName: 'Fluent'
                }
            ]
        }
    ];

    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" ml="15" mr="15" bg={themebg} color={'default.lightText'}>
            <VStack>
                <Box>
                    {sideBarMenuIcons.map((sections, sectionIndex) => {
                        const lastItemLength = sections.section.length - 1;
                        const listSections = sections.section.map((icons, iconIndex) => {
                            if (lastItemLength === iconIndex) {
                                return (
                                    <>
                                        <Box mt="17">{icons.icon}</Box>
                                        <Center>
                                            <Divider mt="17" orientation="horizontal" bg={'dark.borderColor'} />
                                        </Center>
                                    </>
                                );
                            } else {
                                return <Box mt="17">{icons.icon}</Box>;
                            }
                        });

                        return listSections;
                    })}
                </Box>
            </VStack>
        </Flex>
    );
};

export default SideBarMenu;
