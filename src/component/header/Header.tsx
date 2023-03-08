import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, useColorModeValue, Editable, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList, useDisclosure, AvatarGroup } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../colorModeSwitcher/ColorModeSwitcher';
import { DownArrow, PencilIcon, LogoLight, GridCanvas, LineCanvasLogo, NoneCanvasLogo } from '../../assets/icons';
import Share from '../modalSystem/Share';
import Settings from '../settings/Settings';
import MyProfileModal from '../modalSystem/MyProfileModal';
// import ViewData from '../modalSystem/ViewData';
// import NotebookModal from '../modalSystem/NotebookModal';
const Header = (props: any) => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const [isExperiment, setIsExperiment] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const settingsModal = useDisclosure();
    const myProfileModal = useDisclosure();
    // const ViewDataModal = useDisclosure();
    // const notebookModal = useDisclosure();
    useEffect(() => {
        console.log(window.location);
        console.log(window.location.pathname.match('experiment'));
        const experimentRoute = window.location.pathname.match('experiment');
        if (experimentRoute === null) {
            setIsExperiment(false);
        } else {
            setIsExperiment(true);
        }
    }, [window.location]);
    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" height={'44px'} pl={'4'} bg={themebg} color={'default.lightText'}>
            <Box flex="3" ml={'16px'} mt={'7px'} mb={'7px'}>
                <LogoLight />
            </Box>
            {isExperiment && (
                <Center flex="3">
                    <Text color={'default.lightGrayHeader'} mr={'8px'} fontSize={'18'} fontWeight={'400'} fontStyle={'normal'}>
                        Project Name
                    </Text>
                    <Text color={'default.lightGrayHeader'} pl={'2'}>
                        /
                    </Text>
                    <Text color={'default.whiteText'} pl={'2'} fontSize={'18'} fontWeight={'700'} fontStyle={'normal'} ml={'8px'}>
                        {' '}
                        My New Experiment
                    </Text>

                    <Editable pl={'10'} defaultValue="Take some chakra" cursor={'pointer'}>
                        <PencilIcon color={'#A3B4D1'} height={'18px'} width={'18px'} />
                    </Editable>
                </Center>
            )}
            <Center flex="3" mr={5} justifyContent={'flex-end'}>
                {isExperiment && (
                    <>
                        <AvatarGroup size="sm" max={2}>
                            <Avatar borderRadius="full" name={`P G`} />
                            <Avatar borderRadius="full" name={`N l`} />
                        </AvatarGroup>
                        <Box pl={'6'} pr={'6'}>
                            <Button onClick={onOpen} colorScheme="default.lightGrayHeader" variant="outline" width={'62px'} height={'28px'} borderRadius={3}>
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
                        <Box>
                            <GridCanvas />
                        </Box>

                        <Menu>
                            <MenuButton>
                                <Box mr={'34'} ml={'14'}>
                                    <DownArrow color={'#A3B4D1'} />
                                </Box>
                            </MenuButton>
                            <MenuList borderRadius={'0'} width={'110'} color={textColor} mt={'8'} ml={'-66px'}>
                                <MenuItem>
                                    <GridCanvas />
                                    <Text ml={'12'}>Dot</Text>
                                </MenuItem>
                                <MenuItem>
                                    <LineCanvasLogo />
                                    <Text ml={'12'}>Line</Text>
                                </MenuItem>
                                <MenuItem>
                                    <NoneCanvasLogo />
                                    <Text ml={'12'}>None</Text>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </>
                )}
                <Avatar borderRadius="full" boxSize="32px" name={`${props.firstName} ${props.lastName}`} bg={'default.userCircleHeaderBg'} color={'default.userCircleHeaderFont'} />
                <Menu>
                    <MenuButton>
                        <Box ml={'12'} mr={'23'}>
                            <DownArrow color={'#A3B4D1'} />
                        </Box>
                    </MenuButton>
                    <MenuList width={127} borderRadius={'0'} mr={'18'} mt={'10'} color={textColor}>
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
