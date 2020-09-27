'use strict'

const express = require('express');
const cors = require('cors');
const socket = require('socket.io');
const database = require('./db/database');
const events = require('./events/ws');

const app = express();

const host = process.env.host || 'localhost';
const port = process.env.PORT || 5000;

app.locals.ENV= process.env.NODE_ENV || 'development';

const server = app.listen(port, () => {
  console.log(`✔ Server listening on: http://${host}:${port}`);
});

const io = socket(server);

// Remove x-powered-by header (doesn't let clients know we are using Express)
app.disable('x-powered-by');
// Support Cross-Browsing requests
app.use(cors());
// Static files
app.use(express.static("public"));

io.on('connection', client => {
  console.log('Socket > Client connected...');
  io.emit('new user');

  client.on('getFriends', async data => {
    // console.log(data);
    let newData = `Friends' Hunters\n`;
    newData += await events.getFriends(data);
    io.emit('gotFriends', newData);
  });
  client.on('getRandom', data => {
    console.log(data);
    let newData = `Random Hunters\n`;
    io.emit('gotRandom', newData);
  });

  io.on("disconnect", () => {
    io.emit("user disconnected");
    console.log('Socket > Client disconnected...')
  });
});

try {
  database.db;              // Initialize the DB connection for testing
  // console.log(`✔ A list of hunters from MongoDB can be found at: http://${host}:${port}/api/hunters`);
} catch (e) {
  console.error('There has been an error with the MongoDB server.');
}
