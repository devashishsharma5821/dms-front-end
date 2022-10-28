import { Text, Box, Button, Input, InputGroup, InputLeftElement, useColorModeValue, Divider, Flex, Center, InputRightElement, IconButton, useFocusEffect, border, background } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react-use-disclosure";
import { useRef, ChangeEvent, useState, useEffect } from "react";
import './TransformerMenu.css'

import {
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    List,
    ListItem,
} from "@chakra-ui/react";
import React from "react";
import { ArrowLeftIcon, CloseIcon, Search2Icon } from "@chakra-ui/icons";
import DoubleAngleLeftIcon from "../../assets/icons/DoubleAngleLeftIcon";
import DownDeltaIcon from "../../assets/icons/DownDeltaIcon";
import RightDeltaIcon from "../../assets/icons/RightDeltaIcon";
import TransformersIcon from "../../assets/icons/TransformersIcon";

const TransformerMenu = (props: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef: any = useRef();
    const themeBg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    const iconBg = useColorModeValue('light.lighterGrayishBlue', 'dark.veryDarkGrayishBlue');
    const accordianItemBg = useColorModeValue('light.lightestGreenBlue', 'dark.lighterGreenBlue');
    const accordianItemBorder = useColorModeValue('light.slightlyDesaturatedBlue', 'dark.lightGrayishBlue');
    const accordianTextColor = useColorModeValue('light.veryDarkBlue', 'dark.veryDarkGray');

    const [showClearSearch, setClearSearch] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const searchChange = (event: ChangeEvent<HTMLInputElement>) => {
        let currentSearchValue = event.currentTarget.value;
        setSearchValue(event.currentTarget.value);
        (currentSearchValue && currentSearchValue.trim() != "") ? setClearSearch(true) : setClearSearch(false);
    }
    const clearSearch = () => {
        setSearchValue("");
        setClearSearch(false);
    }
    useEffect(() => {
        (props.isLeftMenuOpen) ? onOpen() : onClose();
    }, [props.isLeftMenuOpen])
    useEffect(() => {
        props.toggleLeftMenu(isOpen);
    }, [isOpen])

    return (

        <div>
            <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef}
                id="left-overlay-menu"
                colorScheme={themeBg}
                
            >
                <DrawerOverlay bg="transparent" />
                <DrawerContent bg={themeBg} mt="44" ml="54" w="sm" maxWidth="sm">
                    <DrawerCloseButton bg={themeBg} border="px" mt={2.5} mr={2.5} w="24px" h="24px" borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')} color={useColorModeValue('light.lightestDarkGray', 'dark.Gray')}>
                        <DoubleAngleLeftIcon></DoubleAngleLeftIcon>
                    </DrawerCloseButton>
                    <DrawerHeader>Transformers</DrawerHeader>

                    <DrawerBody>
                        <InputGroup size='sm' w="275" bg={useColorModeValue('default.whiteText', 'dark.mediumDark')}
                            borderRadius='4px' border="1px" borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryDarkGrayishBlue')} _focus={{ outline: "none", boxShadow: "none" }}>
                            <InputLeftElement width="var(--chakra-sizes-10)"
                                pointerEvents='none'
                                children={<Search2Icon color='default.darkGray' />}
                            />
                            <Input placeholder="Search" _placeholder={{ color: 'default.gray' }} value={searchValue} border='none' paddingStart='var(--chakra-space-9)' paddingEnd='var(--chakra-space-4)' _focus={{ outline: "none", boxShadow: "none" }} onChange={searchChange} />
                            {showClearSearch ?
                                <InputRightElement width='4.5rem' justifyContent="flex-end">
                                    <IconButton aria-label='Search database' icon={<CloseIcon onClick={clearSearch} color='default.darkGray' />} bg="transparent" color={iconBg} _hover={{ background: "transparent" }} />
                                </InputRightElement> : ""}
                        </InputGroup>

                        <Flex marginTop="18">
                            <Box p='4' color={useColorModeValue('light.blue', 'dark.gray')} textDecoration="none">
                                Expand All
                            </Box>
                            <Center height="38" mt={4} h={5} background={useColorModeValue('light.blue', 'dark.gray')}>
                                <Divider orientation="vertical" />
                            </Center>
                            <Box p='4' color={useColorModeValue('light.blue', 'dark.gray')}>
                                Collapse All
                            </Box>
                        </Flex>
                        <Accordion allowMultiple>
                            <AccordionItem border="none" _last={{ border: 'none' }} borderStyle="none" mb='22px'>
                                {({ isExpanded }) => (
                                    <>
                                        <h2 style={{ border: 'none', borderStyle: "none" }}>
                                            <AccordionButton>
                                                {isExpanded ? (
                                                    <DownDeltaIcon />
                                                ) : (
                                                    <RightDeltaIcon />
                                                )}
                                                <Box display='flex' justifyContent="center" alignItems="center" ml="10">
                                                    <Box><TransformersIcon /></Box>
                                                    <Box flex="1" textAlign="left" ml='10'>

                                                        Input/Output
                                                    </Box></Box>


                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4} ml="20" mt="10">
                                            <List spacing={3}>
                                                <ListItem>
                                                    <Button leftIcon={<TransformersIcon styles={{color:"#000000"}}/>} h="52px" boxShadow="0px 3px 3px rgba(0, 0, 0, 0.08);" borderRadius="4px" 
                                                    justifyContent="flex-start" textAlign="left" borderColor={accordianItemBorder} bg={accordianItemBg} 
                                                    _hover={{background:accordianItemBg}} color={accordianTextColor} colorScheme='teal' variant='outline' width='257px'>PH_US_Sales_42</Button>
                                                </ListItem>
                                                <ListItem>
                                                <Button leftIcon={<TransformersIcon styles={{color:"#000000"}}/>} h="52px" boxShadow="0px 3px 3px rgba(0, 0, 0, 0.08);" borderRadius="4px" 
                                                    justifyContent="flex-start" textAlign="left" borderColor={accordianItemBorder} bg={accordianItemBg} 
                                                    _hover={{background:accordianItemBg}} color={accordianTextColor} colorScheme='teal' variant='outline' width='257px'>PH_US_Sales_42</Button>
                                                </ListItem>
                                                <ListItem>
                                                <Button leftIcon={<TransformersIcon styles={{color:"#000000"}}/>} h="52px" boxShadow="0px 3px 3px rgba(0, 0, 0, 0.08);" borderRadius="4px" 
                                                    justifyContent="flex-start" textAlign="left" borderColor={accordianItemBorder} bg={accordianItemBg} 
                                                    _hover={{background:accordianItemBg}} color={accordianTextColor} colorScheme='teal' variant='outline' width='257px'>PH_US_Sales_42</Button>
                                                </ListItem>
                                                {/* You can also use custom icons from react-icons */}
                                                <ListItem>
                                                <Button leftIcon={<TransformersIcon styles={{color:"#000000"}}/>} h="52px" boxShadow="0px 3px 3px rgba(0, 0, 0, 0.08);" borderRadius="4px" 
                                                    justifyContent="flex-start" textAlign="left" borderColor={accordianItemBorder} bg={accordianItemBg} 
                                                    _hover={{background:accordianItemBg}} color={accordianTextColor} colorScheme='teal' variant='outline' width='257px'>PH_US_Sales_42</Button>
                                                </ListItem>
                                            </List>
                                        </AccordionPanel>
                                    </>
                                )}

                            </AccordionItem>

                            <AccordionItem border="none" _last={{ border: 'none' }} borderStyle="none">
                                {({ isExpanded }) => (
                                    <>
                                        <h2 style={{ border: 'none', borderStyle: "none" }}>
                                            <AccordionButton>
                                                {isExpanded ? (
                                                    <DownDeltaIcon />
                                                ) : (
                                                    <RightDeltaIcon />
                                                )}
                                                <Box display='flex' justifyContent="center" alignItems="center" ml="10">
                                                    <Box><TransformersIcon /></Box>
                                                    <Box flex="1" textAlign="left" ml='10px'>

                                                    Dataframe Manipulation
                                                    </Box></Box>

                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4}>
                                            <List spacing={3}>
                                                <ListItem>
                                                    <Button colorScheme='teal' variant='outline' width='200px'>item 5</Button>
                                                </ListItem>
                                                <ListItem>
                                                    <Button colorScheme='teal' variant='outline' width='200px'>item 6</Button>
                                                </ListItem>
                                                <ListItem>
                                                    <Button colorScheme='teal' variant='outline' width='200px'>item 7</Button>
                                                </ListItem>
                                                {/* You can also use custom icons from react-icons */}
                                                <ListItem>
                                                    <Button colorScheme='teal' variant='outline' width='200px'>item 8</Button>
                                                </ListItem>
                                            </List>
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                        </Accordion>
                    </DrawerBody>

                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default TransformerMenu;
