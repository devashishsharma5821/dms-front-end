import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, useColorModeValue, Editable, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList, useDisclosure, AvatarGroup } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../colorModeSwitcher/ColorModeSwitcher';
import { PencilIcon, LogoLight, GridCanvas, LineCanvasLogo, NoneCanvasLogo } from '../../assets/icons';
import HeaderDownArrow from '../../assets/icons/HeaderDownArrow';
import Share from '../modalSystem/Share';
import Settings from '../settings/Settings';
import MyProfileModal from '../modalSystem/MyProfileModal';

import DemandModelingStudio from '../../assets/icons/DemandModelingStudio';
// import ViewData from '../modalSystem/ViewData';
// import NotebookModal from '../modalSystem/NotebookModal';
const Header = (props: any) => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const textColor = useColorModeValue('default.darkBlack', 'default.whiteText');
    const textColor2 = useColorModeValue('default.BlackText', 'default.whiteText');
    const [isExperiment, setIsExperiment] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const settingsModal = useDisclosure();
    const myProfileModal = useDisclosure();
    // const ViewDataModal = useDisclosure();
    // const notebookModal = useDisclosure();
    useEffect(() => {
        const experimentRoute = window.location.pathname.match('experiment');
        if (experimentRoute === null) {
            setIsExperiment(false);
        } else {
            setIsExperiment(true);
        }
    }, [window.location.pathname]);
    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" height={'64px'} pl={'4'} bg={themebg} color={'default.lightText'} width={'auto'}>
            <Center ml={'16px'}>
                <Box>
                    <LogoLight />
                </Box>
                <Box>
                    <DemandModelingStudio />
                </Box>
            </Center>

            {isExperiment && (
                <Center flex={3}>
                    <Text color={'default.headerTitleColor'} mr={'8px'} fontSize={'18'} fontWeight={'500'} line-height={'24px'}>
                        My Project
                    </Text>
                    <Text color={'default.headerTitleColor'} pl={'2'}>
                        /
                    </Text>
                    <Text color={'default.headerTitleLightColor'} pl={'2'} fontSize={'18'} fontWeight={'500'} ml={'8px'} line-height={'24px'}>
                        {' '}
                        My New Experiment
                    </Text>

                    <Editable cursor={'pointer'} ml={'8px'}>
                        <PencilIcon color={'#AFB6C2'} height={'24px'} Height={'24px'} />
                    </Editable>
                </Center>
            )}
            <Center flex="3" mr={5} justifyContent={'flex-end'}>
                {isExperiment && (
                    <>
                        <AvatarGroup size="sm" max={2}>
                            <Avatar borderRadius="full" border={'none'} name={`P G`} />
                            <Avatar borderRadius="full" border={'none'} name={`N l`} />
                        </AvatarGroup>
                        <Box mr={'26px'} ml={'16px'}>
                            <Button
                                onClick={onOpen}
                                color={'light.headerTitleLightColor'}
                                border={'1px'}
                                borderColor={'default.headerButoonBorder'}
                                variant="unstyled"
                                width={'62px'}
                                height={'32px'}
                                borderRadius={4}
                                fontSize={'14px'}
                            >
                                Share
                            </Button>
                            {isOpen && <Share isOpen={isOpen} onClose={onClose}></Share>}
                        </Box>
                    </>
                )}
                <Box mr={'24'}>
                    {' '}
                    <ColorModeSwitcher />
                </Box>
                {isExperiment && (
                    <>
                        <Menu>
                            <MenuButton>
                                <Flex>
                                    <Box>
                                        <GridCanvas color={'#F3F6FA'} />
                                    </Box>
                                    <Box mr={'14px'} ml={'10px'} mt={'10px'}>
                                        <HeaderDownArrow />
                                    </Box>
                                </Flex>

                            </MenuButton>
                            <MenuList borderRadius={'0'} minWidth={'110'} color={textColor} mt={'8'} ml={'-45px'} pt={'0px'} pb={'0px'}>
                                <MenuItem pl={'9px'}>
                                    <GridCanvas color={'#000000'} />
                                    <Text ml={'12'}>Dot</Text>
                                </MenuItem>
                                <MenuItem>
                                    <LineCanvasLogo />
                                    <Text ml={'12'}>Line</Text>
                                </MenuItem>
                                <MenuItem>
                                    <NoneCanvasLogo />
                                    <Text ml={'11'}>None</Text>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </>
                )}
                <Menu>
                    <MenuButton>
                        <Flex>
                            <Box width={'20px'} ml={'12'}>
                                <Avatar borderRadius="full" boxSize="32px" name={`${props.firstName} ${props.lastName}`} bg={'default.userCircleHeaderBg'} color={'default.userCircleHeaderFont'} />
                            </Box>
                            <Box width={'20px'} ml={'22px'} mt={'15px'}>
                                <HeaderDownArrow />
                            </Box>
                        </Flex>

                    </MenuButton>
                    <MenuList width={127} borderRadius={'0'} mt={'10'} ml={'30px'} color={textColor2} pt={'0px'} pb={'0px'}>
                        <MenuItem onClick={myProfileModal.onOpen}>My Profile</MenuItem>

                        <MyProfileModal
                            userDetail={{ firstName: props.firstName, lastName: props.lastName, email: props.email }}
                            isOpen={myProfileModal.isOpen}
                            onClose={myProfileModal.onClose}
                        ></MyProfileModal>
                        <MenuItem onClick={settingsModal.onOpen}>Settings</MenuItem>
                        <Settings isOpen={settingsModal.isOpen} onClose={settingsModal.onClose}></Settings>
                        <MenuItem>Signout</MenuItem>
                        {/* <MenuItem onClick={ViewDataModal.onOpen}>View Data</MenuItem>
                        <ViewData isOpen={ViewDataModal.isOpen} onClose={ViewDataModal.onClose}></ViewData> */}
                        {/* <MenuItem onClick={notebookModal.onOpen}>Notebook</MenuItem> */}
                        {/* <NotebookModal isOpen={notebookModal.isOpen} onClose={notebookModal.onClose}></NotebookModal> */}
                    </MenuList>
                </Menu>
            </Center>
        </Flex>
    );
};

export default Header;
