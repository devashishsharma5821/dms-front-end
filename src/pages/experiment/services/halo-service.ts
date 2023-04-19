import { dia, ui } from '@antuit/rappid-v1';
const Position = ui.Halo.HandlePosition;

export class HaloService {
    halo: ui.Halo | any;

    create(cellView: dia.CellView) {
        this.halo = new ui.Halo({
            cellView,
            handles: this.getHaloConfig(),
            useModelGeometry: false
        }).render();
        this.startRecording();
    }
    startRecording() {
        this.halo.on('action:play:pointerdown', (evt: any) => {
            evt.stopPropagation();
            console.log('I am Triggered CHECK ME FOR PLAY ')
        });
    }

    getHaloConfig() {
        return [
            {
                name: 'remove',
                position: Position.NW,
                events: { pointerdown: 'removeElement' },
                attrs: {
                    '.handle': {
                        'data-tooltip-class-name': 'small',
                        'data-tooltip': 'Click to remove the object',
                        'data-tooltip-position': 'right',
                        'data-tooltip-padding': 15
                    }
                }
            },
            {
                name: 'play',
                position: Position.NE,
                icon: `/v3-dms/assets/icon/transformersIcons/AnomalyIconDark.svg`,
                attrs: {
                    '.handle': {
                        'data-tooltip-class-name': 'small',
                        'data-tooltip': 'Click to start the Inference',
                        'data-tooltip-position': 'right',
                        'data-tooltip-padding': 15
                    }
                }
            },
            // {
            //     name: 'clone',
            //     position: Position.SE,
            //     events: { pointerdown: 'startCloning', pointermove: 'doClone', pointerup: 'stopCloning' },
            //     attrs: {
            //         '.handle': {
            //             'data-tooltip-class-name': 'small',
            //             'data-tooltip': 'Click and drag to clone the object',
            //             'data-tooltip-position': 'left',
            //             'data-tooltip-padding': 15
            //         }
            //     }
            // },
            // {
            //     name: 'unlink',
            //     position: Position.W,
            //     events: { pointerdown: 'unlinkElement' },
            //     attrs: {
            //         '.handle': {
            //             'data-tooltip-class-name': 'small',
            //             'data-tooltip': 'Click to break all connections to other objects',
            //             'data-tooltip-position': 'right',
            //             'data-tooltip-padding': 15
            //         }
            //     }
            // },
            {
                name: 'link',
                position: Position.E,
                events: { pointerdown: 'startLinking', pointermove: 'doLink', pointerup: 'stopLinking' },
                attrs: {
                    '.handle': {
                        'data-tooltip-class-name': 'small',
                        'data-tooltip': 'Click and drag to connect the object',
                        'data-tooltip-position': 'left',
                        'data-tooltip-padding': 15
                    }
                }
            },
            // {
            //     name: 'rotate',
            //     position: Position.SW,
            //     events: { pointerdown: 'startRotating', pointermove: 'doRotate', pointerup: 'stopBatch' },
            //     attrs: {
            //         '.handle': {
            //             'data-tooltip-class-name': 'small',
            //             'data-tooltip': 'Click and drag to rotate the object',
            //             'data-tooltip-position': 'right',
            //             'data-tooltip-padding': 15
            //         }
            //     }
            // }
        ];
    }
}

