var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var webpush = require('web-push');
var uuidv4 = require('uuid').v4;
var publicVapidKey = "BD1vyLsXvNLrCH7L4TDSZptJll9tvZwIk81RQZeSFCZOf_1yaDrNtXkVa21AWXrdF8mZHGriGaokM1GJRjErapE";
var privateVapidKey = "URPBqUSlqj1Ttm7hYWb9wprRusnPPSCc_V-bFcCIJJ8";
webpush.setVapidDetails("mailto:romane@echino.com", publicVapidKey, privateVapidKey);
var connectedClients = [];
app.use(express.json());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    next();
});
// This displays message that the server running and listening to specified port
app.listen(port, function () { return console.log("Listening on port ".concat(port)); }); //Line 6
console.log('Salut', uuidv4());
app.post('/api/subscribe', function (req, res) {
    var subscription = req.body;
    res.status(201).json({});
    var payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });
    webpush.sendNotification(subscription, payload)["catch"](console.log);
});
app.post('/api/disconnect', function (req, res) {
    console.log('/disconnect ---------------');
    console.log('data', JSON.stringify(req.body));
    console.log('---------------');
    console.log('clients before', JSON.stringify(connectedClients));
    var data = req.body;
    var response = 'ALREADY_DISCONNECT';
    var clientIndex = connectedClients.findIndex(function (obj) { return obj.id === data.id; });
    if (clientIndex > -1) {
        var client = connectedClients.find(function (obj) { return obj.id === data.id; });
        if (client) {
            console.log(client.nickname, 'disconnected');
        }
        connectedClients[clientIndex].connected = false;
        connectedClients[clientIndex].host = false;
        response = 'DISCONNECTED';
    }
    console.log('---------------');
    console.log('clients afterward', JSON.stringify(connectedClients));
    res.send(response);
});
app.post('/api/connect', function (req, res) {
    console.log('/connect ---------------');
    console.log('data', JSON.stringify(req.body));
    var data = req.body;
    var isHost = connectedClients.length === 0 ? true : false;
    console.log('isHost (emptyclients)', isHost);
    if (!isHost) {
        console.log('clients now', JSON.stringify(connectedClients));
        if (connectedClients.filter(function (c) { return c.connected === true; }).length === 0) {
            isHost = true;
            console.log('isHost (no one connected)', isHost);
        }
    }
    var client = {
        nickname: data.nickname,
        id: data.id,
        host: isHost,
        connected: true
    };
    var foundClient = connectedClients.find(function (c) { return c.id === data.id; });
    if (foundClient) {
        var clientIndex = connectedClients.findIndex(function (obj) { return obj.id === data.id; });
        foundClient.host = isHost;
        foundClient.connected = true;
        connectedClients[clientIndex] = foundClient;
        console.log('found', clientIndex, connectedClients[clientIndex]);
        client = foundClient;
    }
    else {
        console.log('new client');
        connectedClients.push(client);
    }
    console.log('clients now', JSON.stringify(connectedClients, null, 2));
    var response = 'HOST';
    if (!isHost) {
        response = connectedClients.find(function (c) { return c.host === true; }).id;
    }
    console.log('sending', JSON.stringify(client), response);
    res.send(response);
});
app.get('/api/getclients', function (req, res) {
    res.send({ connected: connectedClients });
});
app.get('/api/resetclients', function (req, res) {
    connectedClients.length = 0;
    res.send({ connected: connectedClients });
});
module.exports = app;
