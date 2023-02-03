import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import useAppStore from '../store';
import { ExperimentAppStoreState, DmsComputeData } from '../models/computeDetails';
import { Message } from '../models/messages';
import { defaultConfig } from '../utils/config';
import { BusHelper } from '../helpers/BusHelper';
import { v4 } from 'uuid';

function SocketWrapper(props: any) {
    const opid = v4();
    const { wsHost } = defaultConfig;
    const [pidState, setPIDState] = useState<string>('');
    let wsUrl = `${wsHost}?token=${localStorage.accessToken}&espToken=${localStorage.espUserToken}`;
    const [connectionEstablished, disconnected, receiveMessage, createdById, message, connectionState, DmsComputeData, submitMessage, UserConfig, setComputeState, getAndUpdateDmsComputeData] =
        useAppStore((state: ExperimentAppStoreState) => [
            state.connectionEstablished,
            state.disconnected,
            state.receiveMessage,
            state.createdById,
            state.message,
            state.connectionState,
            state.DmsComputeData,
            state.submitMessage,
            state.UserConfig,
            state.setComputeState,
            state.getAndUpdateDmsComputeData
        ]);
    const { sendMessage, sendJsonMessage, lastMessage, readyState, getWebSocket } = useWebSocket(wsUrl, {
        onOpen: () => {
            // if (createdById) {
            connectionEstablished();
            getAndUpdateDmsComputeData();

            console.log('connection Establishedd');
            sendJsonMessage({ action: 'subscribe', subject: `dms_pid.out.161` });

            // }
        },
        onClose: () => {
            console.log('inside onClose');
            disconnected();
        },
        onError: () => {
            console.log('inside onError');
            disconnected();
        },
        onMessage: (ev: any) => {
            console.log('Receive message ev', JSON.parse(ev.data));
            const message = JSON.parse(ev.data);
            if (message?.payload) {
                //TODO:- Update DMS COMPUTE LIST
                getAndUpdateDmsComputeData();
            }
            pidMeassageResponseHandler(JSON.parse(ev.data));
            receiveMessage(JSON.parse(ev.data));
        }
    });

    let unsubscribe: any = null;
    console.log('lastMessage ==>', lastMessage);

    const checkComputeStatus = (dmsComputes: DmsComputeData[]) => {
        const computeRunningStatus: DmsComputeData[] = dmsComputes.filter((compute: DmsComputeData) => compute.status === 'RUNNING');
        if (computeRunningStatus.length !== 0) {
            computeRunningStatus.map((compute: DmsComputeData) => {
                if (compute?.status && compute?.id) {
                    const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
                        experimentId: 1,
                        opId: opid,
                        userId: compute?.id,
                        //TODO Below are added just for fixing errors
                        project_id: 12,
                        get_datatables: undefined,
                        az_blob_get_containers: undefined,
                        az_blob_browse_container: undefined
                    });
                    submitMessage({
                        content: aliveMessage
                    });
                }
            });
        }
    };

    // TODO: ResponseCheckInterval Type

    let responseCheckInterval: any = {}; //variable for the intervalID
    let counter = 0;
    function checkAlive(msg: Message) {
        sendJsonMessage(msg); //send an "isAlive" message to the PID
        responseCheckInterval[msg.payload?.op_id] = setInterval(() => {
            //kickoff a new timer
            setPIDState('unknown'); //interval reached and uncanceled means we have not received a response
            // counter++;
            setComputeState('unknown');
            setTimeout(() => {
                //wait and retry
                // if (counter === 1) {
                //     pidMeassageResponseHandler(msg);
                // }
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
        setPIDState('alive'); //set the process state as "alive"
        setComputeState('alive');
        checkAlive(message); //restart a new checkAlive sequence
    }

    useEffect(() => {
        if (connectionState.connected && Object.keys(message).length > 0) {
            // if(message.content?.)
            // checkAlive(message.content);
            sendJsonMessage(message.content);
        }
    }, [message]);
    // console.log('DmsComputeData ===>', DmsComputeData);

    // useEffect(() => {
    //     if (DmsComputeData !== null) checkComputeStatus(DmsComputeData);
    // }, [DmsComputeData]);

    return <>{props.children}</>;
}

export default SocketWrapper;
