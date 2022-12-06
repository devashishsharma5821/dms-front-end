import React from 'react';
import { Box, Flex, Text, useColorModeValue, Editable, Button, Center, Avatar, Menu, MenuButton, MenuItem, MenuList, useDisclosure, ModalOverlay, ModalContent, ModalHeader, FormControl, ModalBody, Input, ModalCloseButton, ModalFooter, Modal, FormLabel, Divider, Stack } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../colorModeSwitcher/ColorModeSwitcher';
import { DownArrow, PencilIcon, LogoLight, GridCanvas, LineCanvasLogo, NoneCanvasLogo } from '../../assets/icons';
import { config } from 'process';

const Header = (props: any) => {
    const themebg = useColorModeValue('light.header', 'dark.header');
    const textColor = useColorModeValue('light.header', 'default.whiteText');
    const { isOpen, onOpen, onClose } = useDisclosure()
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)
    return (
        <Flex as="nav" align="center" justify="space-between" wrap="wrap" height={'44px'} pl={'4'} bg={themebg} color={'default.lightText'}>
            <Box flex="3" ml={'2'}>
                <LogoLight />
            </Box>
            <Center flex="3">
                <Text color={'default.lightGrayHeader'} fontSize={'18'} fontStyle={'normal'}>
                    Project Name
                </Text>
                <Text color={'default.lightGrayHeader'} pl={'2'}>
                    /
                </Text>
                <Text color={'default.whiteText'} pl={'2'} fontSize={'18'} fontWeight={'700'} fontStyle={'normal'}>
                    {' '}
                    My New Experiment
                </Text>

                <Editable pl={'10'} defaultValue="Take some chakra">
                    <PencilIcon />
                </Editable>
            </Center>

            <Center flex="3" mr={5} justifyContent={'flex-end'} >
            <Box pl={'6'} pr={'6'} >
                    <Button onClick={onOpen} colorScheme="default.lightGrayHeader" variant="outline">
                        Share
                    </Button>
                <Modal size={'3xl'}
                     initialFocusRef={initialRef}
                     finalFocusRef={finalRef}
                     isOpen={isOpen}
                     onClose={onClose}
                     isCentered
                     >        
                    <ModalOverlay />
                    <ModalContent width={'713px'} borderRadius={'2'} height={'734px'}>
                     <ModalHeader  color={"default.modalShareText"} mt={'13'} ml={20}>Share</ModalHeader>
                    <ModalCloseButton  mt={'12'} mr={8} />
                    <Divider/>
                  <ModalBody pb={6} >
                    <FormControl>
                     <FormLabel  color={"default.BlackText"} mt={'20'} ml={20} mb={10}>Send to</FormLabel>
                      <Flex>
                      <Input   _placeholder={{ opacity: 2, color: 'default.defaultTextColorInBox' }} borderRadius={'2'} width={'581px'} ml={20} height={'8'} ref={initialRef} placeholder='Type name or email with comma seperated' />
                      <Button bg={'default.shareModalButton'} mr={3} borderRadius={'2'}  ml={22}>
                         Share
                    </Button>
                    </Flex>
                    </FormControl>

                    <FormControl mt={4}>
                   
                   <Box  borderColor='red' border={2}  mt={20}  mb={20} ml={20}  mr={20} bg={'black'} width={'667px'} height={'472px'}>

                   </Box>
                    </FormControl>
                </ModalBody>
               
                <Divider/>
                  <ModalFooter>
                   
                    <Button onClick={onClose} bg={'default.shareModalButton'} borderRadius={'2'} mb={19} mr={22} mt={'22'}>Close</Button>
                  </ModalFooter>
                 </ModalContent>
                  </Modal>
                </Box>
                <Box>
                    {' '}
                    <ColorModeSwitcher />
                </Box>
                <Menu>
                    <MenuButton ml={'24'} >
                    < GridCanvas/>
                    </MenuButton>
                    <MenuList borderRadius={'0'} width={'110'} color={textColor} ml={'-46'}>
                        <MenuItem>< GridCanvas/><Text  ml={'12'}>Dot</Text></MenuItem>
                        <MenuItem><LineCanvasLogo/><Text  ml={'12'}>Line</Text></MenuItem>
                        <MenuItem><NoneCanvasLogo/><Text  ml={'12'}>None</Text></MenuItem>
                    </MenuList>
                </Menu>
                <Box mr={'27'}  ml={'11'}>
                <DownArrow />
                </Box>
                <Menu>
                    <MenuButton>
                        <Avatar borderRadius="full" boxSize="32px" name={`${props.firstName} ${props.lastName}`} bg={'default.userCircleHeaderBg'} color={'default.userCircleHeaderFont'} />
                    </MenuButton>
                    <MenuList width={127} borderRadius={'0'} mr={'-26'} mt={'-2'} color={textColor}>
                        <MenuItem>My Profile</MenuItem>
                        <MenuItem>Settings</MenuItem>
                        <MenuItem>Signout</MenuItem>
                    </MenuList>
                </Menu>
                <Box ml={'12'}  mr={'23'}>
                   <DownArrow />
                </Box>
            </Center>
        </Flex>
    );
};

export default Header;