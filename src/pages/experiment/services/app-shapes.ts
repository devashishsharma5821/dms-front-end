import { dia, shapes, connectionPoints, g, util } from '@antuit/rappid-v1';
import { memoize } from 'lodash';

export namespace app {

    export class CircularModel extends shapes.standard.Ellipse {

        portLabelMarkup = [{
            tagName: 'text',
            selector: 'portLabel'
        }];

        defaults() {

            return util.defaultsDeep({
                type: 'app.CircularModel',
                attrs: {
                    root: {
                        magnet: false
                    }
                },
                ports: {
                    groups: {
                        'in': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            position: {
                                name: 'ellipse',
                                args: {
                                    startAngle: 0,
                                    step: 30
                                }
                            },
                            label: {
                                position: {
                                    name: 'radial',
                                    args: null
                                }
                            }
                        },
                        'out': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            position: {
                                name: 'ellipse',
                                args: {
                                    startAngle: 180,
                                    step: 30
                                }
                            },
                            label: {
                                position: {
                                    name: 'radial',
                                    args: null
                                }
                            }
                        }
                    }
                }
            }, shapes.standard.Ellipse.prototype.defaults);
        }
    }

    export class RectangularModel extends shapes.standard.Rectangle {

        portLabelMarkup = [{
            tagName: 'text',
            selector: 'portLabel'
        }];

        defaults() {

            return util.defaultsDeep({
                type: 'app.RectangularModel',
                attrs: {
                    root: {
                        magnet: false
                    }
                },
                ports: {
                    groups: {
                        'in': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            position: {
                                name: 'left'
                            },
                            label: {
                                position: {
                                    name: 'left',
                                    args: {
                                        y: 0
                                    }
                                }
                            }
                        },
                        'out': {
                            markup: [{
                                tagName: 'circle',
                                selector: 'portBody',
                                attributes: {
                                    'r': 10
                                }
                            }],
                            position: {
                                name: 'right'
                            },
                            attrs: {
                                portBody: {
                                    magnet: true,
                                    fill: '#61549c',
                                    strokeWidth: 0
                                },
                                portLabel: {
                                    fontSize: 11,
                                    fill: '#61549c',
                                    fontWeight: 800
                                }
                            },
                            label: {
                                position: {
                                    name: 'right',
                                    args: {
                                        y: 0
                                    }
                                }
                            }
                        }
                    }
                }
            }, shapes.standard.Rectangle.prototype.defaults);
        }
    }

    export class Link extends shapes.standard.Link {

        defaultLabel = {
            attrs: {
                rect: {
                    fill: '#ffffff',
                    stroke: '#8f8f8f',
                    strokeWidth: 1,
                    refWidth: 10,
                    refHeight: 10,
                    refX: -5,
                    refY: -5
                }
            }
        };

        private getDataWidthCached = memoize((d: string) => (new g.Path(d))?.bbox()?.width);

        static connectionPoint(line: any, view: any, magnet: any, opt: any, type: any, linkView: any): g.Point {
            const markerWidth = linkView.model.getMarkerWidth(type);
            opt = {offset: markerWidth, stroke: true};
            // connection point for UML shapes lies on the root group containg all the shapes components
            const modelType = view.model.get('type');
            if (modelType.indexOf('uml') === 0) { opt.selector = 'root'; }
            // taking the border stroke-width into account
            if (modelType === 'standard.InscribedImage') { opt.selector = 'border'; }
            return connectionPoints.boundary.call(this, line, view, magnet, opt, type, linkView);
        }

        defaults() {
            return util.defaultsDeep({
                type: 'app.Link',
                router: {
                    name: 'normal'
                },
                connector: {
                    name: 'rounded'
                },
                labels: [],
                attrs: {
                    line: {
                        stroke: '#8f8f8f',
                        strokeDasharray: '0',
                        strokeWidth: 2,
                        fill: 'none',
                        sourceMarker: {
                            type: 'path',
                            d: 'M 0 0 0 0',
                            stroke: 'none'
                        },
                        targetMarker: {
                            type: 'path',
                            d: 'M 0 -5 -10 0 0 5 z',
                            stroke: 'none'
                        }
                    }
                }
            }, shapes.standard.Link.prototype.defaults);
        }

        getMarkerWidth(type: any) {
            const d = (type === 'source') ? this.attr('line/sourceMarker/d') : this.attr('line/targetMarker/d');
            return this.getDataWidth(d);
        }

        getDataWidth(d: any) {
            return this.getDataWidthCached(d);
        }
    }
}

export const NavigatorElementView = dia.ElementView.extend({

    body: null,

    markup: [{
        tagName: 'rect',
        selector: 'body',
        attributes: {
            'fill': '#31d0c6'
        }
    }],

    initFlag: ['RENDER', 'UPDATE', 'TRANSFORM'],

    presentationAttributes: {
        size: ['UPDATE'],
        position: ['TRANSFORM'],
        angle: ['TRANSFORM']
    },

    confirmUpdate: function(flags: number) {

        if (this.hasFlag(flags, 'RENDER')) { this.render(); }
        if (this.hasFlag(flags, 'UPDATE')) { this.update(); }
        if (this.hasFlag(flags, 'TRANSFORM')) { this.updateTransformation(); }
    },

    render: function() {
        const { fragment, selectors: { body }} = util.parseDOMJSON(this.markup);
        this.body = body;
        this.el.appendChild(fragment);
    },

    update: function() {
        const { model, body } = this;
        const { width, height } = model.size();
        body.setAttribute('width', width);
        body.setAttribute('height', height);
    }
});


export const NavigatorLinkView = dia.LinkView.extend({

    initialize: util.noop,

    render: util.noop,

    update: util.noop
});

// re-export build-in shapes from rappid
export const basic = shapes.basic;
export const standard = shapes.standard;
export const fsa = shapes.fsa;
export const pn = shapes.pn;
export const erd = shapes.erd;
export const uml = shapes.uml;
export const org = shapes.org;
