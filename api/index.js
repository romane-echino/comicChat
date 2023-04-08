const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const webpush = require('web-push');
const { v4: uuidv4 } = require('uuid');

const publicVapidKey = "BD1vyLsXvNLrCH7L4TDSZptJll9tvZwIk81RQZeSFCZOf_1yaDrNtXkVa21AWXrdF8mZHGriGaokM1GJRjErapE";
const privateVapidKey = "URPBqUSlqj1Ttm7hYWb9wprRusnPPSCc_V-bFcCIJJ8";
webpush.setVapidDetails("mailto:romane@echino.com", publicVapidKey, privateVapidKey);

app.use(express.json())


app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'content-type');
	next();
});

connectedClients = [];



// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
console.log('Salut', uuidv4())

app.post('/api/subscribe', (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: "Hello World", body: "This is your first push notification" });

  webpush.sendNotification(subscription, payload).catch(console.log);
})

app.post('/api/disconnect', (req, res) => {
  console.log('/disconnect ---------------')
  console.log('data', JSON.stringify(req.body));
  console.log('---------------')
  console.log('clients before', JSON.stringify(connectedClients));
  let data = req.body;
  let response = 'ALREADY_DISCONNECT'

  let clientIndex = connectedClients.findIndex((obj) => obj.id === data.id);

  if (clientIndex > -1) {
    let client = connectedClients.find((obj) => obj.id === data.id);
    console.log(client.nickname, 'disconnected');
    connectedClients[clientIndex].connected = false;
    connectedClients[clientIndex].host = false;
    response = 'DISCONNECTED'
  }

  console.log('---------------')
  console.log('clients afterward', JSON.stringify(connectedClients));
  res.send(response);
})


app.post('/api/connect', (req, res) => {
  console.log('/connect ---------------')
  console.log('data', JSON.stringify(req.body));

  let data = req.body;

  let isHost = connectedClients.length === 0 ? true : false;
  console.log('isHost (emptyclients)', isHost);
  if (!isHost) {
    console.log('clients now', JSON.stringify(connectedClients));
    if (connectedClients.filter(c => c.connected === true).length === 0) {
      isHost = true;
      console.log('isHost (no one connected)', isHost);
    }
  }

  let client = {
    nickname: data.nickname,
    id: data.id,
    host: isHost,
    connected: true
  }

  let foundClient = connectedClients.find(c => c.id === data.id)
  if (foundClient) {

    let clientIndex = connectedClients.findIndex((obj) => obj.id === data.id);
    foundClient.host = isHost;
    foundClient.connected = true;
    connectedClients[clientIndex] = foundClient;

    console.log('found', clientIndex, connectedClients[clientIndex]);
    client = foundClient;
  }
  else {
    console.log('new client');
    connectedClients.push(client)
  }

  console.log('clients now', JSON.stringify(connectedClients, null, 2));

  let response = 'HOST';
  if (!isHost) {
    response = connectedClients.find(c => c.host === true).id;
  }

  console.log('sending', JSON.stringify(client), response);

  res.send(response);
})

app.get('/api/getclients', (req, res) => {
  res.send({ connected: connectedClients });
});


app.get('/api/resetclients', (req, res) => {
  connectedClients = [];
  res.send({ connected: connectedClients });
});

module.exports = app;