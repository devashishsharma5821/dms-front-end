import React from 'react';
import { Box, Flex, Text, useColorModeValue, Button, Center, useDisclosure, ModalOverlay, ModalContent, ModalHeader, FormControl, ModalBody, ModalCloseButton, ModalFooter, Modal, Divider, Checkbox, } from '@chakra-ui/react';
import {  ExclamationIcon, PencilIcon, PlusIcont } from '../../assets/icons';
import { DeleteIcon } from '@chakra-ui/icons';

const Variables = (props: any) => {
    const textColorIcon = useColorModeValue('#666C80', 'white');
    const textColor2 = useColorModeValue('default.blackText', 'default.whiteText');
    const shretextColor = useColorModeValue('default.modalShareText', 'default.whiteText');
    const accesstextColor = useColorModeValue('default.titleForShare', 'default.whiteText');
    const {  onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    
const variablesData1 = {
  data: [
    {
      variableGlobal: 'Global Var 1',
      valueGlobal: 'Value 1',
      variableLocal: 'Local Var 1',
      valueLocal: 'l_value 1',
    },
    {
      variableGlobal: 'Global Var 2',
      valueGlobal: 'Value 2',
      variableLocal: 'Local Var 2',
      valueLocal: 'l_value 2',
    },
    {
      variableGlobal: 'Global Var 3',
      valueGlobal: 'Value 1',
      variableLocal: 'Local Var 3',
      valueLocal: 'l_value 3',
    },
   
  ]
} 

    return (
          
        <Modal size={'6xl'}
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={props.isOpen}
            onClose={props.onClose}
            isCentered
               closeOnOverlayClick={false} trapFocus={false} lockFocusAcrossFrames={true}
            >        
          <ModalOverlay />
          <ModalContent width={'826px'} borderRadius={'2'} maxHeight={'534px'}>
            <ModalHeader  color={shretextColor} mt={'13'} mb={'15'} ml={20}>Variables</ModalHeader>
                <ModalCloseButton  mt={'18'} mr={'10px'} color={textColor2} />
                <Divider color={"default.dividerColor"}/>
            <ModalBody  >

                    
                <FormControl mt={4}>
                    
                 <Box mt={21}  mb={20}   borderRadius={'4px'}  maxHeight={'340px'}  >
                 
                        <Box>
                            <Center>
                              
                                
                              <Flex ml={'20px'} mr={'20px'} width={'316px'} borderColor={'light.lighterGrayishBlue'} borderWidth={1} borderRadius={4} >
                              <Center>
                              <Box pb={12} height={'340px'}>
                                   <Text ml={16} color={accesstextColor} mt={'16px'} mb={'16px'} fontWeight={700}>Global</Text>
                                   <Divider width={'314px'} color={"default.dividerColor"}/>
                                   <Flex>
                                      <Center mt={20} mb={8}>
                                
                                        <Box ml={16} width={'127px'} > 
                                          <Text fontWeight={600}>Variable</Text>
                                        </Box>
                                        <Box>
                                          <Text fontWeight={600}>Value</Text>
                                        </Box>
                                      </Center>
                                   </Flex>   
                                {variablesData1.data.map((icons: { variableGlobal: string; valueGlobal: string;  }) => {
                                  
                              return(<>
                                <Flex >
                                  <Center >
                                
                                    <Box width={'127px'} >
                                        <Text ml={16} color={accesstextColor} mb={8}>{icons.variableGlobal}</Text>
                                    </Box>
                                    <Box >
                                        <Text ml={16} color={accesstextColor} mb={8}>{icons.valueGlobal}</Text>
                                    </Box>
                                  
                                  </Center>
                                </Flex>
                                    </>
                              )  })}
                              
                                </Box>
                                </Center>
                                 </Flex>
                                   <Flex width={'448px'} mr={'20px'}  borderColor={'light.lighterGrayishBlue'} borderWidth={1} borderRadius={4}>
                                
                                       <Box pb={12} height={'340px'}>
                                
                                          <Flex >
                                              <Center flex="2" mb={'16px'}  mt={'16px'} >                       
                                                      <Text ml={16} fontWeight={700}>Local</Text>
                                                  <Center flex="2"  justifyContent={'flex-end'} >
                                                      <Box > <PlusIcont  color={textColorIcon}/></Box> 
                                                      <Box ml={20}><PencilIcon color={textColorIcon} height={'18px'} width={'18px'} /></Box>  
                                                      <Box mr={16} ml={20}><DeleteIcon color={textColorIcon} height={'18px'} width={'16px'}/></Box>  
                                                  </Center>
                                              </Center>     
                                          </Flex>
                                          <Divider color={"default.dividerColor"}  width={'448px'}/>
                                          <Box width={'416px'} height={'64px'} bg={'default.bgExclamationText'} borderRadius={8} mt={16} ml={16}>
                                            <Flex>
                                          
                                                <Box width={'40px'}  bg={'default.bgExclamationIcon'} height={'64px'} borderTopLeftRadius={'8px'} borderBottomLeftRadius={'8px'} p={7} >
                                                  <Box  mt={'3px'} ><ExclamationIcon/></Box>
                                                </Box>
                                                <Box   p={10}>
                                                  <Text>Variable names must be alphanumeric, less than 25 characters long, and contain no spaces.</Text>
                                                </Box>
                                                
                                            </Flex>
                                          </Box>
                                          <Flex>
                                         <Center mt={20} mb={8}>
                                
                                        <Box ml={16} width={'198px'} > 
                                          <Checkbox >
                                            <Text fontWeight={600}>Variable</Text>
                                          </Checkbox>
                                        </Box>
                                        <Box ml={2}>
                                            <Text fontWeight={600}>Value</Text>
                                        </Box>
                                      </Center>
                                   </Flex>   
                                
                                {variablesData1.data.map((icons: { variableLocal: string; valueLocal: string;  }) => {
                                  return(<>
                                  <Flex>
                                   <Center >
                                    <Box width={'198px'} ml={16} mr={10}>
                                      <Checkbox mt={4}>
                                          <Text  color={accesstextColor} mt={'8px'}>{icons.variableLocal}</Text>
                                      </Checkbox>
                                    </Box>
                                    <Box >
                                        <Text ml={12} color={accesstextColor} mt={'8px'}>{icons.valueLocal}</Text>
                                    </Box>
                                  
                                    </Center>
                                  </Flex>
                                    </>
                              )  })}
                                
                                </Box>
                              </Flex>
                            </Center>
       
                        </Box>
                 </Box>
                </FormControl>    
            </ModalBody>
                
                <Divider color={"default.dividerColor"}/>
                <ModalFooter >

                 <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={20} mt={'19'} width={'72px'} height={'40px'}>Close</Button>
                  
                </ModalFooter>
          </ModalContent>
        </Modal>
        
    );
};

export default Variables;
