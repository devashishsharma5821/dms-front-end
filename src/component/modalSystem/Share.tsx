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
import { copyToClipBoard, getFormattedUserData } from '../../utils/common.utils';
import { getToastOptions } from '../../models/toastMessages';
import { getAndUpdateExperimentData } from '../../zustandActions/experimentActions';

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
    const [UserConfig] = useAppStore((state: any) => [state.UserConfig]);

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
    const setCreateProjectAccessRoles = (access: any, level: any) => {
        let newAccessList = [...accessUserList];
        newAccessList.forEach((user: any) => {
            if (user.userId === access.userId) {
                user.accessLevel = level;
            }
        });
        console.log('asdfsdfsdf', newAccessList);
        setAccessUserList(newAccessList);
    };
    const deleteCreateProjectAccessRoles = (access: any) => {
        const userToKeep = accessUserList.filter((user: any) => {
            return user.userId !== access.userId;
        });
        setAccessUserList(userToKeep);
    };
    const accessMenuChanged = (access: any, type: string, isEdit: boolean) => {
        const user = AllUsersData?.filter((singleUser) => {
            return singleUser.email === access.email;
        });
        if (!isEdit) {
            if (type === 'delete') {
                deleteCreateProjectAccessRoles(access);
            } else if (type === 'canEdit' || type === 'canView') {
                setCreateProjectAccessRoles(access, type === 'canEdit' ? DMSAccessLevel[1] : DMSAccessLevel[0]);
            }
        } else {
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
            } else if (type === 'canEdit' || type === 'canView') {
                const mutationVariable = {
                    access: [
                        {
                            user_id: user![0].userId,
                            access_level: type === 'canEdit' ? DMSAccessLevel[1] : DMSAccessLevel[0]
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
        }
    };

    const handleShare = () => {
        if (userValue.length > 0) {
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
                    const userToAdd = { accessLevel, ...sharedUser![0] };
                    const checkIfUserAlreadyExists = newAccessList.filter((user) => {
                        return user.userId === sharedUser![0].userId;
                    });
                    if (checkIfUserAlreadyExists.length === 0) {
                        newAccessList.push(userToAdd);
                    }
                });
                setAccessUserList(newAccessList);
            }
        }
    };
    const closeShareModal = (ev: any) => {
        ev.preventDefault();
        if (props.isEdit) {
            props.onClose();
        } else {
            if (accessUserList?.length > 0) {
                props.onCreateUserAccess(accessUserList);
            }
            props.onClose();
        }
    };
    return (
        <Modal size={'3xl'} initialFocusRef={initialRef} finalFocusRef={finalRef} isOpen={props.isOpen} onClose={props.onClose} closeOnOverlayClick={false} trapFocus={false} lockFocusAcrossFrames={true} isCentered>
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
                                <Box width={'602px'} pl={'20px'} height={'36px'}>
                                    <Text fontWeight={400} fontSize={16} color={textColor2} mb={'8px'}>
                                        Send to
                                    </Text>
                                    <MultiSelect
                                        overflowY={'scroll'}
                                        value={userValue}
                                        options={userOptions}
                                        color={defaultInBoxTextColor}
                                        onChange={handleUserChange!}
                                        bg={'black'}
                                        marginInlineStart={'-4px'}
                                    />
                                </Box>
                                <Box maxWidth={'79px'} mt={'8px'}>
                                    <Button onClick={handleShare} bg={'default.textButton'} borderRadius={'4'} mt={'28px'} minWidth={'66px'} height={'36px'} ml={'16px'} mr={'15px'}>
                                        Share
                                    </Button>
                                </Box>
                            </Flex>
                        </FormControl>

                        <FormControl mt={4}>
                            <Box
                                borderColor={'light.lighterGrayishBlue'}
                                borderWidth={1}
                                mt={16}
                                mb={20}
                                ml={20}
                                mr={20}
                                pb={10}
                                width={'667px'}
                                maxHeight={'476px'}
                                overflowY={'auto'}
                                borderRadius={4}
                            >
                                <Flex justifyContent={'start'}>
                                    <Center>
                                        <Text mt={17} ml={16} color={accesstextColor} fontWeight={700}>
                                            Access by
                                        </Text>
                                        <Box mt={17} ml={8} bg={'default.tagBoxColor'} width={'29px'} height={'24px'} textAlign="center" borderRadius={3}>
                                            <Text color={'default.accessByNumber'} fontSize={'14px'} pt={2} fontWeight={600} cursor={'pointer'}>
                                                {accessUserList.length}
                                            </Text>
                                        </Box>
                                    </Center>
                                </Flex>
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
                                                                    <Text fontSize={'16px'} fontWeight={400} color={textColor}>
                                                                        {icons.accessLevel}
                                                                    </Text>

                                                                    <Box ml={'12px'}>
                                                                        <DownArrowShare color={'#666C80'} />
                                                                    </Box>
                                                                </Center>
                                                            </MenuButton>
                                                            <MenuList width={121} borderRadius={'0'} ml={'-18px'} mt={'-2'} color={textColor}>
                                                                <MenuItem
                                                                    isDisabled={UserConfig.userConfiguration.user.userId === icons.id}
                                                                    onClick={() => {
                                                                        accessMenuChanged(icons, 'canView', props.isEdit);
                                                                    }}
                                                                >
                                                                    Can View
                                                                </MenuItem>
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        accessMenuChanged(icons, 'canEdit', props.isEdit);
                                                                    }}
                                                                >
                                                                    Can Edit
                                                                </MenuItem>
                                                                <Divider />
                                                                <MenuItem
                                                                    isDisabled={UserConfig.userConfiguration.user.userId === icons.id}
                                                                    onClick={() => {
                                                                        accessMenuChanged(icons, 'delete', props.isEdit);
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
                                            <Text color={accesstextColor}>This Project Is Not Shared With Any User</Text>
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
