/* eslint-disable */
'use strict';

const socket = io();

let userData = '';

const getUserInfo = () => {
  fetch('data/user.json')
  .then(res => res.json())
  .then(user => {
    userData = user;
    document.querySelector('.userInfo').innerHTML = `<pre>${JSON.stringify(user[0])}</pre>`;
  });
};

const getFriends = () => {
  socket.emit('getFriends', JSON.stringify(userData));
};

const getRandom = () => {
  socket.emit('getRandom', JSON.stringify(userData));
};

// new user is connected so we grab the payload from the json file.
getUserInfo();

socket.on('gotFriends', (data) => {
  console.log('gotFriends', data);
  const html = `<p>Get Friends</p><pre>${data}</pre>`
  document.querySelector('.messages__last').innerHTML += html;
});

socket.on('gotRandom', (data) => {
  console.log('gotRandom', data);
  const html = `<p>Get Random</p><pre>${data}</pre>`
  document.querySelector('.messages__last').innerHTML += html;
});
