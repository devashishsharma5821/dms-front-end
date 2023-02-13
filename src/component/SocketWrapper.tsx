import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useAppStore from '../store';
import { SocketWrapperAppStoreState, DmsComputeData } from '../models/computeDetails';
import { Message, disperseMessage } from '../models/messages';
import { defaultConfig } from '../utils/config';
import { BusHelper } from '../helpers/BusHelper';
import { v4 } from 'uuid';
import { setComputeState, updateDmsComputeData } from '../zustandActions/computeActions';
import { connectionEstablished, disconnected, receiveMessage, submitMessage } from '../zustandActions/socketActions';
import { Action } from '@antuit/web-sockets-gateway-client';
import { responseCheckIntervalObj } from '../models/socketWrapper';

const SocketWrapper: React.FC<React.PropsWithChildren> = (props) => {
    const opid = v4();
    const { wsHost } = defaultConfig;
    let wsUrl = `${wsHost}?token=${localStorage.accessToken}&espToken=${localStorage.espUserToken}`;
    const [message, connectionState, DmsComputeData, UserConfig] = useAppStore((state: SocketWrapperAppStoreState) => [state.message, state.connectionState, state.DmsComputeData, state.UserConfig]);
    const { sendJsonMessage } = useWebSocket(wsUrl, {
        onOpen: () => {
            console.log('Socket connection Establishedd');
            connectionEstablished();
        },
        onClose: () => {
            console.log('Socket connect closed');
            disconnected();
        },
        onError: () => {
            console.log('Soccet connection error');
            disconnected();
        },
        onMessage: (ev: MessageEvent) => {
            console.log('Socket Receive message', JSON.parse(ev.data));
            const message = JSON.parse(ev.data);
            console.log('message in socket', message);

            if (message?.payload?.action === 'ALIVE') {
                const msgComputeId = message?.subject?.split('.')[2];
                let updateFlag = false;
                console.log('msgComputeId', parseInt(msgComputeId));
                const updatedComputeData = DmsComputeData?.map((computeData: DmsComputeData) => {
                    if (computeData.id === msgComputeId) {
                        if (computeData.status !== message?.payload?.status) {
                            computeData.status = message?.payload?.status;
                            updateFlag = true;
                            pidMeassageResponseHandler(JSON.parse(ev.data));
                        }
                    }
                    return computeData;
                });
                if (updateFlag) {
                    updateDmsComputeData(updatedComputeData);
                }
            }
            receiveMessage(JSON.parse(ev.data));
        }
    });

    useEffect(() => {
        if (connectionState.connected && message.length > 0) {
            disperseMessage(message);
            // if(message.content?.)
            // checkAlive(message.content);
        }
    }, [message]);

    useEffect(() => {
        if (DmsComputeData !== null) checkComputeStatus(DmsComputeData);
    }, [DmsComputeData]);
    // let unsubscribe: any = null;

    const disperseMessage = (messages: Array<disperseMessage>) => {
        messages.forEach((msg: disperseMessage) => {
            if (Object.keys(msg)?.length > 0) {
                console.log('In message: ', msg);
                if (msg?.content?.action === Action.Publish) {
                    checkAlive(msg);
                } else {
                    sendJsonMessage(msg.content);
                }
            }
        });
    };

    const checkComputeStatus = async (dmsComputes: DmsComputeData[]) => {
        const computeRunningStatus: DmsComputeData[] = dmsComputes.filter((compute: DmsComputeData) => compute.status === 'RUNNING' || compute.status === 'STARTING');
        if (computeRunningStatus.length !== 0) {
            const messageQue: Array<disperseMessage> = [];
            await computeRunningStatus.forEach((compute: DmsComputeData) => {
                if (compute?.status && compute?.id) {
                    const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
                        experimentId: 1,
                        opId: opid,
                        userId: compute?.id
                    });
                    messageQue.push({ content: { action: Action.Subscribe, subject: `dms_pid.out.${compute?.id}` } });
                    messageQue.push({ content: aliveMessage });
                }
            });
            console.log('messageQue', messageQue);
            submitMessage(messageQue);
        }
    };

    let responseCheckInterval: responseCheckIntervalObj = {}; //variable for the intervalID
    function checkAlive(msg: disperseMessage) {
        console.log('inside checkAlive');
        sendJsonMessage(msg); //send an "isAlive" message to the PID
        responseCheckInterval[msg?.content?.payload?.op_id] = setInterval(() => {
            //kickoff a new timer
            setComputeState('unknown'); //interval reached and uncanceled means we have not received a response
            setTimeout(() => {
                checkAlive(msg);
            }, 15000);
        }, 50000);
    }

    function pidMeassageResponseHandler(message: Message) {
        //we received an "I am Alive" message from the PID
        console.log('inside pidMessageResponseHandler');
        clearInterval(responseCheckInterval[message.payload.op_id]); // cancel the  active responseCheckInterval
        console.log('lets check interval clear', responseCheckInterval);
        delete responseCheckInterval[message.payload.op_id];
        console.log('responseCheckInterval', responseCheckInterval);
        setComputeState('alive'); //set the process state as "alive"

        // checkAlive(message); //restart a new checkAlive sequence
    }

    return <>{props.children}</>;
};

export default SocketWrapper;
