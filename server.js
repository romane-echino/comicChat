const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
const { v4: uuidv4 } = require('uuid');
app.use(express.json())

connectedClients = [];

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
console.log('Salut', uuidv4())

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
});


app.post('/connect', (req, res) => {
  let data = req.body;
  console.log('data', JSON.stringify(req.body));

  

  let client = {
    nickname: data.nickname,
    id: data.userId,
    host: connectedClients.length === 0 ? true : false
  }
  let foundClient = connectedClients.find(c => c.id === data.userId)
  if(foundClient){
    console.log('found');
    client = foundClient;
  }
  else{
    console.log('new client');
    connectedClients.push(client)
  }
  
  let response = 'HOST';
  if(!client.host){
    response = connectedClients.find(c => c.host === true).id;
  }

  console.log('sending', JSON.stringify(client), response);

  res.send(response);
})

app.get('/getclients', (req, res) => {
  res.send({ connected: connectedClients });
});


app.get('/resetclients', (req, res) => {
  connectedClients = [];
  res.send({ connected: connectedClients });
});



