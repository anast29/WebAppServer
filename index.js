const WebSocketServer = require('ws').Server,
    webSocket = new WebSocketServer({port: 8000}, {perMessageDeflate: false});
const JSON = require('circular-json');
let str=String(), code=String() , matrix = [], count=0, passw=String(), user_passw=String(), mass_let=String(), mass_num=String(), num;
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
}

function createPassw() {
    let letter = ['A','B','C','D','E','F','G','H','I','J'];
    while (count < 4) {
        code = Math.floor(Math.random() * letter.length);
        num = getRandomArbitary(1, 10);
        if (~passw.indexOf(letter[code] + num)) {
            console.log('dublicate');
        } else {
            passw += letter[code] + num + ' ';
            mass_let += letter[code] + ' ';
            mass_num += num + ' ';
            count++;
        }

    }
    console.log(passw);
}

function checkMessage() {
    let k=0,i=1,j,f_elem=String(),s_elem=String();
    const let_elem = mass_let.substring(0, mass_let.length - 1).split(' ');
    const num_elem = mass_num.substring(0, mass_num.length - 1).split(' ');
    console.log(let_elem);
    console.log(num_elem);
    while(k<5) {
        for (j = 0; j < 10; j++) {
            if (matrix[0][j] === let_elem[k]) {
                s_elem += j;
                // console.log(j);
            }
        }
        for ( i = 0; i < 10; i++) {
            if (matrix[i][0] === Number(num_elem[k])) {
                f_elem += i;
                // console.log(i);
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
        if (message.data.replace(/\s/g, '') === user_passw) {
            ws.send('Success');
        } else {
            ws.send('Wrong password');
        }
    };
    ws.onclose = function() {
    };
});