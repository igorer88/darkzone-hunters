/* eslint-disable */

const socket = io();

let userName = "";
let userData = "";

const getUserInfo = () => {
  fetch('data/user.json')
  .then(res => res.json())
  .then(user => {
    userData = user[0];
    document.querySelector('.userInfo').innerHTML = `<pre>${JSON.stringify(userData)}</pre>`;
  });
};

const newUserConnected = (user) => {
  userName = user || `User${Math.floor(Math.random() * 1000000)}`;
  socket.emit("new user", userName);
  getUserInfo();
};

const getRandom = () => {
  socket.emit("getRandom", userData);
};

const getFriends = () => {
  socket.emit('getFriends', userData);
};

// new user is created so we generate nickname and emit event
newUserConnected();

socket.on('gotRandom', (data) => {
  const html = `<p>Get Random</p><pre>${data}</pre>`
  document.querySelector('.messages__last').innerHTML += html;
});

socket.on('gotFriends', (data) => {
  const html = `<p>Get Friends</p><pre>${data}</pre>`
  document.querySelector('.messages__last').innerHTML += html;
});

socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
});
