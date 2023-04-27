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
    const [message, connectionState, DmsComputeData] = useAppStore((state: SocketWrapperAppStoreState) => [state.message, state.connectionState, state.DmsComputeData, state.UserConfig]);
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
            console.log('Socket connection error');
            disconnected();
        },
        onMessage: (ev: MessageEvent) => {
            console.log('Socket Receive message', JSON.parse(ev.data));

            const message = JSON.parse(ev.data);
            if (message?.payload?.experiment) {
                console.log('lets check experimentRecieveMessasage  =>', message);
            }
            if (message?.payload?.action === 'ALIVE') {
                const msgComputeId = message?.subject?.split('.')[2];
                let updateFlag = false;
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
        console.log('letys check msg outside connectionState', connectionState?.connected, 'msg ===>', message);

        if (connectionState?.connected && message?.length > 0) {
            console.log('letys check msg inside connectionState', connectionState?.connected, 'msg ===>', message);
            // sendJsonMessage(message.content);

            disperseMessage(message);
            // if(message.content?.)
            // checkAlive(message.content);
        }
    }, [message, connectionState?.connected]);

    useEffect(() => {
        if (DmsComputeData !== null) checkComputeStatus(DmsComputeData);
    }, [DmsComputeData]);
    // let unsubscribe: any = null;

    const disperseMessage = (messages: Array<disperseMessage>) => {
        messages.forEach((msg: disperseMessage) => {
            console.log('lets check message now for dispersing ===>', msg);
            // if (Object.keys(msg)?.length > 0) {
            //     if (msg?.content?.action === Action.Publish) {
            //         checkAlive(msg);
            //     } else {
            sendJsonMessage(msg.content);
            //     }
            // }
        });
    };

    const checkComputeStatus = async (dmsComputes: DmsComputeData[]) => {
        const computeRunningStatus: DmsComputeData[] = dmsComputes?.filter((compute: DmsComputeData) => compute.status === 'RUNNING' || compute.status === 'STARTING');
        if (computeRunningStatus?.length !== 0) {
            const messageQue: Array<disperseMessage> = [];
            await computeRunningStatus?.forEach((compute: DmsComputeData) => {
                if (compute?.status && compute?.id) {
                    const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
                        project_id: 2,
                        experimentId: 1,
                        opId: opid,
                        userId: compute?.id
                    });
                    messageQue.push({ content: { action: Action.Subscribe, subject: `dms_pid.out.${compute?.id}` } });
                    messageQue.push({ content: aliveMessage });
                }
            });
            submitMessage(messageQue);
        }
    };

    let responseCheckInterval: responseCheckIntervalObj = {}; //variable for the intervalID
    function checkAlive(msg: disperseMessage) {
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
        clearInterval(responseCheckInterval[message.payload.op_id]); // cancel the  active responseCheckInterval
        delete responseCheckInterval[message.payload.op_id];
        setComputeState('alive'); //set the process state as "alive"

        // checkAlive(message); //restart a new checkAlive sequence
    }

    return <>{props.children}</>;
};

export default SocketWrapper;
