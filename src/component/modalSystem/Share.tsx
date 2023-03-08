import React, { useEffect, FC } from 'react';
import {
    Box, Flex, Text, useColorModeValue, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList,
    ModalOverlay, ModalContent, ModalHeader, FormControl, ModalBody,
    ModalCloseButton, ModalFooter, Modal, FormLabel, Divider, Link, Select, Toast
} from '@chakra-ui/react';
    import {
        MultiSelect,
        MultiSelectProps,
        MultiSelectTheme,
        SelectionVisibilityMode,
        useMultiSelect,
    } from 'chakra-multiselect';
import {  DownArrowShare, LinkChain } from '../../assets/icons';
import { ShareCreate, ShareCreateDetail, ShareDelete, ShareDeleteDetail } from '../../models/share';
import useAppStore from '../../store';
import { DMSAccessLevel, GetAllUsersDataAppStoreState } from '../../models/profile';
import { getAndUpdateAllUsersData } from '../../zustandActions/commonActions';
import client from '../../apollo-client';
import { createAccess, deleteAccess } from '../../query';
import { useParams } from 'react-router-dom';
import { getAndUpdateSingleProjectData } from '../../zustandActions/projectActions';
import { GetSingleProjectAppStoreState } from '../../models/project';
import { getFormattedUserData } from '../../utils/common.utils';

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
    const [selectedUser, setSelectedUser] = React.useState("");
    const [accessUserList, setAccessUserList] = React.useState<any>([]);
    const [AllUsersData] = useAppStore((state: GetAllUsersDataAppStoreState) => [state.AllUsersData]);
    const [SingleProjectData] = useAppStore((state: GetSingleProjectAppStoreState) => [state.SingleProjectData]);
    const params = useParams();
    const userOptions = AllUsersData.map((user) => ({ label: user.email, value: user.email }))
    const [userValue, setUserValue] = React.useState([]);
    useEffect(() => {
        if(props.retainData.length > 0) {
            setAccessUserList(props.retainData);
        }
        if(props.isEdit) {
            setAccessUserList([]);
            if (SingleProjectData === null) {
                getAndUpdateSingleProjectData(params.projectId as string);
            } else {
                if(SingleProjectData.project_access === null) {
                    setAccessUserList([]);
                } else {
                    if(AllUsersData && SingleProjectData) {
                        setAccessUserList(getFormattedUserData(AllUsersData, SingleProjectData));
                    }
                }
            }
        }
    }, [SingleProjectData]);

    useEffect(() => {
        if (AllUsersData === null) {
            const variablesForAllUsers = {isActive: true, pageNumber: 1, limit: 9999, searchText: ""};
            getAndUpdateAllUsersData(variablesForAllUsers);
        };
    }, [AllUsersData]);


    const handleUserChange = (ev: any) => {
        setUserValue(ev);
        setSelectedUser(ev.target.value);
    };
    const accessMenuChanged = (access: any) => {
        const removedUser = AllUsersData?.filter((singleUser) => {
            return singleUser.email === access.email;
        });
        const removeVariable = {
            userId: removedUser[0].userId,
            projectId: params.projectId
        };
        client
            .mutate<ShareDelete<ShareDeleteDetail>>({
                mutation: deleteAccess(removeVariable)
            })
            .then(() => {
                Toast({
                    title: `Access removed Successfully`,
                    status: 'success',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
                getAndUpdateSingleProjectData(params.projectId as string);
            })
            .catch(() => {
                Toast({
                    title: `Access failed to be removed`,
                    status: 'error',
                    isClosable: true,
                    duration: 5000,
                    position: 'top-right'
                });
            });
    }

    const handleShare = () => {
        if(props.isEdit) {
            const mutationVariable = {
                access: [
                    {
                        user_id: selectedUser,
                        access_level: DMSAccessLevel[0]
                    }
                ],
                project_id: params.projectId
            };
            client
                .mutate<ShareCreate<ShareCreateDetail>>({
                    mutation: createAccess(),
                    variables: {input: mutationVariable}
                })
                .then(() => {
                    Toast({
                        title: `Project Shared Successfully`,
                        status: 'success',
                        isClosable: true,
                        duration: 5000,
                        position: 'top-right'
                    });
                    getAndUpdateSingleProjectData(params.projectId as string);
                    setSelectedUser('');
                })
                .catch(() => {
                    Toast({
                        title: `Project will not be shared successfully`,
                        status: 'error',
                        isClosable: true,
                        duration: 5000,
                        position: 'top-right'
                    });
                });
        } else {
            const sharedUser = AllUsersData?.filter((singleUser) => {
                return singleUser.userId === selectedUser;
            });
            let newAccessList = [...accessUserList];
            newAccessList.push(sharedUser[0]);
            setAccessUserList(newAccessList);
        }
    };
    const closeShareModal = (ev: any) => {
        ev.preventDefault();
        if(props.isEdit) {
            props.onClose();
        } else {
            props.onCreateUserAccess(accessUserList);
            props.onClose();
        }
    };
    return (
                <Modal size={'3xl'}
                     initialFocusRef={initialRef}
                     finalFocusRef={finalRef}
                     isOpen={props.isOpen}
                     onClose={props.onClose}
                     isCentered
                    
                     >        
                    <ModalOverlay />
                    <ModalContent width={'713px'} borderRadius={'2'} maxHeight={'734px'}>
                     <ModalHeader  color={shretextColor} mt={'13'} ml={20}>Share</ModalHeader>
                    <ModalCloseButton onClick={closeShareModal} mt={'12'} mr={8} color={textColor2} />
                    <Divider color={"default.dividerColor"}/>
                        {
                            AllUsersData &&
                            <ModalBody pb={6} >
                                <Box ml={16} mt={'21px'} mb={'16px'} w={671} h={42} borderRadius={'8px'} color={colorForBadges}  bg={bgColorForBadges} padding={'10px 12px'}>
                                    Sharing project will give access to entire experiment inside the project.
                                </Box>
                                <FormControl>
                                    <FormLabel  color={textColor2} mt={'20'} ml={20} mb={10}>Send to</FormLabel>
                                    <Flex>
                                        {/*<MultiSelect*/}
                                        {/*    value={userValue}*/}
                                        {/*    options={userOptions}*/}
                                        {/*    label='Type name or email to begin searching'*/}
                                        {/*    onChange={handleUserChange!}*/}
                                        {/*/>*/}
                                        <Select onChange={handleUserChange} color={defaultInBoxTextColor} borderRadius={'2'} width={'581px'} ml={20} height={'36px'} placeholder='Type name or email with comma seperated'>
                                            {AllUsersData.map((user, userIndex) => {
                                                return(
                                                    <option key={userIndex} value={user.userId}>{user.firstName} {user.lastName}</option>
                                                )
                                            })}
                                        </Select>
                                        <Button onClick={handleShare} bg={'default.shareModalButton'} mr={3} borderRadius={'2'}  ml={22} width={'66px'} height={'36px'}>
                                            Share
                                        </Button>
                                    </Flex>
                                </FormControl>

                                <FormControl mt={4}>

                                    <Box borderColor={'light.lighterGrayishBlue'} borderWidth={1}  mt={20}  mb={20} ml={20}  mr={20} pb={10}  width={'667px'} maxHeight={'472px'}  >
                                        <Text  mt={17} ml={16} color={accesstextColor}>Access by </Text>

                                        <Flex as="nav" align="center" justify="space-between" wrap="wrap">

                                            {
                                                accessUserList.length > 0 &&
                                                accessUserList.map((icons: any, iconsIndex: number) => {
                                                    return(
                                                        <><Center key={iconsIndex}>
                                                            <Avatar ml={16} p={'5px'}  borderRadius="full" boxSize="32px" name={`${icons.firstName} ${icons.lastName}`} color={'default.whiteText'} />
                                                            <Box mt={'17px'} width={'300px'}>
                                                                <Text ml={12} color={accesstextColor}>{icons?.firstName} {icons?.lastName}</Text>
                                                                <Text ml={12}  color={'default.veryLightGrayTextColor'}>{icons.email} </Text>
                                                            </Box>
                                                        </Center><Center mr={'36px'}>
                                                            <Menu>
                                                                <MenuButton>
                                                                    <Text mr={'9px'} color={textColor2}>Can View</Text>
                                                                </MenuButton>
                                                                <MenuList width={121} borderRadius={'0'} ml={'-18px'} mt={'-2'} color={textColor}>
                                                                    <MenuItem>Can View</MenuItem>
                                                                    <MenuItem>Can Edits</MenuItem>
                                                                    <Divider />
                                                                    <MenuItem onClick={()=> {accessMenuChanged(icons)}}>Remove</MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                            <DownArrowShare />
                                                        </Center></>
                                                    ) })
                                            }
                                            {
                                                accessUserList.length === 0 &&
                                                <Box>
                                                    <Text color={accesstextColor} >This Project Is not Shared with Any Users</Text>
                                                </Box>
                                            }
                                        </Flex>

                                    </Box>

                                </FormControl>
                            </ModalBody>
                        }
                <Divider color={"default.dividerColor"}/>
                  <ModalFooter >
 
                  
                 <Box width={'100%'} ml={20}>
                    <Flex>
                     <LinkChain />
                     <Link mt={-2}  ml={8} color={'light.button'}href='https://chakra-ui.com' isExternal> Copy Link </Link>
                     </Flex>
                 </Box>
                 <Button onClick={closeShareModal} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={20} mt={'22'} width={'72px'} height={'40px'}>Close</Button>
                  
                  </ModalFooter>
                 </ModalContent>
                  </Modal>
        
    );
};

export default Share;
