const WebSocketServer = require('ws').Server,
    webSocket = new WebSocketServer({port: 8000}, {perMessageDeflate: false});
const JSON = require('circular-json');
webSocket.on('connection', function (ws) {
    ws.onmessage = function(message) {
        const msg = JSON.stringify(message);
        console.log(JSON.parse(msg));
    };
    ws.onclose = function() {

    };
});