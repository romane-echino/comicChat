const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
const { v4: uuidv4 } = require('uuid');

connectedClients = [];

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6
console.log('Salut', uuidv4())

// create a GET route
app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
});

app.get('/connect', (req, res) => {
  let id = uuidv4();
  connectedClients.push(id)
  res.send({ id: id, connected: connectedClients });
});

app.get('/getclients', (req, res) => {

  res.send({ connected: connectedClients });
});


