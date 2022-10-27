import { Text, Box, Button, Input, InputGroup, InputLeftElement, useColorModeValue, Divider, Flex, Center, InputRightElement, IconButton, useFocusEffect } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react-use-disclosure";
import { useRef, ChangeEvent, useState, useEffect } from "react";

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

const TransformerMenu = (props: any) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef: any = useRef();
    const themeBg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    const iconBg = useColorModeValue('light.lighterGrayishBlue', 'dark.veryDarkGrayishBlue');

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
                    <DrawerContent bg={themeBg} mt="44px" ml="54px" >
                        <DrawerCloseButton bg={themeBg} border="1px" mt={2.5} mr={2.5} w="24px" h="24px" borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')} color={useColorModeValue('light.lightestDarkGray', 'dark.Gray')}>
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
                                <AccordionItem>
                                    <h2>
                                        <AccordionButton>
                                            <AccordionIcon />
                                            <Box flex="1" textAlign="left">
                                                Input/Output
                                            </Box>

                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel pb={4}>
                                        <List spacing={3}>
                                            <ListItem>
                                                <Button colorScheme='teal' variant='outline' width='200px'>item 1</Button>
                                            </ListItem>
                                            <ListItem>
                                                <Button colorScheme='teal' variant='outline' width='200px'>item 2</Button>
                                            </ListItem>
                                            <ListItem>
                                                <Button colorScheme='teal' variant='outline' width='200px'>item 3</Button>
                                            </ListItem>
                                            {/* You can also use custom icons from react-icons */}
                                            <ListItem>
                                                <Button colorScheme='teal' variant='outline' width='200px'>item 4</Button>
                                            </ListItem>
                                        </List>
                                    </AccordionPanel>
                                </AccordionItem>

                                <AccordionItem>
                                    <h2>
                                        <AccordionButton>
                                            <AccordionIcon />
                                            <Box flex="1" textAlign="left">
                                                Dataframe Manipulation
                                            </Box>

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
                                </AccordionItem>
                            </Accordion>
                        </DrawerBody>

                    </DrawerContent>
                </Drawer>
            </div>
        </div>
    );
};

export default TransformerMenu;
