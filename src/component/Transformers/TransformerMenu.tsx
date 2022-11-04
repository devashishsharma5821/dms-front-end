import {Box, Button, useColorModeValue, Divider, Flex, Center } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react-use-disclosure";
import { useRef, useState, useEffect } from "react";
import { useApolloClient} from "@apollo/client";
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
    List,
    ListItem,
} from "@chakra-ui/react";
import DoubleAngleLeftIcon from "../../assets/icons/DoubleAngleLeftIcon";
import DownDeltaIcon from "../../assets/icons/DownDeltaIcon";
import RightDeltaIcon from "../../assets/icons/RightDeltaIcon";
import TransformersIcon from "../../assets/icons/TransformersIcon";
import { TransformerDetail } from "../../models/transformerDetail";
import { TransformerListResponse } from "../../models/transformerListResponse";
import { getTransformersData } from "../../query";
import SearchComponent from "../search/SearchComponent";

const TransformerMenu = (props: any) => {

    const [formatedTransformersData, setFormatedTransformersData] = useState({});
    const client = useApolloClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef: any = useRef();
    const themeBg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    const accordianItemBg = useColorModeValue('light.grayishBlue', 'dark.lightGrayishBlue');
    const accordianItemBorder = useColorModeValue('light.slightlyDesaturatedBlue', 'dark.lightGrayishBlue');
    const accordianTextColor = useColorModeValue('light.veryDarkBlue', 'dark.veryDarkGray');
    const panelCloseBtnBg = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    
/*
 * for grouping transformers data by category and returning formatted object
*/
    const formatTransformerData = (transformerdata: any) => {
      return  transformerdata.reduce((transformersList:any, currentObj:any)=>{
             (transformersList[currentObj['category']] = transformersList[currentObj['category']] || []).push(currentObj);
                return transformersList;
        },{});
    }

/*
 * formatting transformers data and updating it to formatedTransformersData
*/
   
    const updateTransformersData = (transformerdata:TransformerDetail[])=>{
        const formatedtranformerData = formatTransformerData(transformerdata);
        setFormatedTransformersData(formatedtranformerData);
    }

/*
 * Query to  get transformers data
*/
    
    useEffect(() => {
        const { GET_TRANSFORMERS } = getTransformersData();
        client.query<TransformerListResponse<Array<TransformerDetail>>>({
                query: GET_TRANSFORMERS
            })
            .then((response) => {
                let transformerdata = [...response.data.dmsTransformers];
                updateTransformersData(transformerdata)
            })
            .catch((err) => console.error(err));
    },[])
    
    useEffect(() => {
        props.isLeftMenuOpen ? onOpen() : onClose();
    }, [props.isLeftMenuOpen]);
    useEffect(() => {
        props.toggleLeftMenu(isOpen);
    }, [isOpen]);

    return (
        <div>
            <Drawer isOpen={isOpen} placement="left" onClose={onClose} finalFocusRef={btnRef} id="left-overlay-menu" colorScheme={themeBg}>
                <DrawerOverlay bg="transparent" />
                <DrawerContent bg={themeBg} mt="44" ml="54" w="292px" maxWidth="292px">
                    <DrawerCloseButton bg={panelCloseBtnBg} _hover={{background:panelCloseBtnBg}} border="px" mt={2.5} mr={2.5} w="24px" h="24px" borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')} color={useColorModeValue('light.lightestDarkGray', 'dark.Gray')}>
                        <DoubleAngleLeftIcon></DoubleAngleLeftIcon>
                    </DrawerCloseButton>
                    <DrawerHeader>Transformers</DrawerHeader>

                    <DrawerBody paddingStart='var(--chakra-space-11)' paddingEnd='var(--chakra-space-11)' >
                        <SearchComponent/>

                        <Flex marginTop={18} fontFamily="Nunito">
                            <Box paddingLeft={11} paddingRight={10} color={useColorModeValue('light.blue', 'dark.gray')} fontWeight="bold" textDecoration="none" cursor="pointer">
                                Expand All
                            </Box>
                            <Center height="38"  h={5} background={useColorModeValue('light.blue', 'dark.gray')}>
                                <Divider orientation="vertical" />
                            </Center>
                            <Box pl={12} pr={73}  color={useColorModeValue('light.blue', 'dark.gray')} fontWeight="bold" cursor="pointer">
                                Collapse All
                            </Box>
                        </Flex>
                        <Accordion allowMultiple mt={22}>
                            {Object.entries(formatedTransformersData).map((transformerCategoryList: any)=>{
                                return (
                                <AccordionItem border="none" _last={{ border: 'none' }} borderStyle="none" mb='22'>
                                {({ isExpanded }) => (
                                    <>
                                        <h2 style={{ border: 'none', borderStyle: 'none' }}>
                                            <AccordionButton>
                                                {isExpanded ? (
                                                    <DownDeltaIcon />
                                                ) : (
                                                    <RightDeltaIcon />
                                                )}
                                                <Box display='flex' justifyContent="center"  fontWeight={600}  alignItems="center" ml="10">
                                                    <Box><TransformersIcon /></Box>
                                                    <Box flex="1" textAlign="left" ml='10'>

                                                   { transformerCategoryList[0] }
                                                    </Box></Box>


                                            </AccordionButton>
                                        </h2>
                                        <AccordionPanel pb={4} ml="9" mt="10" paddingStart="0" paddingEnd="0">
                                            <List spacing={3}>
                                                {[...transformerCategoryList[1]].map((item2:TransformerDetail,index)=>{
                                                    return(
                                                <ListItem id={'list-'+index}>
                                                    <Button leftIcon={<TransformersIcon/>} h="52px" boxShadow="0px 3px 3px rgba(0, 0, 0, 0.08);" borderRadius="4px" 
                                                    justifyContent="flex-start" textAlign="left" fontFamily="Nunito" borderColor={accordianItemBorder} bg={accordianItemBg} 
                                                    _hover={{background:accordianItemBg}} color={accordianTextColor} colorScheme='teal' variant='outline' width='257px'>{item2.name}</Button>
                                                </ListItem>
                                                    )
                                                })}
                                                
                                                
                                            </List>
                                        </AccordionPanel>
                                    </>
                                )}
                            </AccordionItem>
                            )
                            })}
  
                        </Accordion>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default TransformerMenu;
