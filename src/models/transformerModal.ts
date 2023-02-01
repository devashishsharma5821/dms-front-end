import assign from 'lodash/assign';
import isFunction from 'lodash/isFunction';

import type { dia } from 'jointjs';
import { Transformer, Port } from './transformer';
import { Stage } from './stage';
// import { theme } from '../styles/theme';
import { shapes } from '@antuit/rappid-v1';
import { InputOutputType } from './types';
import { StringHelper } from '../helpers/StringHelper';

export const TRANSFORMER_HEIGHT = 80;
export const TRANSFORMER_WIDTH = 100;
let theme: any;
type TSPort = Omit<Port, 'type'> & { type: Port['type'] | 'dummy' };

export class TransformerModel extends shapes.basic.Generic {
    element!: JSX.Element;
    public defaults() {
        return {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            ...(isFunction(super.defaults) ? super.defaults() : super.defaults),
            name: undefined,
            transformerId: undefined,
            inPorts: [] as TSPort[],
            outPorts: [] as TSPort[],
            icon: '',
            schema: {},
            layout: undefined,
            properties: {},
            outputs: undefined as Stage['outputs'] | undefined,
            portErrors: [],
            formErrors: [],
            pipeErrors: [],
            size: { width: TRANSFORMER_WIDTH, height: TRANSFORMER_HEIGHT },
            attrs: {
                '.': {
                    magnet: false
                },
                '.label-container': {
                    x: 0,
                    y: 0,
                    width: TRANSFORMER_WIDTH,
                    height: TRANSFORMER_HEIGHT
                },
                '.label': {
                    style: {
                        color: theme.palette.getContrastText(theme.palette.background.paper),
                        'text-align': 'center',
                        'font-family': 'ibm-plex-sans,Arial,Helvetica,sans-serif;',
                        'font-size': '10px',
                        'font-weight': 700,
                        overflow: 'hidden'
                    }
                },
                '.icon': { width: 18, height: 18, x: (TRANSFORMER_WIDTH - 18) / 2, y: 16, color: theme.palette.getContrastText(theme.palette.background.paper) }
            },
            ports: {
                groups: {
                    in: {
                        position: {
                            name: 'left'
                        },
                        attrs: {
                            '.port-body': {
                                fill: theme.palette.grey[200],
                                stroke: theme.palette.grey.A200,
                                'stroke-width': 1,
                                magnet: 'passive'
                            },
                            '.port-dummy': {
                                fill: 'transparent',
                                stroke: 'transparent',
                                magnet: false
                            }
                        }
                    },
                    out: {
                        position: {
                            name: 'right'
                        },
                        attrs: {
                            '.port-body': {
                                fill: theme.palette.grey[200],
                                stroke: theme.palette.grey.A200,
                                'stroke-width': 1,
                                magnet: true
                            },
                            '.port-dummy': {
                                fill: 'transparent',
                                stroke: 'transparent',
                                magnet: false
                            }
                        }
                    }
                }
            }
        };
    }

    public markup = StringHelper.singleline`
        <g>
            <defs>
                <filter id="f1" x="0" y="0" width="200%" height="200%">
                    <feOffset result="offOut" in="SourceGraphic" dx="0" dy="3" />
                    <feColorMatrix result="matrixOut" in="offOut" type="matrix" values="0.4 0 0 0 0 0 0.4 0 0 0 0 0 0.4 0 0 0 0 0 1 0" />
                    <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="2" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                </filter>
            </defs>
            <rect
                class="transformer"
                filter="url(#f1)"
                x="0"
                y="0"
                width="${TRANSFORMER_WIDTH}"
                height="${TRANSFORMER_HEIGHT}"
                fill="${theme.palette.background.paper}"
                stroke="${theme.palette.grey[400]}"
            />
            <foreignObject class="label-container">
               <div xmlns="http://www.w3.org/1999/xhtml" class="label" id="node_${this.get('id')}">
               </div>
           </foreignObject>
        </g>`;

    public initialize(attributes?: any) {
        super.initialize(attributes);

        this.updatePortItems();
    }

    private updatePortItems(_model?: any, _changed?: any, opt?: any) {
        const inPorts = this.get('inPorts');
        const outPorts = this.get('outPorts');
        // Make sure all ports are unique.
        const inPortItems = this.createPortItems('in', inPorts.length ? inPorts : [{ name: 'dummy-i', required: false, type: 'dummy' }]);
        const outPortItems = this.createPortItems('out', outPorts.length ? outPorts : [{ name: 'dummy-o', required: false, type: 'dummy' }]);

        this.prop('ports/items', inPortItems.concat(outPortItems), assign({ rewrite: true }, opt));
    }

    public createPortItem(group: string, port: TSPort) {
        return {
            id: port.name,
            type: port.type,
            group: group,
            markup:
                port.type === InputOutputType.Dataframe
                    ? '<rect class="port-body" x="-7" y="-7" width="14" height="14" stroke="transparent" />'
                    : port.type === InputOutputType.Dataset
                    ? '<circle class="port-body" r="7" />'
                    : port.type === InputOutputType.Metadata
                    ? '<polygon class="port-body" points="-7,0 -4.0,-7 4.0,-7 7,0 4.0,7 -4.0,7" stroke="transparent" />'
                    : port.type === InputOutputType.Model
                    ? '<polygon class="port-body" points="0,-7, 7,7, -7,7" stroke="tranparent" />'
                    : '<rect class="port-dummy" x="-7" y="-7" width="14" height="14" />',
            attrs: {
                '.port-body': {
                    'port-type': port.type
                },
                '.port-label': {
                    text: port.name
                }
            }
        };
    }

    public createPortItems(group: string, ports: Port[]) {
        return ports.map((port) => this.createPortItem(group, port));
    }

    public getTransformer(): Transformer {
        const { x, y } = this.position();

        return {
            stageId: this.get('id'),
            name: this.get('name'),
            label: this.get('label'),
            properties: this.get('properties'),
            position: { x, y }
        };
    }

    public setLabel(paper: dia.Paper, label: string, graph?: any) {
        if (graph) {
            graph.getCells().forEach((cell: any) => {
                if (cell.cid === this.cid) {
                    const view = this.findView(paper);
                    view.$el.find('.label').text(label);
                    this.set('label', label);
                }
            });
        } else {
            const view = this.findView(paper);
            view.$el.find('.label').text(label);
            this.set('label', label);
        }
    }
}

(shapes.basic as any).Transformer = TransformerModel;

export default TransformerModel;
