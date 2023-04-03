import React, { useEffect, useMemo } from 'react';

import { Box, Flex, Divider, useColorModeValue, Center, VStack, Square, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import sideBarMenuIcons from '../../models/sideBarMenuData';
import './SideBarMenu.scss';
import { CreateIcon, WideCreateIcon } from '../../assets/icons';
import CreateNew from '../menuSystem/createNew/CreateNew';
import Recent from '../menuSystem/recent/Recent';
import Help from '../menuSystem/help/Help';
import Explorer from '../menuSystem/explorer/Explorer';
import ComputeJsonModal from '../modalSystem/ComputeJsonModal';
import LeftSideBarMenuCreateProjectModal from '../modalSystem/LeftSideBarMenuCreateProjectModal';
import CreateProjectModal from '../modalSystem/CreateProjectModal';
import useAppStore from '../../store';
import { getAndUpdateDbSettingsData } from '../../zustandActions/computeActions';
import CreateDatasetModal from '../modalSystem/CreateDatasetModal';
import { updateSpinnerInfo } from '../../zustandActions/commonActions';
import ExperimentModal from '../modalSystem/ExperimentModal';
import { getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import ProjectDetailsMenu from '../menuSystem/explorer/projectDetailsMenu/projectDetailsMenu';

const SideBarMenu = () => {
    const [dbSettingsData] = useAppStore((state: any) => [state.dbSettingsData]);
    const themebg = useColorModeValue('light.header', 'dark.header');
    const themeSecondLevel = useColorModeValue('default.whiteText', 'dark.bgDark');
    const [isHovering, setIsHovering] = React.useState(false);
    const [activateSubMenu, setActivateSubMenu] = React.useState(false);
    const [activateThirdSubMenu, setActivateThirdSubMenu] = React.useState(false);
    const zIndexStyle = useMemo(() => ({ zIndex: '1' }), []);
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const createComputeModal = useDisclosure();
    const createProjectFromModal = useDisclosure();
    const createProjectModal = useDisclosure();
    const createDatasetModal = useDisclosure();
    const createExperimentModal = useDisclosure();
    const navigate = useNavigate();
    const hoverIn = () => {
        setIsHovering(true);
    };
    const hoverOut = () => {
        // Turn Off the Sub Menu
        if (!activateSubMenu && !activateThirdSubMenu) {
            setActivateSubMenu(false);
            setActivateThirdSubMenu(false);
            setIsHovering(false);
        }
    };
    const hoverInThirdSubMenu = () => {
        setActivateThirdSubMenu(true);
        setActivateSubMenu(true);
        setIsHovering(true);
    };
    const hoverOutThirdSubMenu = () => {
        setActivateThirdSubMenu(false);
        setActivateSubMenu(false);
        setIsHovering(false);
    };
    const hoverInSubMenu = () => {
        setActivateSubMenu(true);
        setIsHovering(true);
    };
    const hoverOutSubMenu = () => {
        setActivateSubMenu(false);
        setIsHovering(false);
    };
    const hasThirdLevelMenu = (projectId: string) => {
        updateSpinnerInfo(true);
        getAndUpdateSingleProjectData(projectId as string);
        setActivateThirdSubMenu(true);
    };
    const checkForSubMenuOrNavigation = (data: any, index: any) => {
        if (!data.disabled) {
            if (data.route) {
                sideBarMenuIcons[0].section[currentIndex].isClicked = false;
                navigate(data.route);
            } else if (data.hasSubMenu) {
                // Turn on the Sub Menu
                //data.isClicked = true;
                sideBarMenuIcons[0].section[currentIndex].isClicked = false;
                setCurrentIndex(index);
                sideBarMenuIcons[0].section[index].isClicked = true;
                setActivateSubMenu(true);
            }
        }
    };

    const triggerCreateModal = (type: string) => {
        if (type === 'compute') {
            if (!dbSettingsData.length) {
                updateSpinnerInfo(true);
                const check = getAndUpdateDbSettingsData();
                check.then((data: any) => {
                    data && createComputeModal.onOpen();
                });
            } else {
                createComputeModal.onOpen();
            }
        } else if (type === 'projectFrom') {
            createProjectFromModal.onOpen();
        } else if (type === 'dataset') {
            createDatasetModal.onOpen();
        } else if (type === 'experiment') {
            createExperimentModal.onOpen();
        }
    };
    const thirdLevelMenu = () => {
        return (
            <div style={{ ...zIndexStyle, position: 'absolute', marginLeft: '464px', border: ' 1px solid #D8DCDE' }} id="mySidebar" onMouseOver={hoverInThirdSubMenu} onMouseOut={hoverOutThirdSubMenu}>
                <Flex h={'100vh'} overflow={'hidden'} as="nav" justify="space-between" wrap="wrap" bg={themeSecondLevel}>
                    <VStack>
                        <Box width={'254px'} pl={'0px'} mt="17">
                            <h3>
                                <ProjectDetailsMenu />
                            </h3>
                        </Box>
                    </VStack>
                </Flex>
            </div>
        );
    };
    const secondLevelMenu = () => {
        return (
            <div
                style={{ ...zIndexStyle, position: 'absolute', zIndex: '100', marginLeft: '208px', border: ' 1px solid #D8DCDE' }}
                id="mySidebar"
                onMouseOver={hoverInSubMenu}
                onMouseOut={hoverOutSubMenu}
            >
                <Flex h={'100vh'} overflow={'hidden'} as="nav" justify="space-between" wrap="wrap" bg={themeSecondLevel}>
                    <VStack>
                        {sideBarMenuIcons[0].section[currentIndex].isClicked && (
                            <Box width={'254px'} pl={'0px'} mt="17">
                                {sideBarMenuIcons[0].section[currentIndex].iconName === 'Create' && (
                                    <h3>
                                        <CreateNew openCreateModal={(type: string) => triggerCreateModal(type)} />
                                    </h3>
                                )}
                                {sideBarMenuIcons[0].section[currentIndex].iconName === 'Recent' && (
                                    <h3>
                                        <Recent />
                                    </h3>
                                )}
                                {sideBarMenuIcons[0].section[currentIndex].iconName === 'Explorer' && (
                                    <h3>
                                        <Explorer hasThirdLevelMenu={hasThirdLevelMenu} />
                                    </h3>
                                )}
                                {sideBarMenuIcons[0].section[currentIndex].iconName === 'Help' && (
                                    <h3>
                                        <Help />
                                    </h3>
                                )}
                            </Box>
                        )}
                    </VStack>
                </Flex>
            </div>
        );
    };
    const openCreateProjectFromScratch = () => {
        createProjectFromModal.onClose();
        createProjectModal.onOpen();
    };
    const onCreateProjectSuccess = () => {
        createProjectModal.onClose();
    };
    return (
        <Flex>
            <>
                <div style={{ ...zIndexStyle, position: 'absolute' }} id="mySidebar" onMouseOver={hoverIn} onMouseOut={hoverOut}>
                    <Flex h={'100vh'} overflow={'hidden'} className={''} as="nav" justify="space-between" wrap="wrap" bg={themebg} color={'default.lightText'}>
                        <VStack>
                            {!isHovering && (
                                <Box ml="6" mr="6" mt="30">
                                    {/* <Box width={'38px'} height={'40px'}>
                                    <Square>
                                        <CreateIcon />
                                    </Square>
                                </Box>  */}
                                    {sideBarMenuIcons.map((sections, sectionIndex) => {
                                        const lastItemLength = sections.section.length - 1;
                                        const listSections = sections.section.map((icons, iconIndex) => {
                                            if (icons.iconName === 'Create') {
                                                return (
                                                    <Box key={iconIndex} width={'38px'} height={'40px'} cursor="pointer">
                                                        <Square>
                                                            <CreateIcon />
                                                        </Square>
                                                    </Box>
                                                );
                                            }
                                            if (lastItemLength === iconIndex) {
                                                return (
                                                    <div key={iconIndex}>
                                                        <Box m={'8px auto'} pt={'20%'} width={'38px'} height={'40px'} cursor="pointer">
                                                            <Square>{icons.icon}</Square>
                                                        </Box>
                                                        <Center>
                                                            <Divider orientation="horizontal" bg={'dark.borderColor'} />
                                                        </Center>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <Box key={iconIndex} m={'8px auto'} width={'38px'} pt={'20%'} height={'40px'} cursor="pointer">
                                                        <Square>{icons.icon}</Square>
                                                    </Box>
                                                );
                                            }
                                        });

                                        return listSections;
                                    })}
                                </Box>
                            )}
                            {isHovering && (
                                <Box width="212px" mt="30">
                                    {/* <Box width={'200px'} ml={'6px'} mr={'6px'} height={'40px'} mb={'9px'}>
                                    <Square>
                                        <WideCreateIcon />
                                    </Square>
                                </Box> */}
                                    {sideBarMenuIcons.map((sections, sectionIndex) => {
                                        const lastItemLength = sections.section.length - 1;
                                        const listSections = sections.section.map((icons, iconIndex) => {
                                            if (icons.iconName === 'Create') {
                                                return (
                                                    <Box
                                                        key={iconIndex}
                                                        onClick={() => {
                                                            checkForSubMenuOrNavigation(icons, iconIndex);
                                                        }}
                                                        width={'200px'}
                                                        ml={'6px'}
                                                        mr={'6px'}
                                                        height={'40px'}
                                                        mb={'9px'}
                                                        cursor={icons.disabled ? 'not-allowed' : 'pointer'}
                                                    >
                                                        <Square>
                                                            <WideCreateIcon />
                                                        </Square>
                                                    </Box>
                                                );
                                            }
                                            if (lastItemLength === iconIndex) {
                                                return (
                                                    <div key={iconIndex}>
                                                        <Flex
                                                            _hover={{ bg: '#3C414B', mr: '6px', borderRadius: '2px' }}
                                                            align="center"
                                                            ml={'6px'}
                                                            justify="left"
                                                            onClick={() => {
                                                                checkForSubMenuOrNavigation(icons, iconIndex);
                                                            }}
                                                            className={'sidebar'}
                                                        >
                                                            <Box cursor={icons.disabled ? 'not-allowed' : 'pointer'} m={'8px 8px'} width={'30px'} height={'32px'}>
                                                                <Square>{icons.icon}</Square>
                                                            </Box>
                                                            <Box
                                                                cursor={icons.disabled ? 'not-allowed' : 'pointer'}
                                                                pl={'6px'}
                                                                fontSize={'14px'}
                                                                m={'8px 0px'}
                                                                width={'30px'}
                                                                height={'32px'}
                                                                color-={'default.iconNameColor'}
                                                            >
                                                                <Square className="text">{icons.iconName}</Square>
                                                            </Box>
                                                        </Flex>
                                                        <Center>
                                                            <Divider mb={'8px'} ml={'8px'} mr={'8px'} mt={'8px'} orientation="horizontal" bg={'dark.borderColor'} />
                                                        </Center>
                                                    </div>
                                                );
                                            } else {
                                                return (
                                                    <Flex
                                                        _hover={{ bg: '#3C414B', mr: '6px', borderRadius: '2px' }}
                                                        align="center"
                                                        justify="left"
                                                        ml={'6px'}
                                                        onClick={() => {
                                                            checkForSubMenuOrNavigation(icons, iconIndex);
                                                        }}
                                                        className={'sidebar'}
                                                        key={iconIndex}
                                                    >
                                                        <Box m={'8px 8px'} width={'30px'} height={'32px'} cursor={icons.disabled ? 'not-allowed' : 'pointer'}>
                                                            <Square>{icons.icon}</Square>
                                                        </Box>
                                                        <Box
                                                            cursor={icons.disabled ? 'not-allowed' : 'pointer'}
                                                            pl={'6px'}
                                                            fontSize={'14px'}
                                                            m={'8px 0px'}
                                                            width={'30px'}
                                                            height={'32px'}
                                                            color-={'default.iconNameColor'}
                                                        >
                                                            <Square className="text">{icons.iconName}</Square>
                                                        </Box>
                                                    </Flex>
                                                );
                                            }
                                        });

                                        return listSections;
                                    })}
                                </Box>
                            )}
                        </VStack>{' '}
                    </Flex>
                </div>
                {activateSubMenu && secondLevelMenu()}
                {activateThirdSubMenu && thirdLevelMenu()}
                {createComputeModal.isOpen && <ComputeJsonModal isOpen={createComputeModal.isOpen} onClose={createComputeModal.onClose} />}
                {createDatasetModal.isOpen && <CreateDatasetModal isOpen={createDatasetModal.isOpen} onClose={createDatasetModal.onClose} />}
                {createExperimentModal.isOpen && <ExperimentModal isOpen={createExperimentModal.isOpen} onClose={createExperimentModal.onClose} />}
                {createProjectFromModal.isOpen && (
                    <LeftSideBarMenuCreateProjectModal
                        isOpen={createProjectFromModal.isOpen}
                        onClose={createProjectFromModal.onClose}
                        openCreateProjectFromScratch={openCreateProjectFromScratch}
                    />
                )}
                {createProjectModal.isOpen && (
                    <CreateProjectModal
                        isOpen={createProjectModal.isOpen}
                        onClose={createProjectModal.onClose}
                        onSuccess={onCreateProjectSuccess}
                        isEdit={{ status: false, data: {}, usersData: [] }}
                    />
                )}
            </>
        </Flex>
    );
};

export default SideBarMenu;
