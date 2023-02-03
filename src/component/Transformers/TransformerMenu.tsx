import { Box, Button, useColorModeValue, Divider, Flex, Center, useColorMode, IconButton } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react-use-disclosure";
import { useRef, useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client";
import './TransformerMenu.scss';
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
import React from "react";
import { dia, linkTools, shapes, ui } from "@antuit/rappid-v1";
import transformerMenuConf from "../../models/transformersConfig";
//     AggregationDisaggregationIcon,
//     AnomalyDetectionIcon,
//     ArtificialNeuralNetworkIcon,
//     CustomTransformersIcon,
//     DataFrameManipulationIcon,
//     FeatureExtractionIcon,
//     KeyPerformanceIndicatorIcon,
//     MachineLearningModelsIcon,
//     PromotionModelsIcon,
//     TimeSeriesModelsIcon,
//     TransformersIcon,
//     AggregationDisaggregationIcon_white,
//     AnomalyDetectionIcon_white,
//     ArtificialNeuralNetworkIcon_white,
//     CustomTransformersIcon_white,
//     DataFrameManipulationIcon_white,
//     FeatureExtractionIcon_white,
//     KeyPerformanceIndicatorIcon_white,
//     MachineLearningModelsIcon_white,
//     PromotionModelsIcon_white,
//     TimeSeriesModelsIcon_white,
//     TransformersIcon_white
// } from '../../assets/icons/AllTransformerIcons';

interface DynamicObject {
    [key: string]: any;
}

const TransformerMenu = (props: any) => {


    const iconComponents: any = {
        AggregationDisaggregationIcon: AggregationDisaggregationIcon,
        TransformersIcon: TransformersIcon,
        AnomalyDetectionIcon: AnomalyDetectionIcon,
        PromotionModelsIcon: PromotionModelsIcon,
        TimeSeriesModelsIcon: TimeSeriesModelsIcon,
        FeatureExtractionIcon: FeatureExtractionIcon,
        DataFrameManipulationIcon: DataFrameManipulationIcon,
        ArtificialNeuralNetworkIcon: ArtificialNeuralNetworkIcon,
        KeyPerformanceIndicatorIcon: KeyPerformanceIndicatorIcon,
        MachineLearningModelsIcon: MachineLearningModelsIcon,
        CustomTransformersIcon: CustomTransformersIcon
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
    const { colorMode } = useColorMode();
    const themeBg = useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue');
    const accordianItemBg = useColorModeValue('light.grayishBlue', 'dark.lightGrayishBlue');
    const accordianItemBorder = useColorModeValue('light.slightlyDesaturatedBlue', 'dark.lightGrayishBlue');
    const accordianTextColor = useColorModeValue('light.veryDarkBlue', 'dark.veryDarkGray');
    const panelCloseBtnBg = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    const bgColor = useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    const accordianItemColor = useColorModeValue('light.veryDarkBlue', 'dark.gray');
    //const [mainPaper, setMainPaper]  = React.useState<dia.Paper>(props.paper);
    // const [mainGraph, SetMainGraph]  = React.useState<dia.Graph>(props.graph);
    // const  [maiPaperScroller, setMainPaperScroller] = React.useState<ui.PaperScroller>(props.paperScroller);
    //  const [snaplines, setSnaplines] = React.useState<ui.Snaplines>(props.snaplines);
    const [mainSelection, setMainSelection] = React.useState<any>(props.mainSelection);
    const [clipboard, setClipboard] = React.useState<ui.Clipboard>();

    const canvasBg = useColorModeValue('white', '#171717');
    let transformersGroup:any = {};
    //new joint.ui.Snaplines({ paper: paper });
    /*
     * for grouping transformers data by category and returning formatted object
    */
    let  TransformerGraph = new dia.Graph({}, { cellNamespace: shapes });
    let TransformerPaper = new dia.Paper({
        width: 0,
        height: 0,
        model: TransformerGraph,
        gridSize:           20,
        drawGrid: true,
        snapLinks:          { radius: 600 },
        markAvailable:      true,
        background:         { color: canvasBg },
        interactive: { linkMove: false },
        frozen: true,
        async: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes,
        defaultLink: new dia.Link({
            attrs: { ".marker-target": { d: "M 10 0 L 0 5 L 10 10 z" } }
        }),
        validateConnection: function(
            cellViewS,
            magnetS,
            cellViewT,
            magnetT,
            end,
            linkView
        ) {
            // Prevent loop linking
            return magnetS !== magnetT;
        },
    });
    //setPaper(papert);
    // const selection = new ui.Selection({
    //         paper: paper,
    //     });
    // paper.on('element:pointerdown', (elementView: joint.dia.ElementView, evt: joint.dia.Event) => {

    //     // Select an element if CTRL/Meta key is pressed while the element is clicked.
    //    // if (keyboard.isActive('ctrl meta', evt)) {
    //         selection.collection.add(elementView.model);
    //   //  }

    // });


    let TransformerPaperScroller = new ui.PaperScroller({
        paper:TransformerPaper,
        autoResizePaper: true,
        scrollWhileDragging: true,
        cursor: 'grab'
    });

    // setPaperScroller(paperScrollert);

    TransformerPaperScroller?.render().center();

    const formatTransformerData = (transformerdata: any) => {
        sortTransformers();
        return  transformerdata.reduce((transformersList: any, currentObj: any) => {
            if(!transformersGroup[currentObj['category']])
                transformersGroup[currentObj['category']] = {index:transformerMenuConf[currentObj['category']].order,label:transformerMenuConf[currentObj['category']].category};
            (transformersList[currentObj['category']] = transformersList[currentObj['category']] || []).push(currentObj);
            return transformersList;
        }, {});
    };

    const sortTransformers = () => {
        let sortableData = Object.keys(transformerMenuConf).sort((a: any, b: any): any => {
            return transformerMenuConf[a].order - transformerMenuConf[b].order;
        });
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
    };

    /*
     * formatting transformers data and updating it to formatedTransformersData
     */

    const updateTransformersData = (transformerdata: TransformerDetail[]) => {
        const formatedtranformerData = formatTransformerData(transformerdata);
        setFormatedTransformersData(formatedtranformerData);
    };
    /*
     * filtering Transformers data by User Search Input
     */
    const onSearchChange = (searchVal: string) => {
        let searchResults = [];
        if (searchVal && searchVal !== '') {
            searchResults = transformarsData.filter((currentTransformer: any) => currentTransformer.name?.toLocaleLowerCase().indexOf(searchVal?.toLocaleLowerCase()) > -1);
        } else {
            searchResults = [...transformarsData];
        }
        const formatedData = formatTransformerData(searchResults);
        setFormatedTransformersData(formatedData);
    };

    const elementObj: any = {};

    const clickElement = (i: any) => {
        elementObj[i].click();
    };

    const toggleAccordian = (expandAll: boolean) => {
        const TransformersAccordions: any[] = Array.from(
            document.getElementsByClassName('chakra-accordion__button')
            // document.querySelectorAll("chakra - accordion__item")
        );
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

        // setSnaplines(props.snaplines);

        //let selectionT = new ui.Selection({ paper: TransformerPaper, useModelGeometry: true });
        //setMainSelection(selectionT);
        // let clipboardT = new ui.Clipboard();
        //  setClipboard(clipboardT);
        // selection.collection.on('reset add remove', onSelectionChange());
        //loadTransformers();
        const { GET_TRANSFORMERS } = getTransformersData();
        client
            .query<TransformerListResponse<Array<TransformerDetail>>>({
                query: GET_TRANSFORMERS
            })
            .then((response) => {
                let transformerdata = [...response.data.dmsTransformers];
                setTransformarsData(transformerdata);
                updateTransformersData(transformerdata)
                //  loadTransformers();
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {

        if(leftMenuOpen) {
            onOpen();
            // const timer = setTimeout(()=>{ loadTransformers(); },100)
        } else onClose();

    }, [leftMenuOpen]);

    const updateMainPaperScroller = () =>{
        // props.updatePaperScroll(TransformerPaperScroller);
    }


    // const loadTransformers = () =>{
    //     // TransformerPaper.on('blank:pointerdown', (evt) => {
    //     //     if (evt.shiftKey) mainSelection.startSelecting(evt);
    //     //     if (evt.altKey) TransformerPaperScroller.startPanning(evt);
    //     // });
    //     //updateMainPaperScroller();
    //
    //     console.log('ShowUp', props.mainPaper )
    //     const snapLinesNew = new ui.Snaplines({ paper: props.mainPaper });
    //     stencilService.loadStencil(transformarsData, colorMode);
    //     stencilService.create(props.mainPaperscroll, snapLinesNew);
    //     //const stencilElement: any = document.getElementById("stencil-container") as HTMLDivElement;
    //     //stencilElement.innerHTML = "";
    //     stencilService.stencil.$el.appendTo('#stencil-container');
    //     stencilService.stencil.render();
    //     stencilService.setShapes();
    //     //props.updatestencilService(stencilService);
    //     //let selectionc = new ui.Selection({ paper: mainPaper, useModelGeometry: true });
    //     // setMainSelection(selectionc);
    //     stencilService.stencil.on('element:drop', (elementView: dia.ElementView,evt: dia.Event ) => {
    //         // if(elementView)
    //         console.log('Do I have a drop now')
    //         mainSelection.collection.reset([elementView.model]);
    //     });
    //     // stencilService.stencil.on('element:dragstart', (elementView: dia.ElementView) => {
    //     //     if(elementView)
    //     //         props.addNewTransformer(elementView.model);
    //     //        // mainSelection.collection.reset([elementView.model]);
    //     // });
    //     updateHtml();
    // }
    // const updateHtml = () =>{
    //     const stencilElement = document.getElementById("stencil-container");
    //     const toggleElement =  stencilElement?.getElementsByClassName('groups-toggle')[0];
    //     toggleElement?.parentNode?.removeChild(toggleElement);
    //     const searchElement =stencilElement?.getElementsByClassName('search-wrap')[0];
    //     const toggleElement1 = toggleElement || "";
    //     searchElement?.after(toggleElement1);
    //     const groupLabel = stencilElement?.getElementsByClassName('group-label')[0];
    //     groupLabel?.parentNode?.removeChild(groupLabel);
    //     const expandBtn: HTMLButtonElement = stencilElement?.getElementsByClassName('btn-expand')[0] as HTMLButtonElement;
    //     expandBtn.innerText = "Expand All";
    //     const collapseBtn: HTMLButtonElement = stencilElement?.getElementsByClassName('btn-collapse')[0] as HTMLButtonElement;
    //     collapseBtn.innerText = "Collapse All";
    //
    // }



    // const assignColors = (darkColor: string, lightColor: string) => {
    //     return useColorModeValue('default.whiteText', 'dark.veryLightDarkGrayishBlue');
    // }
    const transformerAdded = (transformer:any)=>{
        props.addNewTransformer(transformer);
    }
    const updatestencilService = ()=>{
        // props.updateStencilService(stencilService);
    }

    useEffect(()=>{
        // if(transformarsData && transformarsData.length>0)
        //     loadTransformers()
    },[colorMode])
    return (
        <Box w="var(--chakra-space-60)" h='calc(90vh)' bg={useColorModeValue('light.lightGrayishBlue', 'dark.veryDarkGrayishBlue')} marginInlineStart="0" ml={44}>
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
                    <DrawerCloseButton
                        bg={panelCloseBtnBg}
                        _hover={{ background: panelCloseBtnBg }}
                        border="px"
                        mt="17"
                        mr={2.5}
                        w="24px"
                        h="24px"
                        borderColor={useColorModeValue('light.lighterGrayishBlue', 'dark.veryLightDarkGrayishBlue')}
                        color={useColorModeValue('light.lightestDarkGray', 'dark.Gray')}
                    >
                        <DoubleAngleLeftIcon></DoubleAngleLeftIcon>
                    </DrawerCloseButton>
                    <DrawerHeader mt="17" p="0">
                        Transformers
                    </DrawerHeader>

                    <DrawerBody pl='0' pt='14' pr="17">
                        <div className="stencil-container"/>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default TransformerMenu;
