import React from 'react';
import { Box, Flex, Text, useColorModeValue, Editable, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList, useDisclosure, ModalOverlay, ModalContent, ModalHeader, FormControl, ModalBody, Input, ModalCloseButton, ModalFooter, Modal, FormLabel, Divider, Stack, Link } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../colorModeSwitcher/ColorModeSwitcher';
import { DownArrow, PencilIcon, LogoLight, GridCanvas, LineCanvasLogo, NoneCanvasLogo, DownArrowShare, LinkChain } from '../../assets/icons';




const Share = (props: any) => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const defaultInBoxTextColor = useColorModeValue('default.defaultTextColorInBox', 'default.veryLightGrayTextColor');
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" height={'44px'} pl={'4'} bg={themebg} color={'default.lightText'}>
            

            <Center flex="3" mr={5} justifyContent={'flex-end'} >
            <Box pl={'6'} pr={'6'} >
                   
                <Modal size={'3xl'}
                     initialFocusRef={initialRef}
                     finalFocusRef={finalRef}
                     isOpen={isOpen}
                     onClose={onClose}
                     isCentered
                     >        
                    <ModalOverlay />
                    <ModalContent width={'713px'} borderRadius={'2'} maxHeight={'734px'}>
                     <ModalHeader  color={shretextColor} mt={'13'} ml={20}>Share</ModalHeader>
                    <ModalCloseButton  mt={'12'} mr={8} color={'light.lighterGrayishBlue'} />
                    <Divider color={"default.dividerColor"}/>
                  <ModalBody pb={6} >
                    <FormControl>
                     <FormLabel  color={textColor2} mt={'20'} ml={20} mb={10}>Send to</FormLabel>
                      <Flex>
                      <Input   _placeholder={{ opacity: 2, color: defaultInBoxTextColor }} borderRadius={'2'} width={'581px'} ml={20} height={'8'} ref={initialRef} placeholder='Type name or email with comma seperated' />
                      <Button bg={'default.shareModalButton'} mr={3} borderRadius={'2'}  ml={22}>
                         Share
                    </Button>
                    </Flex>
                    </FormControl>

                    <FormControl mt={4}>

                   <Box  borderColor={'light.lighterGrayishBlue'} borderWidth={1}  mt={20}  mb={20} ml={20}  mr={20}  width={'667px'} maxHeight={'472px'}>
                        <Text  mt={17} ml={16} color={accesstextColor}>Access by </Text>
                        <Flex as="nav" align="center" justify="space-between" wrap="wrap">
                            <Center>
                              <Avatar ml={16}  borderRadius="full" boxSize="32px" name={`${props.firstName} ${props.lastName}`} bg={'default.userCircleHeaderBg'} color={'default.userCircleHeaderFont'} />
                              <Box mt={'17px'}>
                                 <Text  ml={12} color={accesstextColor}>{props.firstName} {props.lastName}</Text>
                                 <Text ml={12} color={'default.veryLightGrayTextColor'}>{props.email} </Text>
                              </Box>
                           </Center>
                           <Center mr={'36px'} >  
                              <Menu>
                                <MenuButton>
                                    <Text mr={'9px'} color={textColor2}> Can View</Text>
                                </MenuButton>
                                <MenuList width={121} borderRadius={'0'} ml={'-18px'} mt={'-2'} color={textColor}>
                                    <MenuItem>Can View</MenuItem>
                                    <MenuItem>Can Edits</MenuItem>
                                    <Divider/>
                                <MenuItem>Remove</MenuItem>
                                </MenuList>
                               </Menu>
                            <DownArrowShare/>  
                           </Center>
                        </Flex>
                   </Box>
                    </FormControl>
                </ModalBody>
               
                <Divider color={"default.dividerColor"}/>
                
                  <ModalFooter >
                  
                 <Box width={'100%'} ml={20}>
                    <Flex>
                     <LinkChain />
                     <Link mt={-2}  ml={8} color={'light.button'}href='https://chakra-ui.com' isExternal> Copy Link </Link>
                     </Flex>
                 </Box>
                 <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={22} mt={'22'}>Close</Button>
                  
                  </ModalFooter>
                 </ModalContent>
                  </Modal>
                </Box>
                
            </Center>
        </Flex>
    );
};

export default Share;