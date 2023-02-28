import React from 'react';
import { Box, Flex, Text, useColorModeValue, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList, useDisclosure, ModalOverlay, ModalContent, ModalHeader, FormControl, ModalBody, Input, ModalCloseButton, ModalFooter, Modal, FormLabel, Divider, Link } from '@chakra-ui/react';
import {  DownArrowShare, LinkChain } from '../../assets/icons';
import { ShareData } from '../../models/share';

const Share = (props: any) => {
  
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const defaultInBoxTextColor = useColorModeValue('default.defaultTextColorInBox', 'default.veryLightGrayTextColor');
    const {  onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)

const shareData1 = {
    data:[
            {
                firstName: 'Shirin',
                lastName: 'Bampoori',
                email: 'shirin.bampoori@antuit.com',
                
            },
            { 
                firstName: 'Zubin',
                lastName: 'Shah',
                email: 'Zubin.Shah@antuit.com',
            },
            {
                firstName: 'Arjun',
                lastName: 'Guntuka',
                email: 'Arjun.Guntuka@antuit.com',
            },
            {
                firstName: 'Ram',
                lastName: 'Singh',
                email: 'Ram.Singh@antuit.com',
            },
            {
                firstName: 'Sujan',
                lastName: 'Manandhar',
                email: 'Sujan.Manandhar@antuit.com',
            },

] } as ShareData

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
                    <ModalCloseButton  mt={'12'} mr={8} color={textColor2} />
                    <Divider color={"default.dividerColor"}/>
                   
                  <ModalBody pb={6} >
                    <FormControl>
                     <FormLabel  color={textColor2} mt={'20'} ml={20} mb={10}>Send to</FormLabel>
                      <Flex>
                      <Input   _placeholder={{ opacity: 2, color: defaultInBoxTextColor }} borderRadius={'2'} width={'581px'} ml={20} height={'36px'} ref={initialRef} placeholder='Type name or email with comma seperated' />
                      <Button bg={'default.shareModalButton'} mr={3} borderRadius={'2'}  ml={22} width={'66px'} height={'36px'}>
                         Share
                    </Button>
                    </Flex>
                    </FormControl>
                    
                    <FormControl mt={4}>
                    
                   <Box  borderColor={'light.lighterGrayishBlue'} borderWidth={1}  mt={20}  mb={20} ml={20}  mr={20} pb={10}  width={'667px'} maxHeight={'472px'}  >
                        <Text  mt={17} ml={16} color={accesstextColor}>Access by </Text>
                        
                        <Flex as="nav" align="center" justify="space-between" wrap="wrap">

                        {shareData1.data.map((icons, iconsIndex) => {
                            return(
                            <div key={iconsIndex}><Center key={iconsIndex}>
                                    <Avatar ml={16} p={'5px'}  borderRadius="full" boxSize="32px" name={`${icons.firstName} ${icons.lastName}`} color={'default.whiteText'} />
                                    <Box mt={'17px'} width={'300px'}>
                                        <Text ml={12} color={accesstextColor}>{icons?.firstName} {icons?.lastName}</Text>
                                        <Text ml={12}  color={'default.veryLightGrayTextColor'}>{icons.email} </Text>
                                    </Box>
                                </Center><Center mr={'36px'}>
                                        <Menu>
                                            <MenuButton>
                                                <Text mr={'9px'} color={textColor2}> Can View</Text>
                                            </MenuButton>
                                            <MenuList width={121} borderRadius={'0'} ml={'-18px'} mt={'-2'} color={textColor}>
                                                <MenuItem>Can View</MenuItem>
                                                <MenuItem>Can Edits</MenuItem>
                                                <Divider />
                                                <MenuItem>Remove</MenuItem>
                                            </MenuList>
                                        </Menu>
                                        <DownArrowShare />
                                    </Center></div>
                       ) })}                           
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
                 <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={20} mt={'22'} width={'72px'} height={'40px'}>Close</Button>
                  
                  </ModalFooter>
                 </ModalContent>
                  </Modal>
        
    );
};

export default Share;
