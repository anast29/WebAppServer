const WebSocketServer = require('ws').Server,
    webSocket = new WebSocketServer({port: 8000}, {perMessageDeflate: false});
const JSON = require('circular-json');
var str=String();

function getRandomArbitary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function createMatrix() {
    let matrix = [];
    for (let i = 0; i <= 10; i++) {
        matrix[i]=[];
        for (let j = 0; j <= 10; j++) {
            matrix[0][0]=' ';
            str += matrix[0][0];
            if (i===0) {
                let ch = 65;
                while (ch < 75) {
                    matrix[0][j] = String.fromCharCode(ch);
                    str += matrix[0][j] + ' ';
                    ch++;
                    j++;
                }
            } else if (j===0) {
                matrix[i][j] = i+'|';
                str+=matrix[i][j] + ' ';
            } else {
                matrix[i][j]=getRandomArbitary(0,9);
                str+=matrix[i][j] + '  ';
            }
        }
        str+='\n';
    }
    console.log(str);
}

webSocket.on('connection', function (ws) {

    ws.onmessage = function(message) {
        const msg = JSON.stringify(message, ["data"]);
        console.log('Message: %s', msg);
    };

    createMatrix();

    ws.send(str);

    ws.onclose = function() {
    };
});