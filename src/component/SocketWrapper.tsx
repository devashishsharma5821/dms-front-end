import React, { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import useAppStore from '../store';
import { ExperimentAppStoreState } from '../models/computeDetails';
import { defaultConfig } from '../utils/config';
import { BusHelper } from '../helpers/BusHelper';
import { v4 } from 'uuid';

function SocketWrapper(props: any) {
    const opid = v4();
    const { wsHost } = defaultConfig;
    let wsUrl = `${wsHost}?token=${localStorage.accessToken}&espToken=${localStorage.espUserToken}`;
    const [connectionEstablished, disconnected, receiveMessage, createdById, message, connectionState, DmsComputeData, submitMessage, UserConfig, setComputeState] = useAppStore(
        (state: ExperimentAppStoreState) => [
            state.connectionEstablished,
            state.disconnected,
            state.receiveMessage,
            state.createdById,
            state.message,
            state.connectionState,
            state.DmsComputeData,
            state.submitMessage,
            state.UserConfig,
            state.setComputeState
        ]
    );
    const { sendMessage, sendJsonMessage, lastMessage, readyState, getWebSocket } = useWebSocket(wsUrl, {
        onOpen: () => {
            // if (createdById) {
            // sendJsonMessage({ action: 'subscribe', subject: `dms_pid.out.${createdById}` });
            connectionEstablished();
            console.log('connection Establishedd');
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
            console.log('Receive message ev', ev);
            pidMeassageResponseHandler(JSON.parse(ev.data));
            receiveMessage(JSON.parse(ev.data));
        }
    });

    let unsubscribe: any = null;

    const checkComputeStatus = (dmsComputes: any) => {
        const computeRunningStatus = dmsComputes.filter((compute: any) => compute.status === 'RUNNING' || compute.status === 'STARTING');
        console.log('computeRunningStatus', computeRunningStatus);
        if (computeRunningStatus !== 0) {
            computeRunningStatus.map((compute: any) => {
                if (compute?.status && compute?.id) {
                    const aliveMessage = BusHelper.GetKeepAliveRequestMessage({
                        experimentId: 1,
                        opId: opid,
                        userId: compute?.id
                    });
                    submitMessage({
                        content: aliveMessage
                    });
                }
            });
        }
    };
    let responseCheckInterval: any = {}; //variable for the intervalID
    let counter = 0;
    function checkAlive(msg: any) {
        sendJsonMessage(msg); //send an "isAlive" message to the PID
        console.log('outside interval', msg);
        responseCheckInterval[msg.payload.op_id] = setInterval(() => {
            //kickoff a new timer
            console.log('inside interval');
            // setPIDState('unknown'); //interval reached and uncanceled means we have not received a response
            counter++;
            setComputeState('unknown');
            setTimeout(() => {
                //wait and retry
                if (counter === 3) {
                    pidMeassageResponseHandler(msg);
                }
                checkAlive(msg);
            }, 15000);
        }, 30000);
    }

    function pidMeassageResponseHandler(message: any) {
        //we received an "I am Alive" message from the PID
        console.log('inside pidMsg');
        console.log('before responseCheckInterval', responseCheckInterval);

        clearInterval(responseCheckInterval[message.payload.op_id]); // cancel the  active responseCheckInterval
        delete responseCheckInterval[message.payload.op_id];
        console.log('after responseCheckInterval', responseCheckInterval);
        // setPIDState('alive'); //set the process state as "alive"
        setComputeState('alive');

        checkAlive(message); //restart a new checkAlive sequence
    }

    useEffect(() => {
        console.log('connection established', connectionState, message, Object.keys(message).length);

        if (connectionState.connected && Object.keys(message).length > 0) {
            console.log('In socket ', message.content);
            // if(message.content?.)
            checkAlive(message.content);
            // sendJsonMessage(message.content);
        }
    }, [message]);

    useEffect(() => {
        if (DmsComputeData !== null) checkComputeStatus(DmsComputeData);
    }, [DmsComputeData]);

    // const connectionStatus = {
    //     [ReadyState.CONNECTING]: 'Connecting',
    //     [ReadyState.OPEN]: 'Open',
    //     [ReadyState.CLOSING]: 'Closing',
    //     [ReadyState.CLOSED]: 'Closed',
    //     [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
    // }[readyState];

    // console.log('readyState', readyState);
    // console.log('lastrecieve', lastMessage);
    // console.log('connectionStatus', connectionStatus);
    return <>{props.children}</>;
}

export default SocketWrapper;
