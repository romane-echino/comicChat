import express, { Request, Response, NextFunction } from 'express';
import { uuid } from 'uuidv4';
import webpush from 'web-push'

const app = express();
const port = process.env.PORT || 5000;

const publicVapidKey = "BD1vyLsXvNLrCH7L4TDSZptJll9tvZwIk81RQZeSFCZOf_1yaDrNtXkVa21AWXrdF8mZHGriGaokM1GJRjErapE";
const privateVapidKey = "URPBqUSlqj1Ttm7hYWb9wprRusnPPSCc_V-bFcCIJJ8";
webpush.setVapidDetails("mailto:romane@echino.com", publicVapidKey, privateVapidKey);

interface room {
  id: string;
  name: string;
  description: string;
  tags: string[];
  languages: string[];
  clients: client[];
}

interface client {
  nickname: string;
  id: string;
  host: boolean;
  connected: boolean;
}

export interface TRequest<Paramtype, Bodytype> extends Express.Request {
  body: Bodytype,
  params: Paramtype
}

const clients: client[] = [];
const rooms: room[] = [];

//default room
rooms.push({
  id: '03086e2c-0964-4843-ab4c-6ca97ee90e5e',
  name: 'La grande salle',
  description: 'Come in and find out',
  tags: ['dev', 'commicChat'],
  languages: ['fr', 'en'],
  clients: []
})

app.use(express.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  next();
});


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
console.log('Salut', uuid())

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
  console.log('clients before', JSON.stringify(clients));
  let data = req.body;
  let response = 'ALREADY_DISCONNECT'

  let clientIndex = clients.findIndex((obj) => obj.id === data.id);

  if (clientIndex > -1) {
    let client = clients.find((obj) => obj.id === data.id);
    if (client) {
      console.log(client.nickname, 'disconnected');
    }

    clients[clientIndex].connected = false;
    clients[clientIndex].host = false;
    response = 'DISCONNECTED'
  }

  console.log('---------------')
  console.log('clients afterward', JSON.stringify(clients));
  res.send(response);
})


app.post('/api/create-room', (request: TRequest<null, room>, response: Response) => {
  let room: room = request.body;
  room.id = uuid();
  rooms.push(room);
  response.status(200).send({})
})

app.get('/api/room', (request: TRequest<{ id: string }, null>, response: Response) => {
  response.status(200).send(rooms.find(r => r.id === request.params.id))
})

app.get('/api/rooms', (request: Request, response: Response) => {
  response.status(200).send(rooms)
})

app.post('/api/connect', (req, res) => {
  console.log('/connect ---------------')
  console.log('data', JSON.stringify(req.body));

  let data = req.body;

  let isHost = clients.length === 0 ? true : false;
  console.log('isHost (emptyclients)', isHost);
  if (!isHost) {
    console.log('clients now', JSON.stringify(clients));
    if (clients.filter(c => c.connected === true).length === 0) {
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

  let foundClient = clients.find(c => c.id === data.id)
  if (foundClient) {

    let clientIndex = clients.findIndex((obj) => obj.id === data.id);
    foundClient.host = isHost;
    foundClient.connected = true;
    clients[clientIndex] = foundClient;

    console.log('found', clientIndex, clients[clientIndex]);
    client = foundClient;
  }
  else {
    console.log('new client');
    clients.push(client)
  }

  console.log('clients now', JSON.stringify(clients, null, 2));

  let response = 'HOST';
  if (!isHost) {
    response = clients.find(c => c.host === true)!.id;
  }

  console.log('sending', JSON.stringify(client), response);

  res.send(response);
})

app.get('/api/getclients', (req, res) => {
  res.send({ connected: clients });
});


app.get('/api/resetclients', (req, res) => {
  clients.length = 0;
  res.send({ connected: clients });
});

module.exports = app;