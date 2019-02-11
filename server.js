const express = require('express');
const ws = require('./index');

const app = express();

app.use('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});