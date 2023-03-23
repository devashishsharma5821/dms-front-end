import React, { useEffect, FC } from 'react';
import {
    Box,
    Flex,
    Text,
    useColorModeValue,
    Button,
    Center,
    Avatar,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    FormControl,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Modal,
    Divider,
    Link,
    createStandaloneToast
} from '@chakra-ui/react';
import { MultiSelect } from 'chakra-multiselect';
import { DownArrowShare, LinkChain } from '../../assets/icons';
import { ShareCreate, ShareCreateDetail, ShareDelete, ShareDeleteDetail } from '../../models/share';
import useAppStore from '../../store';
import { DMSAccessLevel, GetAllUsersDataAppStoreState } from '../../models/profile';
import { getAndUpdateAllUsersData, updateSpinnerInfo } from '../../zustandActions/commonActions';
import client from '../../apollo-client';
import { createAccess, deleteAccess } from '../../query';
import { useParams } from 'react-router-dom';
import { getAndUpdateAllProjectsData, getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import { GetSingleProjectAppStoreState } from '../../models/project';
import { getFormattedUserData } from '../../utils/common.utils';
import { getToastOptions } from '../../models/toastMessages';

const Share = (props: any) => {
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const bgColorForBadges = useColorModeValue('light.badge', 'dark.badge');
    const colorForBadges = useColorModeValue('default.whiteText', 'default.blackText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const defaultInBoxTextColor = useColorModeValue('default.defaultTextColorInBox', 'default.veryLightGrayTextColor');
    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);
    const [selectedUser, setSelectedUser] = React.useState('');
    const [accessUserList, setAccessUserList] = React.useState<any>([]);
    const [AllUsersData] = useAppStore((state: GetAllUsersDataAppStoreState) => [state.AllUsersData]);
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const params = useParams();
    const userOptions = AllUsersData?.map((user) => ({ label: user.email, value: user.email }));
    const [userValue, setUserValue] = React.useState([]);
    const { toast } = createStandaloneToast();
    useEffect(() => {
        if (props.retainData?.length > 0) {
            setAccessUserList(props.retainData);
        }
        if (props.isEdit) {
            setAccessUserList([]);
            updateSpinnerInfo(true);
            if (SingleProjectData === null) {
                getAndUpdateSingleProjectData(params.projectId as string);
            } else {
                updateSpinnerInfo(false);
                if (SingleProjectData.project_access === null || SingleProjectData.project_access.length === 0) {
                    setAccessUserList([]);
                    setUserValue([]);
                } else {
                    if (AllUsersData && SingleProjectData) {
                        const userList = getFormattedUserData(AllUsersData, SingleProjectData);
                        setAccessUserList(userList);
                    }
                }
            }
        }
    }, [SingleProjectData]);

    useEffect(() => {
        updateSpinnerInfo(true);
        if (AllUsersData === null) {
            const variablesForAllUsers = { isActive: true, pageNumber: 1, limit: 9999, searchText: '' };
            getAndUpdateAllUsersData(variablesForAllUsers);
        } else {
            updateSpinnerInfo(false);
        }
    }, [AllUsersData]);

    const handleUserChange = (ev: any) => {
        setUserValue(ev);
    };
    const accessMenuChanged = (access: any, type: string) => {
        const user = AllUsersData?.filter((singleUser) => {
            return singleUser.email === access.email;
        });
        updateSpinnerInfo(true);
        if (type === 'delete') {
            const removeVariable = {
                userId: user![0].userId,
                projectId: params.projectId
            };
            client
                .mutate<ShareDelete<ShareDeleteDetail>>({
                    mutation: deleteAccess(removeVariable)
                })
                .then(() => {
                    toast(getToastOptions(`Access removed Successfully`, 'success'));
                    getAndUpdateSingleProjectData(params.projectId as string);
                    updateSpinnerInfo(false);
                })
                .catch((err) => {
                    updateSpinnerInfo(false);
                    toast(getToastOptions(`${err}`, 'error'));
                });
        } else if (type === 'canEdit') {
            const mutationVariable = {
                access: [
                    {
                        user_id: user![0].userId,
                        access_level: DMSAccessLevel[1]
                    }
                ],
                project_id: params.projectId
            };
            client
                .mutate<ShareCreate<ShareCreateDetail>>({
                    mutation: createAccess(),
                    variables: { input: mutationVariable }
                })
                .then(() => {
                    toast(getToastOptions(`Project Permission Changed Successfully`, 'success'));
                    getAndUpdateSingleProjectData(params.projectId as string);
                    updateSpinnerInfo(false);
                })
                .catch((err) => {
                    updateSpinnerInfo(false);
                    toast(getToastOptions(`${err}`, 'error'));
                });
        }
    };

    const handleShare = () => {
        if (props.isEdit) {
            updateSpinnerInfo(true);
            const mutationVariable = {
                access: userValue.map((selUserEmail) => {
                    const sharedUser = AllUsersData?.filter((singleUser) => {
                        return singleUser.email === selUserEmail;
                    });
                    return {
                        user_id: sharedUser![0].userId,
                        access_level: DMSAccessLevel[0]
                    };
                }),
                project_id: params.projectId
            };
            client
                .mutate<ShareCreate<ShareCreateDetail>>({
                    mutation: createAccess(),
                    variables: { input: mutationVariable }
                })
                .then(() => {
                    toast(getToastOptions(`Project Shared Successfully`, 'success'));
                    getAndUpdateSingleProjectData(params.projectId as string);
                    getAndUpdateAllProjectsData();
                    setUserValue([]);
                    updateSpinnerInfo(false);
                })
                .catch((err) => {
                    toast(getToastOptions(`${err}`, 'error'));
                });
        } else {
            let newAccessList = [...accessUserList];
            userValue.forEach((selUserEmail) => {
                const sharedUser = AllUsersData?.filter((singleUser) => {
                    return singleUser.email === selUserEmail;
                });
                const accessLevel = DMSAccessLevel[0];
                const userToAdd = {accessLevel, ...sharedUser![0]};
                const checkIfUserAlreadyExists = newAccessList.filter((user) => {
                   return user.userId === sharedUser![0].userId;
                });
                if(checkIfUserAlreadyExists.length === 0) {
                    newAccessList.push(userToAdd);
                };
            });
            setAccessUserList(newAccessList);
        }
    };
    const closeShareModal = (ev: any) => {
        ev.preventDefault();
        if (props.isEdit) {
            props.onClose();
        } else {
            if(accessUserList?.length > 0) {
                props.onCreateUserAccess(accessUserList);
            }
            props.onClose();
        }
    };
    return (
        <Modal size={'3xl'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} closeOnOverlayClick={false} isCentered>
            <ModalOverlay />
            <ModalContent width={'713px'} borderRadius={'4'} maxHeight={'autos'}>
                <ModalHeader color={shretextColor} mt={'13px'} ml={20} mb={'13px'}>
                    Share
                </ModalHeader>
                <ModalCloseButton onClick={closeShareModal} mt={'12'} mr={8} color={textColor2} />
                <Divider color={'default.dividerColor'} />
                {AllUsersData && (
                    <ModalBody pb={6}>
                        <Box ml={16} mt={'16px'} mb={'16px'} w={671} h={42} borderRadius={'8px'} color={colorForBadges} bg={bgColorForBadges} padding={'10px 12px'}>
                            Sharing project will give access to entire experiment inside the project.
                        </Box>
                        <FormControl>
                            <Flex>
                                <Box width={'592px'} mr={'20px'} pl={'-40px'} height={'36px'}>
                                    <MultiSelect
                                        value={userValue}
                                        options={userOptions}
                                        color={defaultInBoxTextColor}
                                        label="Send to"
                                        onChange={handleUserChange!}
                                        bg={'black'}
                                        marginInlineStart={'-4px'}
                                    />
                                </Box>
                                <Box maxWidth={'79px'}>
                                    <Button onClick={handleShare} bg={'default.textButton'} borderRadius={'4'} mt={'28px'} minWidth={'66px'} height={'36px'} ml={'10px'} mr={'15px'}>
                                        Share
                                    </Button>
                                </Box>
                            </Flex>
                        </FormControl>

                        <FormControl mt={4}>
                            <Box
                                borderColor={'light.lighterGrayishBlue'}
                                borderWidth={1}
                                mt={20}
                                mb={20}
                                ml={20}
                                mr={20}
                                pb={10}
                                width={'667px'}
                                maxHeight={'476px'}
                                overflowY={'auto'}
                                borderRadius={4}
                            >
                                <Text mt={17} ml={16} color={accesstextColor} fontWeight={700}>
                                    Access by{' '}
                                </Text>

                                <Flex as="nav" align="center" justify="space-between" wrap="wrap">
                                    {accessUserList.length > 0 &&
                                        accessUserList.map((icons: any, iconsIndex: number) => {
                                            return (
                                                <>
                                                    <Center key={iconsIndex}>
                                                        <Avatar ml={16} p={'5px'} borderRadius="full" boxSize="32px" name={`${icons.firstName} ${icons.lastName}`} color={'default.whiteText'} />
                                                        <Box mt={'17px'} width={'300px'}>
                                                            <Text ml={12} color={accesstextColor}>
                                                                {icons?.firstName} {icons?.lastName}
                                                            </Text>
                                                            <Text ml={12} color={'default.veryLightGrayTextColor'}>
                                                                {icons.email}{' '}
                                                            </Text>
                                                        </Box>
                                                    </Center>
                                                    <Center mr={'20px'}>
                                                        <Menu>
                                                            <MenuButton>
                                                                    <Center>
                                                                        <Text fontSize={'16px'} fontWeight={400} color={textColor}>{icons.accessLevel}</Text>

                                                                        <Box ml={'12px'}>
                                                                            <DownArrowShare color={'#666C80'} />
                                                                        </Box>
                                                                    </Center>
                                                            </MenuButton>
                                                            <MenuList width={121} borderRadius={'0'} ml={'-18px'} mt={'-2'} color={textColor}>
                                                                <MenuItem
                                                                    isDisabled={!props.isEdit}
                                                                    onClick={() => {
                                                                        accessMenuChanged(icons, 'canView');
                                                                    }}
                                                                >
                                                                    Can View
                                                                </MenuItem>
                                                                <MenuItem
                                                                    isDisabled={!props.isEdit}
                                                                    onClick={() => {
                                                                        accessMenuChanged(icons, 'canEdit');
                                                                    }}
                                                                >
                                                                    Can Edit
                                                                </MenuItem>
                                                                <Divider />
                                                                <MenuItem
                                                                    isDisabled={!props.isEdit}
                                                                    onClick={() => {
                                                                        accessMenuChanged(icons, 'delete');
                                                                    }}
                                                                >
                                                                    Remove
                                                                </MenuItem>
                                                            </MenuList>
                                                        </Menu>
                                                        <DownArrowShare />
                                                    </Center>
                                                </>
                                            );
                                        })}
                                    {accessUserList.length === 0 && (
                                        <Box ml={'15px'}>
                                            <Text color={accesstextColor}>This Project Is not Shared with Any Users</Text>
                                        </Box>
                                    )}
                                </Flex>
                            </Box>
                        </FormControl>
                    </ModalBody>
                )}
                <Divider color={'default.dividerColor'} />
                <ModalFooter minHeight={'80px'}>
                    {/*<Box width={'100%'} ml={20}>*/}
                    {/*    <Flex>*/}
                    {/*        <LinkChain />*/}
                    {/*        <Link mt={-2} ml={8} color={'light.button'} href="https://chakra-ui.com" isExternal>*/}
                    {/*            {' '}*/}
                    {/*            Copy Link{' '}*/}
                    {/*        </Link>*/}
                    {/*    </Flex>*/}
                    {/*</Box>*/}
                    <Button onClick={closeShareModal} bg={'default.textButton'} borderRadius={'3'} mb={19} mr={20} mt={'22'} width={'72px'} height={'40px'}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default Share;
