import React, { useEffect, useRef } from 'react';
import { dia, shapes, ui } from '@antuit/rappid-v1';
import './designer.scss';
import { Flex, Wrap, Button } from '@chakra-ui/react';
import * as appShapes from '../../models/app-shapes';
const Designer = (props: any) => {
    const canvas: any = useRef(null);
    let paperScroller: any;
    useEffect(() => {
        const graph = new dia.Graph({}, { cellNamespace: shapes });
        const paper = new dia.Paper({
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
        return () => {
            paperScroller.remove();
            nav.remove();
            paper.remove();
        };
    }, []);

    const zoomIn = () => {
        paperScroller.zoom(0.2, { max: 4 });
    };
    const zoomOut = () => {
        paperScroller.zoom(-0.2, { min: 0.2 });
    };
    return (
        <>
            <Button onClick={zoomIn}>Zoom In</Button>
            <Button onClick={zoomOut}>Zoom Out</Button>
            <Wrap className="canvas" ref={canvas}/>
            <Wrap id="navigator"/>
        </>

    );
};

export default Designer;
