const WebSocketServer = require('ws').Server,
    webSocket = new WebSocketServer({port: 8000});

webSocket.on('connection', function (ws) {
    ws.onmessage = function(message) {
        console.log(message);
    };

    ws.onclose = function() {

    };
});