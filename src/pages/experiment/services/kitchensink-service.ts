import * as joint from '@antuit/rappid-v1';
// import * as dagre from 'dagre';
import * as _ from 'lodash';
import {StencilService} from './stencil-service';
import {ToolbarService} from './toolbar-service';
import {InspectorService} from './inspector-service';
import {HaloService} from './halo-service';
import {KeyboardService} from './keyboard-service';
import * as appShapes from './app-shapes';

class KitchenSinkService {

    el: HTMLElement;
    graph: joint.dia.Graph | any;
    paper: joint.dia.Paper | any;
    paperScroller: joint.ui.PaperScroller | any;
    commandManager: joint.dia.CommandManager | any;
    snaplines: joint.ui.Snaplines | any;
    clipboard: joint.ui.Clipboard | any;
    selection: joint.ui.Selection | any;
    navigator: joint.ui.Navigator | any;

    stencilService: StencilService;
    toolbarService: ToolbarService;
    inspectorService: InspectorService;
    haloService: HaloService;
    keyboardService: KeyboardService;

    constructor(
        el: any,
        stencilService: StencilService,
        toolbarService: ToolbarService,
        inspectorService: InspectorService,
        haloService: HaloService,
        keyboardService: KeyboardService
    ) {
        this.el = el;

        // apply current joint js theme
        const view = new joint.mvc.View({ el });
        view.delegateEvents({
            'mouseup input[type="range"]': (evt) => evt.target.blur()
        });

        this.stencilService = stencilService;
        this.toolbarService = toolbarService;
        this.inspectorService = inspectorService;
        this.haloService = haloService;
        this.keyboardService = keyboardService;
    }

    startRappid(stencil: any, group: any) {
        console.log('I am in start Rappid Service')
        // Set the Theme of the Joint JS based on the CSS included in the canvasStyles
        joint.setTheme('modern');
        this.initializePaper();
        this.initializeStencil(stencil, group);
        this.initializeSelection();
        this.initializeToolsAndInspector();
        this.initializeNavigator();
        this.initializeToolbar();
        this.initializeKeyboardShortcuts();
        this.initializeTooltips();
    }

    initializePaper() {

        const graph = this.graph = new joint.dia.Graph({}, {
            cellNamespace: appShapes
        });

        this.commandManager = new joint.dia.CommandManager({ graph: graph });

        const paper = this.paper = new joint.dia.Paper({
            width: '100vw',
            height: '100vh',
            gridSize: 10,
            drawGrid: true,
            model: graph,
            cellViewNamespace: appShapes,
            background: {color: 'white'},
            defaultLink: <joint.dia.Link>new appShapes.app.Link(),
            defaultConnectionPoint: appShapes.app.Link.connectionPoint,
            interactive: { linkMove: false },
            async: true,
            snapLinks: { radius: 20 },
            sorting: joint.dia.Paper.sorting.APPROX,
            markAvailable: true,

            highlighting: {
                'magnetAvailability': {
                    name: 'addClass',
                    options: {
                        className: 'available-magnet'
                    }
                },
                'elementAvailability': {
                    name: 'stroke',
                    options: {
                        padding: 20,
                        attrs: {
                            'stroke-width': 3,
                            'stroke': '#ED6A5A'
                        }
                    }
                }
            },
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                // Prevent linking from input ports
                if (magnetS && magnetS.getAttribute('port-group') === 'in') return false;
                // Prevent linking from output ports to input ports within one element
                if (cellViewS === cellViewT) return false;
                // Prevent linking to output ports
                return magnetT && magnetT.getAttribute('port-group') === 'in';
            },
            validateMagnet: function(cellView, magnet) {
                // Note that this is the default behaviour. It is shown for reference purposes.
                // Disable linking interaction for magnets marked as passive
                return magnet.getAttribute('magnet') !== 'passive';
            }
        });

        // paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
        paper.on('cell:mousewheel', this.onMousewheel.bind(this));

        this.snaplines = new joint.ui.Snaplines({ paper: paper });

        const paperScroller = this.paperScroller = new joint.ui.PaperScroller({
            paper,
            autoResizePaper: false,
            scrollWhileDragging: true,
            cursor: 'grab',
            padding: 0
        });

