import React from 'react';
import { Box, Flex, Text, useColorModeValue, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList, useDisclosure, ModalOverlay, ModalContent, ModalHeader, FormControl, ModalBody, Input, ModalCloseButton, ModalFooter, Modal, FormLabel, Divider, Link, Textarea, Editable } from '@chakra-ui/react';
import {  DownArrowShare, LinkChain, PencilIcon, WhiteExperiment } from '../../assets/icons';
import { ShareData } from '../../models/share';

const Properties = (props: any) => {
  
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
          <ModalContent width={'714px'} borderRadius={'2'} maxHeight={'852px'}>
            <ModalHeader  color={shretextColor} mt={'13'} ml={20}>Properties</ModalHeader>
                <ModalCloseButton  mt={'12'} mr={8} color={'default.blackText'} />
                <Divider color={"default.dividerColor"}/>
            <ModalBody pb={6} >

                    <Flex fontWeight={700}>
                        <Center  >
                            <Text  color={textColor2} mt={'20'} ml={20} mb={10} >Project Name:</Text>
                            <Text color={textColor2} mt={'20'} mb={10}  ml={'5px'}>My Project</Text> 
                        </Center>
                    </Flex>

                <FormControl mt={4}>
                    
                 <Box borderColor={'light.lighterGrayishBlue'} borderWidth={1}  mt={20}  mb={20} ml={16}  pb={10} borderRadius={'4px'} width={'671px'} maxHeight={'635px'}  >
                       
                        <Flex >
                          <Center ml={'19px'}>
                            <WhiteExperiment color="#666C80" />
                           
                                <Box ml={12}>   
                                    <Text  mt={17}  color={accesstextColor}>Experiment Name </Text>
                                    <Center>
                                    <Text  color={accesstextColor} fontWeight={700}>My New Experiment </Text>
                                    <Editable pl={'10'} defaultValue="Take some chakra">
                                        <PencilIcon color={'#666C80'} />
                                    </Editable>
                                    </Center>
                                </Box>
                            </Center>
                        </Flex >

                       

                        <Flex  mb={'21px'}>
                            <Center  >
                                <Text  color={textColor2} mt={'20'} ml={20}  >Tag:</Text>
                                <Text  color={'#2180C2'} mt={'20'} ml={20}  >+ Add Tag</Text>
                            </Center>
                        </Flex>

                        <Divider color={"default.dividerColor"}/>

                        <Box width={671}>
                            <Center>
                              <Flex ml={'36px'} mt={'-51px'}>
                                <Avatar  p={'5px'}  borderRadius="full" boxSize="42px" name={`Shirin Bampoori`} color={'default.whiteText'} />
                                <Center>
                                    
                                        <Box width={'300px'}>
                                            <Text ml={12} color={accesstextColor}>Created by</Text>
                                            <Text ml={12}  color={accesstextColor} fontWeight={700}>Shirin Bampoori</Text>
                                            <Text ml={12} color={accesstextColor}>Created On</Text>
                                            <Text ml={12}  color={accesstextColor} fontWeight={700}>10/05/2022  10:20 AM</Text>
                                            <Text ml={12} color={accesstextColor}>Last Modifies</Text>
                                            <Text ml={12}  color={accesstextColor} fontWeight={700}>10 Mins ago</Text>
                                        </Box>
                                </Center>
                             
                              </Flex>
                              <Flex as="nav" align="center" justify="space-between" wrap="wrap">
                                <Box>
                                
                                <Flex >
                                    <Center flex="2">                       
                                        <Text mt={'21px'} ml={12}>Access by</Text>
                                        <Center flex="2"  justifyContent={'flex-end'} mr={46}>
                                            <Text  color={'#2180C2'}  mt={'21px'} > Edit</Text> 
                                            <Text  color={'#2180C2'}  mt={'21px'} ml={16}> Copy Link</Text>  
                                        </Center>
                                    </Center>     
                                </Flex>
                                {shareData1.data.map((icons) => {
                                    return(<>
                                    
                                    <Center>
                                            <Avatar ml={16} p={'5px'}  borderRadius="full" boxSize="32px" name={`${icons.firstName} ${icons.lastName}`} color={'default.whiteText'} />
                                            <Box mt={'17px'} width={'300px'}>
                                                <Text ml={12} color={accesstextColor}>{icons?.firstName} {icons?.lastName}</Text>
                                                <Text ml={12}  color={'default.veryLightGrayTextColor'}>{icons.email} </Text>
                                                
                                            </Box>
                                        </Center>
                                        <Center mr={'36px'}>
                                        
                                    </Center></>
                                    
                                ) })}   
                        
                                </Box>
                              </Flex>

                      
                            </Center>
                        
                          
                                <Flex >
                                    <Center>                       
                                        <Text  color={textColor2} mt={'20'} ml={16} mb={10} >Link To </Text>
                                        <Text  color={'#2180C2'} mt={'20'} ml={10} mb={10} > Edit </Text>  
                                    </Center>     
                                </Flex>
                                <Flex >
                                    <Box>
                                        <Center ml={16}>
                                            <LinkChain />
                                            <Link  ml={8} mt={-8} color={'light.button'}href='https://chakra-ui.com' isExternal>Experiment 2  </Link>
                                        </Center>
                                    </Box>
                                </Flex>
                                <Flex >
                                    <Box>
                                        <Text mt={16} ml={16} mb={6}>Description</Text>
                                        <Textarea  width={'639px'} height={'97px'} ml={16} mr={16} placeholder='Type your description here...'  />
                                    </Box>
                                </Flex>
                        </Box>
                 </Box>
                        
                    
                </FormControl>    
            </ModalBody>
                
                <Divider color={"default.dividerColor"}/>
                <ModalFooter >

                 <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={20} mt={'22'} width={'72px'} height={'40px'}>Close</Button>
                  
                </ModalFooter>
          </ModalContent>
        </Modal>
        
    );
};

export default Properties;