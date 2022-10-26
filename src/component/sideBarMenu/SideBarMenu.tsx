import React from 'react';
import { Box, Flex, Divider, useColorModeValue, Center, VStack } from '@chakra-ui/react';
import { Link as Routelink } from 'react-router-dom';
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
                    iconName: 'Create',
                    route: '/project'
                },
                {
                    icon: <WhiteHome />,
                    iconName: 'Home',
                    route: '/notfound'
                },
                {
                    icon: <WhiteRecentIcon />,
                    iconName: 'Recent',
                    route: '/notfound'
                },
                {
                    icon: <WhiteExperiment />,
                    iconName: 'Experiment',
                    route: '/notfound'
                },
                {
                    icon: <WhiteCollection />,
                    iconName: 'Collection',
                    route: '/notfound'
                },
                {
                    icon: <WhiteComputeIcon />,
                    iconName: 'Compute',
                    route: '/compute'
                },
                {
                    icon: <WhiteDatasetIcon />,
                    iconName: 'Dataset',
                    route: '/notfound'
                }
            ]
        },
        {
            section: [
                {
                    icon: <WhiteNotebookIcon />,
                    iconName: 'Notebook',
                    route: '/notebook'
                },
                {
                    icon: <WhiteArtifactsIcon />,
                    iconName: 'Artifacts',
                    route: '/notfound'
                },
                {
                    icon: <WhiteWorkflowsIcon />,
                    iconName: 'Workflows',
                    route: '/notfound'
                }
            ]
        },
        {
            section: [
                {
                    icon: <WhiteDocumentationIcon />,
                    iconName: 'Documentation',
                    route: '/notfound'
                },
                {
                    icon: <WhiteResourceCenterIcon />,
                    iconName: 'ResourceCenter',
                    route: '/notfound'
                },
                {
                    icon: <WhiteInfoIcon />,
                    iconName: 'Info',
                    route: '/notfound'
                },
                {
                    icon: <WhiteSettingIcon />,
                    iconName: 'Setting',
                    route: '/notfound'
                }
            ]
        },
        {
            section: [
                {
                    icon: <WhiteFluentIcon />,
                    iconName: 'Fluent',
                    route: '/notfound'
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
                                        <Routelink to={icons.route}>
                                            <Box mt="17">{icons.icon}</Box>
                                        </Routelink>
                                        <Center>
                                            <Divider mt="17" orientation="horizontal" bg={'dark.borderColor'} />
                                        </Center>
                                    </>
                                );
                            } else {
                                return (
                                    <Routelink to={icons.route}>
                                        <Box mt="17">{icons.icon}</Box>
                                    </Routelink>
                                );
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
