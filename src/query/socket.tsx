export function wsconnect(callback: any) {
    if (localStorage.espUserToken) {
        const host = `wss://ws.espdev.antuits.com`;
        let wsUrl = `${host}?token=${localStorage.accessToken}&espToken=${localStorage.espUserToken}`;
        var ws = new WebSocket(wsUrl);
        ws.onopen = function () {
            ws.send(JSON.stringify({ action: 'subscribe', subject: 'dms_pid.out.bb99409d-7aca-49df-859e-b6c394318ca0.1' }));
        };

        ws.onmessage = function (e) {
            console.log('Message:', e.data);
            const payload = JSON.parse(e.data).payload;
            callback(JSON.stringify(payload));
        };

        ws.onclose = function (e) {
            console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            setTimeout(function () {
                wsconnect(callback);
            }, 1000);
        };
        ws.onerror = function (err) {
            console.error('Socket encountered error: ', err, 'Closing socket');
            ws.close();
        };
    }
}
