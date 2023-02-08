import { Event } from '@antuit-zebra/pipeline-interactive-driver-client-ts';
import { Message } from '@antuit/web-sockets-gateway-client';
import { WebsocketBuilder, Websocket, ExponentialBackoff } from 'websocket-ts';
// import useAppStore from '../store';
// import { connectionEstablished, disconnected, receiveMessage, startConnecting, submitMessage } from './socketSlice';
import { SessionHelper } from './../helpers/SessionHelper';

export function wsconnect(values: any) {
    if (localStorage.espUserToken) {
        // const { connectionEstablished } = useAppStore;
        //TODO: Move host to env
        const host = `wss://ws.espdev.antuits.com`;
        let wsUrl = `${host}?token=${localStorage.accessToken}&espToken=${localStorage.espUserToken}`;
        // var ws = new WebSocket(wsUrl);
        //TODO: store.dispatch need to move to zustand
        var ws = new WebsocketBuilder(wsUrl)
            .withBackoff(new ExponentialBackoff(100, 10))
            .onOpen((i, ev) => {
                console.debug('Connected to websocket', ev, values);
                // connectionEstablished();
                // store.dispatch(connectionEstablished());
                //subscription
                // setTimeout(() => {
                //     ws.send(JSON.stringify({ action: 'subscribe', subject: 'dms_pid.out.bb99409d-7aca-49df-859e-b6c394318ca0.1' }));
                // }, 5000);
            })
            .onClose((i, ev) => {
                console.debug('Disconnected from websocket');
                // store.dispatch(disconnected());
            })
            .onError((i, ev) => {
                console.debug('Error from websocket:');
                console.debug(ev);
                // store.dispatch(disconnected());
            })
            .onMessage((i, ev) => {
                let message = JSON.parse(ev.data) as Message<Event>;
                console.log('Message, i', i, 'ev is', ev);
                // store.dispatch(receiveMessage(message));
                // const payload = JSON.parse(message).payload;
                // callback(JSON.stringify(payload));
            })
            .onRetry((i, ev) => {
                console.debug('Retrying websocket connection');
            })
            .build();
        // ws.onopen = function () {
        // ws.send(JSON.stringify({ action: 'subscribe', subject: 'dms_pid.out.bb99409d-7aca-49df-859e-b6c394318ca0.1' }));
        // };

        // ws.onmessage = function (e) {
        //     console.log('Message:', e.data);
        //     const payload = JSON.parse(e.data).payload;
        //     callback(JSON.stringify(payload));
        // };

        // ws.onclose = function (e) {
        //     console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        //     setTimeout(function () {
        //         wsconnect(callback);
        //     }, 1000);
        // };
        // ws.onerror = function (err) {
        //     console.error('Socket encountered error: ', err, 'Closing socket');
        //     ws.close();
        // };
    }
}
