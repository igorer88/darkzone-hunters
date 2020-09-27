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

io.on('connection', socket => {
  console.log('Socket > Client connected...');
  io.emit('new user');

  socket.on('getFriends', async data => {
    // console.log(data);
    let newData = `Friends' Hunters\n`;
    newData += await events.getFriends(data);
    io.emit('gotFriends', newData);
  });
  socket.on('getRandom', async data => {
    let newData = `Random Hunters\n`;
    newData += await events.getRandom(data);
    io.emit('gotRandom', newData);
  });
});

try {
  database.db;              // Initialize the DB connection for testing
} catch (e) {
  console.error('There has been an error with the MongoDB server.');
}
