const express = require('express');
const ws = require('./index');
const app = express();

//Generate matrix
const speakeasy = require('speakeasy');
const secret = speakeasy.generateSecret({length: 20});
console.log(secret.base32);


app.use('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

