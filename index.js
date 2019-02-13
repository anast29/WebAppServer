const WebSocketServer = require('ws').Server,
    webSocket = new WebSocketServer({port: 8000}, {perMessageDeflate: false});
const JSON = require('circular-json');
let str=String(), code=String() , matrix = [], count=0, passw=String(), user_passw=String();
function getRandomArbitary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function createMatrix() {
    for (let i = 0; i <= 10; i++) {
        matrix[i]=[];
        for (let j = 0; j <= 10; j++) {
            if (i===0) {
                matrix[i][0]='*';
                str += matrix[0][0];
                let ch = 65;
                while (ch < 75) {
                    matrix[0][j] = String.fromCharCode(ch);
                    str +=' ' + matrix[0][j];
                    ch++;
                    j++;
                }
            } else if (j===0) {
                matrix[i][j] = i;
                str+=matrix[i][j] + ' ';
            } else {
                matrix[i][j]=getRandomArbitary(0,9);
                str+=matrix[i][j] + ' ';
            }
        }
        str+='\n';
    }
    console.log(matrix[5][1]);
}

function createPassw() {
    let letter = ['A','B','C','D','E','F','G','H','I','J'];
    while (count < 4) {
        code = Math.floor(Math.random() * letter.length);
        passw+=letter[code]+getRandomArbitary(1,10) + ' ';
        count++;
    }
    console.log(passw);
}

function checkMessage() {
    let k=0,i=1,j,f_elem=String(),s_elem=String();
    const elem = passw.replace(/\s/g, '').split('');
    console.log(elem);
    while(k<9) {
        for (j = 0; j < 10; j++) {
            if (matrix[0][j] === elem[k]) {
                s_elem += j;
            }
        }
        for ( i = 1; i <= 10; i++) {
            if (matrix[i][0] === Number(elem[k])) {
                f_elem += i;
            }
        }
        k++;
    }
    for (let y = 0 ; y < s_elem.length; y ++) {
        // console.log('j' + s_elem + 'i' + f_elem +'Search element:' + matrix[Number(f_elem.charAt(y))][Number(s_elem.charAt(y))+1]);
        user_passw +=matrix[Number(f_elem.charAt(y))][Number(s_elem.charAt(y))+1];
    }
    console.log(user_passw);

}

webSocket.on('connection', function (ws) {
    createMatrix();
    createPassw();
    checkMessage();
    ws.send(str +'\n Enter number:' + passw);
    ws.onmessage = function(message) {
        //const msg = JSON.stringify(message, ["data"]);
        console.log('Message: %s', message.data);
        if (message.data === user_passw) {
            ws.send('Success');
        } else {
            ws.send('Wrong password');
        }
    };
    ws.onclose = function() {
    };
});