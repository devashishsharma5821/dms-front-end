import React, { useEffect, useRef } from 'react';
import { dia, shapes, ui } from '@antuit/rappid-v1';
import './designer.scss';
import { Flex, Wrap, Button, Box, IconButton, useColorModeValue, useColorMode } from '@chakra-ui/react';
import * as appShapes from '../../models/app-shapes';
import ZoomInIcon from '../../assets/icons/ZoomInIcon';
import ZoomOutIcon from '../../assets/icons/ZoomOutIcon';
import FitToContent from '../../assets/icons/FitToContent';
const Designer = (props: any) => {
    const canvas: any = useRef(null);
    const designerElement = React.useRef<HTMLDivElement | null>(null);
    const [ paperState, setPaperState ] = React.useState<dia.Paper | undefined>(undefined);
    const [ paperScrollerState, setPaperScrollerState ] = React.useState<any>(undefined);
    const [ canvasBackground, setCanvasBackground ] = React.useState<any>();
    const [ canvasBackgroundSize, setCanvasBackgroundSize ] = React.useState<any>();
    const [ dotSpace, setDotSpace ] = React.useState<any>(20);
    const [ dotSize, setDotSize ] = React.useState<any>(1);
    const {colorMode} = useColorMode();
    const canvasBg = useColorModeValue('white', '#171717');
    let paperScroller: any;
    useEffect(() => {
        const graph = new dia.Graph({}, { cellNamespace: shapes });
        const paper = new dia.Paper({
            width: 0,
            height: 0,
            model: graph,
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

        paperScroller = new ui.PaperScroller({
            paper,
            autoResizePaper: true,
            scrollWhileDragging: true,
            cursor: 'grab'
        });
        canvas.current.appendChild(paperScroller.el);
        paperScroller.render().center();
        const nav = new ui.Navigator({
            width: 240,
            height: 115,
            paperScroller: paperScroller,
            zoom: false,
            paperOptions: {
                async: true,
                sorting: dia.Paper.sorting.NONE,
                elementView: appShapes.NavigatorElementView,
                linkView: appShapes.NavigatorLinkView,
                cellViewNamespace: { /* no other views are accessible in the navigator */ }
            }
        });
        nav.$el.appendTo('#navigator');
        nav.render();
        const m1 = new shapes.devs.Model({
            position: { x: 50, y: 50 },
            size: { width: 90, height: 90 },
            inPorts: ["in1", "in2"],
            outPorts: ["out"],
            ports: {
                groups: {
                    in: {
                        attrs: {
                            ".port-body": {
                                fill: "#16A085",
                                magnet: "passive"
                            }
                        }
                    },
                    out: {
                        attrs: {
                            ".port-body": {
                                fill: "#E74C3C"
                            }
                        }
                    }
                }
            },
            attrs: {
                ".label": { text: "Model", "ref-x": 0.5, "ref-y": 0.2 },
                rect: { fill: "#2ECC71" }
            }
        });
        graph.addCell(m1);

        const m2 = m1.clone();
        m2.translate(300, 0);
        graph.addCell(m2);
        m2.attr(".label/text", "Model 2");
        paper.unfreeze();
        paper.on('blank:pointerdown', paperScroller.startPanning);
        setPaperScrollerState(paperScroller);
        setPaperState(paper);
        return () => {
            paperScroller.remove();
            nav.remove();
            paper.remove();
        };
    }, []);

    const zoomIn = () => {
        paperScrollerState.zoom(0.2, { max: 4 });
        if(dotSpace < 80)
        setDotSpace(dotSpace+4);
        if(dotSize < 4)
        setDotSize(dotSize+0.2);
    };
    const zoomOut = () => {
        paperScrollerState.zoom(-0.2, { min: 0.2 });
        if(dotSpace >4)
        setDotSpace(dotSpace-4);
        if(dotSize > 0.4)
            setDotSize(dotSize-0.2);
    };

    const fitToContent = () => {
        const opt = {padding:150, scaleGrid:0.2}
        paperScrollerState.zoomToFit(opt);
        paperScrollerState.zoomToRect();
    };

    const setCanvasBackgroundMode = () =>{
        let bg = "";
        let bgSize = "";
        if(colorMode === "light"){
            bg = "linear-gradient(90deg, #ffffff, "+(dotSpace - dotSize)+"px, transparent 1%) center, linear-gradient(#ffffff, "+(dotSpace - dotSize)+"px, transparent 1%) center, #aaaaaa";
            bgSize = dotSpace+"px "+dotSpace+"px";
            paperState?.setGrid(true);
            paperState?.drawGrid( {name:'dot'});
        }else{
            bg = "#171717";
            bgSize = "unset";
            paperState?.setGrid(false);
        }
        
            setCanvasBackground(bg);
            setCanvasBackgroundSize(bgSize);
    }
    React.useEffect( () => {
        const setPaperDimensions = () =>{
            let width = designerElement.current?.clientWidth || 20;
            let height = designerElement.current?.clientHeight || 20; 
            paperState?.setDimensions(width, height);
           
        }
        setPaperDimensions();
         setCanvasBackgroundMode();
        window.addEventListener('resize', setPaperDimensions);
        
        return () => {window.removeEventListener('resize', setPaperDimensions); }
        },
        [paperState, dotSpace, canvasBg]
    );
    React.useEffect( () => {
        paperState?.drawBackground({color:canvasBg});       
        setCanvasBackgroundMode();
        
    },[canvasBg]);
    return (
        <Box position="relative" background={canvasBackground} backgroundSize={canvasBackgroundSize}>
            <Box position="absolute" zIndex={10} bottom="75px" right="180px" display="flex" flexDirection="column">
                {/* <Button onClick={zoomIn} mr="5px" backgroundColor="#808080" _hover={{bg:"#929090"}}>Zoom In</Button>
                <Button onClick={zoomOut} backgroundColor="#808080" _hover={{bg:"#929090"}}>Zoom Out</Button> */}
                <IconButton aria-label='Fit' variant='outline' icon={<FitToContent />} onClick={fitToContent} height="57px" width="56px" marginBottom="16px" />
                <IconButton aria-label='Zoom In' variant='outline' icon={<ZoomInIcon />} onClick={zoomIn} height="57px" width="56px" borderBottomRadius="none"/>
                 <IconButton aria-label='Zoom Out' variant='outline' icon={<ZoomOutIcon />} onClick={zoomOut} height="57px" width="56px" borderTopRadius="none"/>
            </Box>
            <Box ref={designerElement} className="designer"><Wrap className="canvas" ref={canvas} /></Box>
            <Box position="absolute" bottom="75px"><Wrap id="navigator" overflow="unset"/></Box>
        </Box>

    );
};

export default Designer;
