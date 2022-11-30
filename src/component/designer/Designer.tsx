import React, { useEffect, useRef } from 'react';
import { dia, shapes, ui } from '@antuit/rappid-v1';
import './designer.scss';
import { Flex, Wrap, Button, Box, IconButton } from '@chakra-ui/react';
import * as appShapes from '../../models/app-shapes';
import ZoomInIcon from '../../assets/icons/ZoomInIcon';
import ZoomOutIcon from '../../assets/icons/ZoomOutIcon';
const Designer = (props: any) => {
    const canvas: any = useRef(null);
    const designerElement = React.useRef<HTMLDivElement | null>(null);
    const [ paperState, setPaperState ] = React.useState<dia.Paper | undefined>(undefined);
    const [ paperScrollerState, setPaperScrollerState ] = React.useState<any>(undefined);
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
            background:         { color: 'white' },
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
        setPaperScrollerState(paperScroller)
        setPaperState(paper);
        return () => {
            paperScroller.remove();
            nav.remove();
            paper.remove();
        };
    }, []);

    const zoomIn = () => {
        paperScrollerState.zoom(0.2, { max: 4 });
    };
    const zoomOut = () => {
        paperScrollerState.zoom(-0.2, { min: 0.2 });
    };
    React.useEffect( () => {
        const setPaperDimensions = () =>{
            let width = designerElement.current?.clientWidth || 20;
            let height = designerElement.current?.clientHeight || 20; 
            paperState?.setDimensions(width, height);
        }
        setPaperDimensions();
        window.addEventListener('resize', setPaperDimensions);
        return () => {window.removeEventListener('resize', setPaperDimensions); }
        },
        [paperState]
    );
    return (
        <Box position="relative">
            <Box position="absolute" zIndex={10} bottom="75px" right="180px">
                {/* <Button onClick={zoomIn} mr="5px" backgroundColor="#808080" _hover={{bg:"#929090"}}>Zoom In</Button>
                <Button onClick={zoomOut} backgroundColor="#808080" _hover={{bg:"#929090"}}>Zoom Out</Button> */}
                <IconButton aria-label='Zoom In' variant='outline' icon={<ZoomInIcon />} onClick={zoomIn}/>
                 <IconButton aria-label='Zoom Out' variant='outline' icon={<ZoomOutIcon />} onClick={zoomOut} />
            </Box>
            <Box ref={designerElement} className="designer"><Wrap className="canvas" ref={canvas} /></Box>
            <Box position="absolute" bottom="75px"><Wrap id="navigator" /></Box>
        </Box>

    );
};

export default Designer;