        this.renderPlugin('.paper-container', paperScroller);
        paperScroller.render().center();
    }

    initializeStencil(stencil: any, group: any) {
        const { stencilService, paperScroller, snaplines } = this;
        stencilService.create(paperScroller, snaplines, group);

        this.renderPlugin('stencil-container', stencilService.stencil);
        stencilService.setShapes(stencil);

        stencilService.stencil.on('element:drop', (elementView: joint.dia.ElementView) => {
            this.selection.collection.reset([elementView.model]);
        });
    }

    initializeSelection() {

        this.clipboard = new joint.ui.Clipboard();
        this.selection = new joint.ui.Selection({ paper: this.paper, useModelGeometry: true });
        this.selection.collection.on('reset add remove', this.onSelectionChange.bind(this));

        const keyboard = this.keyboardService.keyboard;

        // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
        // Otherwise, initiate paper pan.
        this.paper.on('blank:pointerdown', (evt: joint.dia.Event, x: number, y: number) => {
            if (keyboard.isActive('shift', evt)) {
                this.selection.startSelecting(evt);
            } else {
                this.selection.collection.reset([]);
                this.paperScroller.startPanning(evt);
                this.paper.removeTools();
            }
        });

        this.paper.on('element:pointerdown', (elementView: joint.dia.ElementView, evt: joint.dia.Event) => {
            // Select an element if CTRL/Meta key is pressed while the element is clicked.
            if (keyboard.isActive('ctrl meta', evt)) {
                this.selection.collection.add(elementView.model);
            }

        });

        this.graph.on('remove', (cell: joint.dia.Cell) => {
            // If element is removed from the graph, remove from the selection too.
            if (this.selection.collection.has(cell)) {
                this.selection.collection.reset(this.selection.collection.models.filter((c: any) => c !== cell));
            }

        });

        this.selection.on('selection-box:pointerdown', (elementView: joint.dia.ElementView, evt: joint.dia.Event) => {
            // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
            if (keyboard.isActive('ctrl meta', evt)) {
                this.selection.collection.remove(elementView.model);
            }

        }, this);
    }

    onSelectionChange() {
        const { paper, selection } = this;
        const { collection } = selection;
        paper.removeTools();
        joint.ui.Halo.clear(paper);
        joint.ui.FreeTransform.clear(paper);
        joint.ui.Inspector.close();
        if (collection.length === 1) {
            const primaryCell: joint.dia.Cell = collection.first();
            const primaryCellView = paper.requireView(primaryCell);
            selection.destroySelectionBox(primaryCell);
            this.selectPrimaryCell(primaryCellView);
        } else if (collection.length === 2) {
            collection.each(function(cell: joint.dia.Cell) {
                selection.createSelectionBox(cell);
            });
        }
    }

    selectPrimaryCell(cellView: joint.dia.CellView) {
        const cell = cellView.model;
        if (cell.isElement()) {
            this.selectPrimaryElement(<joint.dia.ElementView>cellView);
        } else {
            this.selectPrimaryLink(<joint.dia.LinkView>cellView);
        }
        this.inspectorService.create(cell);
    }

    selectPrimaryElement(elementView: joint.dia.ElementView) {
        const element = elementView.model;

        new joint.ui.FreeTransform({
            cellView: elementView,
            allowRotation: false,
            preserveAspectRatio: !!element.get('preserveAspectRatio'),
            allowOrthogonalResize: element.get('allowOrthogonalResize') !== false
        }).render();

        this.haloService.create(elementView);
    }

    selectPrimaryLink(linkView: joint.dia.LinkView) {
        const ns = joint.linkTools;
        const toolsView = new joint.dia.ToolsView({
            name: 'link-pointerdown',
            tools: [
                new ns.Vertices(),
                new ns.SourceAnchor(),
                new ns.TargetAnchor(),
                new ns.SourceArrowhead(),
                new ns.TargetArrowhead(),
                new ns.Segments(),
                new ns.Boundary({ padding: 15 }),
                new ns.Remove({ offset: -20, distance: 40 })
            ]
        });

        linkView.addTools(toolsView);
    }

    initializeToolsAndInspector() {

        this.paper.on('cell:pointerup', (cellView: joint.dia.CellView) => {
            const cell = cellView.model;
            const { collection } = this.selection;
            if (collection.includes(cell)) { return; }
            collection.reset([cell]);
        });

        this.paper.on('link:mouseenter', (linkView: joint.dia.LinkView) => {

            // Open tool only if there is none yet
            if (linkView.hasTools()) { return; }

            const ns = joint.linkTools;
            const toolsView = new joint.dia.ToolsView({
                name: 'link-hover',
                tools: [
                    new ns.Vertices({ vertexAdding: false }),
                    new ns.SourceArrowhead(),
                    new ns.TargetArrowhead()
                ]
            });

            linkView.addTools(toolsView);
        });

        this.paper.on('link:mouseleave', (linkView: joint.dia.LinkView) => {

            // Remove only the hover tool, not the pointerdown tool
            if (linkView.hasTools('link-hover')) {
                linkView.removeTools();
            }
        });

        this.graph.on('change', (cell: joint.dia.Cell, opt: any ) => {
            if (!cell.isLink() || !opt.inspector) { return; }

            const ns = joint.linkTools;
            const toolsView = new joint.dia.ToolsView({
                name: 'link-inspected',
                tools: [
                    new ns.Boundary({ padding: 15 }),
                ]
            });

            cell.findView(this.paper).addTools(toolsView);
        });
    }

    initializeNavigator() {

        const navigator = this.navigator = new joint.ui.Navigator({
            width: 191,
            height: 125,
            paperScroller: this.paperScroller,
            paperOptions: {
                async: true,
                sorting: joint.dia.Paper.sorting.NONE,
                elementView: appShapes.NavigatorElementView,
                linkView: appShapes.NavigatorLinkView,
                cellViewNamespace: { /* no other views are accessible in the navigator */ }
            }
        });

        this.renderPlugin('.navigator-container', navigator);
    }

    initializeToolbar() {

        this.toolbarService.create(this.commandManager, this.paperScroller);

        this.toolbarService.toolbar.on({
            'svg:pointerclick': this.openAsSVG.bind(this),
            'png:pointerclick': this.openAsPNG.bind(this),
            'to-front:pointerclick': this.applyOnSelection.bind(this, 'toFront'),
            'to-back:pointerclick': this.applyOnSelection.bind(this, 'toBack'),
            // 'layout:pointerclick': this.layoutDirectedGraph.bind(this),
            'snapline:change': this.changeSnapLines.bind(this),
            'clear:pointerclick': this.graph.clear.bind(this.graph),
            'print:pointerclick': this.paper.print.bind(this.paper),
            'grid-size:change': this.paper.setGridSize.bind(this.paper)
        });

        this.renderPlugin('.toolbar-container', this.toolbarService.toolbar);
    }

    applyOnSelection(method: string) {
        this.graph.startBatch('selection');
        this.selection.collection.models.forEach((model: any) => { model[method](); });
        this.graph.stopBatch('selection');
    }

    changeSnapLines(checked: boolean) {

        if (checked) {
            this.snaplines.startListening();
            this.stencilService.stencil.options.snaplines = this.snaplines;
        } else {
            this.snaplines.stopListening();
            // @ts-ignore
            this.stencilService.stencil.options.snaplines = null;
        }
    }

    initializeKeyboardShortcuts() {

        this.keyboardService.create(
            this.graph, this.clipboard, this.selection, this.paperScroller, this.commandManager);
    }

    initializeTooltips(): joint.ui.Tooltip {

        return new joint.ui.Tooltip({
            rootTarget: document.body,
            target: '[data-tooltip]',
            direction: joint.ui.Tooltip.TooltipArrowPosition.Auto,
            padding: 10
        });
    }

    // backwards compatibility for older shapes
    exportStylesheet = '.scalable * { vector-effect: non-scaling-stroke }';

    openAsSVG() {

        this.paper.hideTools().toSVG((svg: string) => {
            new joint.ui.Lightbox({
                image: 'data:image/svg+xml,' + encodeURIComponent(svg),
                downloadable: true,
                fileName: 'Rappid'
            }).open();
            this.paper.showTools();
        }, {
            preserveDimensions: true,
            convertImagesToDataUris: true,
            useComputedStyles: false,
            stylesheet: this.exportStylesheet
        });
    }

    openAsPNG() {

        this.paper.hideTools().toPNG((dataURL: string) => {
            new joint.ui.Lightbox({
                image: dataURL,
                downloadable: true,
                fileName: 'Rappid'
            }).open();
            this.paper.showTools();
        }, {
            padding: 10,
            useComputedStyles: false,
            stylesheet: this.exportStylesheet
        });
    }

    onMousewheel(cellView: joint.dia.CellView, evt: joint.dia.Event, ox: number, oy: number, delta: number) {

        if (this.keyboardService.keyboard.isActive('alt', evt)) {
            evt.preventDefault();
            this.paperScroller.zoom(delta * 0.2, { min: 0.2, max: 5, grid: 0.2, ox, oy });
        }
    }

    // layoutDirectedGraph() {
    //
    //     joint.layout.DirectedGraph.layout(this.graph, {
    //         graphlib: dagre.graphlib,
    //         dagre: dagre,
    //         setVertices: true,
    //         rankDir: 'TB',
    //         marginX: 100,
    //         marginY: 100
    //     });
    //
    //     this.paperScroller.centerContent({ useModelGeometry: true });
    // }

    // The below Render Plugin of the class, behaves little differently for Stencil
    // You need to make sure, the Chakra components you use document.getElementsByClassName to find the dom association
    // Because Chakra components are Javascript by design and not HTML ELEMENTS.
    renderPlugin(selector: string, plugin: any): void {
        if(selector === 'stencil-container') {
            document.getElementsByClassName(selector)[0].appendChild(plugin.el);
            plugin.render();
                const stencilElement = document.getElementsByClassName(selector)[0];
                const toggleElement = stencilElement?.getElementsByClassName('groups-toggle')[0];
                toggleElement?.parentNode?.removeChild(toggleElement);
                const searchElement = stencilElement?.getElementsByClassName("search-wrap")[0];
                const toggleElement1 = toggleElement || "";
                searchElement?.after(toggleElement1);
                const groupLabel = stencilElement?.getElementsByClassName("group-label")[0];
                groupLabel?.parentNode?.removeChild(groupLabel);
                const expandBtn: HTMLButtonElement = stencilElement?.getElementsByClassName('btn btn-expand')[0] as HTMLButtonElement;
                expandBtn.innerHTML = (`<div>Expand All<span class='v-line-new'></span></div>`);
                const collapseBtn: HTMLButtonElement = stencilElement?.getElementsByClassName('btn btn-collapse')[0] as HTMLButtonElement;
                collapseBtn.innerHTML = (`<div class="collapseButtonReSpace">Collapse All</div>`);

        } else {
            this.el.querySelector(selector)?.appendChild(plugin.el);
            plugin.render();
        }

    }
}

export default KitchenSinkService;
