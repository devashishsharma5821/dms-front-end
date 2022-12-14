import { Box, Button, useColorModeValue, Divider, Flex, Center, useColorMode, IconButton } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react-use-disclosure";
import { useRef, useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import './TransformerMenu.scss'

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
import {
    AggregationDisaggregationIcon, AnomalyDetectionIcon, ArtificialNeuralNetworkIcon,
    CustomTransformersIcon, DataFrameManipulationIcon, FeatureExtractionIcon, KeyPerformanceIndicatorIcon,
    MachineLearningModelsIcon, PromotionModelsIcon, TimeSeriesModelsIcon, TransformersIcon,
    AggregationDisaggregationIcon_white, AnomalyDetectionIcon_white, ArtificialNeuralNetworkIcon_white,
    CustomTransformersIcon_white, DataFrameManipulationIcon_white, FeatureExtractionIcon_white, KeyPerformanceIndicatorIcon_white,
    MachineLearningModelsIcon_white, PromotionModelsIcon_white, TimeSeriesModelsIcon_white, TransformersIcon_white
} from "../../assets/icons/AllTransformerIcons";
import { TransformerDetail } from "../../models/transformerDetail";
import { TransformerListResponse } from "../../models/transformerListResponse";
import { getTransformersData } from "../../query";
import SearchComponent from "../search/SearchComponent";
import client from "../../apollo-client";
import TransformerMenuItem from "./TransformerMenuItem";
import DoubleAngleRightIcon from "../../assets/icons/DoubleAngleRightIcon";

interface DynamicObject {
    [key: string]: any
}

const TransformerMenu = (props: any) => {
  
    const transformerMenuConf: any = {
        'Input/Output': {
            category: 'Input/Output',
            order: 1,
            icon: "TransformersIcon",
            backgroundDark: "#C9C5E9",
            backgroundLight: "#ECEAFD",
            borderDark: "#C9C5E9",
            borderLight: "#9792C8"
        },
        'Anomaly Detection/Imputation': {
            category: 'Anomaly Detection/Imputation',
            order: 4,
            icon: "AnomalyDetectionIcon",
            backgroundDark: "#83C7FB",
            backgroundLight: "#E3F7FA",
            borderDark: "#83C7FB",
            borderLight: "#97C2C9"
        },
        'Promotion Model': {
            category: 'Promotion Model',
            order: 3,
            icon: "PromotionModelsIcon",
            backgroundDark: "#FFC2C8",
            backgroundLight: "#FEEBEE",
            borderDark: "#FFC2C8",
            borderLight: "#C0999F"
        },
        'Time-Series Models': {
            category: 'Time-Series Models',
            order: 2,
            icon: "TimeSeriesModelsIcon",
            backgroundDark: "#E9E5CB",
            backgroundLight: "#FDFBEA",
            borderDark: "#E9E5CB",
            borderLight: "#C9C49C"
        },
        'Feature Extraction': {
            category: 'Feature Extraction',
            order: 5,
            icon: "FeatureExtractionIcon",
            backgroundDark: "#F6C99F",
            backgroundLight: "#FBF3E3",
            borderDark: "#F6C99F",
            borderLight: "#DAC8A1"
        },
        'Dataframe Manipulation': {
            category: 'Dataframe Manipulation',
            order: 6,
            icon: "DataFrameManipulationIcon",
            backgroundDark: "#80E0C0",
            backgroundLight: "#F1FFF2",
            borderDark: "#80E0C0",
            borderLight: "#53AC59"
        },
        'Aggregation/Disaggregation': {
            category: 'Aggregation/Disaggregation',
            order: 7,
            icon: "AggregationDisaggregationIcon",
            backgroundDark: "#B9B8FF",
            backgroundLight: "#ECF5FF",
            borderDark: "#B9B8FF",
            borderLight: "#5686BD"
        },
        'Artificial Neural Network': {
            category: 'Artificial Neural Network',
            order: 8,
            icon: "ArtificialNeuralNetworkIcon",
            backgroundDark: "#EDEDED",
            backgroundLight: "#EDEDED",
            borderDark: "#EDEDED",
            borderLight: "#C1BDBD"
        },
        'Key Performance Indicator': {
            category: 'Key Performance Indicator',
            order: 9,
            icon: "KeyPerformanceIndicatorIcon",
            backgroundDark: "#CEE095",
            backgroundLight: "#F8FFE9",
            borderDark: "#CEE095",
            borderLight: "#BEC8A9"
        },
        'Machine Learning Models': {
            category: 'Machine Learning Models',
            order: 10,
            icon: "MachineLearningModelsIcon",
            backgroundDark: "#F9BFFF",
            backgroundLight: "#FFF6F0",
            borderDark: "#F9BFFF",
            borderLight: "#A75A2E"
        },
        'Custom Transformers': {
            category: 'Custom Transformers',
            order: 11,
            icon: "CustomTransformersIcon",
            backgroundDark: "#C1E0EB",
            backgroundLight: "#E8F4F4",
            borderDark: "#C1E0EB",
            borderLight: "#90B9BF"
        },
    }
    const iconComponents: any = {
        'AggregationDisaggregationIcon': AggregationDisaggregationIcon,
        'TransformersIcon': TransformersIcon,
        'AnomalyDetectionIcon': AnomalyDetectionIcon,
        'PromotionModelsIcon': PromotionModelsIcon,
        'TimeSeriesModelsIcon': TimeSeriesModelsIcon,
        'FeatureExtractionIcon': FeatureExtractionIcon,
        'DataFrameManipulationIcon': DataFrameManipulationIcon,
        'ArtificialNeuralNetworkIcon': ArtificialNeuralNetworkIcon,
        'KeyPerformanceIndicatorIcon': KeyPerformanceIndicatorIcon,
        'MachineLearningModelsIcon': MachineLearningModelsIcon,
        'CustomTransformersIcon': CustomTransformersIcon,
    };

    const iconComponentsDark: any = {
        'AggregationDisaggregationIcon': AggregationDisaggregationIcon_white,
        'TransformersIcon': TransformersIcon_white,
        'AnomalyDetectionIcon': AnomalyDetectionIcon_white,
        'PromotionModelsIcon': PromotionModelsIcon_white,
        'TimeSeriesModelsIcon': TimeSeriesModelsIcon_white,
        'FeatureExtractionIcon': FeatureExtractionIcon_white,
        'DataFrameManipulationIcon': DataFrameManipulationIcon_white,
        'ArtificialNeuralNetworkIcon': ArtificialNeuralNetworkIcon_white,
        'KeyPerformanceIndicatorIcon': KeyPerformanceIndicatorIcon_white,
        'MachineLearningModelsIcon': MachineLearningModelsIcon_white,
        'CustomTransformersIcon': CustomTransformersIcon_white,
    }
    const [transformarsData, setTransformarsData] = useState(new Array<TransformerDetail>());
    const [formatedTransformersData, setFormatedTransformersData] = useState<DynamicObject>({});
    const [sortedTransformersData, setSortedTransformersData] = useState(Array<string>);
    const [leftMenuOpen, setLeftMenuOpen] = useState(false);
    const client = useApolloClient();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef: any = useRef();
    const {colorMode} = useColorMode();
    const themeBg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    const accordianItemBg = useColorModeValue('light.grayishBlue', 'dark.lightGrayishBlue');
    const accordianItemBorder = useColorModeValue('light.slightlyDesaturatedBlue', 'dark.lightGrayishBlue');
    const accordianTextColor = useColorModeValue('light.veryDarkBlue', 'dark.veryDarkGray');
    const panelCloseBtnBg = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    const bgColor = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    const accordianItemColor = useColorModeValue('light.veryDarkBlue', 'dark.gray');
    /*
     * for grouping transformers data by category and returning formatted object
    */
    const formatTransformerData = (transformerdata: any) => {
        sortTransformers();
        return  transformerdata.reduce((transformersList: any, currentObj: any) => {
            (transformersList[currentObj['category']] = transformersList[currentObj['category']] || []).push(currentObj);
            return transformersList;
        }, {});
         
    }

    const sortTransformers = () => {
        
        let sortableData = Object.keys(transformerMenuConf).sort((a:any,b:any): any=>{ return transformerMenuConf[a].order - transformerMenuConf[b].order});
        setSortedTransformersData(sortableData);
       // let sortTransformers: any = {};
        //sortableData.map((TransformerArray, index)=>{ sortTransformers[sortableData[index]]= transformerdata[sortableData[index]]})
        // for(let i=0;i<sortableData.length;i++){
        //     sortTransformers[sortableData[i]] =  transformerdata[sortableData[i]]
        // }
        // return transformerdata;
        // let sortableData = [];
        // for(var category in transformerMenuConf){
        //     sortableData.push([category, transformerMenuConf[category]]);
        // }
        // sortableData.sort((a:any,b:any): any=>{ return a[1].order - b[1].order})
        // let sortTransformers: any = {};
        // sortableData.forEach((TransformerArray)=>{ sortTransformers[TransformerArray[0]]= transformerdata[TransformerArray[0]]})
        // return sortTransformers;
    }

    /*
     * formatting transformers data and updating it to formatedTransformersData
    */

    const updateTransformersData = (transformerdata: TransformerDetail[]) => {
        const formatedtranformerData = formatTransformerData(transformerdata);
        setFormatedTransformersData(formatedtranformerData);
    }
    /*
    * filtering Transformers data by User Search Input
     */
    const onSearchChange = (searchVal: string) => {
        let searchResults = [];
        if (searchVal && searchVal !== "") {
            searchResults = transformarsData.filter((currentTransformer: any) => currentTransformer.name?.toLocaleLowerCase().indexOf(searchVal?.toLocaleLowerCase()) > -1);

        } else {
            searchResults = [...transformarsData]
        }
        const formatedData = formatTransformerData(searchResults);
        setFormatedTransformersData(formatedData);

    }

    var elementObj: any = {};

    const clickElement = (i: any) => {
        console.log("count=", i);
        elementObj[i].click();
    }

    const toggleAccordian = (expandAll: boolean) => {

        const TransformersAccordions: any[] = Array.from(
            document.getElementsByClassName("chakra-accordion__button")
            // document.querySelectorAll("chakra - accordion__item")
        );
        console.log("TransformersAccordions=" + TransformersAccordions);
        for (let i = 0; i < TransformersAccordions.length; i++) {
            ((index) => TransformersAccordions[index].click())(i);
        }

        // chakraAccordionButtons.map((element: any) => {
        //   element.setAttribute("aria-expanded", expandAll.toString());
        //   element.Click();
        // });

        // TransformersAccordions.forEach(button => {
        //     button.click();
        //     // button.addEventListener('click', function handleClick(event: any) {
        //     //     console.log('button clicked');
        //     //     console.log(event);
        //     //     console.log(event.target);
        //     // });
        // })
    };
    const toggleLeftMenu = () => {
        setLeftMenuOpen(!leftMenuOpen);
    };

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
                setTransformarsData(transformerdata);
                updateTransformersData(transformerdata)
            })
            .catch((err) => console.error(err));
    }, [])

    useEffect(() => {
        leftMenuOpen ? onOpen() : onClose();
    }, [leftMenuOpen]);
    

    // const assignColors = (darkColor: string, lightColor: string) => {
    //     return useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    // }

    return (
        <Box  w="var(--chakra-space-60)" bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')} marginInlineStart="0" ml={44}>
            <Box textAlign="right" ml="26">
                            <IconButton
                                aria-label="expand"
                                minWidth="0"
                                border="1px"
                                width="24px"
                                height="24px"
                                borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')}
                                background={bgColor}
                                _active={{ background: bgColor }}
                                _hover={{ background: bgColor }}
                                icon={<DoubleAngleRightIcon />}
                                mt={-85}
                                mr={18}
                                onClick={toggleLeftMenu}
                            />
                        </Box>
                        <Box position="relative" width="104px" transform="rotate(270deg)" left={-16} mt={30} textAlign="right">
                            <Box color={useColorModeValue('light.VeryDarkBlue', 'dark.Gray')} fontWeight="600">
                                Transformers
                            </Box>
                        </Box>
            <Drawer isOpen={isOpen} placement="left" onClose={toggleLeftMenu} finalFocusRef={btnRef} id="left-overlay-menu" colorScheme={themeBg}>
                <DrawerOverlay bg="transparent" />
                <DrawerContent bg={themeBg} mt="44" ml="54" pl="18" w="292px" maxWidth="292px">
                    <DrawerCloseButton bg={panelCloseBtnBg} _hover={{ background: panelCloseBtnBg }} border="px" mt="17" mr={2.5} w="24px" h="24px" borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')} color={useColorModeValue('light.lightestDarkGray', 'dark.Gray')}>
                        <DoubleAngleLeftIcon></DoubleAngleLeftIcon>
                    </DrawerCloseButton>
                    <DrawerHeader mt="17" p="0" >Transformers</DrawerHeader>

                    <DrawerBody pl='0' pt='14' pr="17">
                        <SearchComponent searchChange={(val: string) => { onSearchChange(val) }} />

                        <Flex mt='18'>
                            <Box pl={0} pr={13} color={useColorModeValue('light.blue', 'dark.gray')} fontWeight="bold" textDecoration="none" cursor="pointer" onClick={() => { toggleAccordian(true) }}>
                                Expand All
                            </Box>
                            <Center height="38" h={5} background={useColorModeValue('light.blue', 'dark.gray')}>
                                <Divider orientation="vertical" />
                            </Center>
                            <Box pl={12} color={useColorModeValue('light.blue', 'dark.gray')} fontWeight="bold" cursor="pointer" onClick={() => { toggleAccordian(false) }}>
                                Collapse All
                            </Box>
                        </Flex>
                        <Accordion allowMultiple mt={22}>
                            {
                                
                                sortedTransformersData.map((category: any, index) => {
                                    if(formatedTransformersData[sortedTransformersData[index]]){
                                let iconName = transformerMenuConf[sortedTransformersData[index]].icon;
                                let CurrentIconComponent = (colorMode === 'light')? iconComponents[iconName]:iconComponentsDark[iconName];
                                return (
                                    <AccordionItem border="none" _last={{ border: 'none' }} color={accordianItemColor} borderStyle="none" mb='22'>
                                        {({ isExpanded }) => (
                                            <>
                                                <h2 style={{ border: 'none', borderStyle: 'none' }}>
                                                    <AccordionButton>
                                                        {isExpanded ? (
                                                            <DownDeltaIcon />
                                                        ) : (
                                                            <RightDeltaIcon />
                                                        )}
                                                        <Box display='flex' justifyContent="center" fontWeight={600} alignItems="center" ml="12">
                                                            <Box><CurrentIconComponent /></Box>
                                                            <Box flex="1" textAlign="left" ml='10'>

                                                                {sortedTransformersData[index]}
                                                            </Box></Box>


                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}  mt="10" width="257px"  paddingStart="0" paddingEnd="0">
                                                    <List spacing={3} >
                                                        {[...formatedTransformersData[sortedTransformersData[index]]].map((transformerData: TransformerDetail, index) => {
                                                            let curentConfig = transformerMenuConf[transformerData.category];
                                                            return (

                                                                <TransformerMenuItem config={curentConfig} index={index} name={transformerData.name} />
                                                            )
                                                        })}


                                                    </List>
                                                </AccordionPanel>
                                            </>
                                        )
                                        }
                                    </AccordionItem>
                                )
                            }})}

                        </Accordion>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box >
    );
};

export default TransformerMenu;