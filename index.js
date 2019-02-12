const WebSocketServer = require('ws').Server,
    webSocket = new WebSocketServer({port: 8000}, {perMessageDeflate: false});
const JSON = require('circular-json');
var matrix = [];

function getRandomArbitary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function createMatrix() {
    let matrix = [];
    for (let i = 0; i <= 10; i++) {
        matrix[i]=[];
        for (let j = 0; j <= 10; j++) {
            matrix[0][0]='  ';
            if (i===0) {
                let ch = 64;
                while (ch < 75) {
                    matrix[0][j] = String.fromCharCode(ch) + ' ';
                    ch++;
                    j++;
                }
            } else if (j===0) {
                matrix[i][j] = i+') ';
            } else {
                matrix[i][j]=getRandomArbitary(0,9) + ' ';
            }
        }
    }
    console.log(matrix);
    let str='', remove, i=0;
    let buf = matrix;
    while(i < 10) {
        str.concat(buf.slice(0,1).join('\n'));
        console.log(buf.slice(0,1).join('\n'));
        //matrix = buf.splice(0,1);
        remove = buf.splice(0,1);
        i++;
    }
    console.log(str);
}

webSocket.on('connection', function (ws) {

    ws.onmessage = function(message) {
        const msg = JSON.stringify(message, ["data"]);
        console.log('Message: %s', msg);
    };

    createMatrix();

    ws.send();

    ws.onclose = function() {
    };
});